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
 * Definition of the finalize grader report class
 *
 * @package   gradereport_grader_finalize
 * @copyright 2023 Athanasios Angelakopoulos
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
require_once($CFG->dirroot . '/grade/report/grader/lib.php');
require_once($CFG->libdir.'/tablelib.php');

/**
 * Class providing an API for the finalize grades plugin to export the grades in a certain format.
 * @uses grade_report_grader_finalize
 * @copyright 2023 Athanasios Angelakopoulos
 * @license   http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */
class grade_report_grader_finalize extends grade_report_grader
{
    private $finalize_grading_object;

    /**
     * @return void
     * Feeding values to finalize_grading_object, which is an array of [gradeitemname, userid, rawgrade]
     * To include the final grade for each user as well, we noticed that in the $this->grades object
     * the final grade for each user, has null value in the rawgrade and has its value in the finalgrade field
     * so we take it from there
     */
    public function get_raw_grades(){
        global $DB;
        $this->finalize_grading_object = array();
        foreach ($this->gtree->items as $item) {
            $gradeitem = array();
            $gradingUsers = get_enrolled_users($this->context, 'mod/assign:grade');
            foreach ($this->users as $user) {
                if (!empty($this->grades[$user->id][$item->id]->rawgrade)) {
                    $lastModifiedById = $this->grades[$user->id][$item->id]->usermodified;
                    if ($lastModifiedById == $user->id){
                        $gradedBy = 'System';
                        $submitedOn = date("Y-m-d H:i:s",$this->grades[$user->id][$item->id]->timemodified);
                    }
                    else{
                        $gradedBy = $gradingUsers[$lastModifiedById]->firstname;
                        $sql = "SELECT * FROM {grade_grades_history}
                               WHERE userid = :userid
                               AND loggeduser = :userid2
                               ORDER BY timemodified DESC
                               LIMIT 1";
                        $history = $DB->get_record_sql($sql, array('userid'=>$user->id,'userid2'=>$user->id));
                        $submitedOn = date("Y-m-d H:i:s", $history->timemodified);
                    }
                    $gradeitem[] = array(
                        'userid' => $user->id,
                        'username' => $user->firstname . ' ' . $user->lastname,
                        'email'=> $user->email,
                        'activity_name' => $item->get_name(),
                        'submitted on'=> $submitedOn,
                        'graded by'=> $gradedBy,
                        'graded on'=> date("Y-m-d H:i:s",$this->grades[$user->id][$item->id]->timemodified),
                        'rawgrade' => $this->grades[$user->id][$item->id]->rawgrade
                    );

                    $name = $item->get_name();
                }
                else if(!empty($this->grades[$user->id][$item->id]->finalgrade)) {
                    $gradeitem[] = array(
                        'userid' => $user->id,
                        'username' => $user->firstname . ' ' . $user->lastname,
                        'email'=> $user->email,
                        'activity_name' => 'Final Grade',
                        'submitted on' => date("Y-m-d H:i:s",$this->grades[$user->id][$item->id]->timemodified),
                        'graded on' => date("Y-m-d H:i:s",$this->grades[$user->id][$item->id]->timemodified),
                        'graded by'=> 'System',
                        'rawgrade' => $this->grades[$user->id][$item->id]->finalgrade,
                    );
                    $name = 'Final Grade';
                }
            }
            $this->finalize_grading_object[$name] = $gradeitem;
        }
    }

    /**
     * @return false|string
     * Calls the above function to fill the finalize grading object and
     * then turns it in the wanted json format
     */
    public function get_finalize_toJson(){
        $this->get_raw_grades();
        global $USER;
        if(!empty($this->finalize_grading_object)){
            $resultArray []= array(
                "userid"=>$USER->id,
                "courseid"=>$this->courseid,
                "time"=>date("Y-m-d H:i:s",time()),
                "grades"=>$this->finalize_grading_object
            );
            return json_encode($resultArray);
        }
        else{
            return json_encode([]);
        }

    }




}