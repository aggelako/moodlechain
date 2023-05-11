function isAuthed(walletKey) {

    if (typeof window.ethereum !== 'undefined') {
        console.log("hasbulla")
        // window.ethereum.enable();
        console.log(ethereum.request({ method: 'eth_requestAccounts' }))
    }
    else {
        console.log(ethereum.request({ method: 'eth_requestAccounts' }))
    }

    console.log("checking to auth key:", walletKey);
    return true;
}
export default isAuthed;