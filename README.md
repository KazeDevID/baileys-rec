# baileys-rec

<div align="center">

[![npm version](https://img.shields.io/npm/v/baileys-rec.svg?style=for-the-badge&color=10b981)](https://www.npmjs.com/package/baileys-rec)
[![npm downloads](https://img.shields.io/npm/dm/baileys-rec.svg?style=for-the-badge&color=3b82f6)](https://www.npmjs.com/package/baileys-rec)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-f59e0b?style=for-the-badge)](https://nodejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-6366f1.svg?style=for-the-badge)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-KazeDevID%2Fbaileys--rec-181717?style=for-the-badge&logo=github)](https://github.com/KazeDevID/baileys-rec)

<p align="center">
  <b>Modern, Production-Ready WhatsApp Web API Library for Node.js &amp; TypeScript</b><br/>
  Supercharged with Native Flow Interactive Buttons, Multi-Card Swipeable Carousels, AI Rich Messages, and Official Meta WhatsApp Business Cloud API Protocol Compatibility.
</p>

</div>

---

## 🌟 Key Highlights

- 🔘 **Native Flow Interactive Buttons**: Send Quick Reply buttons, Call-to-Action URLs, Call buttons, Copy Voucher codes, and Single Select list menus that render natively on mobile and desktop WhatsApp.
- 🎠 **Multi-Card Swipeable Carousels**: Create horizontal card carousels with banner media, custom headers, body text, and dedicated action buttons per card.
- 🌐 **Meta Cloud API Protocol Compatibility (`sock.sendCloudApi`)**: Drop-in compatibility for official Meta WhatsApp Cloud API payloads (`type: "interactive"`, `type: "template"`, etc.).
- 🚀 **Built-in HTTP Meta Cloud API Client**: Direct REST client (`createMetaCloudApiClient`, `sendMetaCloudApi`) with automatic phone sanitization, response parsing, and 24-hour customer care window diagnostics.
- 🤖 **AI Rich Messages**: Display syntax-highlighted code blocks, structured data tables, verified bot cards, and citations.
- 🔒 **Fixed WhatsApp Mobile Visibility**: Built-in automatic `viewOnceMessage` wrapping with `deviceListMetadataVersion: 2` and `messageVersion: 1` so interactive messages always appear in WhatsApp chats.
- ⚡ **Pairing Code & QR Login**: Support for both terminal QR code scan and phone-number-based 8-digit Pairing Code authentication.
- 🛡️ **TypeScript First**: Full typings, auto-completion, and builder patterns.

---

## 📦 Installation

Install via your favorite package manager:

```bash
# Using npm
npm install baileys-rec@latest

# Using yarn
yarn add baileys-rec

# Using pnpm
pnpm add baileys-rec

# Using bun
bun add baileys-rec
```

### System Requirements
- **Node.js**: `v20.0.0` or higher.
- **Modules**: Native ESM and CommonJS (CJS) supported.

---

## 🚀 Quick Start & Connection

### 1. Connection with QR Code (Terminal)

```typescript
import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason
} from "baileys-rec";
import { Boom } from "@hapi/boom";

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth_session");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        browser: ["baileys-rec", "Chrome", "1.2.1"]
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (connection === "close") {
            const shouldReconnect =
                (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log("Connection closed. Reconnecting:", shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === "open") {
            console.log("Connected to WhatsApp successfully with baileys-rec!");
        }
    });

    return sock;
}

connectToWhatsApp();
```

---

### 2. Connection with 8-Digit Pairing Code (No Camera / No QR)

If you run your bot on a server or VPS without camera scanning, use the phone number pairing code method:

```typescript
import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason
} from "baileys-rec";

async function connectWithPairingCode() {
    const { state, saveCreds } = await useMultiFileAuthState("./auth_session");

    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: false,
        browser: ["Ubuntu", "Chrome", "20.0.04"]
    });

    sock.ev.on("creds.update", saveCreds);

    // Request pairing code if not registered
    if (!sock.authState.creds.registered) {
        const phoneNumber = "6281234567890"; // Enter bot phone number with country code
        setTimeout(async () => {
            const code = await sock.requestPairingCode(phoneNumber);
            console.log(`Your WhatsApp Pairing Code: ${code}`);
        }, 3000);
    }

    sock.ev.on("connection.update", (update) => {
        if (update.connection === "open") {
            console.log("Logged in via pairing code!");
        }
    });

    return sock;
}

connectWithPairingCode();
```

---

## 💬 Complete Messaging Guide

### 1. Sending Standard Messages

```typescript
const jid = "6281234567890@s.whatsapp.net";

// A. Simple Text with Link Preview
await sock.sendMessage(jid, {
    text: "Visit our documentation: https://github.com/KazeDevID/baileys-rec"
});

// B. Text with Mentions
await sock.sendMessage(jid, {
    text: "Hello @6281234567890, welcome to the group!",
    mentions: ["6281234567890@s.whatsapp.net"]
});

// C. Quoted / Reply to Message
await sock.sendMessage(jid, {
    text: "This is a reply to your previous message"
}, { quoted: incomingMessage });
```

---

### 2. Sending Media Messages

```typescript
// A. Image with Caption
await sock.sendMessage(jid, {
    image: { url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c" },
    caption: "Here is your requested product photo."
});

// B. Video
await sock.sendMessage(jid, {
    video: { url: "https://www.w3schools.com/html/mov_bbb.mp4" },
    caption: "Product Demo Video",
    gifPlayback: false
});

// C. Audio & Voice Note (PTT)
await sock.sendMessage(jid, {
    audio: { url: "./audio.mp3" },
    mimetype: "audio/mp4",
    ptt: true // true for green microphone voice note
});

// D. Document (PDF, ZIP, DOCX, APK)
await sock.sendMessage(jid, {
    document: { url: "./invoice.pdf" },
    mimetype: "application/pdf",
    fileName: "Invoice_REC_2026.pdf",
    caption: "Official Invoice"
});
```

---

### 3. Sending Interactive Messages (`sock.sendInteractive`)

`sock.sendInteractive` provides high-level convenience for sending native flow action buttons, bottom-sheet menus, and URL buttons:

#### A. Quick Reply & Action Buttons
```typescript
await sock.sendInteractive(jid, {
    title: "Order Confirmation #REC-9821",
    text: "Your order is ready for dispatch. Please confirm your delivery preference:",
    footer: "Interactive Protocol • baileys-rec",
    buttons: [
        { id: "confirm_order", text: "✅ Confirm Order" },
        { url: "https://github.com/KazeDevID/baileys-rec", text: "🌐 Track Order" },
        { call: "+6281234567890", text: "📞 Call Courier" },
        { copy: "PROMO2026", text: "🎟️ Copy Voucher" }
    ]
});
```

#### B. Image Header with Interactive Buttons
```typescript
await sock.sendInteractive(jid, {
    image: { url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe" },
    caption: "Special Year-End Flash Sale! Up to 70% discount.",
    footer: "Limited time offer",
    buttons: [
        { id: "claim_promo", text: "🎁 Claim Discount" },
        { url: "https://github.com/KazeDevID/baileys-rec", text: "🛒 Shop Now" }
    ]
});
```

#### C. Single Select Menu (Bottom Sheet List)
```typescript
await sock.sendInteractive(jid, {
    title: "Service Department",
    text: "Please select a service category from the list below:",
    footer: "Tap button to view options",
    buttonText: "Browse Services",
    sections: [
        {
            title: "Development Solutions",
            rows: [
                { id: "opt_bot", title: "WhatsApp Bot Dev", description: "Automated bots with interactive buttons" },
                { id: "opt_api", title: "Meta Cloud API", description: "Official Graph API integration" }
            ]
        },
        {
            title: "Customer Support",
            rows: [
                { id: "opt_help", title: "24/7 Live Support", description: "Talk to our engineering team" }
            ]
        }
    ]
});
```

---

### 4. Swipeable Multi-Card Carousel (`cards`)

Send horizontal swipeable carousels where each card has its own banner image, title, description, and action buttons:

```typescript
await sock.sendInteractive(jid, {
    text: "Explore our featured flagship product catalog:",
    footer: "Swipe cards horizontally to compare",
    cards: [
        {
            image: { url: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600" },
            title: "Smartphone Pro Ultra",
            subtitle: "Flagship Series",
            caption: "144Hz AMOLED display with 200MP camera system.",
            buttons: [
                { id: "buy_phone", text: "🛒 Buy Now ($999)" },
                { url: "https://github.com/KazeDevID/baileys-rec", text: "📄 Full Specs" }
            ]
        },
        {
            image: { url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600" },
            title: "Studio Wireless Headphones",
            subtitle: "Hi-Res Audio",
            caption: "Active Noise Cancellation with 40-hour battery life.",
            buttons: [
                { id: "buy_audio", text: "🛒 Buy Now ($299)" },
                { copy: "AUDIO50", text: "🎟️ Copy $50 Coupon" }
            ]
        }
    ]
});
```

---

### 5. Using Fluent Builders (`ButtonBuilder`)

Build buttons using a chainable builder pattern:

```typescript
import { ButtonBuilder } from "baileys-rec";

const buttons = new ButtonBuilder()
    .addReply("btn_agree", "✅ Agree & Continue")
    .addReply("btn_decline", "❌ Cancel")
    .addUrl("Terms of Service", "https://github.com/KazeDevID/baileys-rec")
    .addCall("Support Hotline", "+6281234567890")
    .addCopy("Promo Code", "DISCOUNT50")
    .build();

await sock.sendButton(jid, {
    title: "Account Verification",
    text: "Please accept our terms of service to proceed:",
    footer: "Security Department",
    buttons
});
```

---

### 6. Sending AI Rich Messages (`sock.sendRichMessage`)

Format bot responses with syntax-highlighted code blocks, formatted tables, and verified disclaimers:

```typescript
// A. Syntax-Highlighted Code Block
await sock.sendRichMessage(jid, {
    title: "TypeScript Solution",
    code: `import makeWASocket from "baileys-rec";
const sock = makeWASocket({ printQRInTerminal: true });
console.log("Bot online!");`,
    language: "typescript",
    disclaimer: "Generated by Verified Bot"
});

// B. Structured Data Table
await sock.sendRichMessage(jid, {
    title: "Quarterly Performance Report",
    table: [
        ["Quarter", "Messages Sent", "Uptime", "Latency"],
        ["Q1 2026", "2,450,000", "99.98%", "110ms"],
        ["Q2 2026", "3,120,000", "99.99%", "95ms"],
        ["Q3 2026", "4,890,000", "100.0%", "88ms"]
    ],
    disclaimer: "Verified Production Analytics"
});
```

---

### 7. Meta WhatsApp Cloud API Protocol Compatibility (`sock.sendCloudApi`)

Use official Meta WhatsApp Business Cloud API payload schemas directly:

```typescript
// Send official Meta Cloud API JSON payload via Baileys socket
await sock.sendCloudApi(jid, {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: "6281234567890",
    type: "interactive",
    interactive: {
        type: "button",
        header: { type: "text", text: "Order Update" },
        body: { text: "Your delivery package has arrived at the local facility." },
        footer: { text: "baileys-rec Official Cloud Adapter" },
        action: {
            buttons: [
                { type: "reply", reply: { id: "track_delivery", title: "🚚 Track Package" } },
                { type: "reply", reply: { id: "reschedule", title: "📅 Reschedule" } }
            ]
        }
    }
});

// Or inside standard sock.sendMessage using "cloudApi" property
await sock.sendMessage(jid, {
    cloudApi: {
        messaging_product: "whatsapp",
        type: "interactive",
        interactive: {
            type: "cta_url",
            body: { text: "Check out our open-source repository:" },
            action: {
                name: "cta_url",
                parameters: {
                    display_text: "🌐 Open GitHub",
                    url: "https://github.com/KazeDevID/baileys-rec"
                }
            }
        }
    }
});
```

#### Payload Converter Utilities
```typescript
import { fromCloudApiMessage, toCloudApiMessage } from "baileys-rec";

// 1. Meta Cloud API Payload -> Baileys message object
const baileysMessage = fromCloudApiMessage(metaJsonPayload);
await sock.sendMessage(jid, baileysMessage);

// 2. Baileys message object -> Meta Cloud API JSON payload
const metaPayload = toCloudApiMessage(baileysContent, "6281234567890");
```

---

### 8. Official Direct HTTP Meta Cloud API REST Client

`baileys-rec` provides a dedicated HTTP client for interacting with Meta's Graph API (`https://graph.facebook.com/v21.0/{phoneNumberId}/messages`):

```typescript
import { createMetaCloudApiClient, sendMetaCloudApi } from "baileys-rec";

// Initialize client
const client = createMetaCloudApiClient({
    phoneNumberId: "104523985721834",
    accessToken: "EAA...", // System User Permanent Token
    apiVersion: "v21.0"   // Optional, defaults to v21.0
});

// 1. Send Pre-Approved Template (Required to start business-initiated conversation)
await client.sendTemplate("6281234567890", "hello_world", "en_US");

// 2. Send Plain Text
await client.sendText("6281234567890", "Hello from Meta Cloud API!", true);

// 3. Send Interactive Message
await client.sendInteractive("6281234567890", {
    type: "button",
    body: { text: "Please confirm your email address:" },
    action: {
        buttons: [
            { type: "reply", reply: { id: "email_ok", title: "✅ Correct" } }
        ]
    }
});
```

---

## 👂 Handling Incoming Messages & Button Clicks

Listen to `messages.upsert` to capture text, button clicks, menu selections, and flow responses:

```typescript
sock.ev.on("messages.upsert", async ({ messages, type }) => {
    if (type !== "notify") return;

    for (const msg of messages) {
        if (!msg.message || msg.key.fromMe) continue;

        const sender = msg.key.remoteJid;
        const messageContent = msg.message;

        // 1. Check for Native Flow Quick Reply Button Click
        const interactiveResponse =
            messageContent.interactiveResponseMessage?.nativeFlowResponseMessage;
        if (interactiveResponse) {
            const buttonId = interactiveResponse.name;
            const params = JSON.parse(interactiveResponse.paramsJson || "{}");
            console.log(`User clicked button: ${params.id || buttonId}`);

            if (params.id === "confirm_order") {
                await sock.sendMessage(sender, { text: "Thank you! Your order is confirmed." });
            }
            continue;
        }

        // 2. Check for Single Select Menu (List Response)
        const listResponse = messageContent.listResponseMessage;
        if (listResponse) {
            const selectedRowId = listResponse.singleSelectReply?.selectedRowId;
            console.log(`User selected list item: ${selectedRowId}`);
            continue;
        }

        // 3. Regular Text Message
        const text =
            messageContent.conversation ||
            messageContent.extendedTextMessage?.text ||
            "";

        if (text.toLowerCase() === "!menu") {
            await sock.sendInteractive(sender, {
                text: "Choose an option:",
                buttons: [
                    { id: "opt_1", text: "📦 Products" },
                    { id: "opt_2", text: "📞 Support" }
                ]
            });
        }
    }
});
```

---

## 🛠️ WhatsApp Chat Visibility & Troubleshooting

If you send messages using Meta Cloud API or Baileys socket and they **do not appear in WhatsApp**, verify the following rules:

| Symptom / Cause | Explanation | Solution |
| :--- | :--- | :--- |
| **Interactive Buttons Not Showing (Fixed in v1.2.1)** | WhatsApp mobile clients require interactive messages to have `messageVersion: 1` and be wrapped inside a `viewOnceMessage` envelope with `deviceListMetadataVersion: 2`. | Upgrade to `baileys-rec@1.2.1`. The wrapper is automatically handled. |
| **Meta Cloud API 24h Window Rule** | Meta Business Messaging strictly enforces a **24-hour Customer Care Window**. Outside 24h, free-form text and interactive messages are rejected (`Error 131047`). | Send an approved Template Message (`type: "template"`, e.g. `hello_world`). Once the user replies, the 24h session opens. |
| **Invalid Phone Number Format** | Meta Graph API rejects numbers containing `+`, spaces, dashes, or `@s.whatsapp.net` (`Error 100`). | Use numeric E.164 digits only: e.g. `6281234567890`. Use `sanitizeWhatsAppNumber()` helper. |
| **Sandbox / Test Number Whitelist** | When testing on a Meta Developer Sandbox number, messages are only delivered to verified recipient numbers (`Error 131030`). | Add recipient phone number to the "To Phone Numbers" whitelist in Meta Developer Dashboard. |
| **Too Many Reply Buttons** | Meta limits `type: "button"` reply buttons to a maximum of 3. Sending 4 or more causes Meta `Error 100`. | Use `type: "list"` (Menu) for 4 or more options. `toCloudApiMessage()` auto-converts this. |
| **Temporary Access Token Expired** | Meta temporary developer access tokens expire after 24 hours (`Error 190`). | Generate a permanent System User Token in Meta Business Manager. |

---

## 📚 API Reference Cheat Sheet

| Method | Description |
| :--- | :--- |
| `sock.sendInteractive(jid, content, options)` | Send native flow buttons, list menus, CTA links, or carousels |
| `sock.sendCloudApi(jid, payload, options)` | Send official Meta WhatsApp Cloud API JSON payload via socket |
| `sock.sendButton(jid, content, options)` | Send button message with header, body, footer, and buttons |
| `sock.sendRichMessage(jid, content, options)` | Send syntax-highlighted code blocks, tables, and AI bot cards |
| `sock.sendMessage(jid, content, options)` | Standard Baileys socket sending method |
| `createMetaCloudApiClient(config)` | Create official HTTP Meta WhatsApp Cloud API REST client |
| `sendMetaCloudApi(config, payload)` | Send payload directly to Meta Graph API endpoint via HTTP |
| `sanitizeWhatsAppNumber(phone)` | Format and clean phone number to international E.164 digits |
| `diagnoseMetaCloudApiError(error)` | Diagnose Meta error code (24h window, sandbox whitelist, token) |
| `fromCloudApiMessage(payload)` | Convert Meta Cloud API payload to Baileys content object |
| `toCloudApiMessage(content, phone)` | Convert Baileys content object to Meta Cloud API JSON payload |
| `ButtonBuilder` | Fluent builder class for interactive buttons |
| `MessageBuilder` | Fluent builder class for rich interactive messages |

---

## 👥 Authors & Community

- **Author**: [KazeDevID](https://github.com/KazeDevID) (<kamusiapakah752@gmail.com>)
- **Repository**: [https://github.com/KazeDevID/baileys-rec](https://github.com/KazeDevID/baileys-rec)
- **NPM Package**: [https://www.npmjs.com/package/baileys-rec](https://www.npmjs.com/package/baileys-rec)

## 📄 License

This project is licensed under the [MIT License](LICENSE).
