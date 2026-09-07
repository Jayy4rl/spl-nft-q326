import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createSignerFromKeypair,
  publicKey,
  signerIdentity,
} from "@metaplex-foundation/umi";
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys";
import { fetchAsset, mplCore, update } from "@metaplex-foundation/mpl-core";
import { base58 } from "@metaplex-foundation/umi/serializers";
import wallet from "../../devnet-wallet.json";

const umi = createUmi(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

const keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);

umi.use(signerIdentity(signer));
umi.use(mplCore());
umi.use(irysUploader({ address: "https://devnet.irys.xyz/" }));

const assetAddress = publicKey("DEPzJiQk2Akq2D4moipxQGfLE8aP2jeBtmnQb1t7XVMv");
const image =
  "https://gateway.irys.xyz/58ibBiK263ifDeqzqaMGMfAnFa2Nqxr5qN1M597AW95f";

(async () => {
  try {
    const current_nft = await fetchAsset(umi, assetAddress);
    console.log("Current name:", current_nft.name, "| uri:", current_nft.uri);

    const newMetadata = {
      name: "My Updated NFT",
      description: "Updated by the update authority.",
      image,
      attributes: [{ trait_type: "Rarity", value: "Legendary" }],
      properties: {
        files: [{ uri: image, type: "image/jpeg" }],
        category: "image",
      },
    };

    const newUri = await umi.uploader.uploadJson(newMetadata);
    console.log("new metadata uri:", newUri);

    const tx = await update(umi, {
      asset: current_nft,
      name: "My Updated NFT",
      uri: newUri,
    }).sendAndConfirm(umi);

    console.log("signature:", base58.deserialize(tx.signature)[0]);

    const update_nft = await fetchAsset(umi, assetAddress);
    console.log("Updated name:", update_nft.name, "| uri:", update_nft.uri);
  } catch (error) {
    console.log(error);
  }
})();
