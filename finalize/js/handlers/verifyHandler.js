import accessContract from "../helpers/accessContract.js";
import { getExtraDataPopUp, selectActivitiesPopUp } from "../helpers/popUpWindows.js"
$(document).ready(function () {
    $("#verify_button").click(async function () {
        const courseId = $(this).data("courseId");
        const jsonData = $(this).data("grades");
        console.log(jsonData);
        const activities = [];
        for (let key in jsonData[0].grades) {
            activities.push({
                name: key,
            })
        }
        const gradingActivities = await selectActivitiesPopUp(activities);
        console.log(gradingActivities);
        const results = await getExtraDataPopUp(courseId, jsonData);
        console.log(results);
        const contract = await accessContract();
        for (let i = 0; i < gradingActivities.length; i++) {
            console.log(typeof (results[0].schoolId), typeof (results[0].semesterYearCourse), typeof (gradingActivities[i]));
            const response = await contract.getGrades(results[0].schoolId.toString(), results[0].semesterYearCourse, gradingActivities[i].toString());
            console.log(response);
        }

    });
});
