/*
TITLE: Multiple Choice Quiz Module
AUTHOR: Lars Hedlund
MAIN FEATURES:
(1) Load questions from preformatted files.
(2) Submit, Skip, and Restart options.
(3) Displays questions, user answers, and question answers at end of exercise.
(4) Verifies answers and tracks score.

BUGS: (1:Fixed) Special html characters (like &thorn;) could not be checked against the correct answer.
VERSION: 1.0
*/

$(function() {
  // Score and exercise tracking
  TOTAL = exercises.length;
  current = 0;
  score = 0;

  // Holds all of the students' answers to be displayed at the end of the quiz.
  var student_answers = [];

  init();

  function init() {
      loadQuestion();
  };

  function refresh() {
      /* METHOD: Refreshes div ids that the questions and choices are written to. */
      $('#question').html('');
      $('#options').html('');
  };

  function loadQuestion() {
      /* METHOD: Loads a random multiple choice question from any array of varying
       length. The array must be organized as an 'associative array', where the
       outer braces [] contain objects {} with key pairs.
       For example:
       var exercises = [
           {"question":"What is your <b>quest</b>?", "options": "blue,the airspeed velocity of an unladen swallow,coconuts", "answer":"to seek the Holy Grail"}];
       where question is the question text, options are multiple choice items that
       are not the answer, and answer is the answer.
      */

      // Change these variables if you change the div ids
      var $display_question = $('#question'),
          $display_options = $('#options');

      var current_exercise = exercises[current];
      // Refresh content
      refresh();
      // Load the question and question number into the div container
      $display_question.append((current + 1) + ": " + current_exercise["question"]);

      // Randomly displays options and answers from the exercises array.
      var choices = current_exercise["options"].split(',');
      choices.push(current_exercise["answer"]);
      while (choices.length != 0) {
          var i = Math.floor(Math.random() * choices.length);
          var write_option = '<input type="radio" name="choice" value="' + choices[i] + '">';
          $display_options.append(write_option + choices[i] + "<br>");
          choices.splice(i, 1);
      };
  };

  function advanceQuestion(id_value) {
      /* METHOD: Move the exercise forward through button selection.
      INPUT: Button id for easier comparison in if/else statements
      */

      // Change these variables if you change the div ids
      var $skip = $('#skip'),
          $restart = $('#restart'),
          $display_options = $('#options'),
          $submit = $('#submit');

      // Start of button logic checks.
      if (id_value == 'restart') {
          current = 0;
          score = 0;
      } else if (id_value == 'submit') {
          // Check to see whether or not the answer is correct
          var current_exercise = exercises[current];
          var val = $('input:checked').val();

          /* BUG FIX: Add the answer to a hidden field to pull &thorn; and &aelig; correctly, or else they are pulled literally (with & and ;) from array. */
          var write_answer = '<input type="hidden" id="answer" value="' +    current_exercise["answer"] + '">';
          $display_options.append(write_answer);
          var answer = $('#answer').val();
          //END FIX

          // Validate the user's input to change score
          if (val == answer) {
              score++;
          };
          // Add the answer to the student_answers array for tracking
          student_answers.push(val);
          // Update current to advance to next question
          current++;
      } else {
          // Skip is the only other option, so advance the question.
          current++;
      };

      // Determine which buttons to show
      if (current == TOTAL) {
          $submit.attr('disabled', true);
          $skip.attr('disabled', true);
          showScore();
      } else {
          // reset submit and skip if user restarts after final score is shown.
          $submit.attr('disabled', false);
          $skip.attr('disabled', false);
          loadQuestion();
      };
      console.log("Current, Score, Total:" + current, score, TOTAL)
  };

  function showScore() {
      /* METHOD: Dispays a customized congratulations and the score, followed by each question's text and its answer (along with the user's selection).
      */
      // Change these variables if you change the div ids
      var $display_score = $('#options');
      // Refresh content
      refresh();

      // The message that will be displayed to the user when he or she finishes
      var congratulations = "<h2>Great work!</h2>";

      // Displays the congratulations message and score.
      var display_score = congratulations + "<br>";
      display_score += "<h3>Your final score is " + score + " out of " + TOTAL + ".</h3>";
      // Displays the user's choice and the correct answer.
      for (i = 0; i < TOTAL; i++) {
          var current_exercise = exercises[i];
          display_score += '<p><b>' + (i + 1) + ": " + current_exercise["question"] + '</b> </p>';
          display_score += "<p>Your answer was " + student_answers[i] + '</p>';
          display_score += "<p>The correct answer is " + current_exercise["answer"] + '</p>';
      }
      $display_score.html(display_score);
  };

  // Advance to the next question
  $('button').on('click', function() {
    advanceQuestion(this.id);
  });

});
