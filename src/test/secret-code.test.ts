import { describe, expect, it } from "vitest";

import { decryptText, encryptText } from "@/lib/secret-code";

describe("secret code cipher", () => {
  it("encodes single letters per the spec examples", () => {
    expect(encryptText("A")).toBe("___.");
    expect(encryptText("B")).toBe("__._");
    expect(encryptText("C")).toBe("__..");
    expect(encryptText("D")).toBe("_.__");
    expect(encryptText("H")).toBe(".___");
    expect(encryptText("I")).toBe(".__.");
    expect(encryptText("Z")).toBe(".._._");
  });

  it("encodes words and sentences with // and / separators", () => {
    expect(encryptText("HI A")).toBe(".___//.__./___.");
  });

  it("ignores case", () => {
    expect(encryptText("hi a")).toBe(".___//.__./___.");
  });

  it("leaves digits and punctuation unchanged and in place", () => {
    expect(encryptText("HI!")).toBe(".___//.__.!");
    expect(encryptText("A1")).toBe(".___1");
  });

  it("round-trips messages", () => {
    expect(decryptText(encryptText("SECRET CODE"))).toBe("SECRET CODE");
    expect(decryptText(encryptText("Attack at dawn 12:30!"))).toBe(
      "Attack at dawn 12:30!",
    );
  });

  it("decodes letters and words back to text", () => {
    expect(decryptText(".___//.__./___.")).toBe("HI A");
  });

  it("trims extra whitespace before decoding", () => {
    expect(decryptText("   .___//.__. / ___   ")).toBe("HI A");
  });

  it("shows ? for invalid groups", () => {
    // ____ decodes to 0, which is not a letter.
    expect(decryptText("____//.__.")).toBe("? A");
    // Groups containing characters other than . and _ are invalid.
    expect(decryptText("ab//cd")).toBe("??");
    // Values above 26 are invalid.
    expect(decryptText("......")).toBe("?");
  });

  it("pads numbers below 16 to four digits both ways", () => {
    expect(decryptText(encryptText("ABCDEFG"))).toBe("ABCDEFG");
  });
});
