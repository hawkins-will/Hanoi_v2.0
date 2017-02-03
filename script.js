//Initialize Variables (i measures clicks, activeSize and comparedSize are for comparing Tile Sizes)
var i = 0, activeSize = 0, comparedSize = 0;

//Timer Variables
var a = 0, b = 0, c = 0;

//Set Timer to 0:00
$(".timeElapsed").text(a + ":" + b + c);

//Initialize High Score Variables
var aSaved = 999, bSaved = 99, cSaved = 99, turnSaved = 999;

//Initialize Arrays containing id's of the seven tiles and Lowest Number of Possible Moves per Number of Tiles
var tileIds = ["#one", "#two", "#three", "#four", "#five", "#six", "#seven"];
var lowestPossible = [7, 15, 31, 63, 127];

//Initalize Object that Stores Records
var myObject = {
  records: [[null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null], [null, null, null, null]]
};
var retrievedObject = sessionStorage.getItem('stored');
var newObject = JSON.parse(retrievedObject);
if (newObject != null) {
  if (myObject.records[0][0] == null || myObject.records[1][0] == null || myObject.records[2][0] == null || myObject.records[3][0] == null || myObject.records[4][0] == null) {
    myObject = newObject;
  }
}

//Function to return Stored Data (if it Exists), Incorporate that Data into Records, and Update Records Display
function loadSaved() {
  // console.log(+numTiles);
  console.log(numTiles);
    //If Records exist for Number of Tiles, show them
  if (myObject.records[+numTiles-3][0] != null || myObject.records[+numTiles-3][1] != null || myObject.records[+numTiles-3][2] != null || myObject.records[+numTiles-3][3] != null) {
      aSaved = +myObject.records[+numTiles-3][0], bSaved = +myObject.records[+numTiles-3][1], cSaved = +myObject.records[+numTiles-3][2], turnSaved = +myObject.records[+numTiles-3][3];
      $(".timeRecord").text(+aSaved + ":" + +bSaved + +cSaved);
      $(".turnRecord").text(turnSaved);
    //If Stored TurnScore is Perfect Score, make Green
    if (+myObject.records[+numTiles-3][3] == +lowestPossible[+numTiles-3]) {
      $(".turnRecord").css("color", "green");
    }
  }
}

var playTimer;

//Function to make Timer display Elapsed Time
function myTimer() {
  c = c + 1;
  if (c == 10) {
    c = 0, b = b + 1;
  }
  if (b == 6) {
    b = 0, a = a + 1;
  }
  $(".timeElapsed").text(a + ":" + b + c);
}

//Column Listeners
function columnsListener() {
  //On Click:
$(".columnOne, .columnTwo, .columnThree").on("click", function () {
  //Set Timer on Initiation of First Turn

  if (i == 0) {
    playTimer = setInterval(myTimer, 1000);
    i = i+2;
  }
  //If Picking Up a Tile:
  if(i%2 == 0) {
    //Do Nothing if there is no Tile to Pick Up
    if ($(this).children().first().length == 0) {
      i = i-1;
    }
    //Select the Top Tile
    $(this).children().first().addClass("active");
    activeSize = $(".active").text();
    i = i+1;
  //If Setting a Tile:
  } else {
    //Compare Selected Tile to Top Tile of Target Column
    comparedSize = $(this).children().first().text();
      //If the target Column is Empty OR if Actice Tile is larger than Compared Tile, place Selected Tile
      if ($(this).children().first().length == 0 || +activeSize < +comparedSize) {
        $(".active").prependTo(this);
        //If you try to place the tile on itself OR if anything else happens, deselect tile and don't add turns
      } else {
        i = i-2;
      }
      //After any of Above, Deselect Tile
      $(".active").removeClass("active");
      i = i+1;
      //If next move will be to Pick Up a Tile, update Turns Elapsed
      if (i%2 == 0) {
        $(".clickScore").text((i/2 - 1) + " Turns");
      }
    }
    //Finally, check if you Won
    checkWin();
  })
}

//Check If You Completed in Fewest Possible Turns
function checkEfficiency() {
  var record = $(".turnRecord").text();
  //If you completed in as few turns as possible for the number of tiles
  if ((i/2 - 1) == +lowestPossible[+numTiles-3]) {
    $(".result").text("You completed the game in as few turns as possible!");
    $(".winScoring").css("visibility", "visible");
    $(".turnRecord").text(+lowestPossible[+numTiles-3]);
    $(".turnRecord").css("color", "green");
    myObject.records[+numTiles-3][3] = +lowestPossible[+numTiles-3];
  } else if ((i/2 - 1) > +lowestPossible[+numTiles-3]) {
    //If you didn't complete as efficiently as possible but beat your score (or there was no score set)
    if ((i/2 - 1) < +record || record == "(Yet!)") {
      $(".result").text("You could've taken fewer turns, though. Try again!");
      $(".winScoring").css("visibility", "visible");
      $(".turnRecord").text((i/2 - 1));
      myObject.records[+numTiles-3][3] = (i/2 - 1);
    //If you DIDN'T beat your record
    } else if ((i/2 - 1) >= +record) {
      $(".result").text("You didn't beat your record, though. Try again!");
      $(".winScoring").css("visibility", "visible");
    }
  } if (a < aSaved){
    //If you took fewer minutes to solve the puzzle
    aSaved = a, bSaved = b, cSaved = c;
    $(".timeRecord").text(a + ":" + b + c);
    myObject.records[+numTiles-3][0] = +a;
    myObject.records[+numTiles-3][1] = +b;
    myObject.records[+numTiles-3][2] = +c;
    //If you took the same number of minutes, but fewer seconds
  } else if (a == aSaved && (b*10 + c) < (bSaved*10 + cSaved)) {
    aSaved = a, bSaved = b, cSaved = c;
    $(".timeRecord").text(a + ":" + b + c);
    myObject.records[+numTiles-3][0] = +a;
    myObject.records[+numTiles-3][1] = +b;
    myObject.records[+numTiles-3][2]= +c;
  }
  //THEN turn off the timer and turn off all Column Listeners
  clearInterval(playTimer);
  $(".columnOne").off();
  $(".columnTwo").off();
  $(".columnThree").off();
  //And Session Store the Update myObject
  sessionStorage.setItem('stored', JSON.stringify(myObject));
}

//Winning
function checkWin() {
  var tilesInOne = $(".columnOne > div").length;
  var tilesInThree = $(".columnThree > div").length
  //Check if Columns One or Two have 7 tiles in them
  if (+tilesInOne == +numTiles || +tilesInThree == +numTiles) {
    //Check HOW you won
    checkEfficiency();
  }
}

//Reset the Board
$(".reset").on("click", function() {
  if ($(".columnOne").children().first().length != 0 || $(".columnTwo").children().first().length != 0 || $(".columnThree").children().first().length != 0) {
    //Set Turns Elapsed to 0 and removed "active" class from active tile (if there is one)
    $(".clickScore").text("0 Turns");
    $(".active").removeClass("active");
    //Append all tilles to Hidden Column
    for (var x = 0; x < numTiles; x++) {
        $(tileIds[x]).appendTo(".hiddenColumn");
        $(tileIds[x]).removeClass("visible");
      }
    //Hide the victory message if it is currently visible and turn off the Timer
    $(".winScoring").css("visibility", "hidden");
    clearInterval(playTimer);
    //Turn off all Listeners on all Columns, then turn them back on
    $(".columnOne").off();
    $(".columnTwo").off();
    $(".columnThree").off();
    //Reactivate button that Places Tiles
    placeTiles();
    $("#tileButton").removeClass("disabled");
    //Reset Timer Values to 0, show timer as 0:00, reset Saved Scores (to be replaced by loaded scores)
    a = 0, b = 0, c = 0;
    aSaved = 999, bSaved = 99, cSaved = 99, turnSaved = 999;
    $(".timeElapsed").text(a + ":" + b + c);
    //Set i (actions elapsed) to 0
    i = 0;
    $(".timeRecord").text("None");
    $(".turnRecord").text("(Yet!)");
    $(".turnRecord").css("color", "black");
    //Scroll to Tile Input
  $("html, body").stop().animate({scrollTop:515}, 1000);
}
})

//Variable that Represents Desired Number of Tiles
var numTiles = 0;
//Function that Places Tiles before Start of Game
function placeTiles() {
  $("#tileButton").on("click", function(){
    numTiles = $("#tileNumber").val();
    if (numTiles != 0) {
      $("#tileNumber").val("");
      for (var x = 0; x < numTiles; x++) {
          $(tileIds[x]).appendTo(".columnTwo");
          $(tileIds[x]).addClass("visible");
        }
      //Scroll the window to the Game
      $("html, body").stop().animate({scrollTop:675}, 1000);
      //Deactivates Tile-Placing Button
      $("#tileButton").addClass("disabled");
      $("#tileButton").off();
      //Run Stored Data Function and Activate Column Listener
      loadSaved();
      columnsListener();
    }
  })
}

//Place the Tiles on Load
placeTiles();

//Limit Numbers that Can be Entered
function handleChange(input) {
  //NEED: Make e invalid
  if (input.value < 3) input.value = 3;
  if (input.value > 7) input.value = 7;
}
