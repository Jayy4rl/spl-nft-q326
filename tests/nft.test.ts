import { publicKey } from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  fetchAsset,
  mplCore,
  type AssetV1,
} from "@metaplex-foundation/mpl-core";
import { beforeAll, describe, expect, it } from "vitest";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
).use(mplCore());

const ASSET = publicKey("DEPzJiQk2Akq2D4moipxQGfLE8aP2jeBtmnQb1t7XVMv");
const WALLET = publicKey("8XZ6xMRiAPPEYnoY4Rf1NgvUhkkbWGZE3ceMa5cZErZ6");
const IMAGE_URI =
  "https://gateway.irys.xyz/58ibBiK263ifDeqzqaMGMfAnFa2Nqxr5qN1M597AW95f";

async function fetchJson<T>(uri: string, attempts = 3): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      const response = await fetch(uri);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return (await response.json()) as T;
    } catch (error) {
      if (i === attempts) throw error;
      await new Promise((resolve) => setTimeout(resolve, 1000 * i));
    }
  }
}

type OffChainMetadata = {
  name: string;
  description: string;
  image: string;
  attributes: { trait_type: string; value: string }[];
};

describe("Task 2 — minting the NFT with MPL Core", () => {
  let asset: AssetV1;

  beforeAll(async () => {
    asset = await fetchAsset(umi, ASSET);
  }, 30_000);

  it("exists on chain as a single MPL Core asset account", () => {
    expect(asset.publicKey).toBe(ASSET);
  });

  it("is owned by my wallet", () => {
    expect(asset.owner).toBe(WALLET);
  });

  it("points at a metadata URI", () => {
    expect(asset.uri).toMatch(/^https:\/\/gateway\.irys\.xyz\/\w+$/);
  });
});

describe("Task 3 — updating the NFT as update authority", () => {
  let asset: AssetV1;
  let metadata: OffChainMetadata;

  beforeAll(async () => {
    asset = await fetchAsset(umi, ASSET);
    metadata = await fetchJson<OffChainMetadata>(asset.uri);
  }, 60_000);

  it("names my wallet as the update authority", () => {
    expect(asset.updateAuthority.type).toBe("Address");
    expect(asset.updateAuthority.address).toBe(WALLET);
  });

  it("carries the updated on-chain name", () => {
    expect(asset.name).toBe("My Updated NFT");
  });

  it("no longer carries the name it was minted with", () => {
    expect(asset.name).not.toBe("My NFT");
  });

  it("serves reachable JSON metadata at its URI", () => {
    expect(metadata).toBeTypeOf("object");
  });

  it("keeps the off-chain name in sync with the on-chain name", () => {
    expect(metadata.name).toBe(asset.name);
  });

  it("carries the updated off-chain attributes", () => {
    expect(metadata.attributes).toContainEqual({
      trait_type: "Rarity",
      value: "Legendary",
    });
  });

  it("still references the originally uploaded image", () => {
    expect(metadata.image).toBe(IMAGE_URI);
  });
});
