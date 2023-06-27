import accessContract from "../helpers/accessContract.js";
import { showTeacherPopUp, handleErrors } from "../helpers/popUpWindows.js"
$(document).ready(function () {
    $("#authorize_button").click(async function () {
        const courseId = $(this).data("courseId");
        const teachers = $(this).data("teachers");
        const teacherId = await showTeacherPopUp(teachers);
        if (teacherId === "dismissed") {
            alert(M.str.gradereport_moodlechain.formCancelation);
            return location.reload();

        }
        if (teacherId === false) {
            alert(M.str.gradereport_moodlechain.genericFailure);
            return location.reload();
        }
        console.log(teachers[teacherId] + " selected for authorization, adding permissions...");
        const contract = await accessContract();
        try {
            await contract.addPermissions(teacherId.toString(), parseInt(courseId));
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
                    alert(M.str.gradereport_moodlechain.authorizedSuccess);
                    return location.reload();
                },
                error: ((jqXHR, textStatus, errorThrown) => {
                    console.log(jqXHR, textStatus, errorThrown);
                    alert(M.str.gradereport_moodlechain.genericFailure);
                    return location.reload();
                })
            });
        }
        catch (err) {
            handleErrors(err);
            return location.reload();
        }

    });
});
