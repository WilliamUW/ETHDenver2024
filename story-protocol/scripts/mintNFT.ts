import { http, Address, createWalletClient, createPublicClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { sepolia } from 'viem/chains'

export async function mintNFT(): Promise<string> {
    console.log('Minting a new NFT...')
    const privateKeyEnv = process.env.WALLET_PRIVATE_KEY;
    if (typeof privateKeyEnv !== 'string') {
        throw new Error('WALLET_PRIVATE_KEY is not set in the environment variables.');
    }
    const privateKey = Buffer.from(privateKeyEnv, 'hex');
    const hexPrivateKey = `0x${privateKey.toString('hex')}`;
    
    const nftAddressEnv = process.env.MY_NFT_CONTRACT_ADDRESS;
    if (typeof nftAddressEnv !== 'string') {
        throw new Error('MY_NFT_CONTRACT_ADDRESS is not set in the environment variables.');
    }
    const nftAddress = Buffer.from(nftAddressEnv, 'hex');
    const hexNftAddress = `0x${nftAddress.toString('hex')}`;

    const account = privateKeyToAccount(hexPrivateKey as `0x${string}`);
    const walletClient = createWalletClient({
        account,
        chain: sepolia,
        transport: http(),
    })
    const publicClient = createPublicClient({
        chain: sepolia,
        transport: http()
    })
    const contractAbi = {
        inputs: [{ internalType: 'address', name: 'to', type: 'address' }],
        name: 'mint',
        outputs: [
            { internalType: 'uint256', name: 'tokenId', type: 'uint256' },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    }

    // 3. Mint an NFT to your account
    const { result } = await publicClient.simulateContract({
        address: hexNftAddress as Address,//process.env.MY_NFT_CONTRACT_ADDRESS as Address,
        functionName: 'safeMint',
        args: [account.address],
        abi: [contractAbi]
    })
    const hash = await walletClient.writeContract({
        address: process.env.MY_NFT_CONTRACT_ADDRESS as Address,
        functionName: 'safeMint',
        args: [account.address],
        abi: [contractAbi]
    })

    const tokenId = result!.toString();

    console.log(`Minted NFT successful with hash: ${hash}`);
    console.log(`Minted NFT tokenId: ${tokenId}`);

    return tokenId;
}