# 🚀 baileys-rec (v1.2.1)

> **The Next-Generation WhatsApp Multi-Device & Meta Cloud API Library for Node.js.**  
> Fork resmi dan disempurnakan dari Baileys dengan integrasi penuh protokol **Meta WhatsApp Business Cloud API**, dukungan tombol interaktif **Native Flow v2**, **Swipeable Multi-Card Carousel**, **Pairing Code**, serta optimasi memori dan auto-reconnect.

[![npm version](https://img.shields.io/npm/v/baileys-rec.svg?style=flat-square&color=00d26a)](https://www.npmjs.com/package/baileys-rec)
[![npm downloads](https://img.shields.io/npm/dm/baileys-rec.svg?style=flat-square&color=blue)](https://www.npmjs.com/package/baileys-rec)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/KazeDevID/baileys-rec?style=flat-square)](https://github.com/KazeDevID/baileys-rec)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg?style=flat-square)](https://nodejs.org/)

---

## 📑 Daftar Isi Lengkap

1. [Pengenalan & Arsitektur](#1-pengenalan--arsitektur)
   - [Apa itu baileys-rec?](#apa-itu-baileys-rec)
   - [Perbandingan: Baileys Socket vs Meta Cloud API](#perbandingan-baileys-socket-vs-meta-cloud-api)
   - [Kelebihan baileys-rec v1.2.1](#kelebihan-baileys-rec-v121)
2. [Persiapan & Instalasi dari Nol](#2-persiapan--instalasi-dari-nol)
   - [Kebutuhan Sistem](#kebutuhan-sistem)
   - [Inisialisasi Project (ESM & CommonJS)](#inisialisasi-project-esm--commonjs)
   - [Instalasi Paket](#instalasi-paket)
3. [Autentikasi & Koneksi WhatsApp](#3-autentikasi--koneksi-whatsapp)
   - [Metode 1: Pairing Code (Tanpa Scan QR, Rekomendasi Server/VPS)](#metode-1-pairing-code-tanpa-scan-qr-rekomendasi-servervps)
   - [Metode 2: QR Code Terminal](#metode-2-qr-code-terminal)
   - [Auto-Reconnect & Penanganan Siklus Hidup Koneksi](#auto-reconnect--penanganan-siklus-hidup-koneksi)
   - [Manajemen Session Auth Multi-File State](#manajemen-session-auth-multi-file-state)
4. [Pengiriman Pesan Dasar (Core Messaging)](#4-pengiriman-pesan-dasar-core-messaging)
   - [Pesan Teks & Format (Bold, Italic, Monospace)](#pesan-teks--format)
   - [Mention Anggota (@mention)](#mention-anggota-mention)
   - [Membalas Pesan (Quote / Reply)](#membalas-pesan-quote--reply)
   - [Pesan Gambar & Foto](#pesan-gambar--foto)
   - [Pesan Video & GIF](#pesan-video--gif)
   - [Pesan Audio & Voice Note (VN / PTT)](#pesan-audio--voice-note-vn--ptt)
   - [Pesan Dokumen & PDF](#pesan-dokumen--pdf)
   - [Pesan Stiker (Biasa & Bergerak/Animated)](#pesan-stiker-biasa--bergerakanimated)
   - [Pesan Lokasi & Maps](#pesan-lokasi--maps)
   - [Pesan Kontak (vCard)](#pesan-kontak-vcard)
   - [Pesan Polling / Voting](#pesan-polling--voting)
   - [Pesan Reaksi Emoji](#pesan-reaksi-emoji)
   - [Hapus Pesan untuk Semua Orang (Revoke / Delete)](#hapus-pesan-untuk-semua-orang-revoke--delete)
   - [Edit Pesan Terkirim](#edit-pesan-terkirim)
5. [Pesan Interaktif & Native Flow (Fitur Unggulan v1.2.1)](#5-pesan-interaktif--native-flow-fitur-unggulan-v121)
   - [Tombol Quick Reply (Balas Cepat)](#tombol-quick-reply-balas-cepat)
   - [Tombol CTA Link URL (Buka Web)](#tombol-cta-link-url-buka-web)
   - [Tombol CTA Call (Panggil Nomor)](#tombol-cta-call-panggil-nomor)
   - [Tombol CTA Copy Code (Salin Kode Promo)](#tombol-cta-copy-code-salin-kode-promo)
   - [List Menu / Dropdown Single Select](#list-menu--dropdown-single-select)
   - [Swipeable Multi-Card Carousel](#swipeable-multi-card-carousel)
   - [Mengapa Pesan Interaktif Pasti Tampil di v1.2.1?](#mengapa-pesan-interaktif-pasti-tampil-di-v121)
6. [Integrasi Penuh Meta WhatsApp Cloud API](#6-integrasi-penuh-meta-whatsapp-cloud-api)
   - [Kirim Skema Meta Cloud API via Socket: sock.sendCloudApi()](#kirim-skema-meta-cloud-api-via-socket-socksendcloudapi)
   - [Klien HTTP Meta Cloud API Bawaan: createMetaCloudApiClient()](#klien-http-meta-cloud-api-bawaan-createmetacloudapiclient)
   - [Bypass Jendela 24 Jam dengan Template Message](#bypass-jendela-24-jam-dengan-template-message)
   - [Fungsi Utilitas: fromCloudApiMessage & toCloudApiMessage](#fungsi-utilitas-fromcloudapimessage--tocloudapimessage)
   - [Membangun Webhook Receiver Resmi Meta Cloud API (Express)](#membangun-webhook-receiver-resmi-meta-cloud-api-express)
7. [Event Handling & Listener Lengkap (Incoming Events)](#7-event-handling--listener-lengkap-incoming-events)
   - [Mendengarkan Pesan Masuk (messages.upsert)](#mendengarkan-pesan-masuk-messagesupsert)
   - [Menangkap Klik Tombol Interaktif & Native Flow](#menangkap-klik-tombol-interaktif--native-flow)
   - [Menangkap Pilihan List Menu](#menangkap-pilihan-list-menu)
   - [Menangkap Hasil Polling / Voting](#menangkap-hasil-polling--voting)
   - [Mengunduh Media (Gambar, Video, Audio, Dokumen)](#mengunduh-media-gambar-video-audio-dokumen)
   - [Update Status Centang (Centang 1, 2, Biru)](#update-status-centang-centang-1-2-biru)
   - [Event Grup: Member Masuk, Keluar, Promote, Demote](#event-grup-member-masuk-keluar-promote-demote)
8. [Manajemen Grup WhatsApp Lengkap (Group Admin)](#8-manajemen-grup-whatsapp-lengkap-group-admin)
   - [Membuat Grup Baru](#membuat-grup-baru)
   - [Mendapatkan Informasi Metadata Grup](#mendapatkan-informasi-metadata-grup)
   - [Mengubah Nama & Deskripsi Grup](#mengubah-nama--deskripsi-grup)
   - [Mengatur Izin Chat (Hanya Admin / Semua Anggota)](#mengatur-izin-chat-hanya-admin--semua-anggota)
   - [Mengambil & Mereset Link Undangan Grup](#mengambil--mereset-link-undangan-grup)
   - [Tambah, Kick, Promote, dan Demote Anggota](#tambah-kick-promote-dan-demote-anggota)
   - [Keluar dari Grup](#keluar-dari-grup)
9. [Profil, Kehadiran (Presence), & Privasi](#9-profil-kehadiran-presence--privasi)
   - [Update Status Bio Teks](#update-status-bio-teks)
   - [Update Foto Profil Akun atau Grup](#update-foto-profil-akun-atau-grup)
   - [Kirim Status Sedang Mengetik / Merekam Suara](#kirim-status-sedang-mengetik--merekam-suara)
   - [Menandai Pesan Sudah Dibaca (Read Receipt Centang Biru)](#menandai-pesan-sudah-dibaca-read-receipt-centang-biru)
10. [Panduan Troubleshooting & Diagnosis Komprehensif](#10-panduan-troubleshooting--diagnosis-komprehensif)
    - [Kenapa Pesan/Tombol Tidak Muncul di WhatsApp?](#kenapa-pesantombol-tidak-muncul-di-whatsapp)
    - [Error Meta 131047: 24-Hour Customer Care Window](#error-meta-131047-24-hour-customer-care-window)
    - [Error Meta 100: Invalid Parameter](#error-meta-100-invalid-parameter)
    - [Session Rusak, 401 Unauthorized, & Bad MAC Session](#session-rusak-401-unauthorized--bad-mac-session)
    - [Tips Menghindari Banned / Blokir Akun WhatsApp](#tips-menghindari-banned--blokir-akun-whatsapp)
11. [Boilerplate Lengkap Bot Siap Pakai (Full Production Code)](#11-boilerplate-lengkap-bot-siap-pakai-full-production-code)
12. [Daftar Referensi API (API Reference Table)](#12-daftar-referensi-api-api-reference-table)

---

## 1. Pengenalan & Arsitektur

### Apa itu baileys-rec?
`baileys-rec` adalah pustaka (library) WhatsApp generasi modern berbasis TypeScript/Node.js yang menggabungkan dua ekosistem terbesar:
1. **Multi-Device WebSocket Protocol**: Terhubung langsung ke jaringan WhatsApp Web tanpa memerlukan emulator browser (Puppeteer/Playwright/Selenium), sangat ringan dalam konsumsi RAM (< 60MB).
2. **Meta WhatsApp Business Cloud API Compatibility**: Mendukung skema payload resmi Meta Cloud API Graph v21.0, sehingga pengembang dapat menggunakan satu struktur kode yang sama untuk nomor bot Baileys maupun nomor resmi WhatsApp Cloud API.

### Perbandingan: Baileys Socket vs Meta Cloud API

| Fitur | Baileys Socket (`baileys-rec`) | Meta Cloud API Resmi | Solusi `baileys-rec` |
| :--- | :--- | :--- | :--- |
| **Biaya Pesan** | **Gratis 100%** (Menggunakan paket data nomor HP sendiri) | Berbayar per percakapan (Meta Rate Card) | Menggunakan format Meta Cloud API **secara gratis** via Socket |
| **Jendela 24 Jam** | **Bebas Tanpa Batas** (Bisa chat user kapan saja) | Dibatasi jendela 24 jam (wajib Template Message) | Mengatasi blokir 24 jam dengan fallback otomatis |
| **Tombol Interaktif** | Memerlukan struktur Protobuf & `viewOnceMessage` | Menggunakan JSON Payload (`type: "interactive"`) | **`sock.sendCloudApi()`** mengubah payload Meta langsung ke Protobuf |
| **Swipeable Carousel** | Tersedia melalui properti `cards` | Tersedia melalui `interactive.type: "carousel"` | Mendukung **keduanya** secara native di v1.2.1 |
| **Nomor HP** | Semua nomor WhatsApp pribadi / bisnis biasa | Wajib akun Meta Developer & Business Manager | Bisa menggunakan keduanya berdampingan |

### Kelebihan baileys-rec v1.2.1
- ✅ **Fix Pesan Interaktif**: Memperbaiki bug di mana tombol hilang dan hanya teks yang tampil di WhatsApp.
- ✅ **Bungkus Otomatis `viewOnceMessage`**: Memastikan tombol selalu dirender pada WhatsApp Android, iOS, dan Desktop.
- ✅ **Protobuf `messageVersion: 1`**: Memenuhi spesifikasi resmi WhatsApp Native Flow protocol.
- ✅ **Stanza `<biz>` Otomatis**: Memastikan binary stanza bisnis WhatsApp disematkan ke setiap pesan tombol.
- ✅ **Dukungan Pairing Code**: Menghubungkan nomor bot tanpa perlu scan QR kamera, ideal untuk server VPS/Docker/Cloud Run.
- ✅ **Auto Fallback Tombol > 3**: Jika payload tombol melebihi batas 3 tombol Meta, otomatis dikonversi menjadi List Menu single-select untuk mencegah Error 100.
- ✅ **Built-in Cloud API Client**: Dilengkapi HTTP Client langsung ke Meta Graph API v21.0 lengkap dengan error diagnostic engine.

---

## 2. Persiapan & Instalasi dari Nol

### Kebutuhan Sistem
- **Node.js**: Versi `>= 18.0.0` (Disarankan Node.js 20.x atau 22.x LTS)
- **NPM**: Versi `>= 9.0.0` atau Yarn / PNPM
- **OS**: Linux (Ubuntu, Debian, CentOS), macOS, atau Windows 10/11

### Inisialisasi Project (ESM & CommonJS)

Buat folder proyek baru dan inisialisasi:
```bash
mkdir whatsapp-bot && cd whatsapp-bot
npm init -y
```

Buka file `package.json` dan tambahkan `"type": "module"` agar Anda dapat menggunakan sintaks modern ES Module (`import/export`):
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

> **Catatan untuk CommonJS**: Jika proyek Anda menggunakan CommonJS (`require`), Anda tidak perlu menambahkan `"type": "module"`. Contoh require:
> ```javascript
> const makeWASocket = require('baileys-rec').default;
> const { useMultiFileAuthState, DisconnectReason } = require('baileys-rec');
> ```

### Instalasi Paket
Instal `baileys-rec` versi terbaru beserta logger `pino`:
```bash
npm install baileys-rec@latest pino
```

Jika ingin menggunakan scanner QR terminal dan penanganan error Boom:
```bash
npm install qrcode-terminal @hapi/boom
```

---

## 3. Autentikasi & Koneksi WhatsApp

### Metode 1: Pairing Code (Tanpa Scan QR, Rekomendasi Server/VPS)
Metode **Pairing Code** adalah cara termudah dan paling stabil untuk menghubungkan bot WhatsApp di server VPS/Cloud tanpa perlu mengambil tangkapan layar terminal untuk scan QR.

Buat file `index.js`:
```javascript
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from 'baileys-rec';
import pino from 'pino';

async function startBot() {
  // 1. Inisialisasi penyimpanan sesi multi-file di folder 'auth_session'
  const { state, saveCreds } = await useMultiFileAuthState('./auth_session');

  // 2. Buat koneksi socket WhatsApp
  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }), // Ganti ke 'info' atau 'debug' jika ingin melihat log lengkap
    printQRInTerminal: false, // Matikan QR terminal karena menggunakan pairing code
    browser: ['Ubuntu', 'Chrome', '22.04'] // Identitas browser
  });

  // 3. Simpan credentials setiap kali ada pembaruan sesi
  sock.ev.on('creds.update', saveCreds);

  // 4. Request pairing code jika nomor belum terdaftar / baru pertama kali login
  if (!sock.authState.creds.registered) {
    // Masukkan nomor WhatsApp bot dengan kode negara tanpa simbol + atau spasi
    // Contoh nomor Indonesia: 6281234567890
    const botNumber = '6281234567890';
    
    // Minta kode pairing 8 digit ke server WhatsApp
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(botNumber);
        console.log('\n==================================================');
        console.log('🔑 KODE PAIRING WHATSAPP ANDA: ', code);
        console.log('👉 Buka WhatsApp di HP > Perangkat Tertaut > Tautkan dengan nomor telepon');
        console.log('==================================================\n');
      } catch (err) {
        console.error('Gagal meminta pairing code:', err);
      }
    }, 3000);
  }

  // 5. Tangani siklus hidup koneksi (connect, disconnect, reconnect)
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    
    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      
      console.log(`⚠️ Koneksi terputus (status: ${statusCode}). Reconnecting: ${shouldReconnect}`);
      
      if (shouldReconnect) {
        startBot(); // Auto reconnect otomatis
      } else {
        console.log('❌ Anda telah logout dari WhatsApp. Hapus folder auth_session dan jalankan ulang bot.');
      }
    } else if (connection === 'open') {
      console.log('✅ BOT WHATSAPP BERHASIL TERHUBUNG!');
      console.log('User ID bot:', sock.user?.id);
    }
  });

  return sock;
}

startBot();
```

### Metode 2: QR Code Terminal
Jika Anda menjalankan bot di komputer lokal dan ingin melakukan pemindaian kamera:
```javascript
import makeWASocket, { useMultiFileAuthState, DisconnectReason } from 'baileys-rec';
import pino from 'pino';

async function startBotQR() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_qr');

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: true // Tampilkan QR Code ASCII di terminal
  });

  sock.ev.on('creds.update', saveCreds);
  
  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'close') {
      if (lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut) {
        startBotQR();
      }
    } else if (connection === 'open') {
      console.log('✅ Berhasil terhubung via QR Code!');
    }
  });
}

startBotQR();
```

### Auto-Reconnect & Penanganan Siklus Hidup Koneksi
Tabel alasan diskoneksi pada `DisconnectReason`:

| Status Code | Enum DisconnectReason | Arti | Solusi / Aksi |
| :--- | :--- | :--- | :--- |
| **401** | `loggedOut` | Akun telah ditautkan keluar dari HP | Jangan reconnect. Hapus folder sesi dan scan/pair ulang. |
| **408** | `timedOut` | Koneksi internet time out | Panggil fungsi `startBot()` untuk reconnect. |
| **428** | `connectionLost` | Koneksi data terputus | Panggil fungsi `startBot()` untuk reconnect. |
| **440** | `connectionReplaced` | Sesi dibuka di terminal/server lain | Tutup salah satu instance. |
| **500** | `badSession` | File session auth korup | Hapus folder sesi dan pairing ulang. |
| **515** | `restartRequired` | WhatsApp meminta restart handshake | Panggil fungsi `startBot()` secara langsung. |

### Manajemen Session Auth Multi-File State
`useMultiFileAuthState('./folder_session')` menyimpan token kredensial terpisah:
- `creds.json`: Kunci enkripsi utama akun.
- `app-state-sync-key-*.json`: Kunci sinkronisasi kontak dan obrolan.
- `session-*.json`: Kunci sesi enkripsi sinyal per pengguna.

> 💡 **Tips Performa**: Jangan pernah mengunggah folder sesi ke GitHub publik. Selalu masukkan folder sesi ke dalam `.gitignore`:
> ```gitignore
> auth_session/
> auth_qr/
> node_modules/
> ```

---

## 4. Pengiriman Pesan Dasar (Core Messaging)

Target pengiriman (`jid`) berupa:
- Chat Pribadi: `"6281234567890@s.whatsapp.net"`
- Grup WhatsApp: `"120363045678901234@g.us"`
- Broadcast List: `"status@broadcast"`

### Pesan Teks & Format
```javascript
// Format teks WhatsApp:
// *teks* = Bold / Tebal
// _teks_ = Italic / Miring
// ~teks~ = Strikethrough / Coret
// ```teks``` = Monospace / Font Kode

await sock.sendMessage(jid, {
  text: 'Halo! Ini adalah *pesan tebal*, _pesan miring_, ~pesan tercoret~, dan ```kode monospace```.'
});
```

### Mention Anggota (@mention)
```javascript
const userJid = '6289876543210@s.whatsapp.net';

await sock.sendMessage(jid, {
  text: 'Halo @6289876543210, silakan cek pesan ini!',
  mentions: [userJid]
});
```

### Membalas Pesan (Quote / Reply)
```javascript
// quoted: msg (objek pesan masuk dari messages.upsert)
await sock.sendMessage(jid, {
  text: 'Ini adalah balasan langsung untuk pesan Anda sebelumnya.'
}, { quoted: incomingMessage });
```

### Pesan Gambar & Foto
Mendukung Buffer biner, URL web langsung, maupun path file lokal:
```javascript
import fs from 'fs';

// Dari URL
await sock.sendMessage(jid, {
  image: { url: 'https://picsum.photos/800/600' },
  caption: '📸 Gambar dari tautan internet'
});

// Dari file lokal atau Buffer
const imageBuffer = fs.readFileSync('./assets/foto.jpg');
await sock.sendMessage(jid, {
  image: imageBuffer,
  caption: '📸 Gambar dari penyimpanan lokal'
});
```

### Pesan Video & GIF
```javascript
// Video biasa dengan suara
await sock.sendMessage(jid, {
  video: { url: 'https://example.com/video.mp4' },
  caption: '🎥 Video demonstrasi'
});

// Video yang diputar otomatis berulang sebagai animasi GIF
await sock.sendMessage(jid, {
  video: { url: 'https://example.com/animation.mp4' },
  caption: 'Animasi GIF',
  gifPlayback: true
});
```

### Pesan Audio & Voice Note (VN / PTT)
```javascript
// Audio biasa (seperti file MP3 musik)
await sock.sendMessage(jid, {
  audio: { url: 'https://example.com/music.mp3' },
  mimetype: 'audio/mp4',
  ptt: false
});

// Push-to-Talk (PTT) / Voice Note mikrofon hijau
await sock.sendMessage(jid, {
  audio: fs.readFileSync('./assets/rekaman.ogg'),
  mimetype: 'audio/ogg; codecs=opus',
  ptt: true
});
```

### Pesan Dokumen & PDF
```javascript
await sock.sendMessage(jid, {
  document: fs.readFileSync('./invoice.pdf'),
  mimetype: 'application/pdf',
  fileName: 'Invoice_Pesanan_REC102.pdf',
  caption: 'Lampiran invoice resmi Anda.'
});
```

### Pesan Stiker (Biasa & Bergerak/Animated)
```javascript
// Stiker harus berformat WebP
await sock.sendMessage(jid, {
  sticker: fs.readFileSync('./sticker.webp')
});
```

### Pesan Lokasi & Maps
```javascript
await sock.sendMessage(jid, {
  location: {
    degreesLatitude: -6.2088,
    degreesLongitude: 106.8456,
    name: 'Monumen Nasional (Monas)',
    address: 'Gambir, Kota Jakarta Pusat, DKI Jakarta'
  }
});
```

### Pesan Kontak (vCard)
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

### Pesan Polling / Voting
```javascript
await sock.sendMessage(jid, {
  poll: {
    name: 'Berapa rating Anda untuk pembaruan baileys-rec v1.2.1?',
    values: ['⭐⭐⭐⭐⭐ Luar Biasa', '⭐⭐⭐⭐ Sangat Bagus', '⭐⭐⭐ Cukup Baik'],
    selectableCount: 1 // 1 untuk Single Choice, >1 untuk Multi Choice
  }
});
```

### Pesan Reaksi Emoji
```javascript
// Memberikan emoji reaction pada pesan tertentu
await sock.sendMessage(jid, {
  react: {
    text: '🔥', // Kosongkan string '' untuk mencabut reaksi
    key: incomingMessage.key
  }
});
```

### Hapus Pesan untuk Semua Orang (Revoke / Delete)
```javascript
// Menghapus pesan bot yang sudah terkirim (Delete for Everyone)
await sock.sendMessage(jid, {
  delete: sentMessageKey
});
```

### Edit Pesan Terkirim
```javascript
// Mengubah isi teks pesan yang sudah terkirim sebelumnya
await sock.sendMessage(jid, {
  edit: sentMessageKey,
  text: 'Ini adalah teks yang sudah diperbarui secara langsung.'
});
```

---

## 5. Pesan Interaktif & Native Flow (Fitur Unggulan v1.2.1)

`baileys-rec` v1.2.1 telah disempurnakan sehingga seluruh tombol **Native Flow** dijamin tampil pada aplikasi WhatsApp resmi Android, iOS, maupun Web/Desktop.

### Tombol Quick Reply (Balas Cepat)
Mengirim pesan dengan tombol balasan cepat (maksimal 3 tombol):
```javascript
await sock.sendMessage(jid, {
  text: 'Pesanan #REC-102 Anda telah selesai diproses.',
  footer: 'baileys-rec Official',
  nativeFlowMessage: {
    buttons: [
      {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          display_text: '✅ Konfirmasi Terima',
          id: 'btn_confirm'
        })
      },
      {
        name: 'quick_reply',
        buttonParamsJson: JSON.stringify({
          display_text: '❌ Batalkan Pesanan',
          id: 'btn_cancel'
        })
      }
    ]
  }
});
```

### Tombol CTA Link URL (Buka Web)
Mengirim tombol yang langsung membuka browser saat ditekan:
```javascript
await sock.sendMessage(jid, {
  text: 'Kunjungi repository resmi baileys-rec untuk melihat dokumentasi dan release notes:',
  footer: 'KazeDevID Official',
  nativeFlowMessage: {
    buttons: [
      {
        name: 'cta_url',
        buttonParamsJson: JSON.stringify({
          display_text: '🌐 Buka GitHub Repository',
          url: 'https://github.com/KazeDevID/baileys-rec',
          merchant_url: 'https://github.com/KazeDevID/baileys-rec'
        })
      }
    ]
  }
});
```

### Tombol CTA Call (Panggil Nomor)
Mengirim tombol yang langsung memanggil nomor telepon saat ditekan:
```javascript
await sock.sendMessage(jid, {
  text: 'Butuh bantuan darurat? Hubungi customer care kami:',
  footer: 'Layanan 24 Jam',
  nativeFlowMessage: {
    buttons: [
      {
        name: 'cta_call',
        buttonParamsJson: JSON.stringify({
          display_text: '📞 Hubungi CS Sekarang',
          phone_number: '+6281234567890'
        })
      }
    ]
  }
});
```

### Tombol CTA Copy Code (Salin Kode Promo)
Mengirim tombol yang otomatis menyalin kode promo ke clipboard HP user:
```javascript
await sock.sendMessage(jid, {
  text: 'Selamat! Anda mendapatkan voucher diskon sebesar 50%:',
  footer: 'Promo Terbatas',
  nativeFlowMessage: {
    buttons: [
      {
        name: 'cta_copy',
        buttonParamsJson: JSON.stringify({
          display_text: '📋 Salin Kode Kupon',
          copy_code: 'DISCOUNT50'
        })
      }
    ]
  }
});
```

### List Menu / Dropdown Single Select
Mengirim menu daftar pilihan (bottom sheet) yang sangat rapi untuk menampilkan banyak opsi:
```javascript
await sock.sendMessage(jid, {
  text: 'Silakan pilih paket langganan yang Anda inginkan:',
  footer: 'Tekan tombol di bawah untuk melihat pilihan',
  nativeFlowMessage: {
    buttons: [
      {
        name: 'single_select',
        buttonParamsJson: JSON.stringify({
          title: '📋 Lihat Daftar Paket',
          sections: [
            {
              title: 'Paket Hemat',
              rows: [
                {
                  header: 'Paket Basic',
                  title: 'Langganan 1 Bulan',
                  description: 'Akses seluruh fitur bot selama 30 hari',
                  id: 'pkg_basic'
                },
                {
                  header: 'Paket Pro',
                  title: 'Langganan 3 Bulan',
                  description: 'Hemat 20% dengan akses prioritas',
                  id: 'pkg_pro'
                }
              ]
            },
            {
              title: 'Paket Enterprise',
              rows: [
                {
                  header: 'Paket Unlimited',
                  title: 'Langganan 1 Tahun',
                  description: 'Dedicated support dan custom branding',
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
Fitur unggulan untuk menampilkan etalase produk atau kartu berita yang dapat digeser (swipe horizontal) langsung di WhatsApp:
```javascript
await sock.sendMessage(jid, {
  text: 'Katalog Layanan & Produk Unggulan:',
  cards: [
    {
      header: {
        title: 'Paket Starter',
        subtitle: 'Rp 99.000 / bln',
        hasMediaAttachment: false
      },
      body: { text: 'Sangat cocok untuk UMKM pemula yang ingin memulai bot WhatsApp.' },
      footer: { text: 'Aktivasi Instan' },
      nativeFlowMessage: {
        buttons: [
          {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({
              display_text: 'Pilih Starter',
              id: 'select_starter'
            })
          }
        ]
      }
    },
    {
      header: {
        title: 'Paket Enterprise',
        subtitle: 'Rp 499.000 / bln',
        hasMediaAttachment: false
      },
      body: { text: 'Performa tinggi tanpa batas request dan didukung SLA 99.9%.' },
      footer: { text: 'Free Konsultasi' },
      nativeFlowMessage: {
        buttons: [
          {
            name: 'quick_reply',
            buttonParamsJson: JSON.stringify({
              display_text: 'Pilih Enterprise',
              id: 'select_enterprise'
            })
          }
        ]
      }
    }
  ]
});
```

### Mengapa Pesan Interaktif Pasti Tampil di v1.2.1?
Di versi `1.2.1`, pustaka ini mengimplementasikan 3 lapisan proteksi otomatis:
1. **Prioritas Parser**: Memindahkan evaluasi cabang `nativeFlow` dan `cards` sebelum cabang teks biasa sehingga pesan dengan `body.text` tidak lagi terpotong.
2. **Standard Protobuf `messageVersion: 1`**: Seluruh tombol native flow otomatis disematkan atribut versi protokol v1 yang wajib bagi WhatsApp versi 2024-2026.
3. **Envelope `viewOnceMessage`**: Otomatis membungkus struktur pesan interaktif dalam amplop `viewOnceMessage` (dengan flag non-ephemeral) dan stanza `<biz>` yang memicu engine WhatsApp mobile client merender tombol UI interaktif.

---

## 6. Integrasi Penuh Meta WhatsApp Cloud API

### Kirim Skema Meta Cloud API via Socket: sock.sendCloudApi()
Anda dapat menggunakan format payload JSON resmi dari dokumentasi Meta Developer, dan `baileys-rec` akan mengonversinya secara mulus ke pesan socket Baileys:

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
      text: 'Pemberitahuan Sistem'
    },
    body: {
      text: 'Server backup harian telah selesai dengan sukses. Pilih tindakan selanjutnya:'
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
            title: '📄 Lihat Log'
          }
        },
        {
          type: 'reply',
          reply: {
            id: 'action_ok',
            title: '✅ Selesai'
          }
        }
      ]
    }
  }
});
```

### Klien HTTP Meta Cloud API Bawaan: createMetaCloudApiClient()
`baileys-rec` menyediakan klien HTTP resmi terintegrasi untuk berkomunikasi langsung dengan REST API Meta Graph v21.0:

```javascript
import { createMetaCloudApiClient } from 'baileys-rec';

const client = createMetaCloudApiClient({
  phoneNumberId: '104523985721834', // Phone Number ID dari Meta Developer Portal
  accessToken: 'EAAG...',            // Permanent System User Token
  apiVersion: 'v21.0'               // Versi Graph API Meta
});

// 1. Kirim pesan teks langsung via HTTP Meta
await client.sendText('6281234567890', 'Halo dari Meta WhatsApp Cloud API!');

// 2. Kirim pesan tombol interaktif via HTTP Meta
await client.sendInteractive('6281234567890', {
  type: 'button',
  body: { text: 'Pilih salah satu menu di bawah ini:' },
  action: {
    buttons: [
      { type: 'reply', reply: { id: 'opt_1', title: 'Layanan 1' } },
      { type: 'reply', reply: { id: 'opt_2', title: 'Layanan 2' } }
    ]
  }
});
```

### Bypass Jendela 24 Jam dengan Template Message
Aturan resmi Meta WhatsApp Business menyatakan: **Anda TIDAK BISA mengirim pesan bebas/interaktif kepada pengguna baru jika pengguna tersebut belum mengirim pesan ke nomor bisnis Anda dalam 24 jam terakhir (Error 131047)**.

Untuk membuka jendela 24 jam, Anda **wajib** mengirimkan pesan berbasis **Template** yang telah disetujui Meta:
```javascript
// Kirim template 'hello_world' resmi Meta untuk membuka jendela 24 jam
const response = await client.sendTemplate(
  '6281234567890',  // Nomor tujuan format E.164
  'hello_world',    // Nama template terdaftar di WhatsApp Business Manager
  'en_US'           // Kode bahasa template
);

console.log('Template terkirim! Message ID:', response.messages[0].id);
// Setelah pengguna membalas pesan template ini, jendela 24 jam terbuka,
// dan Anda dapat mengirim pesan interaktif bebas maupun tombol!
```

### Fungsi Utilitas: fromCloudApiMessage & toCloudApiMessage
Anda dapat mengonversi format payload secara manual:
```javascript
import { fromCloudApiMessage, toCloudApiMessage } from 'baileys-rec';

// 1. Ubah payload Meta Cloud API menjadi konten pesan Baileys
const baileysContent = fromCloudApiMessage({
  type: 'interactive',
  interactive: {
    type: 'button',
    body: { text: 'Klik tombol di bawah' },
    action: {
      buttons: [
        { type: 'reply', reply: { id: 'btn_1', title: 'Pilihan 1' } }
      ]
    }
  }
});

await sock.sendMessage(jid, baileysContent);

// 2. Ubah pesan Baileys kembali ke format Meta Cloud API
const cloudPayload = toCloudApiMessage('6281234567890', {
  text: 'Halo dari Baileys'
});
console.log(cloudPayload);
```

### Membangun Webhook Receiver Resmi Meta Cloud API (Express)
Berikut adalah contoh server Express untuk menerima event Webhook dari Meta Developer:
```javascript
import express from 'express';

const app = express();
app.use(express.json());

const VERIFY_TOKEN = 'MY_SECURE_VERIFY_TOKEN_123';

// 1. Endpoint Verifikasi Webhook Meta (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook Meta berhasil diverifikasi!');
    return res.status(200).send(challenge);
  }
  return res.sendStatus(403);
});

// 2. Endpoint Menerima Event Pesan Masuk (POST)
app.post('/webhook', (req, res) => {
  const body = req.body;
  
  if (body.object === 'whatsapp_business_account') {
    for (const entry of body.entry || []) {
      for (const change of entry.changes || []) {
        const value = change.value;
        const messages = value.messages || [];
        
        for (const msg of messages) {
          console.log(`📩 Pesan masuk dari ${msg.from}: `, msg);
          
          if (msg.type === 'interactive') {
            const btnId = msg.interactive?.button_reply?.id;
            const listId = msg.interactive?.list_reply?.id;
            console.log('User menekan tombol:', btnId || listId);
          }
        }
      }
    }
    return res.sendStatus(200);
  }
  return res.sendStatus(404);
});

app.listen(3000, () => console.log('🚀 Webhook Meta berjalan di port 3000'));
```

---

## 7. Event Handling & Listener Lengkap (Incoming Events)

### Mendengarkan Pesan Masuk (messages.upsert)
```javascript
sock.ev.on('messages.upsert', async ({ messages, type }) => {
  if (type !== 'notify') return; // Hanya tangkap pesan baru

  for (const msg of messages) {
    // 1. Abaikan pesan yang dikirim oleh bot itu sendiri
    if (msg.key.fromMe) continue;

    const fromJid = msg.key.remoteJid;
    const senderName = msg.pushName || 'Pengguna';
    
    // 2. Ambil teks pesan dari berbagai jenis container
    const messageContent = msg.message;
    const text = 
      messageContent?.conversation ||
      messageContent?.extendedTextMessage?.text ||
      messageContent?.imageMessage?.caption ||
      messageContent?.videoMessage?.caption ||
      '';

    console.log(`💬 [${senderName}] (${fromJid}): ${text}`);

    // Respon command sederhana
    if (text.toLowerCase() === '!ping') {
      await sock.sendMessage(fromJid, { text: '🏓 Pong! Bot aktif.' }, { quoted: msg });
    }
  }
});
```

### Menangkap Klik Tombol Interaktif & Native Flow
Saat pengguna menekan tombol **Quick Reply** atau tombol **Native Flow**, WhatsApp mengirimkan event balasan khusus:
```javascript
sock.ev.on('messages.upsert', async ({ messages }) => {
  for (const msg of messages) {
    if (msg.key.fromMe) continue;
    const fromJid = msg.key.remoteJid;

    // 1. Deteksi balasan Native Flow Buttons
    const interactive = msg.message?.interactiveResponseMessage;
    if (interactive?.nativeFlowResponseMessage?.paramsJson) {
      const params = JSON.parse(interactive.nativeFlowResponseMessage.paramsJson);
      const buttonId = params.id;
      console.log('🔘 User menekan Native Flow Button ID:', buttonId);

      if (buttonId === 'btn_confirm') {
        await sock.sendMessage(fromJid, { text: 'Terima kasih telah mengonfirmasi pesanan!' });
      }
      continue;
    }

    // 2. Deteksi balasan Quick Reply tradisional
    const buttonReply = msg.message?.buttonsResponseMessage;
    if (buttonReply) {
      console.log('🔘 User menekan Quick Reply ID:', buttonReply.selectedButtonId);
      continue;
    }

    // 3. Deteksi balasan Template Button
    const templateReply = msg.message?.templateButtonReplyMessage;
    if (templateReply) {
      console.log('🔘 User menekan Template Reply ID:', templateReply.selectedId);
      continue;
    }
  }
});
```

### Menangkap Pilihan List Menu
Saat pengguna memilih salah satu item dari dropdown **List Menu**:
```javascript
sock.ev.on('messages.upsert', async ({ messages }) => {
  for (const msg of messages) {
    if (msg.key.fromMe) continue;
    const fromJid = msg.key.remoteJid;

    const listReply = msg.message?.listResponseMessage;
    if (listReply) {
      const selectedId = listReply.singleSelectReply?.selectedRowId;
      const title = listReply.title;
      console.log(`📋 User memilih menu: ID=${selectedId}, Title=${title}`);

      if (selectedId === 'pkg_basic') {
        await sock.sendMessage(fromJid, { text: 'Anda telah memilih Paket Basic.' });
      }
    }
  }
});
```

### Menangkap Hasil Polling / Voting
```javascript
sock.ev.on('messages.upsert', async ({ messages }) => {
  for (const msg of messages) {
    const pollUpdate = msg.message?.pollUpdateMessage;
    if (pollUpdate) {
      console.log('🗳️ Ada suara baru masuk pada polling!');
      console.log('Kunci polling:', pollUpdate.pollCreationMessageKey);
    }
  }
});
```

### Mengunduh Media (Gambar, Video, Audio, Dokumen)
```javascript
import { downloadMediaMessage } from 'baileys-rec';
import fs from 'fs';

sock.ev.on('messages.upsert', async ({ messages }) => {
  for (const msg of messages) {
    if (msg.key.fromMe) continue;

    const isImage = Boolean(msg.message?.imageMessage);
    const isVideo = Boolean(msg.message?.videoMessage);
    const isAudio = Boolean(msg.message?.audioMessage);
    const isDoc = Boolean(msg.message?.documentMessage);

    if (isImage || isVideo || isAudio || isDoc) {
      console.log('📥 Sedang mengunduh media dari pengguna...');
      
      // Unduh media ke Buffer memori
      const buffer = await downloadMediaMessage(
        msg,
        'buffer',
        {},
        {
          logger: pino({ level: 'silent' }),
          reuploadRequest: sock.updateMediaMessage
        }
      );

      // Simpan file hasil download ke disk lokal
      const filename = isImage ? 'download.jpg' : isVideo ? 'download.mp4' : 'download.bin';
      fs.writeFileSync(`./downloads/${filename}`, buffer);
      console.log(`✅ Media berhasil disimpan ke ./downloads/${filename}`);
    }
  }
});
```

### Update Status Centang (Centang 1, 2, Biru)
```javascript
sock.ev.on('messages.update', (updates) => {
  for (const update of updates) {
    // Status delivery:
    // 2 = PENDING (Menunggu)
    // 3 = SERVER_ACK (Centang 1 / Sampai di server)
    // 4 = DELIVERY_ACK (Centang 2 abu-abu / Diterima di HP)
    // 5 = READ (Centang 2 biru / Telah dibaca)
    // 6 = PLAYED (Voice note telah didengarkan)
    console.log(`Status pesan ${update.key.id}: status=${update.update?.status}`);
  }
});
```

### Event Grup: Member Masuk, Keluar, Promote, Demote
```javascript
sock.ev.on('group-participants.update', async ({ id, participants, action }) => {
  // id: ID grup WhatsApp
  // participants: Array JID pengguna
  // action: 'add' | 'remove' | 'promote' | 'demote'
  
  const targetUser = participants[0];

  if (action === 'add') {
    await sock.sendMessage(id, {
      text: `Selamat datang @${targetUser.split('@')[0]} di grup kami!`,
      mentions: [targetUser]
    });
  } else if (action === 'remove') {
    await sock.sendMessage(id, {
      text: `Selamat tinggal @${targetUser.split('@')[0]}.`,
      mentions: [targetUser]
    });
  } else if (action === 'promote') {
    await sock.sendMessage(id, {
      text: `Selamat! @${targetUser.split('@')[0]} sekarang adalah admin grup.`,
      mentions: [targetUser]
    });
  } else if (action === 'demote') {
    await sock.sendMessage(id, {
      text: `@${targetUser.split('@')[0]} tidak lagi menjadi admin grup.`,
      mentions: [targetUser]
    });
  }
});
```

---

## 8. Manajemen Grup WhatsApp Lengkap (Group Admin)

### Membuat Grup Baru
```javascript
const group = await sock.groupCreate('Grup Komunitas Bot', [
  '6281234567890@s.whatsapp.net',
  '6289876543210@s.whatsapp.net'
]);
console.log('✅ Grup berhasil dibuat! JID:', group.id);
```

### Mendapatkan Informasi Metadata Grup
```javascript
const groupMetadata = await sock.groupMetadata(groupJid);
console.log('Nama Grup:', groupMetadata.subject);
console.log('Deskripsi:', groupMetadata.desc);
console.log('Jumlah Anggota:', groupMetadata.participants.length);
console.log('Daftar Admin:', groupMetadata.participants.filter(p => p.admin).map(p => p.id));
```

### Mengubah Nama & Deskripsi Grup
```javascript
// Ganti nama subjek grup
await sock.groupUpdateSubject(groupJid, 'Nama Grup Baru 2026');

// Ganti deskripsi grup
await sock.groupUpdateDescription(groupJid, 'Aturan baru: Dilarang spam dan promosi!');
```

### Mengatur Izin Chat (Hanya Admin / Semua Anggota)
```javascript
// Hanya admin yang boleh mengirim pesan ke grup (Tutup grup)
await sock.groupSettingUpdate(groupJid, 'announcement');

// Semua anggota boleh mengirim pesan ke grup (Buka grup)
await sock.groupSettingUpdate(groupJid, 'not_announcement');

// Kunci info grup agar hanya admin yang bisa edit nama/foto grup
await sock.groupSettingUpdate(groupJid, 'locked');

// Buka info grup agar semua member bisa edit
await sock.groupSettingUpdate(groupJid, 'unlocked');
```

### Mengambil & Mereset Link Undangan Grup
```javascript
// Ambil kode link undangan grup
const inviteCode = await sock.groupInviteCode(groupJid);
console.log(`🔗 Tautan Grup: https://chat.whatsapp.com/${inviteCode}`);

// Cabut / reset tautan undangan lama dan buat tautan baru
const newInviteCode = await sock.groupRevokeInvite(groupJid);
console.log(`🔗 Tautan Baru: https://chat.whatsapp.com/${newInviteCode}`);
```

### Tambah, Kick, Promote, dan Demote Anggota
```javascript
const user = '6289876543210@s.whatsapp.net';

// 1. Tambah anggota ke grup
await sock.groupParticipantsUpdate(groupJid, [user], 'add');

// 2. Keluarkan / Kick anggota dari grup
await sock.groupParticipantsUpdate(groupJid, [user], 'remove');

// 3. Jadikan anggota sebagai Admin
await sock.groupParticipantsUpdate(groupJid, [user], 'promote');

// 4. Turunkan Admin menjadi anggota biasa
await sock.groupParticipantsUpdate(groupJid, [user], 'demote');
```

### Keluar dari Grup
```javascript
await sock.groupLeave(groupJid);
console.log('✅ Bot telah keluar dari grup.');
```

---

## 9. Profil, Kehadiran (Presence), & Privasi

### Update Status Bio Teks
```javascript
await sock.updateProfileStatus('Online 24/7 | Powered by baileys-rec v1.2.1');
```

### Update Foto Profil Akun atau Grup
```javascript
// Ganti foto profil bot sendiri
await sock.updateProfilePicture(sock.user.id, { url: 'https://example.com/avatar.jpg' });

// Ganti foto profil grup
await sock.updateProfilePicture(groupJid, { url: 'https://example.com/group-logo.jpg' });
```

### Kirim Status Sedang Mengetik / Merekam Suara
Memberikan efek natural agar penerima melihat indikator "sedang mengetik..." atau "sedang merekam audio...":
```javascript
// 1. Kirim status sedang mengetik
await sock.sendPresenceUpdate('composing', jid);

// 2. Kirim status sedang merekam audio
await sock.sendPresenceUpdate('recording', jid);

// 3. Hentikan status mengetik / idle
await sock.sendPresenceUpdate('paused', jid);

// 4. Update status bot online
await sock.sendPresenceUpdate('available');
```

### Menandai Pesan Sudah Dibaca (Read Receipt Centang Biru)
```javascript
// Kirim centang dua biru bahwa bot sudah membaca pesan tersebut
await sock.readMessages([incomingMessage.key]);
```

---

## 10. Panduan Troubleshooting & Diagnosis Komprehensif

### Kenapa Pesan/Tombol Tidak Muncul di WhatsApp?
| Penyebab | Penjelasan Mendalam | Solusi di baileys-rec v1.2.1 |
| :--- | :--- | :--- |
| **Urutan Switch Parser** | Jika payload memiliki teks dan tombol, parser lama mengira itu `extendedTextMessage` dan memotong tombol. | **Diperbaiki**: Cabang `nativeFlow` dievaluasi paling awal. |
| **Protobuf MessageVersion** | WhatsApp menolak render tombol native flow tanpa flag `messageVersion: 1`. | **Diperbaiki**: Atribut `messageVersion: 1` otomatis disisipkan. |
| **Bungkus ViewOnce** | WhatsApp Android & iOS mengabaikan tombol interaktif jika tidak berada dalam amplop `viewOnceMessage`. | **Diperbaiki**: Otomatis dibungkus ke dalam envelope `viewOnceMessage`. |
| **Stanza Binary `<biz>`** | Server WhatsApp memerlukan binary node tag `<biz>` untuk pesan bisnis. | **Diperbaiki**: `shouldIncludeBizBinaryNode` otomatis di-unwrap. |

### Error Meta 131047: 24-Hour Customer Care Window
- **Penyebab**: Anda mencoba mengirim pesan interaktif atau teks biasa ke nomor yang belum mengirim pesan ke WhatsApp bisnis Anda dalam 24 jam terakhir.
- **Solusi**: Kirim pesan menggunakan **Template Message** resmi yang telah diapprove Meta via `client.sendTemplate()`. Begitu user membalas, Anda bebas mengirim pesan interaktif.

### Error Meta 100: Invalid Parameter
- **Penyebab**:
  1. Nomor telepon memiliki tanda `+` atau spasi (contoh salah: `+62 812-3456`).
  2. Jumlah tombol quick reply lebih dari 3 tombol.
- **Solusi di v1.2.1**: `baileys-rec` otomatis membersihkan format nomor ke E.164 (hanya angka: `6281234567890`) dan mengonversi tombol ke list menu jika jumlahnya lebih dari 3.

### Session Rusak, 401 Unauthorized, & Bad MAC Session
- **Penyebab**: Kunci enkripsi sinyal tidak sinkron karena bot dimatikan mendadak saat sedang menulis kunci sesi atau token ditautkan keluar dari HP.
- **Solusi**: Hapus seluruh isi folder `auth_session/`, lalu jalankan bot kembali untuk mendapatkan Pairing Code baru.

### Tips Menghindari Banned / Blokir Akun WhatsApp
1. **Gunakan Jeda (Delay)**: Jangan mengirim lebih dari 10 pesan dalam 1 detik secara terus-menerus. Gunakan jeda acak 1.5 - 3 detik:
   ```javascript
   const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
   await delay(2000);
   ```
2. **Kirim Kehadiran (Presence)**: Selalu kirim `sock.sendPresenceUpdate('composing', jid)` 1-2 detik sebelum mengirim pesan agar perilaku bot menyerupai manusia.
3. **Gunakan Nomor yang Sudah Terverifikasi**: Jangan gunakan nomor baru yang belum pernah memiliki riwayat chat untuk melakukan broadcast massal.
4. **Berikan Tombol Unsubscribe**: Sediakan opsi bagi penerima untuk berhenti berlangganan agar nomor bot Anda tidak dilaporkan (Report/Spam) oleh user.

---

## 11. Boilerplate Lengkap Bot Siap Pakai (Full Production Code)

Simpan kode di bawah ini sebagai `bot.js` dan jalankan dengan `node bot.js`:

```javascript
import makeWASocket, {
  useMultiFileAuthState,
  DisconnectReason
} from 'baileys-rec';
import pino from 'pino';

const BOT_PHONE_NUMBER = '6281234567890'; // Ganti dengan nomor WhatsApp Bot Anda

async function startProductionBot() {
  const { state, saveCreds } = await useMultiFileAuthState('./auth_prod');

  const sock = makeWASocket({
    auth: state,
    logger: pino({ level: 'silent' }),
    printQRInTerminal: false,
    browser: ['Ubuntu', 'Chrome', '22.04']
  });

  sock.ev.on('creds.update', saveCreds);

  // Minta pairing code jika belum login
  if (!sock.authState.creds.registered) {
    setTimeout(async () => {
      try {
        const code = await sock.requestPairingCode(BOT_PHONE_NUMBER);
        console.log('🔑 KODE PAIRING WHATSAPP:', code);
      } catch (err) {
        console.error('Gagal meminta kode pairing:', err);
      }
    }, 3000);
  }

  // Handler siklus hidup koneksi
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const statusCode = lastDisconnect?.error?.output?.statusCode;
      if (statusCode !== DisconnectReason.loggedOut) {
        console.log('🔄 Reconnecting ke WhatsApp...');
        startProductionBot();
      } else {
        console.log('❌ Sesi telah logout. Silakan pairing ulang.');
      }
    } else if (connection === 'open') {
      console.log('🚀 BOT SIAP DIGUNAKAN!');
    }
  });

  // Handler pesan masuk
  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;

    for (const msg of messages) {
      if (msg.key.fromMe) continue;

      const remoteJid = msg.key.remoteJid;
      const pushName = msg.pushName || 'Kawan';

      // 1. Ekstrak teks pesan
      const body = (
        msg.message?.conversation ||
        msg.message?.extendedTextMessage?.text ||
        ''
      ).trim();

      // 2. Deteksi klik tombol interaktif
      const interactiveReply = msg.message?.interactiveResponseMessage;
      if (interactiveReply?.nativeFlowResponseMessage?.paramsJson) {
        const button = JSON.parse(interactiveReply.nativeFlowResponseMessage.paramsJson);
        console.log('User menekan tombol:', button.id);

        if (button.id === 'btn_help') {
          await sock.sendMessage(remoteJid, {
            text: 'Berikut panduan bot:\n1. !menu - Buka daftar menu\n2. !info - Info sistem\n3. !carousel - Coba swipe cards'
          });
        } else if (button.id === 'btn_status') {
          await sock.sendMessage(remoteJid, {
            text: '🟢 Semua sistem server normal dan beroperasi.'
          });
        }
        continue;
      }

      // 3. Perintah !menu dengan format Meta Cloud API via Socket
      if (body.toLowerCase() === '!menu') {
        // Simulasi sedang mengetik
        await sock.sendPresenceUpdate('composing', remoteJid);

        await sock.sendCloudApi(remoteJid, {
          messaging_product: 'whatsapp',
          type: 'interactive',
          interactive: {
            type: 'button',
            header: { type: 'text', text: `Halo ${pushName}!` },
            body: { text: 'Selamat datang di layanan bot baileys-rec v1.2.1. Silakan pilih opsi di bawah:' },
            footer: { text: 'Official Multi-Device Engine' },
            action: {
              buttons: [
                { type: 'reply', reply: { id: 'btn_help', title: '📖 Panduan' } },
                { type: 'reply', reply: { id: 'btn_status', title: '⚡ Cek Status' } }
              ]
            }
          }
        });
      }

      // 4. Perintah !carousel
      else if (body.toLowerCase() === '!carousel') {
        await sock.sendMessage(remoteJid, {
          text: 'Geser kartu ke kanan untuk melihat katalog:',
          cards: [
            {
              header: { title: 'Layanan 1', subtitle: 'Rp 50.000', hasMediaAttachment: false },
              body: { text: 'Deskripsi lengkap layanan pertama kami.' },
              footer: { text: 'baileys-rec' },
              nativeFlowMessage: {
                buttons: [{ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Beli Layanan 1', id: 'buy_1' }) }]
              }
            },
            {
              header: { title: 'Layanan 2', subtitle: 'Rp 100.000', hasMediaAttachment: false },
              body: { text: 'Deskripsi lengkap layanan kedua kami.' },
              footer: { text: 'baileys-rec' },
              nativeFlowMessage: {
                buttons: [{ name: 'quick_reply', buttonParamsJson: JSON.stringify({ display_text: 'Beli Layanan 2', id: 'buy_2' }) }]
              }
            }
          ]
        });
      }
    }
  });
}

startProductionBot();
```

---

## 12. Daftar Referensi API (API Reference Table)

| Method / Fungsi | Tipe | Deskripsi |
| :--- | :--- | :--- |
| `makeWASocket(config)` | Core Factory | Menginisialisasi koneksi socket baru WhatsApp multi-device. |
| `useMultiFileAuthState(folder)` | Auth Handler | Mengelola sesi credentials WhatsApp multi-file yang aman dan persisten. |
| `sock.requestPairingCode(phone)` | Auth Method | Meminta kode pairing 8 digit untuk otentikasi tanpa scan kamera QR. |
| `sock.sendMessage(jid, content, opts)` | Messaging | Mengirim semua jenis pesan: teks, media, stiker, polling, button, cards. |
| `sock.sendCloudApi(jid, payload, opts)` | **v1.2.1 New** | Mengirim pesan skema resmi Meta Cloud API langsung via socket Baileys. |
| `createMetaCloudApiClient(config)` | **v1.2.1 New** | HTTP REST Client untuk mengirim pesan langsung ke Meta Graph API v21.0. |
| `fromCloudApiMessage(payload)` | Converter | Mengonversi payload Meta Cloud API menjadi objek pesan Baileys. |
| `toCloudApiMessage(to, content)` | Converter | Mengonversi pesan Baileys menjadi format payload Meta Cloud API. |
| `diagnoseMetaCloudApiError(err)` | Diagnostic | Menganalisis kode error HTTP Meta (131047, 100, dll) dan memberi solusi. |
| `sock.sendPresenceUpdate(type, jid)` | Presence | Mengirim status `composing`, `recording`, `paused`, atau `available`. |
| `sock.readMessages([key])` | Receipts | Mengirim tanda centang biru (read receipt) untuk pesan tertentu. |
| `sock.groupCreate(title, users)` | Group Management | Membuat grup WhatsApp baru dengan daftar anggota awal. |
| `sock.groupMetadata(jid)` | Group Management | Mengambil informasi detail grup, nama, deskripsi, dan daftar admin. |
| `sock.groupParticipantsUpdate(jid, users, action)` | Group Management | Menambahkan (`add`), mengeluarkan (`remove`), promote, atau demote admin. |
| `sock.groupSettingUpdate(jid, setting)` | Group Management | Mengatur izin kirim pesan grup (`announcement` / `not_announcement`). |
| `downloadMediaMessage(msg, type, opts, ctx)` | Media Download | Mengunduh file media terenkripsi WhatsApp menjadi Buffer memori. |

---

## 📄 Lisensi
Didistribusikan di bawah lisensi [MIT](LICENSE). Dibuat dan dikembangkan oleh **[KazeDevID](https://github.com/KazeDevID)**.  
Kompabilitas penuh dengan protokol resmi **WhatsApp Business Multi-Device & Meta Cloud API 2026**.
