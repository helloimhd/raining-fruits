//  to check what will trigger to move to the left
/*document.addEventListener('keydown', function(e) {
  console.log(e.which)
})*/

var score = 0;
var startFalling = null;
var fruitFalling = null;
var createBombs = null;;

var deductedPoints = [];
var fruitIcons = ["🍉", "🍌", "🍇", "🍏", "🍓", "🍒", "🍍", "🍑", "🍈", "🥝", "🥥"]
var badIcons = ["🔪", "🔨", "✂️"];
var bombIcons = ["💣"];

var mainContainer = document.querySelector(".main-container");
var gameContainer = document.querySelector(".game-container");
var bar = document.querySelector(".bar-container");
var startDisplay = null;
var position = 0;

var getPlayerName = document.getElementById("getPlayerName");
var playerName = document.getElementById("playerName");
var playerScore = document.getElementById("playerScore");
var highestScore = {
    name: "Herda",
    score: 20
}

/*var correctAudio = document.getElementById("correctAudio");
var bombAudio = document.getElementById("bombAudio");
*/
console.log(fruitIcons)


//startGame();
createStartDisplay();


function startGame() {
    //console.log(createStartDisplay())
    startDisplay.remove();
    bar.style.visibility = "visible";
    getPlayerName.style.visibility = "hidden";
    createLives();
    document.querySelector(".highScore").style.visibility  = "visible";
    updateHighScore(playerName, playerScore)
    moveBar();

    // for when game on phone
    control()

    //  after 10 seconds, append the badIcons tgt so that badIcons will appear
    setTimeout(function() {
        fruitIcons = fruitIcons.concat(badIcons);
        //console.log(fruitIcons)
    }, 10000);


    //  every 5 secs create a new bomb
    function addBombs() {
        createBombs = setInterval(function() {
            fruitIcons = fruitIcons.concat(bombIcons);
            //console.log(fruitIcons)
        }, 5000);
    }
    //  but only start making bombs 15 secs after the game start
    setTimeout(addBombs, 15000);

    // clearInteval after 40 secs
    setTimeout(function() {
        clearInterval(createBombs);
    }, 45000);

    fruitFalling = setInterval(function() {
        var randomPosition = Math.floor(Math.random() * 300) ;  // left = 0 to 300
       // console.log(randomPosition);
        currentFruit = createFruit(randomPosition)
        //console.log(test);

        //score();
      }, 1000)

    createScoreBoard()
}