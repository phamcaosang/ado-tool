import { Buffer } from 'buffer';

export const base64Encode = (x: string) => {
    return Buffer.from(x).toString("base64");
}