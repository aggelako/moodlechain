import walletKeyPopUp from "../helpers/walletKeyPopUp.js";
import getExtraDataPopUp from "../helpers/gradesToBlockchain.js"
//Event handler for finalize grades button click
$(document).ready(function () {
    $("#finalize_button").click(async function () {
        const courseId = $(this).data("courseId");
        const jsonData = $(this).data("grades");
        const walletKey = $(this).data("walletKey");

        const isAuthed = await walletKeyPopUp(walletKey, courseId);
        console.log(isAuthed ? "user authorized" : "user not authorized");
        //function that handles, the data downloading, if we click yes on the dialog
        if (isAuthed) {
            getExtraDataPopUp(courseId, jsonData);
        }
        else {
            console.log("User not authorized| either awaiting to be accepted by master, or other error occured");
        }

    });
});

