import { describe, expect, test } from "bun:test";
import { buildSearchRegex, escapeRegex } from "../src/utils/search";

describe("escapeRegex", () => {
  test("escapes regex metacharacters", () => {
    expect(
      escapeRegex("Stripe.js (v2)?")
    ).toBe("Stripe\\.js \\(v2\\)\\?");
  });

  test("leaves ordinary text unchanged", () => {
    expect(
      escapeRegex("amounts owed")
    ).toBe("amounts owed");
  });
});

describe("buildSearchRegex", () => {
  test("matches regardless of whitespace", () => {
    const regex = buildSearchRegex("amounts owed");

    expect(regex.test("amounts owed")).toBe(true);
    expect(regex.test("amounts    owed")).toBe(true);
    expect(regex.test("amounts\nowed")).toBe(true);
    expect(regex.test("Amounts\towed")).toBe(true);
  });

  test("treats regex metacharacters literally", () => {
    const regex = buildSearchRegex("Stripe.js");

    expect(regex.test("Stripe.js")).toBe(true);
    expect(regex.test("StripeXjs")).toBe(false);
    expect(regex.test("Stripe-js")).toBe(false);
  });

  test("is case-insensitive", () => {
    const regex = buildSearchRegex("invoice object");

    expect(regex.test("Invoice Object")).toBe(true);
    expect(regex.test("INVOICE OBJECT")).toBe(true);
  });
});
