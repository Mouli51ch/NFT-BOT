// contractUtils.ts
import { ethers } from 'ethers';
import { FLOW_EVM_CONFIG } from '@/lib/config';

const contractABI = [
    "function mintNFT(address to, string memory uri) external",
];

export async function mintNFT(provider: ethers.providers.Web3Provider, to: string) {
    try {
        const signer = provider.getSigner();
        const contract = new ethers.Contract(FLOW_EVM_CONFIG.contractAddress, contractABI, signer);

        // Mint with a dummy URI and manual gas limit
        const transaction = await contract.mintNFT(to, "https://ipfs.example.com/dummy", {
            gasLimit: 300000
        });
        
        const receipt = await transaction.wait();
        return receipt;
    } catch (error) {
        console.error('Error minting:', error);
        throw error;
    }
}