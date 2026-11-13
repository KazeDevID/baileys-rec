# 🚀 baileys-rec (v1.6.0)

> **The Next-Generation WhatsApp Multi-Device & Meta Cloud API Library for Node.js.**
> 
> **v1.6.0 Flagship Release**: 100% Pure WhatsApp Protobuf (WAProto) support for ALL official Meta WhatsApp Business Cloud API message formats without requiring Meta developer accounts, business managers, or API keys!
> Includes WhatsApp Cloud Templates with parameters, WhatsApp Flows v3 Builder (`FlowBuilder`), Swipeable Multi-Card Carousel, Native One-Time Password (OTP) Copy Code, Voice Notes with Waveform visualization, WhatsApp Channel / Newsletter Management (`NewsletterHelper`), Single & Multi-Product Catalogs, Instant Pix Payments & Order Status Updates, In-App Webview, Polls, and zero-token universal format converters.

[![npm version](https://img.shields.io/npm/v/baileys-rec.svg?style=flat-square&color=00d26a)](https://www.npmjs.com/package/baileys-rec)
[![npm downloads](https://img.shields.io/npm/dm/baileys-rec.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/baileys-rec)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/KazeDevID/baileys-rec?style=flat-square)](https://github.com/KazeDevID/baileys-rec)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)

---

## 🙏 Special Thanks & Acknowledgements

This project stands on the shoulders of giants in the open-source WhatsApp ecosystem. We extend our deepest gratitude to:

1. **Original Baileys by WhiskeySockets** ([@whiskeysockets/baileys](https://www.npmjs.com/package/@whiskeysockets/baileys))  
   Special thanks and heartfelt respect to the creators and maintainers of the original Baileys library. Their pioneering reverse-engineering of the WhatsApp Web multi-device WebSocket protocol, binary node codec (`WABinary`), and cryptographic handshake laid the foundation for the entire modern JavaScript WhatsApp developer community.

2. **Baileys by itsliaaa / Starforge** ([@itsliaaa/baileys](https://www.npmjs.com/package/@itsliaaa/baileys))  
   Sincere gratitude and shoutout to **@itsliaaa** and the Starforge contributors. Their brilliant improvements, socket optimizations, modern message helpers, and active maintenance continuously push the boundaries of what is possible with WhatsApp Web protocol automation.

3. **Meta WhatsApp Business Platform** ([Meta Developers](https://developers.facebook.com/search/?referer=dev_header&q=WhatsApp))  
   For establishing the industry standard specifications for WhatsApp Cloud API, interactive native flows, interactive catalogs, WhatsApp Flows, and rich business messaging templates.

---

## 🌟 What is New in v1.6.0

Version 1.6.0 introduces full protocol parity with Meta WhatsApp Cloud API specifications, giving developers enterprise-grade interactive messaging tools directly over Baileys multi-device socket:

| Feature | Description | WhatsApp Meta Spec Reference |
| :--- | :--- | :--- |
| **Meta Cloud Template Engine** | Send official Meta template messages with dynamic header media, body parameters (`{{1}}`, `{{2}}`), and native buttons | [Meta Templates](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/template-messages) |
| **WhatsApp Flows v3 Builder** | Programmatic JSON schema builder for multi-screen native interactive forms, questionnaires, and booking flows | [WhatsApp Flows](https://developers.facebook.com/docs/whatsapp/flows/) |
| **OTP & Copy Code Native Buttons** | Instant one-tap copy buttons (`cta_copy`) formatted for security verification codes and discount coupons | [Authentication Templates](https://developers.facebook.com/docs/whatsapp/business-management-api/authentication-templates) |
| **Audio Voice Notes with Waveform** | Realistic amplitude visualization bars for PTT (Push-to-Talk) voice notes | [Voice Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/audio-messages) |
| **Newsletter / Channels Helper** | Subscribe, mute, query metadata, and publish messages to WhatsApp Channels (`@newsletter`) | WhatsApp Channels Protocol |
| **Order Status & Tracking** | Itemized order status notifications and interactive checkout review buttons | [Commerce & Orders](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/order-details-messages) |
| **Swipeable Multi-Card Carousel** | Carousel cards containing individual image headers, titles, descriptions, and up to 3 buttons per card | [Interactive Carousel](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/interactive-carousel-messages) |
| **Single & Multi-Product Catalog** | Native interactive catalog bottom-sheets and product showcase cards | [Product Messages](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/product-messages) |
| **Pix Instant Payments** | Native Brazilian Pix and international payment checkout flows | [Payments](https://developers.facebook.com/docs/whatsapp/cloud-api/messages/payment-messages) |

---

## 📦 Installation

```bash
# Install latest release
npm install baileys-rec@latest

# Or using yarn
yarn add baileys-rec

# Or using pnpm
pnpm add baileys-rec
```

> Requires **Node.js >= 20.0.0** (Native ES Modules and modern crypto required).

---

## ⚡ Quick Start: Zero to Connected Bot

```typescript
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason,
  Button
} from "baileys-rec";
import { Boom } from "@hapi/boom";

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("auth_session");

  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false, // Set to false if using pairing code below
  });

  sock.ev.on("creds.update", saveCreds);

  // Connection Lifecycle
  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (connection === "close") {
      const shouldReconnect =
        (lastDisconnect?.error as Boom)?.output?.statusCode !==
        DisconnectReason.loggedOut;
      console.log("Connection closed. Reconnecting:", shouldReconnect);
      if (shouldReconnect) connectToWhatsApp();
    } else if (connection === "open") {
      console.log("✅ WhatsApp connection established successfully!");
    }
  });

  // Pairing Code Authentication (No QR scan needed)
  if (!sock.authState.creds.registered) {
    const phoneNumber = "6281234567890"; // Enter your bot phone number with country code
    const code = await sock.requestPairingCode(phoneNumber);
    console.log(`📲 Your 8-digit WhatsApp Pairing Code: ${code}`);
  }

  // Handle incoming messages
  sock.ev.on("messages.upsert", async ({ messages }) => {
    const msg = messages[0];
    if (!msg.message || msg.key.fromMe) return;

    const jid = msg.key.remoteJid!;
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

    if (body.toLowerCase() === "menu") {
      await new Button(sock)
        .setTitle("Welcome to baileys-rec v1.6.0")
        .setBody("Choose an interactive option below:")
        .setFooter("Powered by baileys-rec & Meta Cloud Proto")
        .addReply("btn_features", "🚀 All Features")
        .addUrl("Documentation", "https://github.com/KazeDevID/baileys-rec")
        .addOtp("482-910", "🔑 Salin Kode OTP")
        .send(jid);
    }
  });
}

connectToWhatsApp();
```

---

## 🎨 Interactive Message Guides & Examples

### 1. WhatsApp Flows v3 Builder (`FlowBuilder`)
Build native interactive forms directly inside WhatsApp without external websites:

```typescript
import { FlowBuilder, Button } from "baileys-rec";

// 1. Construct the Flow Screen and Components
const flow = new FlowBuilder("feedback_flow_v3", "Customer Satisfaction")
  .addScreen("SURVEY_SCREEN", "Rate Your Experience")
  .addTextInput("user_name", "Your Name", { required: true })
  .addDropdown("rating", "How would you rate our service?", [
    { id: "5", title: "⭐️⭐️⭐️⭐️⭐️ Excellent" },
    { id: "4", title: "⭐️⭐️⭐️⭐️ Good" },
    { id: "3", title: "⭐️⭐️⭐️ Average" }
  ])
  .addRadioButtons("recommend", "Would you recommend us to a friend?", [
    { id: "yes", title: "Yes, definitely!" },
    { id: "no", title: "Not sure" }
  ])
  .addFooter("Submit Survey", "complete");

// 2. Attach Flow to Interactive Button
await new Button(sock)
  .setTitle("📋 We Value Your Feedback")
  .setBody("Please take 30 seconds to complete our quick in-app survey:")
  .setFooter("Official Survey")
  .addFlow("feedback_flow_v3", {
    display_text: "📝 Open Feedback Form",
    flow_action_payload: { screen: "SURVEY_SCREEN" }
  })
  .send(jid);
```

---

### 2. OTP Copy Code & Authentication Buttons
Send one-tap copyable security verification codes or voucher discounts:

```typescript
import { Button } from "baileys-rec";

await new Button(sock)
  .setTitle("🔐 Security Verification")
  .setBody("Your one-time authentication code is: *829104*. Do not share this code with anyone.")
  .setFooter("Expires in 5 minutes")
  .addOtp("829104", "📋 Copy Code")
  .addUrl("Need Help?", "https://support.example.com")
  .send(jid);
```

---

### 3. Voice Notes with Waveform Visualization
Send authentic Push-To-Talk (PTT) audio notes with waveform visualization bars:

```typescript
import { generateWaveform } from "baileys-rec";

// Generate realistic speech amplitude waveform
const waveform = generateWaveform(64, { min: 10, max: 95 });

await sock.sendMessage(jid, {
  audio: { url: "./media/voice-message.ogg" },
  mimetype: "audio/ogg; codecs=opus",
  ptt: true,
  waveform: waveform
});
```

---

### 4. Swipeable Multi-Card Carousel
Create high-conversion product carousels with swipeable cards and individual buttons:

```typescript
import { Carousel, Button } from "baileys-rec";

const card1 = new Button(sock)
  .setTitle("Nike Air Zoom 2026")
  .setBody("Ultra lightweight athletic running shoes.")
  .setImage("https://images.unsplash.com/photo-1542291026-7eec264c27ff")
  .addReply("buy_shoe", "🛍️ Order Now ($120)")
  .addUrl("View Details", "https://nike.com");

const card2 = new Button(sock)
  .setTitle("Sony WH-1000XM5")
  .setBody("Industry leading wireless noise canceling headphones.")
  .setImage("https://images.unsplash.com/photo-1505740420928-5e560c06d30e")
  .addReply("buy_headphone", "🛍️ Order Now ($340)")
  .addUrl("View Details", "https://sony.com");

await new Carousel(sock)
  .setTitle("🔥 Weekly Special Offers")
  .setBody("Swipe through our best picks of the week:")
  .setFooter("Limited stock available")
  .addCard(card1)
  .addCard(card2)
  .send(jid);
```

---

### 5. WhatsApp Newsletter / Channels Helper (`NewsletterHelper`)
Follow, unfollow, mute, and publish broadcast messages to WhatsApp Channels:

```typescript
import { NewsletterHelper } from "baileys-rec";

const channelJid = "120363123456789012@newsletter";

// Check if a JID belongs to a channel
if (NewsletterHelper.isNewsletterJid(channelJid)) {
  // Follow the channel
  await NewsletterHelper.follow(sock, channelJid);

  // Send an update to your channel subscribers
  const post = NewsletterHelper.buildNewsletterMessage(
    "📢 *Big Announcement*: baileys-rec v1.6.0 is now officially live on NPM! Enjoy zero-token Meta Cloud API parity."
  );
  await sock.sendMessage(channelJid, post);
}
```

---

### 6. Single & Multi-Product Catalog
Directly display items from your WhatsApp Business Catalog:

```typescript
import { Button } from "baileys-rec";

// Send Single Product
await new Button(sock)
  .setTitle("Featured Smartphone")
  .setBody("Check out the new Galaxy S26 Ultra:")
  .addProduct("PROD_S26", "CATALOG_ID_123", "🛍️ View Product")
  .send(jid);

// Send Multi-Product Section List
await new Button(sock)
  .setTitle("Our Seasonal Menu")
  .setBody("Select your favorite meals:")
  .addProductList("CATALOG_ID_123", [
    {
      title: "Main Dishes",
      product_items: [{ product_retailer_id: "DISH_01" }, { product_retailer_id: "DISH_02" }]
    },
    {
      title: "Beverages",
      product_items: [{ product_retailer_id: "DRINK_01" }]
    }
  ], "🍽️ Open Menu")
  .send(jid);
```

---

### 7. Instant Pix & Payment Status Updates
Send payment requests and update transaction status badges in chat:

```typescript
import { Button } from "baileys-rec";

// Request Pix Payment
await new Button(sock)
  .setTitle("Order #ORD-7749")
  .setBody("Total Amount: R$ 85,00")
  .addPixPayment("pix-key@merchant.com", 8500, "Online Shop", "💳 Pay with PIX")
  .send(jid);

// Send Payment Confirmation Status
await new Button(sock)
  .setTitle("Transaction Approved")
  .setBody("We received your payment successfully!")
  .addPaymentStatus("ORD-7749", "success", {
    currency: "BRL",
    amount: { value: 8500, offset: 100 }
  }, "Receipt Details")
  .send(jid);
```

---

### 8. Zero-Token Universal Meta Cloud API Converter (`fromCloudApiMessage`)
Take official payloads from Meta WhatsApp Business Cloud API docs and send them directly over Baileys:

```typescript
import { fromCloudApiMessage } from "baileys-rec";

// Payload straight from Meta Cloud API documentation:
const metaPayload = {
  messaging_product: "whatsapp",
  to: "6281234567890",
  type: "template",
  template: {
    name: "order_dispatch_alert",
    language: { code: "en_US" },
    components: [
      {
        type: "header",
        parameters: [{ type: "text", text: "Package Dispatched! 📦" }]
      },
      {
        type: "body",
        parameters: [
          { type: "text", text: "David" },
          { type: "text", text: "FedEx Express" }
        ]
      },
      {
        type: "button",
        sub_type: "url",
        index: "0",
        text: "Track Live Location",
        parameters: [{ type: "text", text: "tracking.fedex.com/TRK992" }]
      },
      {
        type: "button",
        sub_type: "copy_code",
        index: "1",
        text: "Copy Tracking ID",
        parameters: [{ type: "coupon_code", coupon_code: "TRK99248" }]
      }
    ]
  }
};

// Converts to 100% pure Baileys Proto format:
const baileysMessage = fromCloudApiMessage(metaPayload);

// Send directly via socket (zero tokens, zero fees!):
await sock.sendMessage(jid, baileysMessage);
```

---

## 🛠️ Complete Button Builder API Reference

| Method | Parameters | Description |
| :--- | :--- | :--- |
| `.setTitle(title)` | `string` | Sets top bold message header |
| `.setBody(body)` | `string` | Sets primary message body |
| `.setFooter(footer)` | `string` | Sets subtle bottom footer text |
| `.setImage(urlOrBuffer)` | `string | Buffer` | Attaches image header |
| `.setVideo(urlOrBuffer)` | `string | Buffer` | Attaches video header |
| `.setDocument(urlOrBuffer)` | `string | Buffer` | Attaches document header |
| `.addReply(id, text)` | `string, string` | Adds quick reply button |
| `.addUrl(text, url)` | `string, string` | Adds external link CTA button |
| `.addOtp(code, text)` | `string, string` | **v1.6.0 New**: Adds copy verification code button |
| `.addCopy(text, code)` | `string, string` | Adds copy to clipboard button |
| `.addCall(text, phone)` | `string, string` | Adds direct phone call button |
| `.addFlow(flowId, opts)` | `string, object` | Adds WhatsApp Flow v3 button |
| `.addProduct(retailerId, catalogId)` | `string, string` | Adds single product showcase button |
| `.addProductList(catalogId, sections)` | `string, array` | Adds multi-product catalog button |
| `.addCatalog(businessJid)` | `string` | Adds open business catalog button |
| `.addPixPayment(pixKey, amount)` | `string, number` | Adds Pix instant payment button |
| `.addPaymentStatus(refId, status)` | `string, string` | Adds payment status update card |
| `.addOrderStatus(refId, status)` | `string, string` | **v1.6.0 New**: Adds order tracking status button |
| `.addReminder(text, timestamp)` | `string, number` | Adds WhatsApp calendar reminder button |
| `.addWebview(url, text, title)` | `string, string, string` | Adds in-app browser webview button |
| `.addLocationRequest(text)` | `string` | Adds request user location button |
| `.send(jid)` | `string` | Finalizes and transmits message over socket |

---

## 📄 License

Distributed under the **[MIT](LICENSE)** License.  
Maintained with ❤️ by **[KazeDevID](https://github.com/KazeDevID)** and **[mkzstyle](https://github.com/mkzstyle)**.

Special thanks again to **[@whiskeysockets/baileys](https://www.npmjs.com/package/@whiskeysockets/baileys)** and **[@itsliaaa/baileys](https://www.npmjs.com/package/@itsliaaa/baileys)** for making open-source WhatsApp tooling possible!
