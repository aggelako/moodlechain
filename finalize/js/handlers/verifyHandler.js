import accessContract from "../helpers/accessContract.js";
import { getExtraDataPopUp, selectActivitiesPopUp, showIncotisencies, handleErrors } from "../helpers/popUpWindows.js"
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
        const [semester, year, course] = results[0].semesterYearCourse.split("_");
        let objectToCompare = transformGrades(results);
        const contract = await accessContract();
        let incostisencies = [];
        for (let i = 0; i < gradingActivities.length; i++) {
            console.log(typeof (results[0].schoolId), typeof (results[0].semesterYearCourse), typeof (gradingActivities[i]));
            try {
                const response = await contract.getGrades(results[0].schoolId.toString(), results[0].semesterYearCourse, gradingActivities[i].toString());
                console.log(response);

                if (response.length == 0) {
                    alert("No grades found");
                    return;
                }
                else {
                    incostisencies.push(compareGrades(response, objectToCompare[gradingActivities[i]]));
                }
            }
            catch (err) {
                handleErrors(err);
                return;
            }
        }
        console.log(incostisencies);
        showIncotisencies(incostisencies, semester, year, course);

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
        let studentName = grades[i][1];
        let activityName = grades[i][3];
        let grade = grades[i][7];
        console.log(studentId, grade, finalizedObject[studentId]);
        if (finalizedObject[studentId] != grade) {
            incostisencies.push({ 'studentName': studentName, 'activityName': activityName, 'gradeInBlockchain': grade, 'currentGrade': finalizedObject[studentId] });
        }
    }
    return incostisencies;
}