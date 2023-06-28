// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

contract Grades {
    address masterUser;

    //mapping from course teacher id to list of courses he is authorized for
    mapping(string => uint[]) teacherPermissions;

    //function for master to add teacherPermissions;

    function addPermissions(string memory teacherId, uint courseId) public {
        require(
            msg.sender == masterUser,
            "You dont have permission to do that"
        );
        teacherPermissions[teacherId].push(courseId);
    }

    constructor() {
        masterUser = msg.sender;
    }

    struct Grade {
        string studentId;
        string studentName;
        string email;
        string activityName;
        string submittedOn;
        string gradedBy;
        string gradedOn;
        string rawGrade;
    }

    struct CourseData {
        string schoolId;
        string semesterYearCourse;
        string activityName;
        Grade[] grades;
    }
    //schoolId->semester_year_course->activityName->grades Object
    mapping(string => mapping(string => mapping(string => Grade[][]))) activityGrades;

    function addGrades(
        string memory teacherId,
        uint courseId,
        CourseData[] memory data
    ) public {
        require(
            hasPermissions(teacherId, courseId) || msg.sender == masterUser,
            "You have no permissions on this course, contact admin"
        );

        for (uint i = 0; i < data.length; i++) {
            uint latest = activityGrades[data[i].schoolId][
                data[i].semesterYearCourse
            ][data[i].activityName].length;
            activityGrades[data[i].schoolId][data[i].semesterYearCourse][
                data[i].activityName
            ].push();
            for (uint j = 0; j < data[i].grades.length; j++) {
                activityGrades[data[i].schoolId][data[i].semesterYearCourse][
                    data[i].activityName
                ][latest].push(data[i].grades[j]);
            }
        }
    }

    function hasPermissions(
        string memory teacherId,
        uint courseId
    ) internal view returns (bool) {
        bool exists = false;
        for (uint i = 0; i < teacherPermissions[teacherId].length; i++) {
            if (teacherPermissions[teacherId][i] == courseId) {
                exists = true;
            }
        }
        return exists;
    }

    function getGrades(
        string memory schoolId,
        string memory semesterYearCourse,
        string memory activityName
    ) public view returns (Grade[] memory) {
        require(
            activityGrades[schoolId][semesterYearCourse][activityName].length >
                0,
            "No grades were found"
        );
        uint latest = activityGrades[schoolId][semesterYearCourse][activityName]
            .length - 1;
        return
            activityGrades[schoolId][semesterYearCourse][activityName][latest];
    }
}
