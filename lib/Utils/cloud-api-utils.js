
/**
 * WhatsApp Cloud API Compatibility Adapter and Interactive Message Builders for Baileys
 * Based on official Meta WhatsApp Business Messaging Cloud API Specs
 * https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started
 */

export class ButtonBuilder {
    constructor() {
        this.buttons = [];
    }

    /**
     * Add Quick Reply Button (Interactive reply)
     * @param {string} id Unique button identifier
     * @param {string} text Display text on button
     * @param {string} [icon] Optional icon name (e.g. "REPLY", "CHECK")
     */
    addReply(id, text, icon) {
        this.buttons.push({ id, text: text || id, icon });
        return this;
    }

    /**
     * Add Call To Action URL Button
     * @param {string} text Display text
     * @param {string} url Web URL
     * @param {boolean} [useWebview=false] Open in in-app webview
     * @param {string} [icon] Optional icon
     */
    addUrl(text, url, useWebview = false, icon) {
        this.buttons.push({ url, text, useWebview, icon });
        return this;
    }

    /**
     * Add Call To Action Call Button
     * @param {string} text Display text
     * @param {string} phoneNumber Phone number with country code
     * @param {string} [icon] Optional icon
     */
    addCall(text, phoneNumber, icon) {
        this.buttons.push({ call: phoneNumber, text, icon });
        return this;
    }

    /**
     * Add Copy Code Button
     * @param {string} text Display text
     * @param {string} code Promo or voucher code to copy
     * @param {string} [icon] Optional icon
     */
    addCopy(text, code, icon) {
        this.buttons.push({ copy: code, text, icon });
        return this;
    }

    /**
     * Add Single Select Menu (Bottom Sheet List)
     * @param {string} title Menu button title
     * @param {Array<{ title: string, rows: Array<{ id: string, title: string, description?: string }> }>} sections
     * @param {string} [icon] Optional icon
     */
    addList(title, sections, icon) {
        this.buttons.push({ sections, text: title, icon });
        return this;
    }

    /**
     * Add WhatsApp Flow Button
     * @param {string} flowId Meta Flow ID
     * @param {string} text Display text
     * @param {string} [flowToken]
     * @param {string} [action="navigate"]
     * @param {object} [payload={}]
     */
    addFlow(flowId, text, flowToken = "1", action = "navigate", payload = {}) {
        this.buttons.push({
            name: "flow",
            buttonParamsJson: JSON.stringify({
                flow_message_version: "3",
                flow_token: flowToken,
                flow_id: flowId,
                flow_cta: text,
                flow_action: action,
                flow_action_payload: payload
            })
        });
        return this;
    }

    /**
     * Add Reminder Button (Sets calendar reminder in WhatsApp)
     */
    addReminder(text, title, timestampOrDate, icon) {
        this.buttons.push({
            reminder: {
                title: title || text,
                time: timestampOrDate
            },
            text,
            icon
        });
        return this;
    }
    /**
     * Add Cancel Reminder Button
     */
    addCancelReminder(text, reminderId = "1", icon) {
        this.buttons.push({
            cancelReminder: reminderId,
            text,
            icon
        });
        return this;
    }
    /**
     * Add Native Location Sharing Request Button
     */
    addLocation(text = "📍 Share Location", icon) {
        this.buttons.push({
            name: "send_location",
            text,
            icon
        });
        return this;
    }
    /**
     * Add In-App Webview Button
     */
    addWebview(text, url, title, icon) {
        this.buttons.push({
            webview: { url, title: title || text },
            text,
            icon
        });
        return this;
    }
    /**
     * Add Payment Checkout / Pix Button
     */
    addPayment(text, paymentConfig = {}, icon) {
        this.buttons.push({
            payment: paymentConfig,
            text,
            icon
        });
        return this;
    }
    /**
     * Add Order Summary Review Button
     */
    addOrder(text, orderConfig = {}, icon) {
        this.buttons.push({
            order: orderConfig,
            text,
            icon
        });
        return this;
    }
    /**
     * Add Voice/Video Call Permission Request Button
     */
    addCallPermission(text = "📞 Request Call", icon) {
        this.buttons.push({
            name: "call_permission_request",
            text,
            icon
        });
        return this;
    }
    /**
     * Build the array of buttons for nativeFlow
     */
    build() {
        return [...this.buttons];
    }
}

/**
 * Fluent builder for creating complete Baileys interactive / rich messages
 */
export class MessageBuilder {
    constructor() {
        this.msg = {};
    }

    setText(text) {
        this.msg.text = text;
        return this;
    }

    setCaption(caption) {
        this.msg.caption = caption;
        return this;
    }

    setHeader(title, subtitle) {
        this.msg.title = title;
        if (subtitle) this.msg.subtitle = subtitle;
        return this;
    }

    setFooter(footer) {
        this.msg.footer = footer;
        return this;
    }

    setMedia(mediaObj) {
        Object.assign(this.msg, mediaObj);
        return this;
    }

    setNativeFlow(buttons) {
        if (buttons instanceof ButtonBuilder) {
            this.msg.nativeFlow = buttons.build();
        } else {
            this.msg.nativeFlow = buttons;
        }
        return this;
    }

    setOffer(text, url, code, expiration) {
        this.msg.offerText = text;
        if (url) this.msg.offerUrl = url;
        if (code) this.msg.offerCode = code;
        if (expiration) this.msg.offerExpiration = expiration;
        return this;
    }

    setBottomSheet(optionText, optionTitle) {
        this.msg.optionText = optionText;
        if (optionTitle) this.msg.optionTitle = optionTitle;
        return this;
    }

    build() {
        return { ...this.msg };
    }
}

/**
 * Converts a Meta WhatsApp Cloud API messages payload to Baileys send message format
 * Following https://developers.facebook.com/documentation/business-messaging/whatsapp/get-started
 * 
 * @param {object} cloudApiPayload Standard Meta Cloud API request body
 * @returns {object} Compatible Baileys AnyMessageContent object
 */
export function fromCloudApiMessage(cloudApiPayload) {
    if (!cloudApiPayload || typeof cloudApiPayload !== "object") {
        throw new Error("Invalid Meta Cloud API payload: must be an object");
    }

    const type = cloudApiPayload.type || (cloudApiPayload.interactive ? "interactive" : cloudApiPayload.text ? "text" : "text");

    // Plain text message
    if (type === "text") {
        const textObj = cloudApiPayload.text || {};
        return {
            text: typeof textObj === "string" ? textObj : textObj.body || ""
        };
    }

    // Interactive message (button, list, cta_url, flow, product, etc.)
    if (type === "interactive") {
        const interactive = cloudApiPayload.interactive || {};
        const interactiveType = interactive.type;
        const bodyText = interactive.body?.text || "";
        const footerText = interactive.footer?.text;
        const header = interactive.header;

        const result = {
            text: bodyText
        };

        if (footerText) {
            result.footer = footerText;
        }

        // Header attachment handling
        if (header) {
            if (header.type === "text" && header.text) {
                result.title = header.text;
            } else if (header.type === "image" && (header.image?.link || header.image?.url)) {
                result.image = { url: header.image.link || header.image.url };
                result.caption = bodyText;
                delete result.text;
            } else if (header.type === "video" && (header.video?.link || header.video?.url)) {
                result.video = { url: header.video.link || header.video.url };
                result.caption = bodyText;
                delete result.text;
            } else if (header.type === "document" && (header.document?.link || header.document?.url)) {
                result.document = { url: header.document.link || header.document.url };
                result.fileName = header.document.filename;
                result.caption = bodyText;
                delete result.text;
            }
        }

        // Button type (Quick Reply Buttons)
        if (interactiveType === "button") {
            const buttons = interactive.action?.buttons || [];
            result.nativeFlow = buttons.map(btn => {
                const reply = btn.reply || {};
                return {
                    id: reply.id || "btn_" + Math.random().toString(36).substring(7),
                    text: reply.title || "Button"
                };
            });
            return result;
        }

        // List type (Single select menu)
        if (interactiveType === "list") {
            const action = interactive.action || {};
            result.nativeFlow = [
                {
                    sections: (action.sections || []).map(sec => ({
                        title: sec.title || "",
                        rows: (sec.rows || []).map(row => ({
                            id: row.id,
                            title: row.title,
                            description: row.description
                        }))
                    })),
                    text: action.button || "Select Option"
                }
            ];
            return result;
        }

        // CTA URL
        if (interactiveType === "cta_url") {
            const params = interactive.action?.parameters || {};
            result.nativeFlow = [
                {
                    text: params.display_text || "Visit Website",
                    url: params.url || "#"
                }
            ];
            return result;
        }

        // Flow
        if (interactiveType === "flow") {
            const params = interactive.action?.parameters || {};
            result.nativeFlow = [
                {
                    name: "flow",
                    paramsJson: JSON.stringify(params)
                }
            ];
            return result;
        }

        // Location request
        if (interactiveType === "location_request_message") {
            result.nativeFlow = [
                {
                    name: "send_location",
                    paramsJson: "{}"
                }
            ];
            return result;
        }

        // Carousel (Swipeable multi-card carousel)
        if (interactiveType === "carousel" || interactive.action?.cards) {
            const cardsList = interactive.action?.cards || [];
            result.cards = cardsList.map((card, idx) => {
                // Meta components format
                if (card.components && Array.isArray(card.components)) {
                    let cardImage = undefined;
                    let cardText = "";
                    let cardTitle = "";
                    const cardButtons = [];

                    for (const comp of card.components) {
                        if (comp.type === "header") {
                            const imgParam = comp.parameters?.find(p => p.type === "image");
                            if (imgParam) {
                                cardImage = { url: imgParam.image?.link || imgParam.image?.url };
                            }
                            const textParam = comp.parameters?.find(p => p.type === "text");
                            if (textParam) cardTitle = textParam.text || "";
                        } else if (comp.type === "body") {
                            const textParam = comp.parameters?.find(p => p.type === "text");
                            if (textParam) cardText = textParam.text || "";
                        } else if (comp.type === "button") {
                            const title = comp.parameters?.[0]?.text || comp.sub_type || "Button";
                            const payload = comp.parameters?.[0]?.payload || "card_btn_" + idx + "_" + cardButtons.length;
                            cardButtons.push({ id: payload, text: title });
                        }
                    }

                    return {
                        title: cardTitle,
                        text: cardText,
                        image: cardImage,
                        buttons: cardButtons
                    };
                }

                // Direct cards format: { header, body, action: { buttons: [...] } }
                let cardImage = undefined;
                if (card.header?.image?.link || card.header?.image?.url) {
                    cardImage = { url: card.header.image.link || card.header.image.url };
                } else if (card.image) {
                    cardImage = typeof card.image === "string" ? { url: card.image } : card.image;
                }

                const cardButtons = (card.action?.buttons || card.buttons || card.nativeFlow || []).map(b => {
                    if (b.reply) {
                        return { id: b.reply.id, text: b.reply.title };
                    }
                    return b;
                });

                return {
                    title: card.header?.text || card.title,
                    subtitle: card.subtitle,
                    text: card.body?.text || card.text || card.caption || "",
                    footer: card.footer?.text || card.footer,
                    image: cardImage,
                    buttons: cardButtons
                };
            });
            return result;
        }

        return result;
    }

    // Media types
    if (type === "image" && cloudApiPayload.image) {
        return {
            image: { url: cloudApiPayload.image.link || cloudApiPayload.image.url },
            caption: cloudApiPayload.image.caption
        };
    }
    if (type === "video" && cloudApiPayload.video) {
        return {
            video: { url: cloudApiPayload.video.link || cloudApiPayload.video.url },
            caption: cloudApiPayload.video.caption
        };
    }
    if (type === "audio" && cloudApiPayload.audio) {
        return {
            audio: { url: cloudApiPayload.audio.link || cloudApiPayload.audio.url },
            mimetype: "audio/mp4"
        };
    }
    if (type === "document" && cloudApiPayload.document) {
        return {
            document: { url: cloudApiPayload.document.link || cloudApiPayload.document.url },
            fileName: cloudApiPayload.document.filename,
            caption: cloudApiPayload.document.caption
        };
    }
    if (type === "location" && cloudApiPayload.location) {
        return {
            location: {
                degreesLatitude: cloudApiPayload.location.latitude,
                degreesLongitude: cloudApiPayload.location.longitude,
                name: cloudApiPayload.location.name,
                address: cloudApiPayload.location.address
            }
        };
    }
    if (type === "contacts" && cloudApiPayload.contacts) {
        return {
            contacts: {
                displayName: cloudApiPayload.contacts[0]?.name?.formatted_name || "Contact",
                contacts: cloudApiPayload.contacts
            }
        };
    }

    // Template messages
    if (type === "template" && cloudApiPayload.template) {
        const tmpl = cloudApiPayload.template;
        const bodyComp = (tmpl.components || []).find(c => c.type === "body");
        const bodyText = bodyComp?.parameters?.map(p => p.text).join(" ") || tmpl.name;
        const buttonComps = (tmpl.components || []).filter(c => c.type === "button");
        
        return {
            text: bodyText,
            nativeFlow: buttonComps.map((b, idx) => ({
                id: b.parameters?.[0]?.payload || "btn_" + idx,
                text: b.parameters?.[0]?.text || "Option " + (idx + 1)
            }))
        };
    }

    return { text: JSON.stringify(cloudApiPayload) };
}

/**
 * Converts a Baileys message content back to Meta WhatsApp Cloud API format
 */
export function toCloudApiMessage(baileysContent, recipientPhone = "") {
    const cleanTo = sanitizeWhatsAppNumber(recipientPhone);
    const base = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: cleanTo
    };
    if (!baileysContent || typeof baileysContent !== "object") {
        return {
            ...base,
            type: "text",
            text: { body: String(baileysContent) }
        };
    }

    // Media messages
    if (baileysContent.image) {
        return {
            ...base,
            type: "image",
            image: {
                link: typeof baileysContent.image === "string" ? baileysContent.image : (baileysContent.image.url || baileysContent.image.link),
                caption: baileysContent.caption
            }
        };
    }
    if (baileysContent.video) {
        return {
            ...base,
            type: "video",
            video: {
                link: typeof baileysContent.video === "string" ? baileysContent.video : (baileysContent.video.url || baileysContent.video.link),
                caption: baileysContent.caption
            }
        };
    }
    if (baileysContent.audio) {
        return {
            ...base,
            type: "audio",
            audio: {
                link: typeof baileysContent.audio === "string" ? baileysContent.audio : (baileysContent.audio.url || baileysContent.audio.link)
            }
        };
    }
    if (baileysContent.document) {
        return {
            ...base,
            type: "document",
            document: {
                link: typeof baileysContent.document === "string" ? baileysContent.document : (baileysContent.document.url || baileysContent.document.link),
                filename: baileysContent.fileName || baileysContent.filename,
                caption: baileysContent.caption
            }
        };
    }
    if (baileysContent.location) {
        return {
            ...base,
            type: "location",
            location: {
                latitude: baileysContent.location.degreesLatitude ?? baileysContent.location.latitude,
                longitude: baileysContent.location.degreesLongitude ?? baileysContent.location.longitude,
                name: baileysContent.location.name,
                address: baileysContent.location.address
            }
        };
    }
    if (baileysContent.react) {
        return {
            ...base,
            type: "reaction",
            reaction: {
                message_id: baileysContent.react.key?.id || baileysContent.react.messageId,
                emoji: baileysContent.react.text || baileysContent.react.emoji
            }
        };
    }

    // Carousel
    if (baileysContent.cards && Array.isArray(baileysContent.cards)) {
        return {
            ...base,
            type: "interactive",
            interactive: {
                type: "carousel",
                body: { text: baileysContent.text || baileysContent.caption || "" },
                footer: baileysContent.footer ? { text: baileysContent.footer } : undefined,
                action: {
                    cards: baileysContent.cards.map((card, idx) => ({
                        card_index: idx,
                        header: card.image ? { type: "image", image: { link: card.image.url || card.image } } : (card.title ? { type: "text", text: card.title } : undefined),
                        body: { text: card.text || card.caption || card.body || "" },
                        action: {
                            buttons: (card.nativeFlow || card.buttons || []).map(b => ({
                                type: "reply",
                                reply: {
                                    id: b.id || "btn_" + idx,
                                    title: b.text || b.buttonText || "Select"
                                }
                            }))
                        }
                    }))
                }
            }
        };
    }

    // Interactive buttons or nativeFlow
    if (baileysContent.nativeFlow || baileysContent.buttons) {
        const rawBtns = baileysContent.nativeFlow || baileysContent.buttons;
        const buttons = Array.isArray(rawBtns) ? rawBtns : (rawBtns.buttons || []);
        const first = buttons[0];

        if (first && first.sections) {
            // List message
            return {
                ...base,
                type: "interactive",
                interactive: {
                    type: "list",
                    header: baileysContent.title ? { type: "text", text: baileysContent.title } : undefined,
                    body: { text: baileysContent.text || baileysContent.caption || "Please select an option:" },
                    footer: baileysContent.footer ? { text: baileysContent.footer } : undefined,
                    action: {
                        button: first.text || "Select",
                        sections: first.sections
                    }
                }
            };
        }
        if (first && first.url) {
            // CTA URL
            return {
                ...base,
                type: "interactive",
                interactive: {
                    type: "cta_url",
                    header: baileysContent.title ? { type: "text", text: baileysContent.title } : undefined,
                    body: { text: baileysContent.text || baileysContent.caption || "" },
                    footer: baileysContent.footer ? { text: baileysContent.footer } : undefined,
                    action: {
                        name: "cta_url",
                        parameters: {
                            display_text: first.text || "Visit",
                            url: first.url
                        }
                    }
                }
            };
        }
        if (buttons.length > 3) {
            // Meta Cloud API strictly limits reply buttons to 3. Convert excess to single select menu to prevent Error 100
            return {
                ...base,
                type: "interactive",
                interactive: {
                    type: "list",
                    header: baileysContent.title ? { type: "text", text: baileysContent.title } : undefined,
                    body: { text: baileysContent.text || baileysContent.caption || "Options:" },
                    footer: baileysContent.footer ? { text: baileysContent.footer } : undefined,
                    action: {
                        button: "Select Option",
                        sections: [{
                            title: "Available Options",
                            rows: buttons.map((b, i) => ({
                                id: b.id || b.buttonId || ("opt_" + i),
                                title: (b.text || b.buttonText || ("Option " + (i + 1))).slice(0, 24)
                            }))
                        }]
                    }
                }
            };
        }

        // Quick replies (1 to 3 buttons)
        return {
            ...base,
            type: "interactive",
            interactive: {
                type: "button",
                header: baileysContent.title ? { type: "text", text: baileysContent.title } : undefined,
                body: { text: baileysContent.text || baileysContent.caption || "" },
                footer: baileysContent.footer ? { text: baileysContent.footer } : undefined,
                action: {
                    buttons: buttons.map(b => ({
                        type: "reply",
                        reply: {
                            id: b.id || b.buttonId || "id",
                            title: (b.text || b.buttonText || "Button").slice(0, 20)
                        }
                    }))
                }
            }
        };
    }

    return {
        ...base,
        type: "text",
        text: { body: baileysContent.text || baileysContent.caption || "" }
    };
}

export function buildButtonMessage(params) {
    const builder = new MessageBuilder();
    if (params.text) builder.setText(params.text);
    if (params.caption) builder.setCaption(params.caption);
    if (params.title) builder.setHeader(params.title, params.subtitle);
    if (params.footer) builder.setFooter(params.footer);
    if (params.media) builder.setMedia(params.media);
    if (params.buttons) builder.setNativeFlow(params.buttons);
    if (params.offer) builder.setOffer(params.offer.text, params.offer.url, params.offer.code, params.offer.expiration);
    if (params.bottomSheet) builder.setBottomSheet(params.bottomSheet.buttonText, params.bottomSheet.title);
    return builder.build();
}

/**
 * Convenient helper to build list messages
 */
export function buildListMessage(params) {
    return {
        text: params.text || "",
        title: params.title,
        footer: params.footer,
        nativeFlow: [
            {
                sections: params.sections || [],
                text: params.buttonText || "Select Option"
            }
        ]
    };
}

/**
 * Convenient helper to build interactive messages (buttons, list, carousel, flow)
 * @param {object} params
 */
export function buildInteractiveMessage(params) {
    if (!params || typeof params !== "object") {
        throw new Error("Invalid interactive message parameters");
    }

    // Direct carousel
    if (params.cards && Array.isArray(params.cards)) {
        return {
            text: params.text || params.body || "",
            footer: params.footer,
            cards: params.cards
        };
    }

    // Direct list menu
    if (params.sections && Array.isArray(params.sections)) {
        return buildListMessage(params);
    }

    // Flow or action buttons
    const result = {
        text: params.text || params.body || "",
        title: params.title || params.header,
        footer: params.footer
    };

    if (params.media) {
        Object.assign(result, params.media);
    } else if (params.image) {
        result.image = typeof params.image === "string" ? { url: params.image } : params.image;
        if (params.caption) result.caption = params.caption;
    } else if (params.video) {
        result.video = typeof params.video === "string" ? { url: params.video } : params.video;
        if (params.caption) result.caption = params.caption;
    }

    if (params.buttons) {
        result.nativeFlow = Array.isArray(params.buttons) ? params.buttons : [params.buttons];
    } else if (params.nativeFlow) {
        result.nativeFlow = params.nativeFlow;
    }

    if (params.bottomSheet) {
        result.optionText = params.bottomSheet.buttonText || params.bottomSheet.title;
        result.optionTitle = params.bottomSheet.title;
    }

    if (params.offer) {
        result.offerText = params.offer.text;
        result.offerUrl = params.offer.url;
        result.offerCode = params.offer.code;
        result.offerExpiration = params.offer.expiration;
    }

    return result;
}

/**
 * Convenient helper to build AI rich bot response messages (code syntax, table, citations)
 * @param {object} params
 */
export function buildRichMessage(params) {
    if (!params || typeof params !== "object") {
        throw new Error("Invalid rich message parameters");
    }
    const result = {};

    if (params.text) result.contentText = params.text;
    if (params.header || params.headerText) result.headerText = params.header || params.headerText;
    if (params.footer || params.footerText) result.footerText = params.footer || params.footerText;
    if (params.disclaimer || params.disclaimerText) result.disclaimerText = params.disclaimer || params.disclaimerText;
    if (params.title) result.title = params.title;

    if (params.code) {
        result.code = params.code;
        result.language = params.language || "javascript";
    }

    if (params.table) {
        result.table = params.table;
        result.noHeading = params.noHeading ?? false;
    }

    if (params.links) result.links = params.links;
    if (params.inlineImage) result.inlineImage = params.inlineImage;
    if (params.imageText) result.imageText = params.imageText;
    if (params.latex) result.latex = params.latex;

    return { richMessage: result };
}

/**
 * High-level helper: send interactive message via socket
 */
export async function sendInteractiveMessage(sock, jid, content, options = {}) {
    if (typeof sock.sendInteractive === "function") {
        return sock.sendInteractive(jid, content, options);
    }
    const message = buildInteractiveMessage(content);
    return sock.sendMessage(jid, message, options);
}

/**
 * High-level helper: send button message via socket
 */
export async function sendButtonMessage(sock, jid, content, options = {}) {
    if (typeof sock.sendButton === "function") {
        return sock.sendButton(jid, content, options);
    }
    const message = buildButtonMessage(content);
    return sock.sendMessage(jid, message, options);
}

/**
 * High-level helper: send AI rich response message via socket
 */
export async function sendRichMessage(sock, jid, content, options = {}) {
    if (typeof sock.sendRichMessage === "function") {
        return sock.sendRichMessage(jid, content, options);
    }
    const message = buildRichMessage(content);
    return sock.sendMessage(jid, message, options);
}


/**
 * Sanitize recipient phone number for Meta WhatsApp Cloud API (E.164 without leading + or @s.whatsapp.net)
 */
export function sanitizeWhatsAppNumber(phone) {
    if (!phone) return "";
    let clean = String(phone).replace(/@.*$/, "").replace(/[^0-9]/g, "");
    if (clean.startsWith("0") && clean.length >= 10) {
        clean = "62" + clean.slice(1);
    }
    return clean;
}

/**
 * Categorize and diagnose common Meta WhatsApp Cloud API errors
 */
export function diagnoseMetaCloudApiError(error) {
    const code = error?.code || error?.error?.code || (typeof error === "number" ? error : 0);
    const subcode = error?.error_subcode || error?.error?.error_subcode;
    const message = error?.message || error?.error?.message || String(error);

    if (code === 131047 || message.includes("24 hours") || message.includes("re-engagement")) {
        return {
            code,
            title: "Customer Service Window Expired (24h Rule)",
            explanation: "More than 24 hours have elapsed since the recipient last messaged your WhatsApp business number. Meta prohibits sending free-form text or interactive messages outside this window.",
            suggestion: "You must send a pre-approved Meta Template Message (type: 'template') to re-engage the user. Once the user replies, the 24-hour conversational window re-opens."
        };
    }
    if (code === 131030 || message.includes("allowed list")) {
        return {
            code,
            title: "Recipient Not In Sandbox Whitelist",
            explanation: "When using a Meta Developer Sandbox / Test Phone Number, WhatsApp only delivers messages to recipient numbers explicitly added to the Allowed Phone Numbers list in Meta App Dashboard.",
            suggestion: "Go to Meta App Dashboard -> WhatsApp -> API Setup, and add the recipient phone number to the 'To' phone numbers whitelist."
        };
    }
    if (code === 190 || subcode === 463 || message.includes("Session has expired") || message.includes("access token")) {
        return {
            code,
            title: "Meta Access Token Expired or Invalid",
            explanation: "Temporary Meta Developer access tokens expire after 24 hours. The request was rejected because the authorization token is invalid.",
            suggestion: "Generate a new token in Meta Graph API Explorer, or configure a permanent System User Token in Meta Business Manager."
        };
    }
    if (code === 100 || message.includes("Invalid parameter")) {
        return {
            code,
            title: "Invalid Request Parameter",
            explanation: "Meta Graph API rejected the message payload format (e.g. invalid phone number format, more than 3 quick-reply buttons, or text exceeding length limit).",
            suggestion: "Verify recipient phone digits without '+' or '@s.whatsapp.net', ensure reply buttons count <= 3, and ensure button titles are <= 20 characters."
        };
    }
    if (code === 131026 || message.includes("undeliverable")) {
        return {
            code,
            title: "Message Undeliverable",
            explanation: "The destination phone number is either not registered on WhatsApp or has blocked this business account.",
            suggestion: "Ensure the recipient phone number is active on WhatsApp."
        };
    }
    return {
        code,
        title: "Meta Cloud API Error (" + (code || "Unknown") + ")",
        explanation: message,
        suggestion: "Check the Meta Cloud API payload and credentials."
    };
}

/**
 * Send messages directly via official Meta WhatsApp Business Cloud API REST endpoint
 */
export async function sendMetaCloudApi(config, payload) {
    if (!config || !config.phoneNumberId || !config.accessToken) {
        throw new Error("Missing required Meta Cloud API config: phoneNumberId and accessToken are required");
    }
    const version = config.apiVersion || "v21.0";
    const url = "https://graph.facebook.com/" + version + "/" + config.phoneNumberId + "/messages";

    const clonedPayload = JSON.parse(JSON.stringify(payload));
    if (clonedPayload.to) {
        clonedPayload.to = sanitizeWhatsAppNumber(clonedPayload.to);
    }

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + config.accessToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(clonedPayload)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || data.error) {
        const diag = diagnoseMetaCloudApiError(data.error || { code: response.status, message: response.statusText });
        const err = new Error("Meta Cloud API Error [" + diag.code + "]: " + diag.title + " - " + diag.explanation);
        err.diagnostics = diag;
        err.metaResponse = data;
        err.statusCode = response.status;
        throw err;
    }
    return data;
}

/**
 * Create a reusable Meta Cloud API Client instance
 */
export function createMetaCloudApiClient(config) {
    return {
        send: (payload) => sendMetaCloudApi(config, payload),
        sendTemplate: (to, templateName, languageCode = "en_US", components = []) => {
            return sendMetaCloudApi(config, {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to,
                type: "template",
                template: {
                    name: templateName,
                    language: { code: languageCode },
                    components
                }
            });
        },
        sendText: (to, body, previewUrl = false) => {
            return sendMetaCloudApi(config, {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to,
                type: "text",
                text: { preview_url: previewUrl, body }
            });
        },
        sendInteractive: (to, interactive) => {
            return sendMetaCloudApi(config, {
                messaging_product: "whatsapp",
                recipient_type: "individual",
                to,
                type: "interactive",
                interactive
            });
        }
    };
}

/**
 * High-level helper: send Meta Cloud API message payload via Baileys socket
 */
export async function sendCloudApiMessage(sock, jid, content, options = {}) {
    if (typeof sock.sendCloudApi === "function") {
        return sock.sendCloudApi(jid, content, options);
    }
    const message = fromCloudApiMessage(content);
    return sock.sendMessage(jid, message, options);
}

/**
 * Universal WhatsApp message extractor and serializer for messages.upsert events.
 * Extracts text, button clicks, interactive responses, flows, single select, polls, events, reactions and edits in one unified structure.
 * 
 * @param {object} msg Raw proto.IWebMessageInfo from messages.upsert
 * @returns {object|null}
 */
export function serializeMessage(msg) {
    if (!msg || typeof msg !== "object") return null;
    const key = msg.key || {};
    const from = key.remoteJid || "";
    const isGroup = from.endsWith("@g.us");
    const isNewsletter = from.endsWith("@newsletter");
    const sender = isGroup ? (key.participant || from) : from;
    const fromMe = !!key.fromMe;
    const id = key.id || "";
    const pushName = msg.pushName || "";
    const timestamp = typeof msg.messageTimestamp === "number"
        ? msg.messageTimestamp
        : (msg.messageTimestamp?.low || Math.floor(Date.now() / 1000));

    // Unwrap message content
    const rawMessage = msg.message || {};
    const normalized = rawMessage.ephemeralMessage?.message ||
        rawMessage.viewOnceMessage?.message ||
        rawMessage.viewOnceMessageV2?.message ||
        rawMessage.viewOnceMessageV2Extension?.message ||
        rawMessage.documentWithCaptionMessage?.message ||
        rawMessage;

    const messageType = Object.keys(normalized)[0] || "";
    const inner = normalized[messageType] || {};

    let body = rawMessage.conversation ||
        normalized.conversation ||
        normalized.extendedTextMessage?.text ||
        normalized.imageMessage?.caption ||
        normalized.videoMessage?.caption ||
        normalized.documentMessage?.caption ||
        "";

    let interactive = null;

    // 1. Native Flow Response
    if (normalized.interactiveResponseMessage) {
        const resp = normalized.interactiveResponseMessage;
        const nativeFlow = resp.nativeFlowResponseMessage;
        let params = {};
        if (nativeFlow?.paramsJson) {
            try {
                params = JSON.parse(nativeFlow.paramsJson);
            } catch {
                params = { raw: nativeFlow.paramsJson };
            }
        }
        interactive = {
            type: "native_flow",
            name: nativeFlow?.name || "unknown",
            id: params.id || params.selected_id || params.flow_token,
            text: params.display_text || params.title || "",
            params,
            responseType: nativeFlow?.name
        };
        body = interactive.id || interactive.text || body;
    }
    // 2. Buttons Response (Legacy Buttons)
    else if (normalized.buttonsResponseMessage) {
        const btn = normalized.buttonsResponseMessage;
        interactive = {
            type: "button_reply",
            id: btn.selectedButtonId,
            text: btn.selectedDisplayText,
            selectedId: btn.selectedButtonId
        };
        body = btn.selectedButtonId || btn.selectedDisplayText || body;
    }
    // 3. List Response (Legacy List)
    else if (normalized.listResponseMessage) {
        const list = normalized.listResponseMessage;
        const selectedId = list.singleSelectReply?.selectedRowId || "";
        interactive = {
            type: "list_reply",
            id: selectedId,
            title: list.title,
            description: list.description,
            selectedId
        };
        body = selectedId || list.title || body;
    }
    // 4. Template Button Reply
    else if (normalized.templateButtonReplyMessage) {
        const tmpl = normalized.templateButtonReplyMessage;
        interactive = {
            type: "template_reply",
            id: tmpl.selectedId,
            text: tmpl.selectedDisplayText,
            index: tmpl.selectedIndex
        };
        body = tmpl.selectedId || tmpl.selectedDisplayText || body;
    }

    // 5. Poll Update
    let pollVote = null;
    if (normalized.pollUpdateMessage) {
        pollVote = {
            pollCreationMessageKey: normalized.pollUpdateMessage.pollCreationMessageKey,
            vote: normalized.pollUpdateMessage.vote,
            senderTimestampMs: normalized.pollUpdateMessage.senderTimestampMs
        };
    }

    // 6. Event RSVP
    let eventRsvp = null;
    if (normalized.eventResponseMessage) {
        eventRsvp = {
            response: normalized.eventResponseMessage.response,
            status: ["UNKNOWN", "GOING", "NOT_GOING", "MAYBE"][normalized.eventResponseMessage.response] || "UNKNOWN",
            timestampMs: normalized.eventResponseMessage.timestampMs
        };
    }

    // 7. Reaction
    let reaction = null;
    if (normalized.reactionMessage) {
        reaction = {
            text: normalized.reactionMessage.text || "",
            key: normalized.reactionMessage.key,
            senderTimestampMs: normalized.reactionMessage.senderTimestampMs
        };
    }

    // 8. Edited Message
    let isEdit = false;
    let editedText = null;
    if (normalized.protocolMessage?.type === 14 || normalized.protocolMessage?.editedMessage) {
        isEdit = true;
        const editContent = normalized.protocolMessage.editedMessage;
        editedText = editContent?.conversation || editContent?.extendedTextMessage?.text || "";
    }

    // 9. Quoted Message
    const contextInfo = inner?.contextInfo || normalized.extendedTextMessage?.contextInfo;
    let quoted = null;
    if (contextInfo?.quotedMessage) {
        const qRaw = contextInfo.quotedMessage;
        const qNormalized = qRaw.ephemeralMessage?.message || qRaw.viewOnceMessage?.message || qRaw;
        const qType = Object.keys(qNormalized)[0] || "";
        quoted = {
            key: {
                remoteJid: from,
                fromMe: contextInfo.participant === key.remoteJid,
                id: contextInfo.stanzaId,
                participant: contextInfo.participant
            },
            sender: contextInfo.participant || from,
            message: qNormalized,
            type: qType,
            text: qNormalized.conversation || qNormalized.extendedTextMessage?.text || ""
        };
    }

    return {
        key,
        id,
        from,
        sender,
        isGroup,
        isNewsletter,
        fromMe,
        pushName,
        timestamp,
        type: messageType,
        body,
        interactive,
        pollVote,
        eventRsvp,
        reaction,
        isEdit,
        editedText,
        quoted,
        raw: msg
    };
}
