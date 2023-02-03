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
 * Definition of the grader report class
 *
 * @package   gradereport_grader_finalize
 * @copyright 2007 Nicolas Connault
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
require_once($CFG->dirroot . '/grade/report/grader/lib.php');
require_once($CFG->libdir.'/tablelib.php');

/**
 * Class providing an API for the grader report building and displaying.
 * @uses grade_report_grader
 * @copyright 2007 Nicolas Connault
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class grade_report_grader_finalize extends grade_report_grader
{
    public function get_raw_grades() {
        $grades = array();
        foreach ($this->users as $user) {
            foreach ($this->gtree->items as $item) {
                if (!empty($this->grades[$user->id][$item->id]->rawgrade)) {
                    $grades[] = array(
                        'userid' => $user->id,
                        'username' => $user->firstname . ' ' . $user->lastname,
                        'activity_name' => $item->get_name(),
                        'rawgrade' => $this->grades[$user->id][$item->id]->rawgrade
                    );
                }
                else if(!empty($this->grades[$user->id][$item->id]->finalgrade)) {
                    $grades[] = array(
                        'userid' => $user->id,
                        'username' => $user->firstname . ' ' . $user->lastname,
                        'activity_name' => 'Final Grade',
                        'rawgrade' => $this->grades[$user->id][$item->id]->finalgrade
                    );
                }
            }

        }
        return $grades;
    }



}