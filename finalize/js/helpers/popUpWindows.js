import displayNotification from "./displayNotifications.js";

function getExtraDataPopUp(courseId, jsonData) {
    return new Promise((resolve) => {
        Swal.fire({
            title: M.str.gradereport_finalize.completeForm,
            html:
                '<label for="school-id-input">School ID:</label>' +
                '<input id="school-id-input" class="swal2-input" type="text" name="schoolId" required>' +
                '<label for="semester-input">Semester:</label>' +
                '<select id="semester-input" class="swal2-input" name="semester" required>' +
                '<option value="">Select Semester</option>' +
                '<option value="1">1</option>' +
                '<option value="2">2</option>' +
                '<option value="3">3</option>' +
                '<option value="4">4</option>' +
                '<option value="5">5</option>' +
                '<option value="6">6</option>' +
                '<option value="7">7</option>' +
                '<option value="8">8</option>' +
                '<option value="9">9</option>' +
                '<option value="10">10</option>' +
                '</select>' +
                '<label for="academic-year-input">Academic Year:</label>' +
                '<select id="academic-year-input" class="swal2-input" name="academicYear" required>' +
                '<option value="">Select Academic Year</option>' +
                '</select>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: M.str.gradereport_finalize.SubmitButton,
            cancelButtonText: M.str.gradereport_finalize.CancelButton,
            preConfirm: () => {
                // Retrieve the input values from the popup
                const schoolId = Swal.getPopup().querySelector('#school-id-input').value;
                const semester = Swal.getPopup().querySelector('#semester-input').value;
                const academicYear = Swal.getPopup().querySelector('#academic-year-input').value;
                let isValid = true;
                if (!schoolId) {
                    Swal.getPopup().querySelector('#school-id-input').classList.add('swal2-inputerror');
                    isValid = false;
                } else {
                    Swal.getPopup().querySelector('#school-id-input').classList.remove('swal2-inputerror');
                }
                if (!semester) {
                    Swal.getPopup().querySelector('#semester-input').classList.add('swal2-inputerror');
                    isValid = false;
                } else {
                    Swal.getPopup().querySelector('#semester-input').classList.remove('swal2-inputerror');
                }
                if (!academicYear) {
                    Swal.getPopup().querySelector('#academic-year-input').classList.add('swal2-inputerror');
                    isValid = false;
                } else {
                    Swal.getPopup().querySelector('#academic-year-input').classList.remove('swal2-inputerror');
                }
                //Validate the input values
                if (!isValid) {
                    Swal.showValidationMessage(M.str.gradereport_finalize.formNotCompleted);
                }
                // Return an object with the input values
                return { schoolId, semester, academicYear };
            },
        }).then((result) => {

            if (result.isConfirmed && result.value) {
                resolve(confirmationPopUp(result, courseId, jsonData));
            }
        }).catch((err) => {
            onFailure(err);
        });

        const academicYearSelect = document.querySelector('#academic-year-input');
        for (let i = 1980; i <= new Date().getFullYear() + 1; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.text = i;
            academicYearSelect.appendChild(option);
        }
    });
}
function confirmationPopUp(result, courseId, jsonData) {
    return new Promise((resolve) => {
        Swal.fire({
            title: M.str.gradereport_finalize.popupMessage,
            html:
                '<label>School ID:</label><span>' + result.value.schoolId + '</span><br>' +
                '<label>Semester:</label><span>' + result.value.semester + '</span><br>' +
                '<label>Academic Year:</label><span>' + result.value.academicYear + '</span><br>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then((confirmResult) => {
            resolve(formatJSONData(courseId, jsonData, result))
        });

    });
}
function selectActivitiesPopUp(activities) {
    return new Promise((resolve) => {
        // Create an HTML string with checkboxes for each object
        var html = "";
        for (var i = 0; i < activities.length; i++) {
            html += "<input type='checkbox' id='object-" + i + "' value='" + activities[i].name + "'>";
            html += "<label for='object-" + i + "'>" + activities[i].name + "</label><br>";
        }
        let gradingActivities = [];
        Swal.fire({
            title: "Select one or more objects",
            html: html,
            showCancelButton: true,
            confirmButtonText: "Submit",
            preConfirm: () => {
                // Get the selected objects from the checkboxes
                var selectedObjects = [];
                for (var i = 0; i < activities.length; i++) {
                    var checkbox = document.getElementById("object-" + i);
                    if (checkbox.checked) {
                        selectedObjects.push(activities[i]);
                    }
                }
                if (selectedObjects.length == 0) {
                    Swal.showValidationMessage("You must select at least one object");
                }
                return selectedObjects;
            }

        })
            .then((result) => {
                // Do something with the selected objects
                if (result.value && result.value.length > 0) {
                    gradingActivities = result.value.map(o => o.name);
                    console.log(gradingActivities);
                } else {
                    gradingActivities = [];
                }
                resolve(gradingActivities);

            });
    });
}

function showTeacherPopUp(teachers) {
    return new Promise((resolve) => {
        let teacherOptions = {};
        for (let i = 0; i < teachers.length; i++) {
            teacherOptions[teachers[i].id] = teachers[i].name;
        }

        // Display the SweetAlert dialog with a dropdown menu of teacher names
        Swal.fire({
            title: 'Select a teacher',
            input: 'select',
            inputOptions: teacherOptions,
            showCancelButton: true,
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(result.value, teacherOptions[result.value]);
            }
            else {
                resolve(false);
            }
        });
    });
}

function formatJSONData(courseId, jsonData, response) {
    const school = response.value.schoolId;
    const courseString = response.value.semester + "_" + response.value.academicYear + "_" + courseId.toString();
    console.log(jsonData);
    for (let i = 0; i < jsonData.length; i++) {
        jsonData[i].schoolId = school;
        jsonData[i].semesterYearCourse = courseString;
    }
    console.log(jsonData);
    return jsonData;
}//Function to display notification, to notify the user in case of success of failure

async function showIncotisencies(inconsistencies, semester, year, courseId) {
    let html = "";
    let icon = "";
    let title = "";

    if (inconsistencies.length == 0) {
        title = "No incotisencies found";
        icon = "success";
    }
    else {
        title = "Incotisencies found for course with id " + courseId + " on " + year + " grades!";
        html += "<link rel=\"stylesheet\" type=\"text/css\" href=\"css/table.css\">";
        html += "<table>\
        <thead>\
          <tr>\
            <th>Student name</th>\
            <th>Activity name</th>\
            <th>Grade on blockchain</th>\
            <th>Current grade</th>\
          </tr>\
        </thead>\
        <tbody>";
        for (let i = 0; i < inconsistencies.length; i++) {
            for (let j = 0; j < inconsistencies[i].length; j++) {
                html += "<tr>\
                <td class=\"name\">" + inconsistencies[i][j]["studentName"] + "</td>\
                <td class=\"name\">" + inconsistencies[i][j]["activityName"] + "</td>\
                <td>" + inconsistencies[i][j]["gradeInBlockchain"] + "</td>\
                <td>" + inconsistencies[i][j]["currentGrade"] + "</td>\
                </tr>";
            }
        }
        html += "</tbody>\
        </table>";
        icon = "error";
    }
    Swal.fire({
        title: title,
        html: html,
        icon: icon,
    });
}
function handleErrors(error) {
    if (error.info.error.code == -32603) {
        alert(error.info.error.data.message);
    }
    else if (error.info.error.code == 4001) {
        alert("You have rejected the transaction");
    }
    else {
        alert(error.info.error.message);
        console.log(error);
    }
    return;
}

export { getExtraDataPopUp, selectActivitiesPopUp, showTeacherPopUp, showIncotisencies, handleErrors };