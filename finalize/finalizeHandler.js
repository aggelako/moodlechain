$(document).ready(function () {
    $("#finalize_button").click(function () {
        // console.log($(this).data);
        const courseId = $(this).data("courseId");
        var jsonData = $(this).data("grades");
        console.log(jsonData);
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
                // Perform the action for "Yes" here

                $.ajax({
                    type: "POST",
                    url: "handleFinalize.php",
                    data: {id: courseId},
                    success: function(response) {
                        var csvData = ["userid", "courseid", "time"].join(",");
                        csvData += "\n";
                        csvData += [jsonData[0].userid, jsonData[0].courseid, jsonData[0].time].join(",");
                        csvData += "\n";
                        csvData += ["username", "activity_name", "grade"].join(",");
                        csvData += "\n";
                        csvData += jsonData[0].grades.map(function(grade) {
                            return [grade.username, grade.activity_name, grade.rawgrade].join(",");
                        }).join("\n");
                        var blob = new Blob([csvData],{type: "text/csv"});
                        var link = document.createElement("a");
                        link.href = URL.createObjectURL(blob);
                        link.download = "grade_data.csv";
                        link.click();
                        console.log("The button was pressed and the request was successful.");
                        require(['core/notification'], function(notification) {
                            notification.addNotification({
                                message: "Grades have been exported successfully!",
                                type: "success"
                            });
                        });

                    },
                    error: function(xhr, status, error) {
                        console.error("An error occurred: " + error);
                        require(['core/notification'], function(notification) {
                            notification.addNotification({
                                message: "Something went wrong",
                                type: "failure"
                            });
                        });
                    }

                });

            }
        });
    });
});
