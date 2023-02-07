//Event handler for finalize grades button click
$(document).ready(function () {
    $("#finalize_button").click(function () {
        const courseId = $(this).data("courseId");
        const jsonData = $(this).data("grades");

        Swal.fire({
            title: M.str.gradereport_finalize.popupMessage,
            text: "",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'Cancel'
        }).then((result) => {
            if (result.value) {
                $.ajax({
                    type: "POST",
                    url: "handleFinalize.php",
                    data: { id: courseId },
                    success: handleSuccess,
                    error: handleError
                });
            }
        });
//function that handles, the data downloading, if we click yes on the dialog
        function handleSuccess(response) {
            const csvData = formatCSVData(jsonData);
            downloadCSV(csvData);
            displayNotification(M.str.gradereport_finalize.successMessage, "success");
        }
//function that handles the error, if there is one after the button is pressed
        function handleError(xhr, status, error) {
            console.error("An error occurred: " + error);
            displayNotification(M.str.gradereport_finalize.errorMessage, "error");
        }
//Function that formats the jsonData we received for the grades finalization, into readabale csv.
        function formatCSVData(jsonData) {
            let csvData = ["userid", "courseid", "time"].join(",") + "\n";
            csvData += [jsonData[0].userid, jsonData[0].courseid, jsonData[0].time].join(",") + "\n";
            csvData += ["username", "activity_name", "grade"].join(",") + "\n";
            csvData += jsonData[0].grades.map(function(grade) {
                return [grade.username, grade.activity_name, grade.rawgrade].join(",");
            }).join("\n");

            return csvData;
        }
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

