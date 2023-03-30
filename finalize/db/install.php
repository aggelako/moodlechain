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

defined('MOODLE_INTERNAL') || die();
function xmldb_gradereport_finalize_install() {
    require_once('/var/www/html/moodle/config.php');
    global $DB, $CFG;
    require_once($CFG->dirroot . '/user/profile/lib.php');
    $custom_field_shortname = 'wallet_address';
    $custom_field_exists = false;
    $custom_fields = profile_get_custom_fields(true);
    foreach($custom_fields as $custom_field) {
        if($custom_field->shortname == $custom_field_shortname) {
            $custom_field_exists = true;
            break;
        }
    }
    if(!$custom_field_exists) {
        $custom_field = new stdClass();
        $custom_field->shortname = $custom_field_shortname;
        $custom_field->name = 'Wallet Address';
        $custom_field->datatype = 'text';
        $custom_field->description = 'Wallet Address';
        $custom_field->descriptionformat = 1;
        $custom_field->categoryid = $category;
        $custom_field->sortorder = 1;
        $custom_field->required = 0;
        $custom_field->locked = 0;
        $custom_field->visible = 1;
        $custom_field->forceunique = 0;
        $custom_field->defaultdata = '';
        $custom_field->defaultdataformat = 0;
        $custom_field->param1 = 30;
        $custom_field->param2 = 2048;
        $custom_field->id = $DB->insert_record('user_info_field', $custom_field);
    }
}