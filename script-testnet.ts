import * as cosmwasm from "@cosmjs/cosmwasm-stargate";
import { DirectSecp256k1HdWallet, DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import "dotenv/config";
import { toBase64, toHex } from "@cosmjs/encoding";
import { ethermint, getSigningEthermintClient } from "@oraichain/proto";
import { calculateFee, GasPrice } from "@cosmjs/stargate";

(async () => {
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("Missing private key");
    }

    const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(privateKey, "hex") as any, "orai");

    const [firstAccount] = await wallet.getAccounts();

    const { setMappingEvmAddress } = ethermint.evm.v1.MessageComposer.withTypeUrl;

    const msg = setMappingEvmAddress({
        signer: firstAccount.address,
        pubkey: toBase64(firstAccount.pubkey),
    });

    const client = await getSigningEthermintClient({
        rpcEndpoint: "https://testnet-v2.rpc.orai.io",
        signer: wallet,
    });

    const res = await client.signAndBroadcast(firstAccount.address, [msg], calculateFee(3000000, GasPrice.fromString("0.001orai")), "Create EVM mapping");
    console.log(res);
})();
