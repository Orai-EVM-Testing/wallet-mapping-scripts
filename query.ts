import { makeCosmoshubPath } from "@cosmjs/amino";
import { defaultRegistryTypes, GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { DirectSecp256k1HdWallet, DirectSecp256k1Wallet } from "@cosmjs/proto-signing";
import "dotenv/config";
import { getSigningEthermintClient } from "@oraichain/proto";
import { ethermint, getSigningEthermintClientOptions } from "@oraichain/proto";

const main = async () => {
    const chainInfo = {
        chainId: "Oraichain",
        rpcEndpoint: "https://testnet-v2.rpc.orai.io/",
        prefix: "orai",
        gasPrice: GasPrice.fromString("0.002orai"),
        feeToken: "orai",
        faucetUrl: "https://faucet.orai.io/",
    };

    // Setup signer
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
        throw new Error("Missing private key");
    }

    const wallet = await DirectSecp256k1Wallet.fromKey(Buffer.from(privateKey, "hex") as any, "orai");

    const { address } = (await wallet.getAccounts())[0];
    console.log(`Connected to ${address}`);

    const { registry, aminoTypes } = getSigningEthermintClientOptions({
        defaultTypes: defaultRegistryTypes,
    });

    const client = await getSigningEthermintClient({
        rpcEndpoint: "https://testnet-v2.rpc.orai.io/",
        signer: wallet,
        gasPrice: GasPrice.fromString("0.002orai"),
    });

    const balance = await client.getBalance(address, chainInfo.feeToken);
    console.log("balance: ", balance);

    const { fromPartial, typeUrl } = ethermint.evm.v1.QueryMappedEvmAddressRequest;
    const msg = {
        typeUrl,
        value: fromPartial({
            cosmosAddress: "orai1z6kh6rmq9zr7av7ye6rfv09yglwu0875gc94ru", // address of the private key
        }),
    };
    console.log(" fetching evm address");
    const txRes = await client.signAndBroadcast(address, [msg], 10000, "Create EVM mapping");
    console.log(txRes);
};

main();
