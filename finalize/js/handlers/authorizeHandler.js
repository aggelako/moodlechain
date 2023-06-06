import accessContract from "../helpers/accessContract.js";
import { showTeacherPopUp, handleErrors } from "../helpers/popUpWindows.js"
$(document).ready(function () {
    $("#authorize_button").click(async function () {
        const courseId = $(this).data("courseId");
        const teachers = $(this).data("teachers");
        const teacherId = await showTeacherPopUp(teachers);
        if (teacherId === false) {
            return alert(M.str.gradereport_finalize.genericFailure);
        }
        console.log(teachers[teacherId] + " selected for authorization, adding permissions...");
        const contract = await accessContract();
        try {
            const response = await contract.addPermissions(teacherId.toString(), parseInt(courseId));
            console.log("Permissions added, logging event on database...")
            $.ajax({
                type: "POST",
                url: "handleFinalize.php",
                data: {
                    action: "authorizeTeacher",
                    teacherId: teacherId,
                    courseId: courseId,
                },
                success: function (response) {
                    console.log("Event logged successfully");
                    alert(M.str.gradereport_finalize.authorizedSuccess);
                },
                error: ((jqXHR, textStatus, errorThrown) => {
                    console.log(jqXHR, textStatus, errorThrown);
                    alert(M.str.gradereport_finalize.genericFailure);
                })
            });
        }
        catch (err) {
            handleErrors(err);
            return;
        }

    });
});
