/**
 * Secret Code cipher.
 *
 * Encrypt: each letter -> alphabet position (A=1..Z=26) -> binary padded to
 * at least 4 digits -> 0 becomes "_" and 1 becomes ".". Letters within a word
 * are joined with "//", words are joined with "/". Digits and punctuation are
 * left unchanged and kept in place. Case is ignored.
 *
 * Decrypt: whitespace is stripped, then the input is tokenized on "//" (letter
 * break) and "/" (word break). Each group's "_" -> 0 and "." -> 1 is read as
 * binary; values 1-26 map back to letters, anything invalid shows as "?".
 */

const LETTER_PATTERN = /[a-z]/i;

export function encodeLetter(letter: string): string {
  const position = letter.toUpperCase().charCodeAt(0) - 64; // A=1 ... Z=26
  return position
    .toString(2)
    .padStart(4, "0")
    .replace(/0/g, "_")
    .replace(/1/g, ".");
}

function encodeWord(word: string): string {
  let result = "";
  let previousWasLetter = false;
  for (const char of word) {
    if (LETTER_PATTERN.test(char)) {
      if (previousWasLetter) result += "//";
      result += encodeLetter(char);
      previousWasLetter = true;
    } else {
      result += char;
      previousWasLetter = false;
    }
  }
  return result;
}

export function encryptText(text: string): string {
  return text
    .trim()
    .split(/\s+/)
    .map(encodeWord)
    .join("/");
}

function decodeGroup(group: string): string {
  if (group === "") return "";
  if (!/^[._]+$/.test(group)) return "?";
  const value = parseInt(group.replace(/_/g, "0").replace(/\./g, "1"), 2);
  if (!Number.isFinite(value) || value < 1 || value > 26) return "?";
  return String.fromCharCode(64 + value); // 1=A ... 26=Z
}

export function decryptText(code: string): string {
  const cleaned = code.trim().replace(/\s+/g, "");
  if (cleaned === "") return "";
  return cleaned
    .split(/(\/\/|\/)/)
    .map((part) => {
      if (part === "//") return "";
      if (part === "/") return " ";
      return decodeGroup(part);
    })
    .join("");
}
