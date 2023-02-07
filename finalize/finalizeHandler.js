$(document).ready(function () {
    $("#finalize_button").click(function () {
        const courseId = $(this).data("courseId");
        const jsonData = $(this).data("grades");

        Swal.fire({
            title: 'Are you sure you want to finalize?',
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

        function handleSuccess(response) {
            const csvData = formatCSVData(jsonData);
            downloadCSV(csvData);
            displayNotification("Grades have been exported successfully!!", "success");
        }

        function handleError(xhr, status, error) {
            console.error("An error occurred: " + error);
            displayNotification("Something went wrong", "error");
        }

        function formatCSVData(jsonData) {
            let csvData = ["userid", "courseid", "time"].join(",") + "\n";
            csvData += [jsonData[0].userid, jsonData[0].courseid, jsonData[0].time].join(",") + "\n";
            csvData += ["username", "activity_name", "grade"].join(",") + "\n";
            csvData += jsonData[0].grades.map(function(grade) {
                return [grade.username, grade.activity_name, grade.rawgrade].join(",");
            }).join("\n");

            return csvData;
        }

        function downloadCSV(csvData) {
            const blob = new Blob([csvData], { type: "text/csv" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "grade_data.csv";
            link.click();
        }

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

