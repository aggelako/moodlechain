export async function showTeacherPopUp(teachers) {
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
            return result.value;
        }
        else {
            return false;
        }
    });
}