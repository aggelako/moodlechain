import isAuthed from "./accessControlMetamask.js";
async function walletKeyPopUp(walletKey, courseId) {
    const saved = true;
    if (walletKey.length < 2) {
        const result = await Swal.fire({
            title: "Provide your wallet key",
            input: 'text',
            inputPlaceholder: 'Enter your wallet key',
            inputAttributes: {
                autocapitalize: 'off'
            },
            showCancelButton: true,
            confirmButtonText: 'Submit',
            showLoaderOnConfirm: true,
            preConfirm: (walletKey) => {
                if (!walletKey || walletKey.length < 2) {
                    Swal.showValidationMessage(`Please provide your wallet key`);
                }
            },
            allowOutsideClick: () => !Swal.isLoading(),
        }).then((result) => {
            if (result.isConfirmed) {
                const saved = $.ajax({
                    url: 'setWalletConfigs.php',
                    type: "POST",
                    data: {
                        id: courseId,
                        walletKey: result.value,
                    },
                    success: function (response) {
                        walletKey = result.value;
                        return true;
                    },
                    error: function (response) {
                        return false;
                    }
                });
                return saved;
            }
        });
    }
    //metamask
    const authorized = isAuthed(walletKey);
    return saved && authorized;
}

export default walletKeyPopUp;