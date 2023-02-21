//Event handler for finalize grades button click
$(document).ready(function () {
    $("#finalize_button").click(function () {
        const courseId = $(this).data("courseId");
        const jsonData = $(this).data("grades");
        console.log(jsonData);
        Swal.fire({
            title: 'Enter Details',
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
            confirmButtonText: 'Submit',
            cancelButtonText: 'Cancel',
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
                    Swal.showValidationMessage(`Please fill in all the fields`);
                }
                // Return an object with the input values
                return {schoolId, semester, academicYear};
            },
        }).then((result) => {
            if(result.isConfirmed && result.value) {
                Swal.fire({
                    title: 'Are you sure you want to submit',
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
                            success: handleSuccess(result),
                            error: handleError
                        });
                    }
                });
            }
        });
        // Dynamically generate the options for the Academic Year field
        const academicYearSelect = document.querySelector('#academic-year-input');
        for (let i = 1980; i <= new Date().getFullYear() + 1; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.text = i;
            academicYearSelect.appendChild(option);
        }

//function that handles, the data downloading, if we click yes on the dialog
        function handleSuccess(response) {
            const data = formatJSONData(jsonData,response);
            console.log(data[0].grades);
            // downloadCSV(csvData);
            displayNotification(M.str.gradereport_finalize.successMessage, "success");
        }
//function that handles the error, if there is one after the button is pressed
        function handleError(xhr, status, error) {
            console.error("An error occurred: " + error);
            displayNotification(M.str.gradereport_finalize.errorMessage, "error");
        }
        //in the following function i want to add fields to each key of the array grades inside jsonData
        function formatJSONData(jsonData, response) {
            console.log(jsonData[0].grades);
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
                }
            }
            return jsonData;
        }
//Function that formats the jsonData we received for the grades finalization, into readabale csv.
//         function formatCSVData(jsonData,response) {
//             let csvData = ["userid", "courseid", "time", "schoolId", "semester", "academic year"].join(",") + "\n";
//             csvData += [jsonData[0].userid, jsonData[0].courseid, jsonData[0].time, response.value.schoolId, response.value.semester, response.value.academicYear].join(",") + "\n";
//             csvData += ["username", "activity_name", "grade"].join(",") + "\n";
//             csvData += jsonData[0].grades.map(function(grade) {
//                 return [grade.username, grade.activity_name, grade.rawgrade].join(",");
//             }).join("\n");
//
//             return csvData;
//         }
//Function through which we download the csvdata in the previous made format
        function downloadCSV(csvData) {
            const blob = new Blob([csvData], { type: "text/csv" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "grade_data.csv";
            link.click();
        }
//Function to display notification, to notify the user in case of success of failure
        function displayNotification(message, type) {
            require(['core/notification'], function(notification) {
                notification.addNotification({
                    message: message,
                    type: type
                });
            });
        }
    });
});

