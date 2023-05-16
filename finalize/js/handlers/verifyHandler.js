import accessContract from "../helpers/accessContract.js";
import { getExtraDataPopUp, selectActivitiesPopUp } from "../helpers/popUpWindows.js"
$(document).ready(function () {
    $("#verify_button").click(async function () {
        const courseId = $(this).data("courseId");
        const jsonData = $(this).data("grades");
        console.log(jsonData);
        const activities = [];
        for (let i = 0; i < jsonData.length; i++) {
            activities.push({
                name: jsonData[i].activityName,
            })
        }
        const gradingActivities = await selectActivitiesPopUp(activities);
        console.log(gradingActivities);
        const results = await getExtraDataPopUp(courseId, jsonData);
        console.log(results);
        let objectToCompare = transformGrades(results);
        const contract = await accessContract();
        for (let i = 0; i < gradingActivities.length; i++) {
            console.log(typeof (results[0].schoolId), typeof (results[0].semesterYearCourse), typeof (gradingActivities[i]));
            const response = await contract.getGrades(results[0].schoolId.toString(), results[0].semesterYearCourse, gradingActivities[i].toString());
            console.log(response);
            if (response.length == 0) {
                alert("No grades found");
                return;
            }
            else {
                let incostisencies = compareGrades(response, objectToCompare[gradingActivities[i]]);
                if (incostisencies.length == 0) {
                    alert("No incostisencies");
                    return;
                }
                else {
                    alert("Incostisencies found");
                    return;
                }
            }
        }

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
    console.log(objectToCompare);
    return objectToCompare;
}


function compareGrades(grades, finalizedObject) {
    console.log(grades, finalizedObject)
    const incostisencies = [];
    for (let i = 0; i < grades.length; i++) {
        let studentId = grades[i][0];
        let grade = grades[i][7];
        console.log(studentId, grade, finalizedObject[studentId]);
        if (finalizedObject[studentId] != grade) {
            incostisencies.push({ 'gradeInBlockchain': grades[i], 'currentGrade': finalizedObject[studentId] });
        }
    }
    return incostisencies;
}