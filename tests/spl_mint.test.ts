import { address, createSolanaRpc, unwrapOption } from "@solana/kit";
import { fetchMint, type Mint } from "@solana-program/token";
import { beforeAll, describe, expect, it } from "vitest";

const rpc = createSolanaRpc(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

const MINT = address("29doABEN4W5E1NZEZStVxHtrrvD44L1Mj62b2t8iZZtj");
const WALLET = address("8XZ6xMRiAPPEYnoY4Rf1NgvUhkkbWGZE3ceMa5cZErZ6");

describe("Task 1 — the SPL token mint", () => {
  let mint: Mint;

  beforeAll(async () => {
    mint = (await fetchMint(rpc, MINT)).data;
  }, 30_000);

  it("exists and is initialized", () => {
    expect(mint.isInitialized).toBe(true);
  });

  it("has 6 decimals", () => {
    expect(mint.decimals).toBe(6);
  });

  it("has a total supply of 100 tokens", () => {
    expect(mint.supply).toBe(100_000_000n);
  });

  it("names my wallet as the mint authority", () => {
    expect(unwrapOption(mint.mintAuthority)).toBe(WALLET);
  });

  it("has no freeze authority", () => {
    expect(unwrapOption(mint.freezeAuthority)).toBe(null);
  });
});
