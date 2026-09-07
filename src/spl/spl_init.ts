import {
  appendTransactionMessageInstruction,
  appendTransactionMessageInstructions,
  assertIsTransactionMessageWithBlockhashLifetime,
  assertIsTransactionWithBlockhashLifetime,
  createKeyPairSignerFromBytes,
  createSolanaRpc,
  createSolanaRpcSubscriptions,
  createTransactionMessage,
  generateKeyPairSigner,
  getSignatureFromTransaction,
  sendAndConfirmTransactionFactory,
  setTransactionMessageFeePayerSigner,
  setTransactionMessageLifetimeUsingBlockhash,
  signTransactionMessageWithSigners,
} from "@solana/kit";
import {
  getInitializeMintInstruction,
  getMintSize,
  TOKEN_PROGRAM_ADDRESS,
} from "@solana-program/token";
import { getCreateAccountInstruction } from "@solana-program/system";

//import your wallet
import wallet from "../../devnet-wallet.json";

const rpc = createSolanaRpc(
  process.env.SOLANA_RPC_URL ?? "https://api.devnet.solana.com",
);

const rpcSubscriptions = createSolanaRpcSubscriptions(
  "wss://api.devnet.solana.com",
);

(async () => {
  try {
    const my_wallet = await createKeyPairSignerFromBytes(
      new Uint8Array(wallet),
    );
    const mint = await generateKeyPairSigner();

    console.log("Wallet Address:", my_wallet.address);
    console.log("Mint address:", mint.address);

    const mint_size = getMintSize();
    console.log(mint_size);
    const rent = await rpc
      .getMinimumBalanceForRentExemption(BigInt(mint_size))
      .send();
    console.log("Rent:", rent);

    const createMintAccount = getCreateAccountInstruction({
      payer: my_wallet,
      newAccount: mint,
      lamports: rent,
      space: mint_size,
      programAddress: TOKEN_PROGRAM_ADDRESS,
    });

    console.log("program:", createMintAccount.programAddress);
    console.log("accounts:", createMintAccount.accounts.length);

    const initializeMint = getInitializeMintInstruction({
      mint: mint.address,
      decimals: 6,
      mintAuthority: my_wallet.address,
    });

    console.log("program:", initializeMint.programAddress);
    console.log("accounts:", initializeMint.accounts.length);

    const { value: latestBlockhash } = await rpc.getLatestBlockhash().send();

    const message = createTransactionMessage({ version: 0 });
    const messageWithPayer = setTransactionMessageFeePayerSigner(
      my_wallet,
      message,
    );

    const messageWithLifetime = setTransactionMessageLifetimeUsingBlockhash(
      latestBlockhash,
      messageWithPayer,
    );

    const finalMessage = appendTransactionMessageInstructions(
      [createMintAccount, initializeMint],
      messageWithLifetime,
    );

    console.log("instructions:", finalMessage.instructions.length);

    const signedTx = await signTransactionMessageWithSigners(finalMessage);
    assertIsTransactionWithBlockhashLifetime(signedTx);
    const signature = getSignatureFromTransaction(signedTx);
    console.log("signature:", signature);
    const sendAndConfirm = sendAndConfirmTransactionFactory({
      rpc,
      rpcSubscriptions,
    });
    await sendAndConfirm(signedTx, { commitment: "confirmed" });

    console.log("mint created:", mint.address);
  } catch (error) {
    console.log(error);
  }
})();
