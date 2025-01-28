// experation
if (new Date() > TARGET_DATE) {
  showModal('expired-message');
}

// timer
function initTimer() {
  if (!HAS_TIMER) return;
  
  let timeInSeconds = GAME_TIMER_MINUTES ? GAME_TIMER_MINUTES * 60 : 0;
  
  function updateTimerDisplay(minutes, seconds) {
    const minuteElem = document.getElementById('minutes');
    const secondElem = document.getElementById('seconds');
    
    // Update minutes and seconds with animations
    applyAnimation(minuteElem, minutes.toString().padStart(2, '0'));
    applyAnimation(secondElem, seconds.toString().padStart(2, '0'));
  }
  
  function applyAnimation(element, newValue) {
    // Store current value
    const currentValue = element.textContent;
    
    // If the value has changed, apply animation
    if (currentValue !== newValue) {
      // Add the 'old' class for current value
      element.classList.add('old');
      
      // Wait for the animation to complete, then update the value
      setTimeout(() => {
        element.textContent = newValue;
        // Remove the 'old' class and add the 'new' class
        element.classList.remove('old');
        element.classList.add('new');
        
        // Remove the 'new' class after animation completes
        setTimeout(() => {
          element.classList.remove('new');
        }, 300); // Duration of animation
      }, 300); // Duration of 'old' animation
    }
  }
  
  const timerInterval = setInterval(() => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    
    updateTimerDisplay(minutes, seconds);
    
    // Decrement the time
    GAME_TIMER_MINUTES ? timeInSeconds-- : timeInSeconds++;
    
    // Stop the timer when it reaches 0
    if (GAME_TIMER_MINUTES && timeInSeconds < 0) {
      clearInterval(timerInterval);
      updateTimerDisplay(0, 0); // Ensure it shows 00:00 at the end
      gameOver();
    }
  }, 1000);
}

function startGame() {
  initTimer();
}

// Start the game
startGame();