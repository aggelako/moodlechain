import { abi, address, network } from './contractConfig.js';
async function accessContract() {
    if (window.ethereum) {
        try {
            const result = await ethereum.request({ method: 'eth_requestAccounts' })
                .then((accounts) => console.log(accounts))
                .catch((err) => console.log(err));
            const provider = new ethers.BrowserProvider(window.ethereum)
            const providerNetwork = await provider.getNetwork();
            if (providerNetwork.chainId !== network.chainId) {
                console.log("Wrong network!", providerNetwork.chainId);
                return;
            }

            const signer = await provider.getSigner();
            const contract = new ethers.Contract(address, abi, signer);
            console.log(signer, provider, contract);
            return contract;
        }
        catch (err) {
            alert(err.message);
        }
    }
    else {
        alert("Please install MetaMask!");
    }
}
export default accessContract;