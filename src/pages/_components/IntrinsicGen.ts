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
