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
require_once('../../../config.php');
require_once($CFG->dirroot . '/grade/lib.php');
require_once($CFG->dirroot . '/grade/report/grader/lib.php');
require_once($CFG->dirroot . '/grade/report/finalize/lib.php');

$courseid = required_param('id', PARAM_INT);
$userid   = optional_param('userid', $USER->id, PARAM_INT);
$page = optional_param('page', 0, PARAM_INT);
$edit          = optional_param('edit', -1, PARAM_BOOL); // sticky editting mode
$sortitemid    = optional_param('sortitemid', 0, PARAM_ALPHANUMEXT);
$PAGE->set_url(new moodle_url($CFG->wwwroot . '/grade/report/finalize/index.php', array('id' => $courseid)));
$PAGE->requires->css('/grade/report/finalize/css/finalize_button.css', true);
$PAGE->set_pagelayout('report');
//needs update everytime we add a new string
$PAGE->requires->strings_for_js(array('buttonText','successMessage','errorMessage','popupMessage', 'formNotCompleted','completeForm','SchoolId','Semester','AcademicYear','SubmitButton','CancelButton'), 'gradereport_finalize');
// Basic access checks.
if (!$course = $DB->get_record('course', array('id' => $courseid))) {
    throw new \moodle_exception('invalidcourseid');
}
require_login($course);
$context = context_course::instance($course->id);

// The report object is recreated each time, save search information to SESSION object for future use.
if (isset($graderreportsifirst)) {
    $SESSION->gradereport["filterfirstname-{$context->id}"] = $graderreportsifirst;
}
if (isset($graderreportsilast)) {
    $SESSION->gradereport["filtersurname-{$context->id}"] = $graderreportsilast;
}
require_capability('gradereport/finalize:view', $context);
require_capability('moodle/grade:viewall', $context);

$gpr = new grade_plugin_return(
    array(
        'type' => 'report',
        'plugin' => 'finalize',
        'course' => $course,
        'page' => $page
    )
);

// last selected report session tracking
if (!isset($USER->grade_last_report)) {
    $USER->grade_last_report = array();
}
$USER->grade_last_report[$course->id] = 'grader';
$reportname = get_string('pluginname', 'gradereport_finalize');
// Do this check just before printing the grade header (and only do it once).
grade_regrade_final_grades_if_required($course);

// Print header
print_grade_page_head(
    $courseid,
    'report',
    'finalize',
    get_string('pluginname', 'gradereport_finalize') . ' - ' . $USER->firstname
    . ' ' . $USER->lastname,
    false
);
$report = new grade_report_grader_finalize($courseid, $gpr, $context, $page, $sortitemid);
// make sure separate group does not prevent view
if ($report->currentgroup == -2) {
    echo $OUTPUT->heading(get_string("notingroup"));
    echo $OUTPUT->footer();
    exit;
}
$warnings = [];
$isediting = has_capability('moodle/grade:edit', $context) && isset($USER->editing) && $USER->editing;
if ($isediting && ($data = data_submitted()) && confirm_sesskey()) {
    // Processing posted grades & feedback here.
    $warnings = $report->process_data($data);
}
$report->load_users();
$report->load_final_grades();
echo $report->group_selector;
$numusers = $report->get_numusers(true, true);
// User search
$url = new moodle_url('/grade/report/grader/index.php', array('id' => $course->id));
$firstinitial = $SESSION->gradereport["filterfirstname-{$context->id}"] ?? '';
$lastinitial  = $SESSION->gradereport["filtersurname-{$context->id}"] ?? '';
$totalusers = $report->get_numusers(true, false);
$renderer = $PAGE->get_renderer('core_user');
echo $renderer->user_search($url, $firstinitial, $lastinitial, $numusers, $totalusers, $report->currentgroupname);

//show warnings if any
foreach ($warnings as $warning) {
    echo $OUTPUT->notification($warning);
}
$studentsperpage = $report->get_students_per_page();
// Don't use paging if studentsperpage is empty or 0 at course AND site levels
if (!empty($studentsperpage)) {
    echo $OUTPUT->paging_bar($numusers, $report->page, $studentsperpage, $report->pbarurl);
}

$displayaverages = true;
if ($numusers == 0) {
    $displayaverages = false;
}

$reporthtml = $report->get_grade_table($displayaverages);
echo $reporthtml;
echo $OUTPUT->render_from_template('gradereport_finalize/button', array('buttonText'=>get_string('buttonText','gradereport_finalize'),'courseId' => $courseid,'grades'=>$report->get_finalize_toJson()));
if (!empty($studentsperpage) && $studentsperpage >= 20) {
    echo $OUTPUT->paging_bar($numusers, $report->page, $studentsperpage, $report->pbarurl);
}
echo $OUTPUT->footer();

