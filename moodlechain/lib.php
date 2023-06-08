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
 * Definition of the moodlechain grader report class
 *
 * @package   gradereport_grader_moodlechain
 * @copyright 2023 Athanasios Angelakopoulos
 */
require_once($CFG->dirroot . '/grade/report/grader/lib.php');
require_once($CFG->libdir.'/tablelib.php');

/**
 * Class providing an API for the moodlechain grades plugin to export the grades in a certain format.
 * @uses grade_report_grader_moodlechain
 * @copyright 2023 Athanasios Angelakopoulos
 */
class grade_report_grader_moodlechain extends grade_report_grader
{   private $numberOfUsers;
    public function __construct($courseid, $gpr, $context, $page, $sortitemid, $totalUsers) {
        parent::__construct($courseid, $gpr, $context, $page, $sortitemid);
        $this->numberOfUsers = $totalUsers;
    }    
    private $moodlechain_grading_object;
    public function get_students_per_page(): int {
        return (int) $this->numberOfUsers ? $this->numberOfUsers : 0;
    }
    public function get_raw_grades(){
        global $DB, $USER;
        $this->moodlechain_grading_object = array();
        foreach ($this->gtree->items as $item) {
            $gradeitem = array();
            $gradingUsers = get_enrolled_users($this->context, 'mod/assign:grade');
            foreach ($this->users as $user) {
                if (!empty($item->itemname)) {
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
                        $submitedOn = $history ? date("Y-m-d H:i:s", $history->timemodified): "No submission info";
                    }
                    $gradedOn = date("Y-m-d H:i:s",$this->grades[$user->id][$item->id]->timemodified);
                    $name = $item->get_name();
                }
                else {
                    $name = 'Final Grade';
                    $submitedOn = date("Y-m-d H:i:s",$this->grades[$user->id][$item->id]->timemodified);
                    $gradedOn = $submitedOn;
                    $gradedBy = 'System';
                }
                $gradeitem[] = array(
                    'studentId' => $user->id,
                    'studentName' => $user->firstname . ' ' . $user->lastname,
                    'email'=> $user->email,
                    'activityName' => $name,
                    'submittedOn' => $submitedOn,
                    'gradedOn' => $gradedOn,
                    'gradedBy'=> $gradedBy,
                    'rawGrade' => $this->grades[$user->id][$item->id]->finalgrade,
                );
            }
            array_push($this->moodlechain_grading_object, array('activityName'=>$name,'grades'=>$gradeitem));
        }
        
        return json_encode($this->moodlechain_grading_object);
    }
}