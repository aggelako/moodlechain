import displayNotification from "./displayNotifications.js";
function getExtraDataPopUp(courseId, jsonData) {
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
            confirmationPopUp(result, courseId, jsonData);
        }
    });
    const academicYearSelect = document.querySelector('#academic-year-input');
    for (let i = 1980; i <= new Date().getFullYear() + 1; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        academicYearSelect.appendChild(option);
    }
}
function confirmationPopUp(result, courseId, jsonData) {
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
        if (confirmResult.value) {
            $.ajax({
                type: "POST",
                url: "handleFinalize.php",
                data: {
                    id: courseId,
                    school_id: result.value.schoolId,
                    semester: result.value.semester,
                    academic_year: result.value.academicYear
                },
                success: handleSuccess(result, courseId, jsonData),
                error: handleError
            });
        }
    });

}
function handleSuccess(response, courseId, jsonData) {
    const data = formatJSONData(courseId, jsonData, response);
    console.log(data[0].grades);
    displayNotification(M.str.gradereport_finalize.successMessage, "success");
}

//function that handles the error, if there is one after the button is pressed
function handleError(xhr, status, error) {
    console.error("An error occurred: " + error);
    displayNotification(M.str.gradereport_finalize.errorMessage, "error");
}

function formatJSONData(courseId, jsonData, response) {
    let newObj = [];
    for (let key in jsonData[0].grades) {
        if (jsonData[0].grades.hasOwnProperty(key)) {
            var oldArray = jsonData[0].grades[key];
            jsonData[0].grades[key] = {};
            jsonData[0].grades[key].user = jsonData[0].userid;
            jsonData[0].grades[key].time = jsonData[0].time;
            jsonData[0].grades[key].grades = oldArray;
            jsonData[0].grades[key].courseId = courseId;
            jsonData[0].grades[key].schoolId = response.value.schoolId;
            jsonData[0].grades[key].semester = response.value.semester;
            jsonData[0].grades[key].academicYear = response.value.academicYear;

            const school = response.value.schoolId;
            const courseString = response.value.semester + "_" + response.value.academicYear + "_" + courseId.toString();
            const activityId = key;
            let values = [];
            for (const obj of oldArray) {
                values.push(Object.values(obj));
            }
            newObj.push([school, courseString, activityId, values]);
        }
    }
    console.log(newObj);
    return jsonData;
}//Function to display notification, to notify the user in case of success of failure


export default getExtraDataPopUp;