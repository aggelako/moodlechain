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
 * Version details for the quizanalytics gradebook report
 *
 * @package   gradereport_finalize
 * @author Moumita Adak <moumita.a@dualcube.com>
 * @copyright  Dualcube (https://dualcube.com)
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
//$url = new moodle_url('/var/www/html/moodle/grade/report/finalize/setWalletConfigs.php');
//$internal_url_finalize = $url->out();
require_once('../../../config.php');
require_once($CFG->dirroot . '/user/lib.php');
global $USER, $DB;
$walletKey = required_param('walletKey', PARAM_ALPHANUMEXT);
$USER->profile['wallet_address'] = $walletKey;
$user_update_result = $DB->update_record('user', $USER);
$courseid = required_param('id', PARAM_INT);

//Add a row to log the finalize event
$record = new stdClass();
$record->userid = $USER->id;
$record->courseid = $courseid;
$record->exportquery = 2;
$record->time = time();
$DB->insert_record('gradereport_finalize_history', $record);
if ($user_update_result) {
    echo "success";
} else {
    echo "error";
}
