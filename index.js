//grab elements from the document

const startBtn = document.querySelector("#start"), 
      restartBtns = document.querySelectorAll(".restart"),
      screens = document.querySelectorAll(".screen"), //menu screens
      timeList = document.querySelector("#time-list"), 
      difficultyList = document.querySelector("#difficulty-list"), 
      timeEl = document.querySelector("#time"), //timer
      hitsEl = document.querySelector("#hits"),
      board = document.querySelector("#board"), //game board
      accuracyEl = document.querySelector("#accuracy"),
      hitsOver = document.querySelector("#hits-over"),
      accuracyOver = document.querySelector("#accuracy-over"),
      hearts = document.querySelectorAll(".heart"),
      fullScreenBtn = document.querySelector("#fullscreen"),
      minimizeBtn = document.querySelector("#minimize");




//game object to store game variables
let game = {
    time: 0, 
    unlimited: false,
    difficulty: 0,
    interval: null, 
    hits: 0,
    missed: 0,
    accuracy: 0,
    playing: false
}

const playScreen = document.getElementById('play-screen'),
      timeScreen = document.getElementById('time-screen'),
      difficultyScreen = document.getElementById('difficulty-screen'),
      gameScreen = document.getElementById('game-screen'),
      gameOverScreen = document.getElementById('game-over-screen');

//make the start button fucntional
startBtn.addEventListener("click", () => {
  //go to next page
  playScreen.classList.add("up"); 
});

timeList.addEventListener("click", (e) => {
  if(e.target.classList.contains("time-btn")) {
    game.time = parseInt(e.target.getAttribute("data-time"));
    game.unlimited = e.target.getAttribute("data-unlimited");
    timeScreen.classList.add("up");
  }
});

difficultyList.addEventListener("click", (e) => {
  if(e.target.classList.contains("difficulty-btn")) {
    game.difficulty = parseInt(e.target.getAttribute("data-difficulty"));
    difficultyScreen.classList.add("up");
    startGame();
  }
});


function startGame() {
  game.playing = true;

  game.interval = setInterval(decreaseTime, 1000);
  createRandomCircle();
}

function decreaseTime() {
  if (game.unlimited) {
    setTime("∞");
    return;
  }
  if (game.time === 0) {
    finishGame();
    return;
  }

  let current = --game.time;
  let miliseconds = game.time * 1000;

  let minutes = Math.floor(miliseconds / (1000* 60));
  let seconds = Math.floor((miliseconds % (1000 * 60)) / 1000);

  //adds '0' if seconds is less than 10
  seconds = seconds < 10 ? "0" + seconds : seconds;
  //adds '0' if minutes is less than 10
  minutes = minutes < 10 ? "0" + minutes : minutes;

  setTime(`${minutes}:${seconds}`);
}

function setTime(time) {
  timeEl.innerHTML = time;
}

function createRandomCircle() {
  if(!game.playing) {
    return;
  }

  const circle = document.createElement("div"); //creates a div
  const size = getRandomNumber(100, 200); //get a random size for the radius



  //list of possible colors for each circle
  const colors = ["#03DAC6", "#FF0266", "#b3ff00", "#ccff00", "#9D00FF"]; 
  const  { width, height } = board.getBoundingClientRect(); //define the width & height 
  const x = getRandomNumber(0, width - size); // midpoint x
  const y = getRandomNumber(0, height - size); // midpoint y

  circle.classList.add("circle"); // add circle to the list of circles
  circle.style.width = `${size}px`; //set width px size
  circle.style.height = `${size}px`; //set height px size
  circle.style.top = `${y}px`; //add margin for top 
  circle.style.left = `${x}px`; //add margin for left


  circle.style.backgroundImage = "url('images/jungkook.png')";
  circle.style.backgroundSize = "cover";
  circle.style.backgroundPosition = "center";
  circle.style.backgroundColor = "transparent";

  //let color = Math.floor(Math.random() * colors.length); //choose random index 
  //circle.style.background = `${colors[color]}`; //random color for circle
  board.append(circle); //add the circle 

  //difficulty
 
  if (game.difficulty == 1) {
    circle.style.animationDuration = "2s";
  } else if (game.difficulty == 2) {
    circle.style.animationDuration = "1s";
  } else {
    circle.style.animationDuration = "3s";
  }
    
  //create new circle after current one disappears
  circle.addEventListener("animationend", () => {
    circle.remove();
    createRandomCircle();

    //if circle disappears and user dont click
    //it counts as a miss
    addMissed();

    //calculate accuracy after miss
    calculateAccuracy();

  });
}

//get event on circle click
board.addEventListener("click", (e) => {
  if (e.target.classList.contains("circle")) {
    game.hits++; //increase hits by 1
    e.target.remove(); //remove circle
    createRandomCircle(); //create new circle
  } else {
    //if not clicked on circle increase miss by 1
    game.missed++;
  }

  //show hits 
  hitsEl.innerHTML = game.hits;

  //calculate accuracy 
  calculateAccuracy();
});


function finishGame() {
  game.playing = false;
  clearInterval(game.interval);
  board.innerHTML = "";
  screens[3].classList.add("up");
  hitsEl.innerHTML = 0;
  timeEl.innerHTML = "00:00";
  game.accuracy.innerHTML = "0%";

  hitsOver.innerHTML = game.hits;
  accuracyOver.innerHTML = `${game.accuracy}%`;

}

function addMissed() {
  //when click missed we decrease accuracy
  //missed circle will decrease lives

  //check if any life remaining
  if(
    hearts[0].classList.contains("dead") &&
    hearts[1].classList.contains("dead") &&
    hearts[2].classList.contains("dead") 
  ) {
    //if all hearts are dead
    finishGame();
  } else {
    //if any life remaining
    game.missed++;

    //add dead to one heart
    for (let i = 0; i < hearts.length; i++) {
     if(!hearts[i].classList.contains("dead")) {
      hearts[i].classList.add("dead");
      //break after adding to one dont add to others
      break;
     }
    }
  }
}

function calculateAccuracy() {
  game.accuracy = (game.hits/ (game.hits + game.missed)) * 100; //accuracy percentage
  game.accuracy = game.accuracy.toFixed(2); //rounds to 2 decimals 
  accuracyEl.innerHTML = `${game.accuracy}%`; //display on document
}



function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

restartBtns.forEach((btn) => {
  btn.addEventListener("click", restartGame);
});


function restartGame() {
  finishGame();
  playScreen.classList.remove("up");
  timeScreen.classList.remove("up");
  difficultyScreen.classList.remove("up");
  gameScreen.classList.remove("up");
  game.time = 0;
  game.difficulty = 0;
  game.hits = 0;
  game.missed = 0;
  game.accuracy = 0;
  game.playing = false;
  game.unlimited = false;
  hearts.forEach((heart) => {
    heart.classList.remove("dead");
  });

}

fullScreenBtn.addEventListener("click", fullScreen);

let elem = document.documentElement;

function fullScreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozrequestFullscreen) {
    elem.mozrequestFullscreen()
  } else if (elem.webkitRequestFullscreen) {
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    elem.msRequestFullscreen();
  }

  //hide full screen button show minimize button
  fullScreenBtn.style.display = "none";
  minimizeBtn.style.display = "block";
}

minimizeBtn.addEventListener("click", minimize);

function minimize() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.mozCancelFullScreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullScreen) {
    document.msExitFullScreen();
  }

  minimizeBtn.style.display = "none";
  fullScreenBtn.style.display = "block";
}

document.addEventListener("DOMContentLoaded", () => {
  // Display playScreen on page load
  playScreen.classList.add("up");

  // Reset other screens
  timeScreen.classList.remove("up");
  difficultyScreen.classList.remove("up");
  gameScreen.classList.remove("up");
  gameOverScreen.classList.remove("up");

  // Reset game state
  restartGame();
});