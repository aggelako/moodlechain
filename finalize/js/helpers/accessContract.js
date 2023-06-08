import { abi, address, network } from './contractConfig.js';
async function accessContract() {
    if (window.ethereum) {
        try {
            await ethereum.request({ method: 'eth_requestAccounts' })
                .then((accounts) => accounts[0])
                .catch((err) => console.log(err));
            const provider = new ethers.BrowserProvider(window.ethereum)
            const providerNetwork = await provider.getNetwork();
            if (providerNetwork.chainId !== network.chainId) {
                console.log(M.str.gradereport_finalize.wrongNetwork, providerNetwork.chainId);
                return;
            }

            const signer = await provider.getSigner();
            const contract = new ethers.Contract(address, abi, signer);
            console.log(M.str.gradereport_finalize.connectedToContract);
            return contract;
        }
        catch (err) {
            alert(err.message);
        }
    }
    else {
        alert(M.str.gradereport_finalize.metamaskNotInstalled);
    }
}
export default accessContract;