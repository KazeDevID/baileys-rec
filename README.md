# baileys-rec

> **Modern WhatsApp Web API Library for Node.js**
> Enhanced with native flow interactive buttons, multi-card carousels, rich bot messages, and official Meta WhatsApp Business Cloud API protocol adapter.

[![npm version](https://img.shields.io/badge/npm-v1.0.0-emerald.svg)](https://www.npmjs.com/package/baileys-rec)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Author](https://img.shields.io/badge/Author-KazeDevID-orange.svg)](https://github.com/KazeDevID)

---

## Installation

Install using npm:

```bash
npm install baileys-rec
```

Or using yarn / pnpm:

```bash
yarn add baileys-rec
# or
pnpm add baileys-rec
```

Requirements:
- Node.js 20.0.0 or higher.
- ESM and CommonJS support.

---

## How to Use

### 1. Connecting to WhatsApp

Initialize your WhatsApp socket connection and handle authentication state persistence:

```typescript
import makeWASocket, { 
    useMultiFileAuthState, 
    DisconnectReason 
} from "baileys-rec";

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth_session");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ["baileys-rec", "Desktop", "1.0.0"]
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const shouldReconnect = 
                (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("Connection closed. Reconnecting:", shouldReconnect);
            if (shouldReconnect) {
                startBot();
            }
        } else if (connection === "open") {
            console.log("Successfully connected to WhatsApp via baileys-rec!");
        }
    });

    sock.ev.on("messages.upsert", async ({ messages }) => {
        const m = messages[0];
        if (!m.message || m.key.fromMe) return;

        const sender = m.key.remoteJid;
        console.log("Received message from " + sender);
    });
}

startBot();
```

---

## Documentation

### 2. Interactive Native Flow Buttons

Create quick reply buttons, website call-to-actions, phone call dialers, and coupon copy buttons using ButtonBuilder:

```typescript
import { ButtonBuilder } from "baileys-rec";

const buttons = new ButtonBuilder()
    .addReply("btn_services", "Our Services")
    .addUrl("Visit Website", "https://github.com/KazeDevID/baileys-rec", true)
    .addCall("Call Support", "+628123456789")
    .addCopy("Copy Voucher", "DISCOUNT50")
    .build();

await sock.sendMessage(jid, {
    text: "Hello! Welcome to our customer support desk. Please choose an option below:",
    footer: "Powered by baileys-rec v1.0.0",
    nativeFlow: buttons
});
```

#### ButtonBuilder API Methods

| Method | Description |
|---|---|
| `addReply(id, text, icon?)` | Adds a Quick Reply button that sends `id` back when tapped. |
| `addUrl(text, url, useWebview?, icon?)` | Adds a Call To Action button opening an external link or in-app browser. |
| `addCall(text, phoneNumber, icon?)` | Adds a button that initiates a phone call. |
| `addCopy(text, code, icon?)` | Adds a button that copies a voucher or promo code to the user clipboard. |
| `addList(title, sections, icon?)` | Adds a button that opens a bottom-sheet single select menu. |
| `addFlow(flowId, text, token?, action?, payload?)` | Adds an interactive WhatsApp Flow action button. |
| `build()` | Returns the compiled array of `NativeFlowButton` objects. |

---

### 3. Meta WhatsApp Cloud API Protocol Adapter

baileys-rec implements direct compatibility with the official Meta WhatsApp Business Messaging Cloud API format (https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started). You can send standard Meta Cloud API JSON payloads directly without connecting to Meta Cloud servers:

```typescript
// Standard Meta Cloud API JSON payload
const metaPayload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: "628123456789",
    type: "interactive",
    interactive: {
        type: "button",
        header: {
            type: "text",
            text: "Order Confirmation"
        },
        body: {
            text: "Your order #1089 is ready for delivery. Please confirm your address:"
        },
        footer: {
            text: "Meta Cloud API Schema"
        },
        action: {
            buttons: [
                {
                    type: "reply",
                    reply: {
                        id: "confirm_yes",
                        title: "Confirm Address"
                    }
                },
                {
                    type: "reply",
                    reply: {
                        id: "reschedule",
                        title: "Reschedule"
                    }
                }
            ]
        }
    }
};

// Send directly in baileys-rec!
await sock.sendMessage(jid, {
    cloudApi: metaPayload
});
```

You can also convert payloads programmatically using helper functions:

```typescript
import { fromCloudApiMessage, toCloudApiMessage } from "baileys-rec";

// Convert Meta Cloud API payload into Baileys message content
const baileysContent = fromCloudApiMessage(metaPayload);
await sock.sendMessage(jid, baileysContent);

// Convert Baileys message content back to Meta Cloud API JSON
const cloudApiJson = toCloudApiMessage(baileysContent, "628123456789");
```

---

### 4. Interactive List Menu (Single Select Bottom Sheet)

Send interactive categorized menu lists with sections and rows:

```typescript
const sections = [
    {
        title: "Beverages",
        rows: [
            { id: "item_coffee", title: "Espresso Coffee", description: "Freshly brewed dark roast" },
            { id: "item_latte", title: "Caramel Latte", description: "Steamed milk with espresso and caramel" },
            { id: "item_matcha", title: "Matcha Green Tea", description: "Authentic Kyoto matcha latte" }
        ]
    },
    {
        title: "Snacks & Pastries",
        rows: [
            { id: "item_croissant", title: "Almond Croissant", description: "Flaky butter pastry with almond cream" },
            { id: "item_cheesecake", title: "New York Cheesecake", description: "Classic rich and creamy cheesecake" }
        ]
    }
];

await sock.sendMessage(jid, {
    text: "Please browse our catalog and choose your favorite item:",
    title: "Modern Coffee Roasters",
    footer: "Open daily 08:00 - 22:00",
    nativeFlow: [
        {
            text: "View Menu",
            sections: sections
        }
    ]
});
```

---

### 5. Multi-Card Interactive Carousel

Send swipeable card carousels with image banners, titles, descriptions, and action buttons per card:

```typescript
await sock.sendMessage(jid, {
    text: "Explore our featured products this week:",
    cards: [
        {
            image: { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600" },
            title: "Pro Smartphone Ultra",
            subtitle: "2026 Flagship",
            caption: "144Hz AMOLED Display with AI-powered processing and 200MP camera.",
            nativeFlow: [
                { id: "order_phone", text: "Buy Now - $999" },
                { url: "https://github.com/KazeDevID/baileys-rec", text: "View Details" }
            ]
        },
        {
            image: { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600" },
            title: "Studio Wireless Headphones",
            subtitle: "Active Noise Cancelling",
            caption: "High resolution audio with 40-hour battery life and memory foam cushions.",
            nativeFlow: [
                { id: "order_audio", text: "Buy Now - $299" },
                { copy: "AUDIO50", text: "Copy $50 Voucher" }
            ]
        }
    ]
});
```

---

### 6. AI Rich Response Messages (Code Blocks & Tables)

Send syntax-highlighted code blocks, data tables, and verified bot messages:

```typescript
// 1. Syntax Highlighted Code Snippet
await sock.sendMessage(jid, {
    code: "import makeWASocket from 'baileys-rec';
const sock = makeWASocket({ ... });",
    language: "typescript",
    footerText: "Formatted via baileys-rec syntax lexer"
});

// 2. Structured Data Table / Invoice
await sock.sendMessage(jid, {
    title: "Invoice Summary #REC-1089",
    table: [
        ["Item Description", "Qty", "Amount"],
        ["Baileys-Rec License", "1", "$150.00"],
        ["Priority Support", "1", "$50.00"],
        ["Total Balance", "2", "$200.00"]
    ],
    footerText: "Verified digital invoice"
});
```

---

## License

MIT License. Copyright (c) 2026 KazeDevID.
