import accessContract from "../helpers/accessContract.js";
import { getExtraDataPopUp, handleErrors } from "../helpers/popUpWindows.js"

//Event handler for finalize grades button click
$(document).ready(function () {
    $("#finalize_button").click(async function () {
        const courseId = $(this).data("courseId");
        const jsonData = $(this).data("grades");
        const userId = $(this).data("userId");
        const results = await getExtraDataPopUp(courseId, jsonData);
        console.log(results);
        const contract = await accessContract();
        console.log(userId, parseInt(courseId), results);
        try {
            const response = await contract.addGrades(userId.toString(), parseInt(courseId), results);
            console.log(response)
        }
        catch (err) {
            handleErrors(err);
            return;
        }
    });
});
