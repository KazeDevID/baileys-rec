# baileys-rec 🚀

> **Enhanced WhatsApp Web API library for Node.js**
> Fork of official Baileys v7.0.0-rc14 with modern native flow interactive buttons, rich bot messages from @itsliaaa/baileys, and native protocol compatibility with Meta WhatsApp Business Cloud API.

[![npm version](https://img.shields.io/badge/npm-v7.0.0--rc14-blue.svg)](https://www.npmjs.com/package/baileys-rec)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Author](https://img.shields.io/badge/Author-KazeDevID-orange.svg)](https://github.com/KazeDevID)

---

## ✨ Features

- ⚡ **Full Baileys Core**: Built on the latest `baileys@7.0.0-rc14` engine.
- 🔘 **Native Flow Buttons**: Send Interactive Quick Replies, CTA URLs, Call Buttons, and Copy Code buttons that render directly on WhatsApp Android, iOS, and Web.
- 📋 **Interactive List Menus**: Bottom sheet single-select lists with sections and rows.
- 🌐 **Meta Cloud API Compatibility**: Send messages using standard WhatsApp Cloud API JSON schemas directly (`sock.sendMessage(jid, { cloudApi: payload })`) without using Cloud API servers!
- 🗂️ **Multi-Card Carousel Messages**: Swipeable interactive cards with media headers and per-card buttons.
- 💻 **AI Rich Response Messages**: Syntax-highlighted code blocks, tables, LaTeX math formulas, citations, and verified bot metadata.
- 🛠️ **Fluent Builders**: Easy-to-use `ButtonBuilder`, `MessageBuilder`, and converter utilities.

---

## 📦 Installation

```bash
npm install baileys-rec
```

---

## 🚀 Quick Start

```typescript
import makeWASocket, { 
    useMultiFileAuthState, 
    ButtonBuilder, 
    fromCloudApiMessage 
} from "baileys-rec";

const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

const sock = makeWASocket({
    auth: state,
    printQRInTerminal: true
});

sock.ev.on("creds.update", saveCreds);

sock.ev.on("connection.update", (update) => {
    const { connection } = update;
    if (connection === "open") {
        console.log("Connected to WhatsApp successfully via baileys-rec!");
    }
});
```

---

## 🔘 1. Interactive Native Flow Buttons

```typescript
import { ButtonBuilder } from "baileys-rec";

const buttons = new ButtonBuilder()
    .addReply("btn_menu", "📋 Main Menu")
    .addUrl("🌐 Visit Website", "https://github.com/KazeDevID")
    .addCall("📞 Call Support", "+628123456789")
    .addCopy("🎟️ Copy Voucher", "PROMO50")
    .build();

await sock.sendMessage(jid, {
    text: "Welcome to our service! Please choose an option below:",
    footer: "Powered by baileys-rec",
    nativeFlow: buttons
});
```

---

## 🌐 2. Meta WhatsApp Cloud API Schema Adapter

```typescript
const metaCloudPayload = {
    messaging_product: "whatsapp",
    recipient_type: "individual",
    to: "628123456789",
    type: "interactive",
    interactive: {
        type: "button",
        header: { type: "text", text: "Special Offer" },
        body: { text: "Claim your special discount today!" },
        footer: { text: "Meta Cloud API Payload" },
        action: {
            buttons: [
                { type: "reply", reply: { id: "claim_yes", title: "Claim Now 🎁" } },
                { type: "reply", reply: { id: "claim_no", title: "Maybe Later" } }
            ]
        }
    }
};

await sock.sendMessage(jid, {
    cloudApi: metaCloudPayload
});
```

---

## 👥 Credits & Authors

- **KazeDevID** - Author of `baileys-rec` modifications, Cloud API adapter, and helper builders.
- **WhiskeySockets / Baileys** - Original Baileys library core.
- **@itsliaaa/baileys** - Inspiration for rich message utilities and initial native flow patterns.

## 📄 License

MIT License.
