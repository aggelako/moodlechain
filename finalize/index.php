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
$PAGE->set_url(new moodle_url($CFG->wwwroot . '/grade/report/finalize/index.php', array('id' => $courseid)));
$PAGE->requires->css('/grade/report/finalize/css/finalize_button.css', true);
$page = optional_param('page', 0, PARAM_INT);
$perpage = optional_param('perpage', 5, PARAM_INT);  // How many per page.
$baseurl = new moodle_url($CFG->wwwroot . '/grade/report/finalize/index.php', array('id' => $courseid, 'perpage' => $perpage));
// Basic access checks.
if (!$course = $DB->get_record('course', array('id' => $courseid))) {
    throw new moodle_exception('nocourseid');
}
require_login($course);
$PAGE->set_pagelayout('report');
$context = context_course::instance($course->id);
require_capability('gradereport/finalize:view', $context);
if (empty($userid)) {
    require_capability('moodle/grade:viewall', $context);
} else {
    if (!$DB->get_record('user', array('id' => $userid, 'deleted' => 0)) || isguestuser($userid)) {
        throw new moodle_exception('invaliduser');
    }
}
$access = false;
if (has_capability('moodle/grade:viewall', $context)) {
    // Ok - can view all course grades.
    $access = true;
} else if ($userid == $USER->id && has_capability('moodle/grade:view', $context) && $course->showgrades) {
    // Ok - can view own grades.
    $access = true;
} else if (has_capability('moodle/grade:viewall', context_user::instance($userid)) && $course->showgrades) {
    // Ok - can view grades of this quizanalytics- parent most probably.
    $access = true;
}

print_grade_page_head(
    $courseid,
    'report',
    'finalize',
    get_string('pluginname', 'gradereport_finalize') . ' - ' . $USER->firstname
    . ' ' . $USER->lastname
);
$gpr = new grade_plugin_return(
    array(
        'type' => 'report',
        'plugin' => 'finalize',
        'course' => $course,
        'page' => $page
    )
);
$sortitemid    = optional_param('sortitemid', 0, PARAM_ALPHANUMEXT);

$report = new grade_report_grader_finalize($courseid, $gpr, $context, $page, $sortitemid);
$numusers = $report->get_numusers(true, true);

$report->load_users();
$report->load_final_grades();
echo $report->group_selector;
$studentsperpage = $report->get_students_per_page();
// Don't use paging if studentsperpage is empty or 0 at course AND site levels
if (!empty($studentsperpage)) {
    echo $OUTPUT->paging_bar($numusers, $report->page, $studentsperpage, $report->pbarurl);
}

$displayaverages = true;
if ($numusers == 0) {
    $displayaverages = false;
}
//for($j=5; $j <= 10; $j++){
//    for( $i=1; $i <= 2; $i++){
//        echo implode($report->grades[$j][$i]," ");
//    }
//}
//var_dump($report->grades[3][2]->finalgrade);
//foreach($report->get_raw_grades() as $item){
//    var_dump($item["userid"], $item["activity_name"], $item["rawgrade"]);
//}
////var_dump($report->get_raw_grades());
//echo($report->get_finalize_toJson());
$reporthtml = $report->get_grade_table($displayaverages);
echo $reporthtml;
echo $OUTPUT->render_from_template('gradereport_finalize/button', array('courseId' => $courseid,'grades'=>$report->get_finalize_toJson()));
echo $OUTPUT->footer();

