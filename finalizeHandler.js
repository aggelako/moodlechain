$(document).ready(function () {
    $("#finalize_button").click(function () {
        const courseId = $(this).data("courseId");

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
                        var csvData = 'data:text/csv;charset=utf-8,' + encodeURI(response.csvdata);
                        var link = document.createElement('a');
                        link.setAttribute('href', csvData);
                        link.setAttribute('download', 'grades.csv');
                        link.click();
                        console.log("The button was pressed and the request was successful.");
                        console.log(response);
                        require(['core/notification'], function(notification) {
                            notification.addNotification({
                                message: "Grades have been exported successfully!",
                                type: "success"
                            });
                        });

                    },
                    error: function(xhr, status, error) {
                        console.error("An error occurred: " + error);
                    }

                });

            }
        });
    });
});
