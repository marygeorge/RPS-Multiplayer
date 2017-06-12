sessionStorage.clear();
 // Initialize Firebase
  var config = {
    apiKey: "AIzaSyB5UV5g3_4wHmfbfObywtiPk318NNY_2XI",
    authDomain: "rps-multiplayer-e669d.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-e669d.firebaseio.com",
    projectId: "rps-multiplayer-e669d",
    storageBucket: "rps-multiplayer-e669d.appspot.com",
    messagingSenderId: "109506467087"
  };
  firebase.initializeApp(config);
// Create a variable to reference the database
var database = firebase.database();
// stores the players value.
var player={
    playerNo:0,
    name:"",
    playerChoice:"",
    wins:0,
    losses:0
}
//variable in database to check whose turn is next
database.ref().set({
            whichPlayerTurn:1
            });
var playerNum=1; //to set the player as player1/player2
var player1Choice="";
var player2Choice="";
var player1Wins=0; 
var player2Wins=0;
var player1Loss=0; 
var player2Loss=0;
var ties=0;
//var readyToPlay=false;
$("#getName").on("click",getPlayerName);
$(".rpsButton").on("click",rpsSelect);
$("#sendMsg").on("click",sendMessage);
$("#chatText").val("");
//----------database---------------------------------------

database.ref().on("value", function(snapshot) {
    //-----If exists set Initial values----------------------
        if(snapshot.val().player1 != undefined )//if there is already a player1
        {
            player=snapshot.val().player1;
            //console.log(snapshot.val().player1);
            playerNum=2;
        }
    },
    function(error)
    {console.log(error.code);}
);

// when player1 values change
//*************problem not getting triggered when the player chooses the same choice again
database.ref("/player1").on("value", function(childSnapshot){
        player1Choice=childSnapshot.val().playerChoice;
        if(player1Choice!="")
        {
            database.ref().set({
                    whichPlayerTurn:2
                });
        }
    },
    function(error){console.log(error.code);}
);

//when player2 values change. check for winner is called here
database.ref("/player2").on("value", function(childSnapshot){
    player2Choice=childSnapshot.val().playerChoice;
    console.log("player2 chose "+player2Choice);
    if(player1Choice!=undefined && player2Choice!=undefined)
    {
        alert(player1Choice+"-"+player2Choice);
        whoWon(player1Choice,player2Choice);
    }
},
function(error){console.log(error.code);}
);

database.ref("/chatMessages").on("value",function(snapshot){
    console.log(snapshot.val());
    $("#chatScreen").append(snapshot.val());
});

//------Functions--------------------------------------------
function setPlayer1Div()
{
    //console.log("player1="+player);
    $("#player1Name").html(player.name);
    $("#play1Choices").show();
}
function setPlayer2Div()
{
    //console.log("player2="+player);
    $("#player2Name").html(player.name);
    $("#play2Choices").show();
}
//get the user value and sets it to player1/player2 in database depending on playerNum
function getPlayerName()
{
    var p=$("#nameText").val().trim();
    player={
            name:p,
            playerNo:playerNum,
            wins:0,
            losses:0
    }
    if(p!="")
    {
         $("#greet").html("Hello " + player.name + "!  " );
         $("#turnText").html("You are player "+playerNum)
        if(playerNum===1)
        {
            sessionStorage.setItem("me",1);//session variable
            $("#play1Choices").show();
            database.ref().update({
            player1:player
            });
            setPlayer1Div();
        }
        else if(playerNum===2)
        {
            sessionStorage.setItem("me",2);//session variable
            $("#play2Choices").show();
            database.ref().update({
            player2: player
            });
            setPlayer2Div();
        }

    }
    $("#enter").hide();
    $("#intro").show();

}


//when player selects a choice
function rpsSelect()
{
   // console.log($(this).attr("data"));
    var id=$(this).attr("id");
    id=id.substring(2,1);
    player.playerChoice=$(this).attr("data");
    if(id==="1")
    {
        //console.log("player1 "+ player.playerChoice)
        database.ref().update({
           player1: player
        });
    }
    else if(id==="2")
    {
       // console.log("player2 "+ player.playerChoice)
        database.ref().update({
           player2: player
        });
    }
}

//logic to determine the winner
function whoWon(player1Choice,player2Choice)
{
    console.log("check1: "+player1Choice);
    console.log("check2: "+player2Choice);
    var winner="";
     if ((player1Choice === "rock") && (player2Choice === "s")) {
            player1Wins++;
            player2Loss++;
            winner="1";
          }
          else if ((player1Choice === "rock") && (player2Choice === "paper")) {
            player2Wins++;
            player1Loss++;
            winner="2";
          }
          else if ((player1Choice === "scissor") && (player2Choice === "rock")) {
            player2Wins++;
            player1Loss++;
            winner="2";
          }
          else if ((player1Choice === "scissor") && (player2Choice === "paper")) {
            player1Wins++;
            player2Loss++;
            winner="1";
          }
          else if ((player1Choice === "paper") && (player2Choice === "rock")) {
            player1Wins++;
            player2Loss++;
            winner="1";
          }
          else if ((player1Choice === "paper") && (player2Choice === "scissor")) {
            player2Wins++;
            player1Loss++;
            winner="2";
          }
          else if (player1Choice === player2Choice) {
            ties++;
            winner="0";
          }
          console.log(player1Wins);
          console.log(player2Wins);
          console.log(ties);
          $("#player1Wins").html("Wins: "+player1Wins);
          $("#player1Lose").html("Losses: "+ player1Loss);
          $("#player2Wins").html("Wins: "+player2Wins);
          $("#player2Lose").html("Losses: "+ player2Loss);
         
          displayWinner(winner);
         
}

function displayWinner(winner)
{
console.log("playerNum"+sessionStorage.getItem("me"));
          console.log("winner"+winner);
          if(sessionStorage.getItem("me")===winner )
            {
                $("#gameResult").html("You Won!");
            }
            else
            {
                $("#gameResult").html("You Lost!");
            }
        if(winner==="0")
        {
                $("#gameResult").html("It's a tie");
        }
        database.ref().set({
                    whichPlayerTurn:1
                });
          
}

function sendMessage()
{
    event.preventDefault();
    var msg=$("#chatText").val().trim();
    msg=player.name+":"+msg + "\n";
    console.log (msg);
    database.ref().set({
                    chatMessages:msg
                });
}