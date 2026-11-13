# 🚀 baileys-rec (v1.5.0)

> **The Next-Generation WhatsApp Multi-Device & Meta Cloud API Library for Node.js.**
> **v1.5.0 Flagship**: 100% Pure WhatsApp Protobuf (WAProto) support for ALL Meta Cloud API message formats without requiring tokens or keys! Includes Single Product (`single_product`), Multi-Product Catalog List (`product_list`), Open Catalog (`open_catalog`), Address Request (`address_message`), Order Details (`review_order`), Pix Payments & Status Updates (`review_and_pay`, `payment_status_update`), Meta Flows v3 (`flow` with mode & actions), In-App Webview (`open_webview`), Voice Note with Waveform/PTT, Polls, Calendar Events, and zero-token `fromCloudApiMessage` converter.  
> An official enhanced fork of Baileys featuring full protocol integration for **Meta WhatsApp Business Cloud API**, **Native Flow v2 Interactive Buttons**, **Swipeable Multi-Card Carousel**, **Pairing Code Authentication**, and robust memory optimization & auto-reconnect.

[![npm version](https://img.shields.io/npm/v/baileys-rec.svg?style=flat-square&color=00d26a)](https://www.npmjs.com/package/baileys-rec)
[![npm downloads](https://img.shields.io/npm/dm/baileys-rec.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/baileys-rec)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/KazeDevID/baileys-rec?style=flat-square)](https://github.com/KazeDevID/baileys-rec)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)

---


## 🌟 What is New in v1.5.0: Pure Proto WhatsApp Cloud Feature Parity (Zero Token / No Key)

In version 1.5.0, `baileys-rec` bridges the entire gap between Meta WhatsApp Business Cloud API and Baileys multi-device socket. You can now use all official Meta interactive message formats **without creating a Meta developer account, without registering business managers, without paying per conversation, and without any API tokens or keys**!

### 1. Single Product & Multi-Product Catalog (Native Flow Proto)

```typescript
import { Button } from "baileys-rec";

// Send Single Product directly via WAProto (no tokens needed)
await new Button(sock)
  .setTitle("Featured Sneakers")
  .setBody("Check out the latest Nike Air Max 2026")
  .setFooter("Official Store")
  .addProduct("NIKE_AIR_MAX", "CATALOG_ID_123", "🛍️ Lihat Produk")
  .send(jid);

// Send Multi-Product Section List
await new Button(sock)
  .setTitle("Our Catalog Collection")
  .setBody("Browse through our seasonal collection")
  .addProductList("CATALOG_ID_123", [
    {
      title: "Footwear",
      product_items: [{ product_retailer_id: "SHOE_01" }, { product_retailer_id: "SHOE_02" }]
    },
    {
      title: "Apparel",
      product_items: [{ product_retailer_id: "HOODIE_01" }]
    }
  ], "🛍️ Lihat Katalog Produk")
  .send(jid);
```

### 2. Pix Payments & Payment Status Updates

```typescript
// Send Instant Pix / Payment Request
await new Button(sock)
  .setTitle("Invoice #INV-2026")
  .setBody("Total Pembayaran: Rp 150.000")
  .addPixPayment("payment@merchant.com", 150000, "Toko Online", "💳 Bayar Sekarang")
  .send(jid);

// Send Payment Status Notification
await new Button(sock)
  .setTitle("Status Transaksi")
  .setBody("Pembayaran Anda telah diverifikasi!")
  .addPaymentStatus("INV-2026", "success", {
    currency: "IDR",
    amount: { value: 15000000, offset: 100 }
  }, "Detail Transaksi")
  .send(jid);
```

### 3. Address Request & Order Details

```typescript
// Request Customer Address (Interactive Bottom-sheet)
await new Button(sock)
  .setTitle("Konfirmasi Pengiriman")
  .setBody("Silakan lengkapi alamat pengiriman Anda:")
  .addAddressRequest("🏠 Isi Alamat Pengiriman", "shipping")
  .send(jid);

// Send Order Review & Checkout
await new Button(sock)
  .setTitle("Ringkasan Pesanan")
  .setBody("Pesanan siap diproses:")
  .addReviewOrder({
    order_id: "ORD_789",
    items: [
      { name: "Wireless Headphones", price: 350000, quantity: 1 }
    ],
    subtotal: 350000,
    tax: 35000,
    status: "pending"
  })
  .send(jid);
```

### 4. Zero-Token Universal Meta Cloud API Converter (`fromCloudApiMessage`)

Got a JSON payload from the official [Meta WhatsApp Business API Documentation](https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started)? Simply pass it to `fromCloudApiMessage()` to send it instantly via Baileys multi-device socket with **zero tokens and zero keys**:

```typescript
import { fromCloudApiMessage } from "baileys-rec";

// Copy-paste straight from Meta docs:
const metaPayload = {
  messaging_product: "whatsapp",
  recipient_type: "individual",
  to: "628123456789",
  type: "interactive",
  interactive: {
    type: "product",
    body: { text: "Exclusive drop!" },
    action: {
      catalog_id: "MY_CATALOG",
      product_retailer_id: "ITEM_99"
    }
  }
};

// Converts to 100% pure Proto format:
const baileysMessage = fromCloudApiMessage(metaPayload);
await sock.sendMessage(jid, baileysMessage);
```

## 📑 Comprehensive Table of Contents

1. [Introduction & Architecture](#1-introduction--architecture)
   - [What is baileys-rec?](#what-is-baileys-rec)
   - [Comparison: Baileys Socket vs Meta Cloud API](#comparison-baileys-socket-vs-meta-cloud-api)
   - [Key Highlights of v1.2.4](#key-highlights-of-v124)
2. [Setup & Installation from Scratch](#2-setup--installation-from-scratch)
   - [System Requirements](#system-requirements)
   - [Project Initialization (ESM & CommonJS)](#project-initialization-esm--commonjs)
   - [Package Installation](#package-installation)
3. [Authentication & WhatsApp Connection](#3-authentication--whatsapp-connection)
   - [Method 1: Pairing Code (No QR Scan, Recommended for VPS/Cloud)](#method-1-pairing-code-no-qr-scan-recommended-for-vpscloud)
   - [Method 2: Terminal QR Code](#method-2-terminal-qr-code)
   - [Auto-Reconnect & Lifecycle Management](#auto-reconnect--lifecycle-management)
   - [Multi-File Session State Management](#multi-file-session-state-management)
4. [Core Messaging](#4-core-messaging)
   - [Text Formatting (Bold, Italic, Monospace)](#text-formatting-bold-italic-monospace)
   - [Mentions (@mention)](#mentions-mention)
   - [Quoting / Replying to Messages](#quoting--replying-to-messages)
   - [Images & Photos](#images--photos)
   - [Videos & GIFs](#videos--gifs)
   - [Audio & Voice Notes (VN / PTT)](#audio--voice-notes-vn--ptt)
   - [Documents & PDFs](#documents--pdfs)
   - [Stickers (Static & Animated)](#stickers-static--animated)
   - [Location & Maps](#location--maps)
   - [Contact Cards (vCard)](#contact-cards-vcard)
   - [Polls & Voting](#polls--voting)
   - [Emoji Reactions](#emoji-reactions)
   - [Revoke / Delete for Everyone](#revoke--delete-for-everyone)
   - [Editing Sent Messages](#editing-sent-messages)
5. [Interactive Messages & Native Flow (v1.2.4 Flagship)](#5-interactive-messages--native-flow-v124-flagship)
   - [Quick Reply Buttons](#quick-reply-buttons)
   - [CTA URL Buttons (Open Web)](#cta-url-buttons-open-web)
   - [CTA Call Buttons (Phone Call)](#cta-call-buttons-phone-call)
   - [CTA Copy Code Buttons (Promo Copy)](#cta-copy-code-buttons-promo-copy)
   - [List Menu / Dropdown Single Select](#list-menu--dropdown-single-select)
   - [Swipeable Multi-Card Carousel](#swipeable-multi-card-carousel)
   - [Why Interactive Messages Guaranteed to Render in v1.2.4](#why-interactive-messages-guaranteed-to-render-in-v124)
6. [Full Meta WhatsApp Cloud API Integration](#6-full-meta-whatsapp-cloud-api-integration)
   - [Send Meta Cloud API Payload via Socket: sock.sendCloudApi()](#send-meta-cloud-api-payload-via-socket-socksendcloudapi)
   - [Built-in Meta Cloud API HTTP Client: createMetaCloudApiClient()](#built-in-meta-cloud-api-http-client-createmetacloudapiclient)
   - [Bypassing the 24-Hour Window with Template Messages](#bypassing-the-24-hour-window-with-template-messages)
   - [Utility Helpers: fromCloudApiMessage & toCloudApiMessage](#utility-helpers-fromcloudapimessage--tocloudapimessage)
   - [Building an Official Meta Cloud API Webhook Receiver (Express)](#building-an-official-meta-cloud-api-webhook-receiver-express)
7. [Event Handling & Listeners (Incoming Events)](#7-event-handling--listeners-incoming-events)
   - [Handling Incoming Messages (messages.upsert)](#handling-incoming-messages-messagesupsert)
   - [Catching Interactive Button & Native Flow Clicks](#catching-interactive-button--native-flow-clicks)
   - [Catching List Menu Selections](#catching-list-menu-selections)
   - [Catching Poll Votes](#catching-poll-votes)
   - [Downloading Media (Images, Videos, Audio, Documents)](#downloading-media-images-videos-audio-documents)
   - [Delivery Receipt Updates (Single, Double, Blue Ticks)](#delivery-receipt-updates-single-double-blue-ticks)
   - [Group Participant Events (Join, Leave, Promote, Demote)](#group-participant-events-join-leave-promote-demote)
8. [Advanced WhatsApp Group Management](#8-advanced-whatsapp-group-management)
   - [Creating a New Group](#creating-a-new-group)
   - [Fetching Group Metadata](#fetching-group-metadata)
   - [Updating Group Subject & Description](#updating-group-subject--description)
   - [Configuring Chat Permissions (Announcements)](#configuring-chat-permissions-announcements)
   - [Getting & Revoking Group Invite Links](#getting--revoking-group-invite-links)
   - [Adding, Kicking, Promoting, and Demoting Members](#adding-kicking-promoting-and-demoting-members)
   - [Leaving a Group](#leaving-group)
9. [Profile, Presence, & Privacy](#9-profile-presence--privacy)
   - [Updating Status Bio](#updating-status-bio)
   - [Updating Profile Pictures (User or Group)](#updating-profile-pictures-user-or-group)
   - [Sending Typing / Recording Presence Indicators](#sending-typing--recording-presence-indicators)
   - [Marking Messages as Read (Blue Ticks)](#marking-messages-as-read-blue-ticks)
10. [Comprehensive Troubleshooting & Diagnostics](#10-comprehensive-troubleshooting--diagnostics)
    - [Why Are Messages/Buttons Not Showing in WhatsApp?](#why-are-messagesbuttons-not-showing-in-whatsapp)
    - [Meta Error 131047: 24-Hour Customer Care Window](#meta-error-131047-24-hour-customer-care-window)
    - [Meta Error 100: Invalid Parameter](#meta-error-100-invalid-parameter)
    - [Corrupted Sessions, 401 Unauthorized, & Bad MAC](#corrupted-sessions-401-unauthorized--bad-mac)
    - [Tips to Avoid WhatsApp Number Banning](#tips-to-avoid-whatsapp-number-banning)
11. [Production-Ready Bot Boilerplate (Full Code)](#11-production-ready-bot-boilerplate-full-code)
12. [API Reference Table](#12-api-reference-table)

---

## 1. Introduction & Architecture

### What is baileys-rec?
`baileys-rec` is a modern TypeScript/Node.js WhatsApp library that bridges two powerful ecosystems:
1. **Multi-Device WebSocket Protocol**: Connects directly to the WhatsApp Web network without running a heavy headless browser (Puppeteer/Playwright), maintaining extremely low RAM consumption (< 60MB).
2. **Meta WhatsApp Business Cloud API Compatibility**: Supports official Meta Cloud API Graph v21.0 payload schemas, allowing developers to write unified code that runs seamlessly on both Baileys socket sessions and official Meta Cloud API endpoints.

### Comparison: Baileys Socket vs Meta Cloud API

| Feature | Baileys Socket (`baileys-rec`) | Official Meta Cloud API | `baileys-rec` Solution |
| :--- | :--- | :--- | :--- |
| **Message Cost** | **100% Free** (Uses your own phone data plan) | Pay-per-conversation (Meta Rate Card) | Use Meta Cloud API JSON structures **completely free** via Socket |
| **24-Hour Window** | **Unlimited** (Initiate chats anytime) | Restricted to 24 hours (Template required) | Bypass 24h restrictions effortlessly |
| **Interactive Buttons** | Requires complex Protobuf & `viewOnceMessage` | Standard JSON Payload (`type: "interactive"`) | **`sock.sendCloudApi()`** converts Meta JSON to Protobuf automatically |
| **Swipeable Carousel** | Supported via `cards` property | Supported via `interactive.type: "carousel"` | Supports **both** natively in v1.2.4 |
| **Phone Number** | Any personal or business WhatsApp number | Requires Meta Business verification & approval | Use either or both side-by-side |

### Key Highlights of v1.2.4
- ✅ **Interactive Message Bugfix**: Resolved parser priority issues where interactive buttons were stripped and converted into plain text.
- ✅ **Automatic `viewOnceMessage` Envelope**: Ensures interactive messages render correctly on WhatsApp Android, iOS, and Desktop clients.
- ✅ **Protobuf `messageVersion: 1`**: Fully compliant with WhatsApp Native Flow specifications.
- ✅ **Automatic `<biz>` Binary Stanza**: Injected business stanzas for robust message delivery.
- ✅ **Pairing Code Support**: Authenticate your bot without scanning terminal QR codes (ideal for headless VPS, Docker, and Cloud Run).
- ✅ **Auto-Fallback for >3 Buttons**: Automatically converts quick reply lists exceeding 3 items into Single-Select List Menus to prevent Meta Error 100.
- ✅ **Built-in Cloud API Client**: Direct REST communication with Meta Graph API v21.0 complete with automated error diagnostics.

---

## 2. Setup & Installation from Scratch

### System Requirements
- **Node.js**: Version `>= 18.0.0` (Node.js 20.x or 22.x LTS recommended)
- **NPM**: Version `>= 9.0.0` or Yarn / PNPM
- **OS**: Linux (Ubuntu, Debian, CentOS), macOS, or Windows 10/11

### Project Initialization (ESM & CommonJS)

Create a new project directory and initialize:
```bash
mkdir whatsapp-bot && cd whatsapp-bot
npm init -y
```

Open `package.json` and add `"type": "module"` to enable modern ES Module syntax (`import/export`):
```json
{
  "name": "whatsapp-bot",
  "version": "1.0.0",
  "type": "module",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  }
}
```

> **CommonJS Note**: If your project uses CommonJS (`require`), omit `"type": "module"`. Example require:
> ```javascript
> const makeWASocket = require('baileys-rec').default;
> const { useMultiFileAuthState, DisconnectReason } = require('baileys-rec');
> ```

### Package Installation
Install the latest version of `baileys-rec` along with `pino` logger:
```bash
npm install baileys-rec@latest pino
```

Optional tools for terminal QR scanning and error handling:
```bash
npm install qrcode-terminal @hapi/boom
```

---

## 3. Authentication & WhatsApp Connection

### Method 1: Pairing Code (No QR Scan, Recommended for VPS/Cloud)
The **Pairing Code** method is the easiest and most stable way to link your WhatsApp bot on cloud servers without needing terminal screenshot tools.

Create `index.js`:
```javascript
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from 'baileys-rec';
import pino from 'pino';

async function startBot() {
  // 1. Initialize multi-file auth state storage in './auth_session'
  const { state, saveCreds } = await useMultiFileAuthState('./auth_session');

  // 2. Create the WhatsApp socket connection
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }), // Set to 'info' or 'debug' for verbose logs
    printQRInTerminal: false, // Disable QR since we use pairing code
    browser: ['Ubuntu', 'Chrome', '22.04']
  });

  // 3. Save credentials upon updates
  sock.ev.on('creds.update', saveCreds);

  // 4. Request pairing code if the session is not registered yet
  if (!sock.authState.creds.registered) {
    // Enter your bot WhatsApp number in E.164 format without + or spaces
    // Example for Indonesia: 6281234567890
    const botNumber = '6281234567890';
    
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(botNumber);
        console.log('\n==================================================');
        console.log('🔑 YOUR WHATSAPP PAIRING CODE: ', code);
        console.log('👉 Open WhatsApp on your phone > Linked Devices > Link with phone number');
        console.log('==================================================\n');
      } catch (err) {
        console.error('Failed to request pairing code:', err);
      }
    }, 3000);
  }

  // 5. Handle connection lifecycle
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      
      console.log(`⚠️ Connection closed (status: ${statusCode}). Reconnecting: ${shouldReconnect}`);
      
      if (shouldReconnect) {
        startBot();
      } else {
        console.log('❌ Logged out from WhatsApp. Delete auth_session folder and restart.');
      }
    } else if (connection === 'open') {
      console.log('✅ WHATSAPP BOT CONNECTED SUCCESSFULLY!');
      console.log('Bot User ID:', sock.user?.id);
    }
  });

  return sock;
}

startBot();
```

### Method 2: Terminal QR Code
For local development where you prefer scanning a QR code with your phone camera:
```javascript
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from 'baileys-rec';
import pino from 'pino';

async function startBotQR() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_qr');

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true
  });

  sock.ev.on('creds.update', saveCreds);
  
  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        startBotQR();
      }
    } else if (connection === 'open') {
      console.log('✅ Connected via QR Code!');
    }
  });
}

startBotQR();
```

### Auto-Reconnect & Lifecycle Management
Disconnect reasons reference table (`DisconnectReason`):

| Status Code | Enum DisconnectReason | Meaning | Action / Solution |
| :--- | :--- | :--- | :--- |
| **401** | `loggedOut` | Account logged out from phone | Do not reconnect. Delete session folder and re-pair. |
| **408** | `timedOut` | Internet connection timed out | Invoke `startBot()` to reconnect. |
| **428** | `connectionLost` | Network data dropped | Invoke `startBot()` to reconnect. |
| **440** | `connectionReplaced` | Session opened on another device/terminal | Terminate conflicting instance. |
| **500** | `badSession` | Auth session files corrupted | Delete session folder and re-pair. |
| **515** | `restartRequired` | WhatsApp requested handshake restart | Invoke `startBot()` directly. |

### Multi-File Session State Management
`useMultiFileAuthState('./folder_session')` stores persistent credentials:
- `creds.json`: Primary account encryption keys.
- `app-state-sync-key-*.json`: Contact and chat synchronization keys.
- `session-*.json`: Signal encryption session keys per peer.

> 💡 **Security Tip**: Never commit your session folders to public repositories. Add them to your `.gitignore`:
> ```gitignore
> auth_session/
> auth_qr/
> node_modules/
> ```

---

## 4. Core Messaging

Target recipient (`jid`) formats:
- Private Chat: `"6281234567890@s.whatsapp.net"`
- Group Chat: `"120363045678901234@g.us"`
- Broadcast: `"status@broadcast"`

### Text Formatting
```javascript
// WhatsApp text formatting:
// *text* = Bold
// _text_ = Italic
// ~text_ = Strikethrough
// ```text``` = Monospace code

await sock.sendMessage(jid, {
  text: 'Hello! This is *bold*, _italic_, ~strikethrough~, and ```monospace code```.'
});
```

### Mentions (@mention)
```javascript
const userJid = '6289876543210@s.whatsapp.net';

await sock.sendMessage(jid, {
  text: 'Hello @6289876543210, please check this message!',
  mentions: [userJid]
});
```

### Quoting / Replying to Messages
```javascript
// quoted: incomingMessage (from messages.upsert)
await sock.sendMessage(jid, {
  text: 'This is a direct reply to your previous message.'
}, { quoted: incomingMessage });
```

### Images & Photos
Supports binary Buffers, direct URLs, or local file paths:
```javascript
import fs from 'fs';

// From URL
await sock.sendMessage(jid, {
  image: { url: 'https://picsum.photos/800/600' },
  caption: '📸 Image from web URL'
});

// From local file or Buffer
const imageBuffer = fs.readFileSync('./assets/photo.jpg');
await sock.sendMessage(jid, {
  image: imageBuffer,
  caption: '📸 Image from local storage'
});
```

### Videos & GIFs
```javascript
// Standard video with sound
await sock.sendMessage(jid, {
  video: { url: 'https://example.com/video.mp4' },
  caption: '🎥 Demonstration video'
});

// Looping GIF animation
await sock.sendMessage(jid, {
  video: { url: 'https://example.com/animation.mp4' },
  caption: 'Looping GIF',
  gifPlayback: true
});
```

### Audio & Voice Notes (VN / PTT)
```javascript
// Standard audio file (e.g. MP3 music)
await sock.sendMessage(jid, {
  audio: { url: 'https://example.com/music.mp3' },
  mimetype: 'audio/mp4',
  ptt: false
});

// Push-to-Talk (PTT) / Green microphone voice note
await sock.sendMessage(jid, {
  audio: fs.readFileSync('./assets/voice.ogg'),
  mimetype: 'audio/ogg; codecs=opus',
  ptt: true
});
```

### Documents & PDFs
```javascript
await sock.sendMessage(jid, {
  document: fs.readFileSync('./invoice.pdf'),
  mimetype: 'application/pdf',
  fileName: 'Invoice_Order_REC102.pdf',
  caption: 'Your official invoice attachment.'
});
```

### Stickers (Static & Animated)
```javascript
// Sticker must be in WebP format
await sock.sendMessage(jid, {
  sticker: fs.readFileSync('./sticker.webp')
});
```

### Location & Maps
```javascript
await sock.sendMessage(jid, {
  location: {
    degreesLatitude: -6.2088,
    degreesLongitude: 106.8456,
    name: 'National Monument (Monas)',
    address: 'Gambir, Central Jakarta, Indonesia'
  }
});
```

### Contact Cards (vCard)
```javascript
const vcard = 
  'BEGIN:VCARD\n' +
  'VERSION:3.0\n' +
  'FN:KazeDevID Official Support\n' +
  'ORG:baileys-rec Team;\n' +
  'TEL;type=CELL;type=VOICE;waid=6281234567890:+62 812-3456-7890\n' +
  'EMAIL:support@kazedev.id\n' +
  'URL:https://github.com/KazeDevID/baileys-rec\n' +
  'END:VCARD';

await sock.sendMessage(jid, {
  contacts: {
    displayName: 'KazeDevID Support',
    contacts: [{ vcard }]
  }
});
```

### Polls & Voting
```javascript
await sock.sendMessage(jid, {
  poll: {
    name: 'How do you rate baileys-rec v1.2.4?',
    values: ['⭐⭐⭐⭐⭐ Amazing', '⭐⭐⭐⭐ Very Good', '⭐⭐⭐ Good'],
    selectableCount: 1 // 1 for Single Choice, >1 for Multi-Choice
  }
});
```

### Emoji Reactions
```javascript
// React to a specific message
await sock.sendMessage(jid, {
  react: {
    text: '🔥', // Empty string '' to remove reaction
    key: incomingMessage.key
  }
});
```

### Revoke / Delete for Everyone
```javascript
// Delete bot's sent message for all participants
await sock.sendMessage(jid, {
  delete: sentMessageKey
});
```

### Editing Sent Messages
```javascript
// Edit previously sent text message content
await sock.sendMessage(jid, {
  edit: sentMessageKey,
  text: 'This message has been updated successfully.'
});
```

---


---

## 🌟 NEW in v1.4.0: Fluent Builder Suite & Meta GenAI Rich Responses

 v1.4.0 introduces an object-oriented, chainable builder system alongside official Meta GenAI rich message responses (syntax-highlighted code blocks, tables, inline citations, suggestion chips, latex formulas, and animated dynamic media).

### 1. Fluent Button Builder ()

Construct full Native Flow interactive messages with zero manual JSON boilerplate:



### 2. Swipeable Multi-Card Carousel ()

Combine multiple  instances or card objects into a smooth swipeable carousel:



### 3. Meta GenAI Rich Bot Responses ( / )

Render beautiful AI responses equipped with syntax highlighting, markdown tables, clickable references, and follow-up chips:

async function syncSession(sock: any) {
  const status = await sock.authState();
  console.log('Session online:', status.creds.me?.id);
  return status;
}

### 4. Standalone Generators & Markdown Lexer ( & )

Directly generate rich payloads or parse inline markdown entities:



## 5. Interactive Messages & Native Flow (v1.2.4 Flagship)

`baileys-rec` v1.2.4 guarantees that all **Native Flow** buttons render flawlessly on official WhatsApp Android, iOS, and Web/Desktop apps.

### Quick Reply Buttons
Send a message with quick reply buttons (maximum 3 buttons):
```javascript
await sock.sendMessage(jid, {
  text: 'Order #REC-102 has been processed.',
  footer: 'baileys-rec Official',
  nativeFlowMessage: {
    buttons: [
      {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          display_text: '✅ Confirm Order',
          id: 'btn_confirm'
        })
      },
      {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          display_text: '❌ Cancel Order',
          id: 'btn_cancel'
        })
      }
    ]
  }
});
```

### CTA URL Buttons (Open Web)
Send a button that opens an external web browser when clicked:
```javascript
await sock.sendMessage(jid, {
  text: 'Visit the official baileys-rec repository for documentation and releases:',
  footer: 'KazeDevID Official',
  nativeFlowMessage: {
    buttons: [
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({
          display_text: '🌐 Open GitHub Repository',
          url: 'https://github.com/KazeDevID/baileys-rec',
          merchant_url: 'https://github.com/KazeDevID/baileys-rec'
        })
      }
    ]
  }
});
```

### CTA Call Buttons (Phone Call)
Send a button that initiates a phone call when tapped:
```javascript
await sock.sendMessage(jid, {
  text: 'Need emergency support? Call our customer care:',
  footer: '24/7 Support',
  nativeFlowMessage: {
    buttons: [
      {
        name: 'cta_call',
        buttonParamsJson: JSON.stringify({
          display_text: '📞 Call CS Now',
          phone_number: '+6281234567890'
        })
      }
    ]
  }
});
```

### CTA Copy Code Buttons (Promo Copy)
Send a button that automatically copies a promo code to the user's clipboard:
```javascript
await sock.sendMessage(jid, {
  text: 'Congratulations! You unlocked a 50% discount voucher:',
  footer: 'Limited Promo',
  nativeFlowMessage: {
    buttons: [
      {
        name: 'cta_copy',
        buttonParamsJson: JSON.stringify({
          display_text: '📋 Copy Coupon Code',
          copy_code: 'DISCOUNT50'
        })
      }
    ]
  }
});
```

### List Menu / Dropdown Single Select
Send a bottom-sheet dropdown menu to present multiple categorized options cleanly:
```javascript
await sock.sendMessage(jid, {
  text: 'Please select your desired subscription plan:',
  footer: 'Tap below to open options',
  nativeFlowMessage: {
    buttons: [
      {
        name: 'single_select',
        buttonParamsJson: JSON.stringify({
          title: '📋 View Plans',
          sections: [
            {
              title: 'Starter Plans',
              rows: [
                {
                  header: 'Basic Tier',
                  title: '1 Month Access',
                  description: 'Full bot features for 30 days',
                  id: 'pkg_basic'
                },
                {
                  header: 'Pro Tier',
                  title: '3 Months Access',
                  description: 'Save 20% with priority support',
                  id: 'pkg_pro'
                }
              ]
            },
            {
              title: 'Enterprise Plans',
              rows: [
                {
                  header: 'Unlimited Tier',
                  title: '1 Year Access',
                  description: 'Dedicated support & custom branding',
                  id: 'pkg_unlimited'
                }
              ]
            }
          ]
        })
      }
    ]
  }
});
```

### Swipeable Multi-Card Carousel
Present horizontally swipeable product catalogs or news cards directly in WhatsApp:
```javascript
await sock.sendMessage(jid, {
  text: 'Featured Services & Products:',
  cards: [
    {
      header: {
        title: 'Starter Package',
        subtitle: '$9 / mo',
        hasMediaAttachment: false
      },
      body: { text: 'Perfect for beginners and small businesses starting with WhatsApp bots.' },
      footer: { text: 'Instant Activation' },
      nativeFlowMessage: {
        buttons: [
          {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({
              display_text: 'Buy Starter',
              id: 'select_starter'
            })
          }
        ]
      }
    },
    {
      header: {
        title: 'Enterprise Package',
        subtitle: '$49 / mo',
        hasMediaAttachment: false
      },
      body: { text: 'High performance, unlimited requests, and 99.9% SLA.' },
      footer: { text: 'Free Setup' },
      nativeFlowMessage: {
        buttons: [
          {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({
              display_text: 'Buy Enterprise',
              id: 'select_enterprise'
            })
          }
        ]
      }
    }
  ]
});
```

### Why Interactive Messages Guaranteed to Render in v1.2.4
Version `1.2.4` implements 3 automated safeguard layers:
1. **Parser Priority**: Evaluates `nativeFlow` and `cards` branches before text branches so messages with `body.text` are never intercepted into extended text messages.
2. **Standard Protobuf `messageVersion: 1`**: Automatically attaches protocol version 1 required by modern WhatsApp clients.
3. **`viewOnceMessage` Envelope**: Automatically wraps interactive messages in `viewOnceMessage` with non-ephemeral flags and binary `<biz>` stanzas that trigger mobile UI rendering.

---

## 6. Full Meta WhatsApp Cloud API Integration

### Send Meta Cloud API Payload via Socket: sock.sendCloudApi()
Use official Meta Cloud API JSON payload structures directly in Baileys:

```javascript
await sock.sendCloudApi(jid, {
  messaging_product: 'whatsapp',
  recipient_type: 'individual',
  to: '6281234567890',
  type: 'interactive',
  interactive: {
    type: 'button',
    header: {
      type: 'text',
      text: 'System Notification'
    },
    body: {
      text: 'Daily server backup completed successfully. Choose next action:'
    },
    footer: {
      text: 'baileys-rec Cloud Adapter'
    },
    action: {
      buttons: [
        {
          type: 'reply',
          reply: {
            id: 'action_view_log',
            title: '📄 View Logs'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'action_ok',
            title: '✅ Done'
          }
        }
      ]
    }
  }
});
```

### Built-in Meta Cloud API HTTP Client: createMetaCloudApiClient()
`baileys-rec` includes a native HTTP REST client communicating directly with Meta Graph API v21.0:

```javascript
import { createMetaCloudApiClient } from 'baileys-rec';

const client = createMetaCloudApiClient({
  phoneNumberId: '104523985721834', // Meta Developer Phone Number ID
  accessToken: 'EAAG...',            // Permanent System User Access Token
  apiVersion: 'v21.0'               // Graph API Version
});

// 1. Send plain text via Meta HTTP API
await client.sendText('6281234567890', 'Hello from Meta WhatsApp Cloud API!');

// 2. Send interactive buttons via Meta HTTP API
await client.sendInteractive('6281234567890', {
  type: 'button',
  body: { text: 'Choose an option below:' },
  action: {
    buttons: [
      { type: 'reply', reply: { id: 'opt_1', title: 'Option 1' } },
      { type: 'reply', reply: { id: 'opt_2', title: 'Option 2' } }
    ]
  }
});
```

### Bypassing the 24-Hour Window with Template Messages
Official Meta policy states: **You cannot send free-form messages or interactive buttons to users who haven't messaged your business number within the last 24 hours (Error 131047)**.

To open or reopen the 24-hour window, you **must** send an approved **Template Message**:
```javascript
// Send Meta's official 'hello_world' template to open the 24h window
const response = await client.sendTemplate(
  '6281234567890',  // E.164 phone number
  'hello_world',    // Approved template name in Meta Business Manager
  'en_US'           // Language code
);

console.log('Template sent! Message ID:', response.messages[0].id);
// Once the user replies to this template, the 24-hour window opens
// and you can freely send interactive buttons and free-form messages!
```

### Utility Helpers: fromCloudApiMessage & toCloudApiMessage
Convert payloads manually:
```javascript
import { fromCloudApiMessage, toCloudApiMessage } from 'baileys-rec';

// 1. Convert Meta Cloud API payload into Baileys message content
const baileysContent = fromCloudApiMessage({
  type: 'interactive',
  interactive: {
    type: 'button',
    body: { text: 'Tap below' },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'btn_1', title: 'Choice 1' } }
      ]
    }
  }
});

await sock.sendMessage(jid, baileysContent);

// 2. Convert Baileys message back to Meta Cloud API payload
const cloudPayload = toCloudApiMessage('6281234567890', {
  text: 'Hello from Baileys'
});
console.log(cloudPayload);
```

### Building an Official Meta Cloud API Webhook Receiver (Express)
Example Express server for receiving Meta Webhook events:
```javascript
import express from 'express';

const app = express();
app.use(express.json());

const VERIFY_TOKEN = 'MY_SECURE_VERIFY_TOKEN_123';

// 1. Meta Webhook Verification (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Meta Webhook verified successfully!');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// 2. Incoming Webhook Event Receiver (POST)
app.post('/webhook', (req, res) => {
  const body = req.body;
  
  if (body.object === 'whatsapp_business_account') {
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value;
        const messages = value.messages || [];
        
        for (const msg of messages) {
          console.log(`📩 Incoming message from ${msg.from}:`, msg);
          
          if (msg.type === 'interactive') {
            const btnId = msg.interactive?.button_reply?.id;
            const listId = msg.interactive?.list_reply?.id;
            console.log('User tapped button:', btnId || listId);
          }
        }
      }
    }
    return res.sendStatus(200);
  }
  return res.sendStatus(404);
});

app.listen(3000, () => console.log('🚀 Meta Webhook running on port 3000'));
```

---

## 7. Event Handling & Listeners (Incoming Events)

### Handling Incoming Messages (messages.upsert)
```javascript
sock.ev.on('messages.upsert', async ({ messages, type }) => {
  if (type !== 'notify') return; // Capture new messages only

  for (const msg of messages) {
    if (msg.key.fromMe) continue; // Ignore bot's own messages

    const fromJid = msg.key.remoteJid;
    const senderName = msg.pushName || 'User';
    
    const messageContent = msg.message;
    const text = 
      messageContent?.conversation ||
      messageContent?.extendedTextMessage?.text ||
      messageContent?.imageMessage?.caption ||
      messageContent?.videoMessage?.caption ||
      '';

    console.log(`💬 [${senderName}] (${fromJid}): ${text}`);

    if (text.toLowerCase() === '!ping') {
      await sock.sendMessage(fromJid, { text: '🏓 Pong! Bot is active.' }, { quoted: msg });
    }
  }
});
```

### Catching Interactive Button & Native Flow Clicks
```javascript
sock.ev.on('messages.upsert', async ({ messages }) => {
  for (const msg of messages) {
    if (msg.key.fromMe) continue;
    const fromJid = msg.key.remoteJid;

    // 1. Native Flow Buttons
    const interactive = msg.message?.interactiveResponseMessage;
    if (interactive?.nativeFlowResponseMessage?.paramsJson) {
      const params = JSON.parse(interactive.nativeFlowResponseMessage.paramsJson);
      console.log('🔘 Native Flow Button ID:', params.id);

      if (params.id === 'btn_confirm') {
        await sock.sendMessage(fromJid, { text: 'Thank you for confirming your order!' });
      }
      continue;
    }

    // 2. Traditional Quick Reply
    const buttonReply = msg.message?.buttonsResponseMessage;
    if (buttonReply) {
      console.log('🔘 Quick Reply ID:', buttonReply.selectedButtonId);
      continue;
    }
  }
});
```

### Catching List Menu Selections
```javascript
sock.ev.on('messages.upsert', async ({ messages }) => {
  for (const msg of messages) {
    if (msg.key.fromMe) continue;
    const fromJid = msg.key.remoteJid;

    const listReply = msg.message?.listResponseMessage;
    if (listReply) {
      const selectedId = listReply.singleSelectReply?.selectedRowId;
      console.log(`📋 Selected List Row ID: ${selectedId}`);

      if (selectedId === 'pkg_basic') {
        await sock.sendMessage(fromJid, { text: 'You selected the Basic Plan.' });
      }
    }
  }
});
```

### Catching Poll Votes
```javascript
sock.ev.on('messages.upsert', async ({ messages }) => {
  for (const msg of messages) {
    const pollUpdate = msg.message?.pollUpdateMessage;
    if (pollUpdate) {
      console.log('🗳️ New poll vote received!');
    }
  }
});
```

### Downloading Media
```javascript
import { downloadMediaMessage } from 'baileys-rec';
import fs from 'fs';

sock.ev.on('messages.upsert', async ({ messages }) => {
  for (const msg of messages) {
    if (msg.key.fromMe) continue;

    const isMedia = Boolean(
      msg.message?.imageMessage ||
      msg.message?.videoMessage ||
      msg.message?.audioMessage ||
      msg.message?.documentMessage
    );

    if (isMedia) {
      console.log('📥 Downloading incoming media...');
      const buffer = await downloadMediaMessage(
        msg,
        'buffer',
        {},
        {
          logger: pino({ level: 'silent' }),
          reuploadRequest: sock.updateMediaMessage
        }
      );

      fs.writeFileSync('./downloads/media_file', buffer);
      console.log('✅ Media saved successfully!');
    }
  }
});
```

### Delivery Receipt Updates (Ticks)
```javascript
sock.ev.on('messages.update', (updates) => {
  for (const update of updates) {
    // Status codes: 2=PENDING, 3=SERVER_ACK, 4=DELIVERY_ACK, 5=READ, 6=PLAYED
    console.log(`Message ${update.key.id} status update: ${update.update?.status}`);
  }
});
```

### Group Participant Events (Join, Leave, Promote, Demote)
```javascript
sock.ev.on('group-participants.update', async ({ id, participants, action }) => {
  const target = participants[0];
  if (action === 'add') {
    await sock.sendMessage(id, {
      text: `Welcome @${target.split('@')[0]} to the group!`,
      mentions: [target]
    });
  }
});
```

---

## 8. Advanced WhatsApp Group Management

### Creating a New Group
```javascript
const group = await sock.groupCreate('Community Bot Group', [
  '6281234567890@s.whatsapp.net',
  '6289876543210@s.whatsapp.net'
]);
console.log('✅ Group created! JID:', group.id);
```

### Fetching Group Metadata
```javascript
const metadata = await sock.groupMetadata(groupJid);
console.log('Group Name:', metadata.subject);
console.log('Participants:', metadata.participants.length);
```

### Updating Group Subject & Description
```javascript
await sock.groupUpdateSubject(groupJid, 'New Group Name 2026');
await sock.groupUpdateDescription(groupJid, 'New rule: No spam allowed!');
```

### Configuring Chat Permissions (Announcements)
```javascript
// Admins only can message
await sock.groupSettingUpdate(groupJid, 'announcement');
// Everyone can message
await sock.groupSettingUpdate(groupJid, 'not_announcement');
```

### Getting & Revoking Group Invite Links
```javascript
const code = await sock.groupInviteCode(groupJid);
console.log(`🔗 Invite Link: https://chat.whatsapp.com/${code}`);

// Revoke and generate new link
await sock.groupRevokeInvite(groupJid);
```

### Adding, Kicking, Promoting, and Demoting Members
```javascript
const user = '6289876543210@s.whatsapp.net';
await sock.groupParticipantsUpdate(groupJid, [user], 'add');
await sock.groupParticipantsUpdate(groupJid, [user], 'remove');
await sock.groupParticipantsUpdate(groupJid, [user], 'promote');
await sock.groupParticipantsUpdate(groupJid, [user], 'demote');
```

### Leaving a Group
```javascript
await sock.groupLeave(groupJid);
```

---

## 9. Profile, Presence, & Privacy

### Updating Status Bio
```javascript
await sock.updateProfileStatus('Online 24/7 | Powered by baileys-rec v1.2.4');
```

### Updating Profile Pictures
```javascript
await sock.updateProfilePicture(sock.user.id, { url: 'https://example.com/avatar.jpg' });
```

### Sending Typing / Recording Presence Indicators
```javascript
await sock.sendPresenceUpdate('composing', jid); // Typing...
await sock.sendPresenceUpdate('recording', jid); // Recording audio...
await sock.sendPresenceUpdate('paused', jid);    // Idle
```

### Marking Messages as Read (Blue Ticks)
```javascript
await sock.readMessages([incomingMessage.key]);
```

---

## 10. Comprehensive Troubleshooting & Diagnostics

### Why Are Messages/Buttons Not Showing in WhatsApp?
| Cause | Deep Explanation | v1.2.4 Solution |
| :--- | :--- | :--- |
| **Parser Switch Order** | Old parsers intercepted messages with `body.text` into extended text messages, stripping buttons. | **Fixed**: `nativeFlow` evaluated before text branches. |
| **Protobuf MessageVersion** | WhatsApp clients discard native flow buttons lacking `messageVersion: 1`. | **Fixed**: `messageVersion: 1` automatically injected. |
| **ViewOnce Envelope** | Mobile clients require interactive messages wrapped inside `viewOnceMessage`. | **Fixed**: Automatic `viewOnceMessage` wrapping applied. |
| **Biz Binary Stanza** | WhatsApp requires `<biz>` binary stanzas for business features. | **Fixed**: `shouldIncludeBizBinaryNode` unwrapped cleanly. |

### Meta Error 131047: 24-Hour Customer Care Window
- **Cause**: Trying to send free-form interactive messages to users who haven't messaged your business in over 24 hours.
- **Solution**: Send an approved Meta **Template Message** via `client.sendTemplate()` to reopen the 24-hour window.

### Meta Error 100: Invalid Parameter
- **Cause**: Phone numbers including `+` or spaces, or quick reply buttons exceeding the limit of 3.
- **Solution in v1.2.4**: `baileys-rec` automatically sanitizes phone numbers into E.164 format and converts quick replies exceeding 3 items into a List Menu automatically.

### Corrupted Sessions, 401 Unauthorized, & Bad MAC
- **Cause**: Signal encryption keys out of sync due to abrupt bot termination.
- **Solution**: Delete the `auth_session/` folder and restart the bot to generate a fresh pairing code.

### Tips to Avoid WhatsApp Number Banning
1. **Use Delays**: Avoid sending more than 10 messages per second. Add random 1.5 - 3 second delays between broadcast messages.
2. **Send Presence**: Trigger `sock.sendPresenceUpdate('composing', jid)` before messaging to simulate human behavior.
3. **Verified Numbers**: Avoid using brand-new unregistered numbers for heavy outbound messaging.

---

## 11. Production-Ready Bot Boilerplate (Full Code)

Save as `bot.js` and run with `node bot.js`:

```javascript
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from 'baileys-rec';
import pino from 'pino';

const BOT_PHONE_NUMBER = '6281234567890';

async function startProductionBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_prod');

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '22.04']
  });

  sock.ev.on('creds.update', saveCreds);

  if (!sock.authState.creds.registered) {
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(BOT_PHONE_NUMBER);
        console.log('🔑 WHATSAPP PAIRING CODE:', code);
      } catch (err) {
        console.error('Failed to request pairing code:', err);
      }
    }, 3000);
  }

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        startProductionBot();
      }
    } else if (connection === 'open') {
      console.log('🚀 BOT READY FOR PRODUCTION!');
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (msg.key.fromMe) continue;
      const remoteJid = msg.key.remoteJid;
      const pushName = msg.pushName || 'User';

      const body = (
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        ''
      ).trim();

      // Handle interactive button clicks
      const interactiveReply = msg.message?.interactiveResponseMessage;
      if (interactiveReply?.nativeFlowResponseMessage?.paramsJson) {
        const button = JSON.parse(interactiveReply.nativeFlowResponseMessage.paramsJson);
        if (button.id === 'btn_help') {
          await sock.sendMessage(remoteJid, { text: 'Commands:\n1. !menu - Open main menu\n2. !carousel - Try swipe cards' });
        }
        continue;
      }

      if (body.toLowerCase() === '!menu') {
        await sock.sendPresenceUpdate('composing', remoteJid);
        await sock.sendCloudApi(remoteJid, {
          messaging_product: 'whatsapp',
          type: 'interactive',
          interactive: {
            type: 'button',
            header: { type: 'text', text: `Hello ${pushName}!` },
            body: { text: 'Welcome to baileys-rec v1.2.4 bot. Choose an option below:' },
            footer: { text: 'Official Multi-Device Engine' },
            action: {
              buttons: [
                { type: 'reply', reply: { id: 'btn_help', title: '📖 Help' } },
                { type: 'reply', reply: { id: 'btn_status', title: '⚡ Status' } }
              ]
            }
          }
        });
      }
    }
  });
}

startProductionBot();
```

---

## 12. API Reference Table

| Method / Function | Type | Description |
| :--- | :--- | :--- |
| `makeWASocket(config)` | Core Factory | Initializes a new multi-device WhatsApp socket connection. |
| `useMultiFileAuthState(folder)` | Auth Handler | Manages secure, persistent multi-file auth credentials. |
| `sock.requestPairingCode(phone)` | Auth Method | Requests an 8-digit pairing code for camera-free authentication. |
| `sock.sendMessage(jid, content, opts)` | Messaging | Sends any message type: text, media, stickers, polls, buttons, cards. |
| `sock.sendCloudApi(jid, payload, opts)` | **v1.2.4 New** | Sends official Meta Cloud API JSON payload directly via Baileys socket. |
| `createMetaCloudApiClient(config)` | **v1.2.4 New** | HTTP REST Client for Meta Graph API v21.0. |
| `fromCloudApiMessage(payload)` | Converter | Converts Meta Cloud API payload into Baileys message objects. |
| `toCloudApiMessage(to, content)` | Converter | Converts Baileys messages into Meta Cloud API JSON format. |
| `diagnoseMetaCloudApiError(err)` | Diagnostic | Analyzes Meta HTTP error codes (131047, 100) and provides solutions. |
| `sock.sendPresenceUpdate(type, jid)` | Presence | Sends `composing`, `recording`, `paused`, or `available` presence. |
| `sock.readMessages([key])` | Receipts | Sends read receipts (blue ticks) for specified messages. |
| `sock.groupCreate(title, users)` | Group Management | Creates a new WhatsApp group with initial participants. |
| `sock.groupMetadata(jid)` | Group Management | Fetches group details, description, and admin list. |
| `sock.groupParticipantsUpdate(jid, users, action)` | Group Management | Adds (`add`), removes (`remove`), promotes, or demotes members. |
| `downloadMediaMessage(msg, type, opts, ctx)` | Media Download | Downloads encrypted WhatsApp media into memory Buffers. |

---

## 📄 License
Distributed under the [MIT](LICENSE) License. Created and maintained by **[KazeDevID](https://github.com/KazeDevID)**.  
Fully compatible with **WhatsApp Business Multi-Device & Meta Cloud API Protocols**.
