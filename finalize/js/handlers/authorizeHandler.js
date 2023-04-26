import walletKeyPopUp from "../helpers/walletKeyPopUp.js";
import displayNotification from "../helpers/displayNotifications.js"
$(document).ready(function () {
    $("#authorize_button").click(async function () {
        const courseId = $(this).data("courseId");
        const walletKey = $(this).data("walletKey");
        const isAuthed = await walletKeyPopUp(walletKey, courseId);
        console.log(isAuthed ? "user authorized" : "user not authorized");
        //function that handles, the data downloading, if we click yes on the dialog
        if (isAuthed) {
            console.log("check if user is master...")
        }
        else {
            displayNotification("Something went wrong or awaiting master approval", "error");
            console.log("User not authorized| either awaiting to be accepted by master, or other error occured");
        }
    });
});
