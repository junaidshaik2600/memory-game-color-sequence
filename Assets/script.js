let body = document.querySelector("body");
let btnNode = document.querySelectorAll(".btn");
let title = document.querySelector("#level-title");
let colorArr = ["red", "blue", "green", "yellow"];
let userArr = [];
let randomArr = [];
let gameActive = false;
let level = 1;

function random() {
  if (!gameActive) {
    gameActive = true;
    body.addEventListener("keypress", randomEventHandlers);
  }
}

async function randomEventHandlers() {
  if (body.classList.contains("game-over")) {
    body.classList.remove("game-over");
  }
  body.removeEventListener("keypress", randomEventHandlers);
  userArr = [];
  title.innerText = `Level ${level}`;
  let randomIndex = Math.round(Math.random() * 3);
  randomArr.push(colorArr[randomIndex]);
  await displaySequence()
  user();
}

async function displaySequence() {
  for (const color of randomArr) {
    const colorId = document.querySelector(`#${color}`);
    playSound(color);
    await pressed(colorId);
    await delay(600);
  }
}

function user() {
  if (gameActive) {
    btnNode.forEach(function (button) {
      button.addEventListener("click", userEventHandlers);
    });
  }
  
}

async function userEventHandlers(event) {
  if (!gameActive) return;
  let clickedButtonId = event.target.id; // Capture the button that was clicked
  userArr.push(`${clickedButtonId}`);
  let pressedIdName = document.querySelector(`#${clickedButtonId}`);
  playSound(clickedButtonId);
  pressed(pressedIdName);
  if (userArr.length === randomArr.length) {
    await disableUserInteraction()
    evaluation();
  } else if (userArr[userArr.length - 1] !== randomArr[userArr.length - 1]) {
    gameOver();
  }
}
function disableUserInteraction() {
  btnNode.forEach(function (button) {
    button.removeEventListener("click", userEventHandlers);
  });
}
function pressed(e) {
  return new Promise((resolve)=>{
    e.classList.add("pressed");
    setTimeout(() => {
      e.classList.remove("pressed");
      resolve(); 
    }, 300);
  })
}
function playSound(e) {
  let sound = new Audio(`./Assets/sounds/${e}.mp3`);
  sound.play();
}
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function evaluation() {
  let currentStep = userArr.length - 1;
  if (userArr[currentStep] === randomArr[currentStep]) {
      setTimeout(() => {
        randomEventHandlers();
      }, 1000);
      level++;
  }
  else{
    gameOver();
  }
}


function gameOver() {
  console.log("You Are Wrong!!!");
    userArr = [];
    randomArr = [];
    gameActive = false;
    body.classList.add("game-over")
    title.innerText = "Game Over, Press Any Key to Restart";
    random();
}

random();
