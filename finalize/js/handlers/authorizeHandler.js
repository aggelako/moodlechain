import displayNotification from "../helpers/displayNotifications.js"
import accessContract from "../helpers/accessContract.js";
import { showTeacherPopUp, handleErrors } from "../helpers/popUpWindows.js"
$(document).ready(function () {
    $("#authorize_button").click(async function () {
        const courseId = $(this).data("courseId");
        const teachers = $(this).data("teachers");
        console.log("teachers: ", teachers);
        const teacher = await showTeacherPopUp(teachers);
        console.log("teacher: ", teacher);
        const contract = await accessContract();
        console.log(teacher, parseInt(courseId));
        try {
            const response = await contract.addPermissions(teacher.toString(), parseInt(courseId));
            console.log(response);
        }
        catch (err) {
            handleErrors(err);
            return;
        }

    });
});
