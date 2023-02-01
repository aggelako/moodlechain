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
 * Renderer for the gradebook overview report
 *
 * @package   gradereport_finalize
 * @copyright 2010 Sam Hemelryk
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

/**
 * Custom renderer for the user grade report
 *
 * To get an instance of this use the following code:
 * $renderer = $PAGE->get_renderer('gradereport_overview');
 *
 * @copyright 2010 Sam Hemelryk
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//$url = new moodle_url($CFG->wwwroot . '/grade/report/finalize/handleFinalize.php');
//$internal_url_finalize = $url->out();
require_once('../../../config.php');
require_once($CFG->libdir . '/csvlib.class.php');

// Get the current Moodle context
global $USER, $DB;
//if(isset($_POST['data'])) {
//$context = context_system::instance();
//
//// Get the current user ID
$userid = $USER->id;
$courseid = required_param('id', PARAM_INT);


//// Check if the current user has the required capability
//        if (!has_capability('gradereport/finalize:export', $context)) {
//            print_error('nopermissions', 'error', '', 'Export grades');
//        }

// Add a row to the gradereport_finalize_history table
$grades = $DB->get_records('grade_grades', array('id' => $courseid));
$record = new stdClass();
$record->userid = $userid;
$record->exportquery = 1;
$record->time = time();
$yo = $DB->insert_record('gradereport_finalize_history', $record);


$filename = clean_filename("grades");
$csvexport = new csv_export_writer();

$csvexport->set_filename($filename);
$header = array('Student id', 'Grade');
$csvexport->add_data($header);

foreach ($grades as $grade) {
    $student_id = $grade->userid;
    $student_grade = $grade->rawgrade;
    $data = array($student_id, $student_grade);
    $csvexport->add_data($data);
}
//$csvexport->download_file();


echo json_encode(['csvdata' => $csvexport]);
//}

// Show success notification
