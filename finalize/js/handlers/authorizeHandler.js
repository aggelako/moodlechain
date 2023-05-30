import accessContract from "../helpers/accessContract.js";
import { showTeacherPopUp, handleErrors } from "../helpers/popUpWindows.js"
$(document).ready(function () {
    $("#authorize_button").click(async function () {
        const courseId = $(this).data("courseId");
        const teachers = $(this).data("teachers");
        console.log("teachers: ", teachers);
        const [teacher, teacherName] = await showTeacherPopUp(teachers);
        console.log("teacher: ", teacher);
        const contract = await accessContract();
        console.log(teacher, parseInt(courseId));
        try {
            const response = await contract.addPermissions(teacher.toString(), parseInt(courseId));
            console.log(response);
            $.ajax({
                type: "POST",
                url: "handleFinalize.php",
                data: {
                    action: "authorizeTeacher",
                    teacherId: teacher,
                    courseId: courseId,
                },
                success: function (response) {
                    console.log(response);
                    alert("Grades added successfully", "success")
                },
                error: ((jqXHR, textStatus, errorThrown) => {
                    console.log(jqXHR, textStatus, errorThrown);
                    alert('Something went wrong', "error");
                })
            });
        }
        catch (err) {
            handleErrors(err);
            return;
        }

    });
});
