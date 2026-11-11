# baileys-rec

> **Modern WhatsApp Web API Library for Node.js**  
> Enhanced with native flow interactive buttons, multi-card swipeable carousels, rich bot messages, and official Meta WhatsApp Business Cloud API protocol adapter.

[![npm version](https://img.shields.io/badge/npm-v1.2.1-emerald.svg)](https://www.npmjs.com/package/baileys-rec)
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

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth_session");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ["baileys-rec", "Chrome", "1.2.0"]
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === "close") {
            const shouldReconnect = 
                lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("Connection closed. Reconnecting:", shouldReconnect);
            if (shouldReconnect) connectToWhatsApp();
        } else if (connection === "open") {
            console.log("Connected to WhatsApp successfully with baileys-rec!");
        }
    });

    return sock;
}
```

---

## Documentation

### 1. Send Interactive Messages (`sock.sendInteractive`)

`baileys-rec` provides first-class methods for modern WhatsApp interactive messages (Native Flow buttons, single select list bottom sheets, multi-card carousels, and WhatsApp Flows):

```typescript
// Method A: Direct socket method with Quick Reply & Action Buttons
await sock.sendInteractive(jid, {
    text: "Please choose from the options below:",
    footer: "Interactive Protocol • baileys-rec",
    buttons: [
        { id: "opt_pricing", text: "💎 View Pricing" },
        { url: "https://github.com/KazeDevID/baileys-rec", text: "🌐 Open Docs" },
        { call: "+1234567890", text: "📞 Call Support" },
        { copy: "PROMO2026", text: "🎟️ Copy Voucher" }
    ]
});

// Method B: Inside standard sock.sendMessage using "interactive" or "nativeFlow"
await sock.sendMessage(jid, {
    interactive: {
        text: "Select a package to continue:",
        footer: "Official Cloud API Compatible",
        buttons: [
            { id: "pkg_basic", text: "📦 Basic Tier" },
            { id: "pkg_pro", text: "🚀 Pro Tier" }
        ]
    }
});

// Method C: Interactive List Menu (Bottom Sheet)
await sock.sendInteractive(jid, {
    text: "Browse our product catalog:",
    footer: "Tap below to open options",
    sections: [
        {
            title: "Development Services",
            rows: [
                { id: "service_bot", title: "WhatsApp Bot Dev", description: "Custom automated workflows" },
                { id: "service_api", title: "API Integrations", description: "REST & Webhook endpoints" }
            ]
        },
        {
            title: "Support",
            rows: [
                { id: "service_help", title: "Customer Assistance", description: "24/7 dedicated engineers" }
            ]
        }
    ],
    buttonText: "View Catalog"
});
```

---

### 2. Swipeable Multi-Card Carousel (`cards`)

Create horizontal swipeable carousels with banner media and interactive buttons for each card:

```typescript
await sock.sendInteractive(jid, {
    text: "Explore our featured collection:",
    footer: "Swipe horizontally to view all items",
    cards: [
        {
            image: { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600" },
            title: "Smartphone Pro Ultra",
            subtitle: "Flagship Edition",
            caption: "144Hz AMOLED screen with 200MP camera system.",
            buttons: [
                { id: "buy_phone", text: "Buy Now ($999)" },
                { url: "https://github.com/KazeDevID/baileys-rec", text: "Specs" }
            ]
        },
        {
            image: { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600" },
            title: "Studio Headphones",
            subtitle: "Active Noise Cancelling",
            caption: "Hi-Res Audio with 40 hours wireless playback.",
            buttons: [
                { id: "buy_audio", text: "Buy Now ($299)" },
                { copy: "PROMO20", text: "Copy 20% Off" }
            ]
        }
    ]
});
```

---

### 3. Send Button Messages (`sock.sendButton`)

Send button messages with quick replies, call-to-actions, and optional image or video headers:

```typescript
import { ButtonBuilder } from "baileys-rec";

// Using ButtonBuilder
const buttons = new ButtonBuilder()
    .addReply("btn_agree", "✅ Agree & Continue")
    .addReply("btn_decline", "❌ Cancel")
    .addUrl("Terms of Service", "https://github.com/KazeDevID/baileys-rec")
    .build();

await sock.sendButton(jid, {
    text: "Do you agree with our terms of service?",
    footer: "Security Verification",
    buttons: buttons
});

// Or send with an image header
await sock.sendButton(jid, {
    image: { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe" },
    caption: "Here is your requested product flyer.",
    footer: "Limited Time Offer",
    buttons: [
        { id: "buy_now", text: "🛒 Buy Now" },
        { copy: "DISCOUNT50", text: "🎟️ Copy Coupon" }
    ]
});
```

---

### 4. Send AI Rich Messages (`sock.sendRichMessage`)

Create syntax-highlighted code blocks, formatted data tables, and verified AI bot cards:

```typescript
// Code snippet with syntax highlighting (supports JavaScript, TypeScript, Python, Rust, Go, SQL, HTML, etc.)
await sock.sendRichMessage(jid, {
    title: "TypeScript Solution",
    code: `import makeWASocket from "baileys-rec";
const sock = makeWASocket({ printQRInTerminal: true });
console.log("Ready!");`,
    language: "typescript",
    disclaimer: "Generated by Verified Bot"
});

// Formatted Data Table
await sock.sendRichMessage(jid, {
    title: "Quarterly Performance",
    table: [
        ["Quarter", "Metric", "Status"],
        ["Q1", "99.9% Uptime", "Optimal"],
        ["Q2", "1.2M Messages", "Delivered"],
        ["Q3", "120ms Latency", "Fast"]
    ],
    disclaimer: "Verified Analytics Report"
});
```

---

### 5. Meta WhatsApp Business Cloud API Protocol Compatibility (v1.2.1)

Send messages directly using the official Meta WhatsApp Cloud API request schema through your Baileys socket connection or via direct HTTP Graph API:

```typescript
// Method 1: Using sock.sendCloudApi (Recommended for Meta Cloud API payloads)
await sock.sendCloudApi(jid, {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: "628123456789",
    type: "interactive",
    interactive: {
        type: "button",
        header: { type: "text", text: "Order Confirmation" },
        body: { text: "Please choose an action for your order #1234:" },
        footer: { text: "baileys-rec Official Cloud Adapter" },
        action: {
            buttons: [
                { type: "reply", reply: { id: "pay_now", title: "💳 Pay Now" } },
                { type: "reply", reply: { id: "cancel_order", title: "❌ Cancel" } }
            ]
        }
    }
});

// Method 2: Inside sock.sendMessage using "cloudApi"
await sock.sendMessage(jid, {
    cloudApi: {
        messaging_product: "whatsapp",
        type: "interactive",
        interactive: {
            type: "cta_url",
            body: { text: "Click below to view the latest update:" },
            action: {
                name: "cta_url",
                parameters: {
                    display_text: "🌐 Open Website",
                    url: "https://github.com/KazeDevID/baileys-rec"
                }
            }
        }
    }
});

// Method 3: Direct HTTP Meta WhatsApp Business Cloud API Client
import { sendMetaCloudApi, createMetaCloudApiClient, diagnoseMetaCloudApiError } from "baileys-rec";

const client = createMetaCloudApiClient({
    phoneNumberId: "YOUR_PHONE_NUMBER_ID",
    accessToken: "YOUR_META_ACCESS_TOKEN",
    apiVersion: "v21.0" // defaults to v21.0
});

// Send template message (required for 24h customer care window re-engagement)
await client.sendTemplate("628123456789", "hello_world", "en_US");
```

---

### 6. WhatsApp Chat Visibility & Delivery Troubleshooting

If your messages send but **do not appear in WhatsApp chat**, check these key factors:

1. **Native Flow & ViewOnce Message Envelope (Fixed in v1.2.1)**:
   Modern WhatsApp clients (Android, iOS, Web) require interactive messages (buttons, lists, flows, and carousels) to specify `messageVersion: 1` and be wrapped in a `viewOnceMessage` context with `deviceListMetadataVersion: 2`. `baileys-rec@1.2.1` automatically handles this under the hood.

2. **24-Hour Customer Care Window (Meta Cloud API)**:
   According to Meta's Business Messaging policy, businesses can only send free-form messages (text, media, interactive buttons) within **24 hours** of the user's last message. Outside this 24-hour window, you **must send an approved Template Message** (`type: "template"`). Once the recipient replies, the 24-hour session opens.

3. **Recipient Phone Number Format**:
   Phone numbers for Meta Cloud API must be digits only in international E.164 format (e.g. `628123456789`), without `+`, without `@s.whatsapp.net`, and without leading `0`. `baileys-rec` provides `sanitizeWhatsAppNumber()` to normalize numbers automatically.

4. **Sandbox / Test Phone Numbers**:
   If using a Meta Developer Sandbox number, messages are only delivered to recipient phone numbers explicitly added to the "To Phone Numbers" whitelist in the Meta App Developer Dashboard.

Send messages directly using the official Meta WhatsApp Cloud API request schema:

```typescript
// Direct Cloud API Carousel payload
await sock.sendMessage(jid, {
    cloudApi: {
        messaging_product: "whatsapp",
        type: "interactive",
        interactive: {
            type: "carousel",
            body: { text: "Discover our popular catalog:" },
            action: {
                cards: [
                    {
                        card_index: 0,
                        header: { type: "image", image: { link: "https://example.com/item1.jpg" } },
                        body: { text: "Item 1 Description" },
                        action: {
                            buttons: [{ type: "reply", reply: { id: "item_1", title: "Order" } }]
                        }
                    }
                ]
            }
        }
    }
});

// Convert Meta Cloud API payloads to Baileys format
import { fromCloudApiMessage, toCloudApiMessage } from "baileys-rec";

const baileysMessage = fromCloudApiMessage(metaPayload);
await sock.sendMessage(jid, baileysMessage);
```

---

## License

MIT © [KazeDevID](https://github.com/KazeDevID)
