import { ethermint } from "@oraichain/proto";

const main = async () => {
    const queryClient = await ethermint.ClientFactory.createRPCQueryClient({
        rpcEndpoint: "https://testnet-v2.rpc.orai.io/",
    });

    const res = await queryClient.ethermint.evm.v1.mappedCosmosAddress({
        evmAddress: "0x082b97a6Cc18de874A0c2C89D5FA2b185221D7E4",
    });
    console.log("res: ", res);
};

main();
