<?php
// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 *
 * @package   gradereport_finalize
 * @author  Athanasios Angelakopoulos
 */
// Index.
$string['pluginname'] = 'Moodlechain';
$string['finalizeButtonText'] = 'Finalize grades';
$string['verifyButtonText'] = 'Verify grades';
$string['authorizeButtonText'] = 'Authorize teacher';
$string['popupMessage'] = 'Moodlechain - Are you sure you want to continue?';
$string['formNotCompleted'] = 'Make sure you complete all the required fields';
$string['completeForm'] = 'Moodlechain - Complete the form';
$string['SubmitButton'] = 'Submit';
$string['CancelButton'] = 'Cancel';
$string['chooseActivityForm'] = 'Choose one or more activities to verify';
$string['chooseActivityValidation'] = 'You must choose at least one activity!';
$string['chooseTeacher'] = 'Chose the teacher to authorize';
$string['finalizeSuccess'] = 'Moodlechain - Grades sent to blockchain successfully';
$string['verificationEnded'] = 'Moodlechain - Verification process ended!';
$string['verifySuccess'] =  $string['verificationEnded'] .'- No inconsistencies found!';
$string['verifyFailure'] = $string['verificationEnded'] . ' Inconsistencies found:';
$string['authorizedSuccess'] = 'Moodlechain - Teacher authorized successfully';
$string['genericFailure'] = 'Something went wrong';
$string['transactionRejected'] = 'You have rejected the transaction';
$string['connectedToContract'] = 'Successfully connected to contract';
$string['metamaskNotInstalled'] = 'Please install metamask or contact the administrator';
$string['loading'] = 'Loading...';
$string['wrongNetwork'] = 'Metamask account is connected to the wrong type of network!';
//for any other string to be used in the JS file, add it here and then add it to the index.php file as a parameter to the require to js call
?>