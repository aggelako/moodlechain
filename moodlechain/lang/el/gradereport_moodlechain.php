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
 *
 * @package   gradereport_finalize
 * @author  Athanasios Angelakopoulos
 */
// Index.
$string['pluginname'] = 'Moodlechain';
$string['finalizeButtonText'] = 'Οριστικοποίηση βαθμολογιών';
$string['verifyButtonText'] = 'Επαλήθευση βαθμολογιών';
$string['authorizeButtonText'] = 'Εξουσιοδότηση καθηγητή';
$string['popupMessage'] = 'Moodlechain - Είστε σίγουροι ότι θέλετε να συνεχίσετε;';
$string['formNotCompleted'] = 'Βεβαιωθείτε ότι έχετε συμπληρώσει όλα τα απαιτούμενα πεδία';
$string['completeForm'] = 'Moodlechain - Συμπληρώστε τη φόρμα';
$string['SubmitButton'] = 'Υποβολή';
$string['CancelButton'] = 'Ακύρωση';
$string['chooseActivityForm'] = 'Επιλέξτε μία ή περισσότερες δραστηριότητες για επαλήθευση';
$string['chooseActivityValidation'] = 'Πρέπει να επιλέξετε τουλάχιστον μία δραστηριότητα!';
$string['chooseTeacher'] = 'Επιλέξτε τον καθηγητή που θα εξουσιοδοτήσετε';
$string['finalizeSuccess'] = 'Moodlechain - Οι βαθμολογίες στάλθηκαν επιτυχώς στο blockchain';
$string['verificationEnded'] = 'Moodlechain - Η διαδικασία επαλήθευσης ολοκληρώθηκε!';
$string['verifySuccess'] = $string['verificationEnded'] .'- Δεν βρέθηκαν ανακρίβιες!';
$string['verifyFailure'] = $string['verificationEnded'] . ' Βρέθηκαν ανακρίβιες:';
$string['authorizedSuccess'] = 'Moodlechain - Ο καθηγητής εξουσιοδόθηκε επιτυχώς';
$string['genericFailure'] = 'Κάτι πήγε στραβά';
$string['transactionRejected'] = 'Απορρίψατε τη συναλλαγή';
$string['connectedToContract'] = 'Συνδέθηκε επιτυχώς με το συμβόλαιο';
$string['connectedToContract'] = 'Επιτυχής σύνδεση με το συμβόλαιο';
$string['metamaskNotInstalled'] = 'Παρακαλώ εγκαταστήστε την επέκταση Metamask ή επικοινωνήστε με το διαχειριστή!';
$string['loading'] = 'Φορτώνει...';
$string['wrongNetwork'] = 'Ο λογαριασμός Metamask είναι συνδεδεμένος σε λάθος τύπο δικτύου!';
$string['noPermissionError'] = 'Δεν έχετε δικαίωμα να εκτελέσετε αυτή την ενέργεια, επικοινωνήστε με τον διαχειριστή!';
//for any other string to be used in the JS file, add it here and then add it to the index.php file as a parameter to the require to js call
?>