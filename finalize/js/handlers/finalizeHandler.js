import accessContract from "../helpers/accessContract.js";
import { getExtraDataPopUp, handleErrors, showLoading, hideLoading } from "../helpers/popUpWindows.js"

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
            showLoading();
            const response = await contract.addGrades(userId.toString(), parseInt(courseId), results, { gasLimit: 300000000 });
            console.log(response)
            $.ajax({
                type: "POST",
                url: "handleFinalize.php",
                data: {
                    action: "addGrades",
                    courseId: courseId,
                    schoolId: results[0].schoolId,
                    semesterYearCourse: results[0].semesterYearCourse,
                },
                success: function (response) {
                    hideLoading();
                    console.log(response);
                    alert("Grades added successfully", "success")
                },
                error: ((jqXHR, textStatus, errorThrown) => {
                    hideLoading();
                    console.log(jqXHR, textStatus, errorThrown);
                    alert('Something went wrong', "error");
                })
            });
        }
        catch (err) {
            console.log(err)
            handleErrors(err);
            return;
        }
    });
});
