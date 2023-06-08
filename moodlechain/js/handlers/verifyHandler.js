import accessContract from "../helpers/accessContract.js";
import { getExtraDataPopUp, selectActivitiesPopUp, showIncotisencies, handleErrors, showLoading, hideLoading } from "../helpers/popUpWindows.js"
$(document).ready(function () {
    $("#verify_button").click(async function () {
        const courseId = $(this).data("courseId");
        const jsonData = $(this).data("grades");
        const activities = [];
        for (let i = 0; i < jsonData.length; i++) {
            activities.push({
                name: jsonData[i].activityName,
            })
        }
        const gradingActivities = await selectActivitiesPopUp(activities);
        if (gradingActivities === false) {
            return alert(M.str.gradereport_moodlechain.genericFailure);
        }
        console.log("Activities selected, retrieving grades from blockchain...");
        const results = await getExtraDataPopUp(courseId, jsonData);
        if (results === false) {
            return alert(M.str.gradereport_moodlechain.genericFailure);
        }
        const [semester, year, course] = results[0].semesterYearCourse.split("_");
        let objectToCompare = transformGrades(results);
        const contract = await accessContract();
        let incostisencies = [];
        showLoading();
        for (let i = 0; i < gradingActivities.length; i++) {
            try {
                const response = await contract.getGrades(results[0].schoolId.toString(), results[0].semesterYearCourse, gradingActivities[i].toString());

                if (response.length == 0) {
                    alert("No grades found");
                    return;
                }
                else {
                    incostisencies.push(compareGrades(response, objectToCompare[gradingActivities[i]]));
                }
            }
            catch (err) {
                hideLoading();
                console.log(err)
                handleErrors(err);
                return;
            }
        }
        console.log("Grades retrieved from blockchain, comparing...")
        hideLoading();
        showIncotisencies(incostisencies, semester, year, course);
        console.log("Grades verified, logging event on database...")
        $.ajax({
            type: "POST",
            url: "handleFinalize.php",
            data: {
                action: "verifyGrades",
                courseId: courseId,
                schoolId: results[0].schoolId,
                semesterYearCourse: results[0].semesterYearCourse,
            },
            success: function (response) {
                console.log("Event logged successfully");
            },
            error: ((jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR, textStatus, errorThrown);
            })
        });
    });
});


function transformGrades(finalizedObject) {
    let objectToCompare = {};
    for (let i = 0; i < finalizedObject.length; i++) {
        objectToCompare[finalizedObject[i].activityName] = {};
        for (let j = 0; j < finalizedObject[i].grades.length; j++) {
            objectToCompare[finalizedObject[i].activityName][finalizedObject[i].grades[j].studentId] = finalizedObject[i].grades[j].rawGrade;
        }
    }
    return objectToCompare;
}


function compareGrades(grades, finalizedObject) {
    const incostisencies = [];
    for (let i = 0; i < grades.length; i++) {
        let studentId = grades[i][0];
        let studentName = grades[i][1];
        let activityName = grades[i][3];
        let grade = grades[i][7];
        if (finalizedObject[studentId] != grade) {
            incostisencies.push({ 'studentName': studentName, 'activityName': activityName, 'gradeInBlockchain': grade, 'currentGrade': finalizedObject[studentId] });
        }
    }
    return incostisencies;
}
