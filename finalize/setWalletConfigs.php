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
// Get the current Moodle context
//$userid = $USER->id;
//
$courseid = required_param('walletKey', PARAM_ALPHANUMEXT);
echo $courseid;
//$custom_field_shortname = 'wallet_address';
//$userid = $USER->id;
//$custom_fields = profile_get_custom_fields(true);
//$custom_field_exists = false;
//foreach($custom_fields as $custom_field) {
//    if($custom_field->shortname == $custom_field_shortname) {
//        $custom_field_exists = true;
//        break;
//    }
//}
//if(!$custom_field_exists) {
//    $custom_field = new stdClass();
//    $custom_field->shortname = $custom_field_shortname;
//    $custom_field->name = 'Wallet Address';
//    $custom_field->datatype = 'text';
//    $custom_field->description = 'Wallet Address';
//    $custom_field->descriptionformat = 1;
//    $custom_field->categoryid = 1;
//    $custom_field->sortorder = 1;
//    $custom_field->required = 0;
//    $custom_field->locked = 0;
//    $custom_field->visible = 1;
//    $custom_field->forceunique = 0;
//    $custom_field->signup = 0;
//    $custom_field->defaultdata = '';
//    $custom_field->defaultdataformat = 0;
//    $custom_field->param1 = 30;
//    $custom_field->param2 = 2048;
//    $custom_field->param3 = 0;
//    $custom_field->param4 = '';
//    $custom_field->param5 = '';
//    $custom_field->id = $DB->insert_record('user_info_field', $custom_field);
//}

//if(array_key_exists($custom_field_shortname, $custom_fields)) {
//    echo "The custom field exists";
//} else {
//    echo "The custom field does not exist";
//}
