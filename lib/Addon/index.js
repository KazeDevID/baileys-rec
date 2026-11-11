import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const pkg = require("@itsliaaa/starforge");

export const {
    createCache,
    createMutex,
    createQueue,
    createZip,
    detectFileType,
    detectMediaInfo,
    encodeQR,
    getAudioWaveform,
    getFile
} = pkg;

export * from "./http-error.js";
export * from "./keyed-db.js";
export * from "./link-preview.js";
