import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { decryptText, encryptText } from "@/lib/secret-code";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Secret Code — Encrypt & Decrypt Messages" },
      {
        name: "description",
        content:
          "Turn any message into a secret code of dots and underscores, and decode it back. Runs entirely in your browser.",
      },
      { property: "og:title", content: "Secret Code — Encrypt & Decrypt Messages" },
      {
        property: "og:description",
        content:
          "Turn any message into a secret code of dots and underscores, and decode it back. Runs entirely in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SecretCodePage,
});

type Mode = "encrypt" | "decrypt";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

function buildReference() {
  return ALPHABET.map((letter) => {
    const position = letter.charCodeAt(0) - 64;
    const binary = position.toString(2).padStart(4, "0");
    return {
      letter,
      position,
      binary,
      code: binary.replace(/0/g, "_").replace(/1/g, "."),
    };
  });
}

function CodeText({ value }: { value: string }) {
  return (
    <>
      {value.split("").map((char, index) => {
        if (char === ".") {
          return (
            <span key={index} className="text-accent">
              {char}
            </span>
          );
        }
        if (char === "/") {
          return (
            <span key={index} className="text-muted-foreground/50">
              {char}
            </span>
          );
        }
        return (
          <span key={index} className="text-muted-foreground">
            {char}
          </span>
        );
      })}
    </>
  );
}

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-40";
const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-ring/50 hover:bg-secondary";

function SecretCodePage() {
  const [mode, setMode] = useState<Mode>("encrypt");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);

  const output = useMemo(
    () => (mode === "encrypt" ? encryptText(input) : decryptText(input)),
    [mode, input],
  );
  const reference = useMemo(buildReference, []);
  const hasInvalidGroups = mode === "decrypt" && input.trim() !== "" && output.includes("?");

  async function copyOutput() {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be blocked; the user can still select the text.
    }
  }

  function clearAll() {
    setInput("");
  }

  function swap() {
    setInput(output);
    setMode(mode === "encrypt" ? "decrypt" : "encrypt");
  }

  return (
    <div className="min-h-screen">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-12 px-4 py-10 sm:py-14">
        <header className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary font-mono text-sm font-bold text-primary-foreground">
              ._/
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Secret Code
            </h1>
          </div>
          <p className="text-muted-foreground">
            Turn messages into dots and underscores — and decode them back.
          </p>
        </header>

        <section className="flex flex-col gap-4">
          <div
            role="tablist"
            aria-label="Mode"
            className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-card p-1"
          >
            {(["encrypt", "decrypt"] as const).map((value) => (
              <button
                key={value}
                role="tab"
                aria-selected={mode === value}
                onClick={() => setMode(value)}
                className={
                  mode === value
                    ? "rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors"
                    : "rounded-lg px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
                }
              >
                {value === "encrypt" ? "Encrypt" : "Decrypt"}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="secret-input" className="text-sm font-medium text-foreground">
              {mode === "encrypt" ? "Your message" : "Your secret code"}
            </label>
            <textarea
              id="secret-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={
                mode === "encrypt" ? "Type your message…" : "Paste code like .___//.__./___."
              }
              className={`min-h-36 w-full resize-y rounded-xl border border-border bg-card p-4 text-base leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-ring focus:ring-2 focus:ring-ring/30 ${
                mode === "decrypt" ? "font-mono" : ""
              }`}
            />
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-foreground">
              {mode === "encrypt" ? "Code" : "Decoded message"}
            </span>
            <div className="min-h-32 w-full break-all rounded-xl border border-border bg-card p-4 font-mono text-lg leading-relaxed">
              {output ? (
                <CodeText value={output} />
              ) : (
                <span className="text-muted-foreground/60">
                  {mode === "encrypt"
                    ? "Your code appears here as you type…"
                    : "The decoded message appears here…"}
                </span>
              )}
            </div>
          </div>

          {hasInvalidGroups && (
            <p className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground">
              Some groups couldn&apos;t be decoded and show as{" "}
              <span className="font-mono text-accent">?</span> — only dots and underscores,
              separated by <span className="font-mono">//</span> or <span className="font-mono">/</span>,
              can be decoded.
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button onClick={copyOutput} disabled={!output} className={primaryButton}>
              {copied ? "Copied!" : "Copy output"}
            </button>
            <button onClick={clearAll} className={secondaryButton}>
              Clear
            </button>
            <button onClick={swap} className={secondaryButton}>
              Swap ⇄
            </button>
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">
              Cipher reference
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Every letter, its alphabet number, binary, and final code.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {reference.map((row) => (
              <div
                key={row.letter}
                className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-3 py-2"
              >
                <span className="w-6 text-lg font-semibold text-foreground">{row.letter}</span>
                <span className="w-7 text-right text-sm text-muted-foreground">
                  {row.position}
                </span>
                <span className="font-mono text-sm text-muted-foreground">{row.binary}</span>
                <span className="font-mono text-base text-accent">{row.code}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <div>
            <h2 className="text-xl font-semibold tracking-tight text-foreground">How it works</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Three simple steps turn any letter into a code.
            </p>
          </div>
          <ol className="flex flex-col gap-3">
            {[
              {
                title: "Number it",
                body: "Each letter becomes its alphabet position: A = 1, B = 2, … Z = 26.",
              },
              {
                title: "Make it binary",
                body: "That number becomes binary, padded to at least 4 digits — so A = 0001.",
              },
              {
                title: "Swap the digits",
                body: "Every 0 becomes an underscore (_) and every 1 becomes a dot (.) — A becomes ___ .",
              },
            ].map((step, index) => (
              <li
                key={step.title}
                className="flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </span>
                <div>
                  <p className="font-semibold text-foreground">{step.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-4">
            <p className="text-sm text-muted-foreground">
              For example, encrypting <span className="font-semibold text-foreground">HI A</span>{" "}
              gives:
            </p>
            <p className="font-mono text-lg text-accent">.___//.__./___.</p>
            <p className="text-sm text-muted-foreground">
              <span className="font-mono text-foreground">//</span> separates letters ·{" "}
              <span className="font-mono text-foreground">/</span> separates words · digits and
              punctuation stay exactly where they are.
            </p>
          </div>
        </section>

        <footer className="text-center text-xs text-muted-foreground">
          Everything runs right in your browser — nothing is stored or sent anywhere.
        </footer>
      </main>
    </div>
  );
}
