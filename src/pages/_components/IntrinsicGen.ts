import { getInstance } from "byteweb";

const virtualized = `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`;
const base64abc = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "+",
  "/",
];

/*
// This constant can also be computed with the following algorithm:
const l = 256, base64codes = new Uint8Array(l);
for (let i = 0; i < l; ++i) {
	base64codes[i] = 255; // invalid character
}
base64abc.forEach((char, index) => {
	base64codes[char.charCodeAt(0)] = index;
});
base64codes["=".charCodeAt(0)] = 0; // ignored anyway, so we just need to prevent an error
*/
const base64codes = [
  255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
  255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255,
  255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 62, 255, 255,
  255, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 255, 255, 255, 0, 255, 255,
  255, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 255, 255, 255, 255, 255, 255, 26, 27, 28, 29, 30, 31, 32,
  33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51,
];

function getBase64Code(charCode: any) {
  if (charCode >= base64codes.length) {
    throw new Error("Unable to parse base64 string.");
  }
  const code = base64codes[charCode];
  if (code === 255) {
    throw new Error("Unable to parse base64 string.");
  }
  return code;
}

export function bytesToBase64(bytes: any) {
  let result = "",
    i,
    l = bytes.length;
  for (i = 2; i < l; i += 3) {
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64abc[((bytes[i - 1] & 0x0f) << 2) | (bytes[i] >> 6)];
    result += base64abc[bytes[i] & 0x3f];
  }
  if (i === l + 1) {
    // 1 octet yet to write
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[(bytes[i - 2] & 0x03) << 4];
    result += "==";
  }
  if (i === l) {
    // 2 octets yet to write
    result += base64abc[bytes[i - 2] >> 2];
    result += base64abc[((bytes[i - 2] & 0x03) << 4) | (bytes[i - 1] >> 4)];
    result += base64abc[(bytes[i - 1] & 0x0f) << 2];
    result += "=";
  }
  return result;
}

export function base64ToBytes(str: string) {
  if (str.length % 4 !== 0) {
    throw new Error("Unable to parse base64 string.");
  }
  const index = str.indexOf("=");
  if (index !== -1 && index < str.length - 2) {
    throw new Error("Unable to parse base64 string.");
  }
  let missingOctets = str.endsWith("==") ? 2 : str.endsWith("=") ? 1 : 0,
    n = str.length,
    result = new Uint8Array(3 * (n / 4)),
    buffer;
  for (let i = 0, j = 0; i < n; i += 4, j += 3) {
    buffer =
      (getBase64Code(str.charCodeAt(i)) << 18) |
      (getBase64Code(str.charCodeAt(i + 1)) << 12) |
      (getBase64Code(str.charCodeAt(i + 2)) << 6) |
      getBase64Code(str.charCodeAt(i + 3));
    result[j] = buffer >> 16;
    result[j + 1] = (buffer >> 8) & 0xff;
    result[j + 2] = buffer & 0xff;
  }
  return result.subarray(0, result.length - missingOctets);
}

export function base64encode(str: any, encoder = new TextEncoder()) {
  return bytesToBase64(encoder.encode(str));
}

export function base64decode(str: any, decoder = new TextDecoder()) {
  return decoder.decode(base64ToBytes(str));
}

export async function getIntrinsicToken() {
  const instance = await getInstance();
  return instance.eval(base64ToBytes(virtualized));
}
