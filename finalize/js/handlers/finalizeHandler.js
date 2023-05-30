import accessContract from "../helpers/accessContract.js";
import { getExtraDataPopUp, handleErrors, showLoading, hideLoading } from "../helpers/popUpWindows.js"

//Event handler for finalize grades button click
$(document).ready(function () {
    $("#finalize_button").click(async function () {
        const courseId = $(this).data("courseId");
        const jsonData = $(this).data("grades");
        const userId = $(this).data("userId");
        const results = await getExtraDataPopUp(courseId, jsonData);
        const contract = await accessContract();
        console.log("Finalizing grades for course with id " + parseInt(courseId));
        try {
            showLoading();
            await contract.addGrades(userId.toString(), parseInt(courseId), results, { gasLimit: 300000000 });
            console.log("Transaction completed, logging event on database...")
            hideLoading();
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
                    console.log("Event logged successfully");
                    alert("Grades added successfully")
                },
                error: ((jqXHR, textStatus, errorThrown) => {
                    console.log(jqXHR, textStatus, errorThrown);
                    alert('Something went wrong');
                })
            });
        }
        catch (err) {
            hideLoading();
            console.log(err)
            handleErrors(err);
            return;
        }
    });
});
