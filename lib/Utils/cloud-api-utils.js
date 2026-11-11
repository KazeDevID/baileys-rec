
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
    if (!baileysContent || typeof baileysContent !== "object") {
        return {
            messaging_product: "whatsapp",
            recipient_type: "individual",
            to: recipientPhone,
            type: "text",
            text: { body: String(baileysContent) }
        };
    }

    const base = {
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: recipientPhone
    };

    if (baileysContent.text && !baileysContent.nativeFlow && !baileysContent.buttons) {
        return {
            ...base,
            type: "text",
            text: { body: baileysContent.text }
        };
    }

    if (baileysContent.nativeFlow) {
        const buttons = Array.isArray(baileysContent.nativeFlow) ? baileysContent.nativeFlow : baileysContent.nativeFlow.buttons || [];
        const first = buttons[0];

        if (first && first.sections) {
            // List message
            return {
                ...base,
                type: "interactive",
                interactive: {
                    type: "list",
                    header: baileysContent.title ? { type: "text", text: baileysContent.title } : undefined,
                    body: { text: baileysContent.text || baileysContent.caption || "" },
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

        // Quick replies
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
                            title: b.text || b.buttonText || "Button"
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

/**
 * Convenient helper to build button messages
 */
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
