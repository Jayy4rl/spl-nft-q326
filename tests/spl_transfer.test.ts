import { address, createSolanaRpc, unwrapOption } from "@solana/kit";
import {
  AccountState,
  fetchToken,
  findAssociatedTokenPda,
  TOKEN_PROGRAM_ADDRESS,
  type Token,
} from "@solana-program/token";
import { beforeAll, describe, expect, it } from "vitest";

const rpc = createSolanaRpc(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

const MINT = address("29doABEN4W5E1NZEZStVxHtrrvD44L1Mj62b2t8iZZtj");
const SENDER = address("8XZ6xMRiAPPEYnoY4Rf1NgvUhkkbWGZE3ceMa5cZErZ6");
const RECIPIENT = address("aczhoP2NX5KzCB4s4Xw8FXDxLcw3gVnWnkRDhBt935E");

describe("Task 1 — transferring the SPL token", () => {
  let sender: Token;
  let recipient: Token;

  beforeAll(async () => {
    const [senderAta] = await findAssociatedTokenPda({
      owner: SENDER,
      mint: MINT,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });
    const [recipientAta] = await findAssociatedTokenPda({
      owner: RECIPIENT,
      mint: MINT,
      tokenProgram: TOKEN_PROGRAM_ADDRESS,
    });

    sender = (await fetchToken(rpc, senderAta)).data;
    recipient = (await fetchToken(rpc, recipientAta)).data;
  }, 30_000);

  it("holds both token accounts against my mint", () => {
    expect(sender.mint).toBe(MINT);
    expect(recipient.mint).toBe(MINT);
  });

  it("assigns each token account to the right owner", () => {
    expect(sender.owner).toBe(SENDER);
    expect(recipient.owner).toBe(RECIPIENT);
  });

  it("delivers 25 tokens to the intended recipient", () => {
    expect(recipient.amount).toBe(25_000_000n);
  });

  it("leaves 50 tokens with the sender", () => {
    expect(sender.amount).toBe(50_000_000n);
  });

  it("leaves both accounts unfrozen", () => {
    expect(sender.state).toBe(AccountState.Initialized);
    expect(recipient.state).toBe(AccountState.Initialized);
  });

  it("gives no third party a delegate claim on either balance", () => {
    expect(unwrapOption(sender.delegate)).toBe(null);
    expect(unwrapOption(recipient.delegate)).toBe(null);
  });
});
