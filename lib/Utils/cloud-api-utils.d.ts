
export interface NativeFlowButton {
    id?: string;
    text?: string;
    buttonText?: string;
    url?: string;
    call?: string;
    copy?: string;
    icon?: string;
    useWebview?: boolean;
    sections?: Array<{
        title: string;
        rows: Array<{
            id: string;
            title: string;
            description?: string;
        }>;
    }>;
    name?: string;
    buttonParamsJson?: string;
    paramsJson?: string;
}

export declare class ButtonBuilder {
    private buttons: NativeFlowButton[];
    constructor();
    addReply(id: string, text: string, icon?: string): this;
    addUrl(text: string, url: string, useWebview?: boolean, icon?: string): this;
    addCall(text: string, phoneNumber: string, icon?: string): this;
    addCopy(text: string, code: string, icon?: string): this;
    addList(title: string, sections: Array<{ title: string; rows: Array<{ id: string; title: string; description?: string }> }>, icon?: string): this;
    addFlow(flowId: string, text: string, flowToken?: string, action?: string, payload?: object): this;
    build(): NativeFlowButton[];
}

export declare class MessageBuilder {
    private msg: any;
    constructor();
    setText(text: string): this;
    setCaption(caption: string): this;
    setHeader(title: string, subtitle?: string): this;
    setFooter(footer: string): this;
    setMedia(mediaObj: any): this;
    setNativeFlow(buttons: NativeFlowButton[] | ButtonBuilder): this;
    setOffer(text: string, url?: string, code?: string, expiration?: number): this;
    setBottomSheet(optionText: string, optionTitle?: string): this;
    build(): any;
}

export declare function fromCloudApiMessage(cloudApiPayload: any): any;
export declare function toCloudApiMessage(baileysContent: any, recipientPhone?: string): any;
export declare function buildButtonMessage(params: any): any;
export declare function buildListMessage(params: any): any;
