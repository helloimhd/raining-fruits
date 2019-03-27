//  shuffle the array
var shuffle = function(array) {
    var currentIndex = array.length, tempValue, randIndex;

    // while there are elements in the array
    while (currentIndex > 0) {
        //pick a random index
        randIndex = Math.floor(Math.random() * currentIndex);

        currentIndex--;   // decrease current index by 1

        // and swap the last element with it
        tempValue = array[currentIndex];
        array[currentIndex] = array[randIndex];
        array[randIndex] = tempValue;
    }
    return array;
}

function createBar() {
    var bar = document.createElement("div")
    bar.className = "bar";
    bar.id = "bar";

    gameContainer.appendChild(bar);
}

//  changing the position of the bar upon click left and right button
function moveRight() {
    bar.style.left = position + "px";    // start with left: 0px
    if (position >= 290){
       document.removeEventListener("keydown", moveRight);
    } else {
        position += 10;
    }
    //barLeft = bar.style.left;
    //return barLeft;
}

function moveLeft() {
    bar.style.left = position + "px";
    if (position <= 0){
       document.removeEventListener("keydown", moveLeft);
    } else {
        position -= 10;
    }
   // barRight = bar.style.left;
   // return barRight;
}

function moveBar() {
    document.addEventListener("keydown", function(e) {
    if (e.which === 39) {   // checking the right button
        moveRight();

    } else if (e.which === 37 ) {    // checking the left button
        moveLeft();
    }
    });
}

function moveBarControl() {
    var left = document.getElementById("left");
    var right = document.getElementById("right");

    document.addEventListener("ontouchstart", function(e) {
    if (left) {   // checking the right button
        moveLeft();

    } else if (right) {    // checking the left button
        moveRight();
    }
    });
}


//  check if two elements touch
function isCollapsed(element1, element2, fruitContent){
    // method returns the size of an element and its position relative to the viewport.
    var element1Size = element1.getBoundingClientRect();
    var element2Size = element2.getBoundingClientRect();

    if (element1Size.left < element2Size.left + element2Size.width && element1Size.left + element1Size.width  > element2Size.left && element1Size.top < element2Size.top + element2Size.height && element1Size.top + element1Size.height > element2Size.top) {


        if (fruitContent === "🔪" || fruitContent === "🔨" || fruitContent === "✂️") {
            return "bad";
        } else if (fruitContent === "💣") {
            return "bomb";
        } else {
            return "fruit";
        }
  }
}

//  check if two elements touch
function gameContainerNFruit(element1, element2) {
    // method returns the size of an element and its position relative to the viewport.
    var element1Size = element1.getBoundingClientRect();
    var element2Size = element2.getBoundingClientRect();

    if (element1Size.left < element2Size.left + element2Size.width && element1Size.left + element1Size.width  > element2Size.left && element1Size.top < element2Size.top + element2Size.height && element1Size.top + element1Size.height > element2Size.top) {

        return "yes"
  }
}

function createScoreBoard() {
    var scoreBoard = document.createElement("div");
    scoreBoard.id = "scoreBoard";

    // mainContainer.appendChild(scoreBoard);
    gameContainer.appendChild(scoreBoard);
}

function createDeductPoint(leftPosition) {
    var deduct = document.createElement("div");
    deduct.id = "deduct";
    deduct.textContent = "-1";
    deduct.style.left = leftPosition;

    gameContainer.appendChild(deduct);

    return deduct;

}

function createFruit(leftPosition) {
    var newFruit = document.createElement("div");
    newFruit.className = "fruits";
    newFruit.style.left = `${leftPosition}px`;

    //console.log(fruitIcons);

    // choose different kind of fruits
    shuffle(fruitIcons);
    for (var i = 0; i < fruitIcons.length; i++) {
        newFruit.textContent = fruitIcons[i];
    }

    var top = 0;
    newFruit.style.top = top;
    gameContainer.appendChild(newFruit);
    moveFruits();


    function moveFruits() {
        top += 2;   // speed of the fruits... the higher, the faster
        newFruit.style.top= `${top}px`;

       if (top < 299){
            startFalling = window.requestAnimationFrame(moveFruits);   // to keep repeating the above

        } else if (top >= 299) {   // once fruit touch the bottom
            // collect fruits and score point
            var fruitContent = newFruit.textContent;
            //console.log(fruitContent)
            var scoreBoard = document.getElementById("scoreBoard")

            // collect one point for each fruit
            if (isCollapsed(newFruit, bar, fruitContent) === "fruit") {
                closeMouth()
                playCorrectAudio();
                score += 1;
                scoreBoard.textContent = `Score: ${score}`;


                //  minus one live if collect tool
            } else if (isCollapsed(newFruit, bar, fruitContent) === "bad") {
                if (lives !== 0){
                    closeMouth()
                    playWekAudio()

                    // get position of current fruit
                    var fruitLeftPosition = newFruit.style.left;
                    createDeductPoint(fruitLeftPosition)

                    //  get deduction element
                    var deductPoint = document.getElementById("deduct");
                    setTimeout(function() {
                        deductPoint.remove();
                    }, 500)

                    //score -= 1;
                    removeLives();
                    lives--;

                    //console.log(lives);
                    scoreBoard.textContent = `Score: ${score}`;

                } else if (lives === 0) {
                    gameOver()
                }

                // game over if bomb
            } else if (isCollapsed(newFruit, bar, fruitContent) === "bomb") {
                closeMouth()
                playBombAudio()
                gameOver();
               // window.cancelAnimationFrame(startFalling)
                return;

                //  deduct lives if miss fruit
                //  check if item hit the gamecontainer
            } else if (gameContainerNFruit(newFruit, gameContainer) === "yes") {
                if (fruitContent !== "🔪" && fruitContent !== "🔨" && fruitContent !== "✂️" && fruitContent !== "💣") {
                    if (lives !== 0) {
                        playSplatAudio()
                        var fruitLeftPosition = newFruit.style.left;
                        var deductPoint = createDeductPoint(fruitLeftPosition)

                        //  get deduction element
                       // var deductPoint = document.getElementById("deduct");
                        setTimeout(function() {
                            deductPoint.remove();
                        }, 500)

                        removeLives();
                        lives--;

                    } else if (lives === 0) {
                          gameOver();
                    }
                }

            }

            //console.log(score);
            newFruit.remove();
       }
   }
   return newFruit;

}


function gameOver() {
    playGameOverAudio()
    bar.remove();

    updateHighScore(playerName, playerScore)

    var allCurrentFruits = document.querySelectorAll(".fruits");
    // take fruits list and remove every item
    allCurrentFruits.forEach(function(fruit) {
        fruit.remove();
    })

    clearInterval(fruitFalling);

    var gameOverAlert = document.createElement("div");
    gameOverAlert.id = "gameOver";
    gameOverAlert.textContent = "Game Over";

    gameContainer.appendChild(gameOverAlert);

    var playAgainAlert = document.createElement("div");
    playAgainAlert.id = "playAgain";
    playAgainAlert.setAttribute("onClick", "restart()")
    playAgainAlert.textContent = "Play Again?"

    gameContainer.appendChild(playAgainAlert)

    //createHighestScore();
}


var lives = 3;
function createLives() {
    var lives = document.createElement("div")
    lives.className = "lives";

    for (var i = 0; i < 3; i++) {
        var indvLives = document.createElement("div");
        indvLives.className = "indvLives";

        if (i === 0) {
            indvLives.id = "one";
        } else if (i === 1) {
            indvLives.id = "two";
        } else if (i === 2) {
            indvLives.id = "three";
        }

        indvLives.textContent = "❤️";

        lives.appendChild(indvLives)
    }
    gameContainer.appendChild(lives);
}

function removeLives() {
    var livesList = document.querySelectorAll(".indvLives");
    for (var i = 0; i < livesList.length; i++) {
        if (lives === 3) {
            var firstLife = livesList[2]
            firstLife.remove();

        } else if (lives === 2) {
            var secondLife = livesList[1]
            secondLife.remove();

        } else if (lives === 1) {
            var thirdLife = livesList[0]
            thirdLife.remove();

        } else {
            console.log("no life")
        }

   }
}

function createStartDisplay() {
    startDisplay = document.createElement("div");
    startDisplay.id = "start";
    startDisplay.setAttribute("onClick", "startGame()");
    startDisplay.textContent = "Start Game";

    gameContainer.appendChild(startDisplay);

   // return start;
}

function updateHighScore(nameElement, scoreElement) {
    console.log(score);
    if (highestScore.score < score) {
        highestScore.score = score;
        scoreElement.textContent = `Score: ${score}`;

        highestScore.name = getPlayerName.value;
        nameElement.textContent = `Name: ${getPlayerName.value}`;

    } else {
        scoreElement.textContent = `Score: ${highestScore.score}`;
        nameElement.textContent = `Name: ${highestScore.name}`;
    }
}

function closeMouth() {
    var barImg = document.querySelector("img");
    barImg.src = "images/close-pacman.png";

    setTimeout(function() {
        barImg.src = "images/Pacman.png";
    }, 250)
}

function restart() {
    //location.reload();
    location = window.location;
}

///////////////////    AUDIO FUNCTIONS    //////////////////////////////
function playCorrectAudio() {
    correctAudio.play()
}

function playBombAudio() {
    bombAudio.play()
}

function playSplatAudio() {
    splatAudio.play()
}

function playWekAudio() {
    wekAudio.play()
}

function playGameOverAudio() {
    gameOverAudio.play()
}