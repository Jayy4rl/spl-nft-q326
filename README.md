# scripts-solana

Scripts for creating SPL tokens and NFTs on Solana devnet.

---

## Setup

### 1. Add your wallet

Place your devnet wallet keypair file at the project root:

```
root/
└── devnet-wallet.json   ← here
```

It should be a JSON array of numbers, e.g. `[174, 23, ...]`.

### 2. Install dependencies

```bash
npm install
```

```bash
npm install --save-dev @types/node ts-node typescript
```

### 3. Add your image

Place your image at the project root.

```
root/
└── image.jpeg   ← here
```

---

> Before running the scripts, go through these docs:
> - [Solana token docs](https://solana.com/docs/tokens) — mint accounts, token accounts, and ATAs
> - [Solana Kit](https://www.solanakit.com/) — the JS SDK used for building and sending transactions
> - [Metaplex Token Metadata](https://www.metaplex.com/docs/smart-contracts/token-metadata) — attaching metadata to SPL tokens
> - [Metaplex Core](https://www.metaplex.com/docs/smart-contracts/core) — the NFT standard used in the NFT scripts

## SPL Token

Uses **@solana/kit** and **@solana-program/token** for transactions, and **mpl-token-metadata** via UMI for on-chain metadata.

| Script | Command | What it does |
|---|---|---|
| `spl_init.ts` | `npm run spl:init` | Creates a new mint account |
| `spl_metadata.ts` | `npm run spl:metadata` | Attaches a name, symbol, and URI to the mint |
| `spl_mint.ts` | `npm run spl:mint` | Creates your associated token account and mints tokens into it |
| `spl_transfer.ts` | `npm run spl:transfer` | Sends tokens to another wallet i.e ata to ata |

Run them in order. Each script logs the addresses/signatures you'll need to paste into the next one.

Mint: 29doABEN4W5E1NZEZStVxHtrrvD44L1Mj62b2t8iZZtj
  - Signature:
    4RBUf2guydZVLJP2ndrTWBiGerqNTzRj8DD7LCFD34ZDejSn3FU8fGaAWFCiMVnXgCLd51qs4iDeeBD1HHTGtczA


Your ata is : 6zXuSJdxwYZiyuZNC8C69VLD7hUmvry22AqXmyQF1ZvW
mint txid: 2BsRFkdUGiiJo5yJUaNifGdn2JK6ejShqVV6aSPtTNML3LzawSn7cyGksmenKjEPsWNCEg41TDKRYLws6QEaZ6T5



Your fromAta is : 6zXuSJdxwYZiyuZNC8C69VLD7hUmvry22AqXmyQF1ZvW
Your toAta is : 4hk7ShZYNCXhfpQ6v9Sm7rfgySd8CTnasGxNwwib4Vi9
mint txid: 5co8djfY8eAGqiigTyhVrHi8EJnwG7Yfv7MmWxetdhzNPyKraY9eKPwXmR1MfZTDVHBZ6VZ9qKPUNQjWqaGe7o8R
---

## NFT

Uses **@solana/kit** and **mpl-core** via UMI. Images and metadata are stored on Irys (decentralized storage).

| Script | Command | What it does |
|---|---|---|
| `nft_image.ts` | `npm run nft:image` | Uploads your image to Irys, logs the image URI |
| `nft_metadata.ts` | `npm run nft:metadata` | Builds the metadata JSON and uploads it, logs the metadata URI |
| `nft_mint.ts` | `npm run nft:mint` | Mints the NFT on-chain using the metadata URI |

Run them in order. Paste the URI logged by each step into the next script before running it.

Your image URI:  https://gateway.irys.xyz/58ibBiK263ifDeqzqaMGMfAnFa2Nqxr5qN1M597AW95f
metadata uri: https://gateway.irys.xyz/CaV2Z2acs3325MkyE9jYw1T3xC9DJwBaGWL1pgQBqKfW
signature 4mAXXVo6gAKeqRxFCZETxsG4MKji9uhAjVHHntmfiWJMN2aNhdLTdFwRcYeyNSTizniY72VWir6GqVGPj8ysvnj5, asset : DEPzJiQk2Akq2D4moipxQGfLE8aP2jeBtmnQb1t7XVMv

Current name:: My NFT | uri: https://gateway.irys.xyz/CaV2Z2acs3325MkyE9jYw1T3xC9DJwBaGWL1pgQBqKfW
new metadata uri: https://gateway.irys.xyz/85wfggoo1fTgi1Ku5b4StaweGWbP6aXu8k3aj6TrGRvj
signature: 5saekDAApUqMKtAM7b3HXnMGaZ2epTZtuXKQcULoZtGBNkvdhJJ2mnoUzi1adiUfFrARSuDpHSLoCzCgTosUkXfJ
Updated name: My NFT | uri: https://gateway.irys.xyz/CaV2Z2acs3325MkyE9jYw1T3xC9DJwBaGWL1pgQBqKfW