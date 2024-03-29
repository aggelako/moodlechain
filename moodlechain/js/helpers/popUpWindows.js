function getExtraDataPopUp(courseId, jsonData) {
    return new Promise((resolve) => {
        Swal.fire({
            title: M.str.gradereport_moodlechain.completeForm,
            html:
                '<label for="school-id-input">' + M.str.gradereport_moodlechain.schoolId + ':</label>' +
                '<input id="school-id-input" class="swal2-input" type="text" name="schoolId" required>' +
                '<label for="semester-input">' + M.str.gradereport_moodlechain.semester + ':</label>' +
                '<select id="semester-input" class="swal2-input" name="semester" required>' +
                '<option value="">' + M.str.gradereport_moodlechain.select + ' ' + M.str.gradereport_moodlechain.semester + '</option>' +
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
                '<label for="academic-year-input">' + M.str.gradereport_moodlechain.academicYear + ':</label>' +
                '<select id="academic-year-input" class="swal2-input" name="academicYear" required>' +
                '<option value="">' + M.str.gradereport_moodlechain.select + ' ' + M.str.gradereport_moodlechain.academicYear + '</option>' +
                '</select>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: M.str.gradereport_moodlechain.SubmitButton,
            cancelButtonText: M.str.gradereport_moodlechain.CancelButton,
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
                    Swal.showValidationMessage(M.str.gradereport_moodlechain.formNotCompleted);
                }
                // Return an object with the input values
                return { schoolId, semester, academicYear };
            },
        }).then((result) => {

            if (result.isConfirmed && result.value) {
                resolve(confirmationPopUp(result, courseId, jsonData));
            }
            else if (result.isDismissed) {
                resolve("dismissed");
            }
            else {
                resolve(false);
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
function confirmationPopUp(courseData, courseId, jsonData) {
    return new Promise((resolve) => {
        Swal.fire({
            title: M.str.gradereport_moodlechain.popupMessage,
            html:
                '<label>' + M.str.gradereport_moodlechain.schoolId + ':</label><span>' + courseData.value.schoolId + '</span><br>' +
                '<label>' + M.str.gradereport_moodlechain.semester + ':</label><span>' + courseData.value.semester + '</span><br>' +
                '<label>' + M.str.gradereport_moodlechain.academicYear + ':</label><span>' + courseData.value.academicYear + '</span><br>',
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonText: M.str.gradereport_moodlechain.Yes,
            cancelButtonText: M.str.gradereport_moodlechain.No,
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(formatJSONData(courseId, jsonData, courseData));
            }
            else if (result.isDismissed) {
                resolve("dismissed");
            }
            else {
                resolve(false)
            }
        });

    });
}
function selectActivitiesPopUp(activities) {
    return new Promise((resolve) => {
        // Create an HTML string with checkboxes for each object
        var html = "";
        html += "<link rel=\"stylesheet\" type=\"text/css\" href=\"css/styles.css\">";
        for (var i = 0; i < activities.length; i++) {
            html += "<input type='checkbox' id='object-" + i + "' value='" + activities[i].name + "'>";
            html += "<label for='object-" + i + "'>" + activities[i].name + "</label><br>";
        }
        Swal.fire({
            title: M.str.gradereport_moodlechain.chooseActivityForm,
            html: html,
            showCancelButton: true,
            confirmButtonText: M.str.gradereport_moodlechain.SubmitButton,
            cancelButtonText: M.str.gradereport_moodlechain.CancelButton,
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
                    Swal.showValidationMessage(M.str.gradereport_moodlechain.chooseActivityValidation);
                }
                return selectedObjects;
            }

        })
            .then((result) => {
                // Do something with the selected objects
                if (result.value && result.value.length > 0) {
                    resolve(result.value.map(o => o.name));
                }
                else if (result.isDismissed) {
                    resolve("dismissed");
                }
                else {
                    resolve(false);
                }
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
            title: M.str.gradereport_moodlechain.chooseTeacher,
            input: 'select',
            inputOptions: teacherOptions,
            showCancelButton: true,
            confirmButtonText: M.str.gradereport_moodlechain.SubmitButton,
            cancelButtonText: M.str.gradereport_moodlechain.CancelButton,
        }).then((result) => {
            if (result.isConfirmed) {
                resolve(result.value, teacherOptions[result.value]);
            }
            else if (result.isDismissed) {
                resolve("dismissed");
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
    for (let i = 0; i < jsonData.length; i++) {
        jsonData[i].schoolId = school;
        jsonData[i].semesterYearCourse = courseString;
    }
    return jsonData;
}//Function to display notification, to notify the user in case of success of failure

async function showIncotisencies(inconsistencies, semester, year, courseId) {
    let html = "";
    let icon = "";
    let title = "";

    if (inconsistencies[0].length == 0) {
        title = M.str.gradereport_moodlechain.verifySuccess;
        icon = "success";
    }
    else {
        title = M.str.gradereport_moodlechain.verifyFailure;
        html += "<link rel=\"stylesheet\" type=\"text/css\" href=\"css/table.css\">";
        html += "<table>\
        <thead>\
          <tr>\
            <th>"+ M.str.gradereport_moodlechain.studentName + "</th>\
            <th>"+ M.str.gradereport_moodlechain.activityName + "</th>\
            <th>"+ M.str.gradereport_moodlechain.gradeOnBlockchain + "</th>\
            <th>"+ M.str.gradereport_moodlechain.gradeOnMoodle + "</th>\
          </tr>\
        </thead>\
        <tbody>";
        for (let i = 0; i < inconsistencies.length; i++) {
            for (let j = 0; j < inconsistencies[i].length; j++) {
                let grade_1 = inconsistencies[i][j]["gradeInBlockchain"] || M.str.gradereport_moodlechain.missingGrade;
                let grade_2 = inconsistencies[i][j]["currentGrade"] || M.str.gradereport_moodlechain.missingGrade;
                html += "<tr>\
                <td class=\"name\">" + inconsistencies[i][j]["studentName"] + "</td>\
                <td class=\"name\">" + inconsistencies[i][j]["activityName"] + "</td>\
                <td>" + grade_1 + "</td>\
                <td>" + grade_2 + "</td>\
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
        width: 'auto',
        icon: icon,
    }).then((result) => {
        location.reload();
    });

}
function handleErrors(error) {
    try {


        if (error.error != undefined && error.error.code != undefined) {
            if (error.error.code == -32603) {
                alert(M.str.gradereport_moodlechain.noPermissionError);
                return
            }
        }
        else if (error.info.error != undefined && error.info.error.code != undefined) {
            if (error.info.error.code == 4001) {
                alert(M.str.gradereport_moodlechain.transactionRejected);
                return
            }
            else {
                alert(error.info.error.data.message);
                return
            }
        }
        else {
            alert(M.str.gradereport_moodlechain.genericFailure);
            console.log(error);
            return
        }
    }
    catch (e) {
        alert(M.str.gradereport_moodlechain.genericFailure);
        console.log(e);
        return
    }
}
function showLoading() {
    Swal.fire({
        title: M.str.gradereport_moodlechain.loading,
        allowOutsideClick: false,
        onBeforeOpen: () => {
            Swal.showLoading()
        }
    });
}

function hideLoading() {
    Swal.close();
}


export { getExtraDataPopUp, selectActivitiesPopUp, showTeacherPopUp, showIncotisencies, handleErrors, showLoading, hideLoading };