const address = "";
const abi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "teacherId",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "courseId",
                "type": "uint256"
            }
        ],
        "name": "addPermissions",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "teacherId",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "courseId",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "schoolId",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "semesterYearCourse",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "activityName",
                        "type": "string"
                    },
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "studentId",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "studentName",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "email",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "activityName",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "submittedOn",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "gradedBy",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "gradedOn",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "rawGrade",
                                "type": "string"
                            }
                        ],
                        "internalType": "struct Grades.Grade[]",
                        "name": "grades",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct Grades.CourseData[]",
                "name": "data",
                "type": "tuple[]"
            }
        ],
        "name": "addGrades",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "string",
                "name": "schoolId",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "semesterYearCourse",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "activityName",
                "type": "string"
            }
        ],
        "name": "getGrades",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "studentId",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "studentName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "email",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "activityName",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "submittedOn",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "gradedBy",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "gradedOn",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "rawGrade",
                        "type": "string"
                    }
                ],
                "internalType": "struct Grades.Grade[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
];
const network = {
    name: "..",
}

export { address, abi, network };