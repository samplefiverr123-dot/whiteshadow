# Whiteshadow

Build a single-page web app called "Secret Code" with a clean, modern, dark-themed design. It encrypts and decrypts text using my custom code language.

THE CODE RULES

Encrypt (text -> code), for each letter:

1. Convert the letter to its alphabet position: A=1, B=2, ... Z=26.

2. Convert that number to binary, padded to at least 4 digits (A=0001, B=0010, C=0011, D=0100 ... O=1111, P=10000 ... Z=11010).

3. Replace every 0 with "_" (underscore) and every 1 with "." (dot).

Examples: A = "___."  B = "__._"  C = "__.."  D = "_.__"  H = ".___"  I = ".__."  Z = ".._._"

Separators (no spaces anywhere):

- Between letters of the same word use "//" (two slashes).

- Between words use "/" (one slash).

- Example: "HI A" -> ".___//.__./___."

- Ignore case (treat lowercase as uppercase).

- Leave digits and punctuation unchanged and keep them in place.

Decrypt (code -> text): tokenize the input with the regex /\/\/|\// so that "//" means a letter break and "/" means a word break. For each letter group, replace "_" with 0 and "." with 1, convert the binary to a number, then to a letter (1=A ... 26=Z). Insert a space for each word break. If a group is invalid (not 1-26 or contains other characters), show "?" for it. Trim any extra whitespace in the input before decoding.

FEATURES

- Two tabs or a toggle: "Encrypt" and "Decrypt".

- A large input textarea and a live output box that updates as the user types.

- Buttons: Copy output, Clear, and Swap (moves output to input and switches mode).

- A reference table showing every letter A-Z with its number, binary, and final symbol code.

- A short "How it works" section explaining the 3 steps and the // and / separators with an example.

- Use a monospace font for the code output so dots, underscores, and slashes line up.

- Fully responsive for mobile. All logic runs in the browser, no backend needed.

- Show a friendly error message for invalid code in Decrypt mode.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://whiteshadow.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/80b6cc50-8bcd-4939-9c3c-95daee6a5377).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
