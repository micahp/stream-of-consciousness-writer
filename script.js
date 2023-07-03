// script.js

$(document).ready(function(){
  let lastKeypressTime = 0;
  let countdownTimer;
  let selectedTime = 1;  // Default time is 1 minute
  let started = false;   // Flag to check if timer is started
  let timerEnded = false; // Flag to check if the timer has ended
  const progressBar = $("#progress-bar");
  const typingArea = $("#typingArea");

  $("#fullscreenBtn").on("click", function() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen(); 
        }
    }
  });

  $(".form-check-input").on("change", function() {
      selectedTime = $(this).val();
      resetAll();
  });

  typingArea.on("keydown", function() {
      if(!timerEnded) {
          typingArea.removeClass("fade-out");
          lastKeypressTime = Date.now();
          if (!started) {
              startCountdown();
              started = true;
          }
      }
  });

  $("#restart").on("click", function() {
      $("#overlay").hide();
      resetAll();
  });

  function startCountdown() {
      let timeLeft = selectedTime * 60;
      let checkProgress = function() {
        $("#timer").html(`Time left: ${timeLeft} seconds`);
        progressBar.css('width', ((selectedTime * 60 - timeLeft) / (selectedTime * 60) * 100) + '%');
        timeLeft--;

        if (Date.now() - lastKeypressTime >= 5000 && !timerEnded) {
            onStopTyping();
        } else if (Date.now() - lastKeypressTime > 0) {
          typingArea.addClass("fade-out");
        }

        if (timeLeft < 0) {
            clearInterval(countdownTimer);
            $("#timer").html("Time's up!");
            timerEnded = true;
        }
    }
    checkProgress();
    countdownTimer = setInterval(checkProgress, 1000);
  }

  function onStopTyping() {
      $("#overlay").show();
      resetAll();
  }

  function resetAll() {
      started = false;
      timerEnded = false;
      clearInterval(countdownTimer);
      countdownTimer = undefined;
      typingArea.removeClass("fade-out").html("");
      lastKeypressTime = 0;
      $("#wordCount").html("");
      $("#timer").html("");
      progressBar.css('width', '0%');
  }
  
  // Updating the word count whenever input changes
  typingArea.on('input', function() {
      let words = $(this).text().match(/\b[-?(\w+)?]+\b/gi);
      if(words) {
          $("#wordCount").html("Word Count: " + words.length);
      } else {
          $("#wordCount").html("Word Count: 0");
      }
  });
});
