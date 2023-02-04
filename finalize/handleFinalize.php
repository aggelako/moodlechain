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
//Isws xreiastei sto neo moodle installation, to $url->out
//$url = new moodle_url($CFG->wwwroot . '/grade/report/finalize/handleFinalize.php');
//$internal_url_finalize = $url->out();
require_once('../../../config.php');
require_once($CFG->libdir . '/csvlib.class.php');

// Get the current Moodle context
global $USER, $DB;
$userid = $USER->id;
$courseid = required_param('id', PARAM_INT);

//Add a row to log the finalize event
$grades = $DB->get_records('grade_grades', array('id' => $courseid));
$record = new stdClass();
$record->userid = $userid;
$record->courseid = $courseid;
$record->exportquery = 1;
$record->time = time();
$DB->insert_record('gradereport_finalize_history', $record);



