function checkLogin() {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
        window.location.href = 'index.html'; // Redirect to login page if not logged in
    } else {
        document.getElementById('username').textContent = currentUser;
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

function initializeUserData(username) {
    const userData = JSON.parse(localStorage.getItem(username)) || {};
    const modes = ['3x4', '4x4', '4x5', '5x6', '6x6'];
    
    modes.forEach(mode => {
        if (!userData[mode]) {
            userData[mode] = { leastMoves: -1, leastTime: -1 };
        }
    });
    
    localStorage.setItem(username, JSON.stringify(userData));
    return userData;
}

function loadHighScore(gameMode) {
    const currentUser = localStorage.getItem('currentUser');
    const userData = JSON.parse(localStorage.getItem(currentUser)) || initializeUserData(currentUser);
    const modeScore = userData[gameMode] || { leastMoves: -1, leastTime: -1 };
    
    document.getElementById('least-moves').textContent = modeScore.leastMoves === -1 ? 'N/A' : modeScore.leastMoves;
    document.getElementById('least-time').textContent = modeScore.leastTime === -1 ? 'N/A' : formatTime(modeScore.leastTime);
}

function updateHighScore(gameMode, moves, time) {
    const currentUser = localStorage.getItem('currentUser');
    const userData = JSON.parse(localStorage.getItem(currentUser)) || initializeUserData(currentUser);
    const currentModeScore = userData[gameMode];
    
    let updated = false;

    if (currentModeScore.leastMoves === -1 || moves < currentModeScore.leastMoves) {
        currentModeScore.leastMoves = moves;
        updated = true;
    }

    if (currentModeScore.leastTime === -1 || time < currentModeScore.leastTime) {
        currentModeScore.leastTime = time;
        updated = true;
    }

    if (updated) {
        userData[gameMode] = currentModeScore;
        localStorage.setItem(currentUser, JSON.stringify(userData));
        loadHighScore(gameMode);
    }
}

function formatTime(seconds) {
    if (seconds === 'N/A') return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    
    let timeString = '';
    if (mins > 0) {
        timeString += `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
        if (secs > 0) timeString += ' and ';
    }
    if (secs > 0 || mins === 0) {
        timeString += `${secs} ${secs === 1 ? 'second' : 'seconds'}`;
    }
    return timeString;
}

var cards = ["💐","🌹","🌻","🏵️","🌺","🌴","🌈","🍓","🍒","🍎","🍉","🍊","🥭","🍍","🍋","🍏","🍐","🥝","🍇","🥥","🍅","🌶️","🍄","🧅","🥦","🥑","🍔","🍕","🧁","🎂","🍬","🍩","🍫","🎈"];
//Shuffling above array
var temp, random, p = cards.length;
if(p) while(--p) {
   random = Math.floor(Math.random() * (p + 1));
   temp = cards[random];
   cards[random] = cards[p];
   cards[p] = temp;
}

//Variables
var pre="", prev_ID, curr_ID=0, turn=0, t="transform", flip="rotateY(180deg)", flipBack="rotateY(0deg)", time, mode;

//Resizing Screen
window.onresize = init;
function init() {
   W = innerWidth;
   H = innerHeight;
   $('body').height(H+"px");
   $('#overlay').height(H+"px");
}

//Showing instructions
window.onload = function() {
    checkLogin();
    $("#overlay").html(`<center><div id="inst"><h3>Welcome !</h3>Instructions For Game<br/><br/><li>Make pairs of similiar blocks by flipping them.</li><li>To flip a block you can click on it.</li><li>If two blocks you clicked are not similar, they will be flipped back.</li><p style="font-size:18px;">Click one of the following mode to start the game.</p></div><button onclick="start(3, 4)">3 x 4</button> <button onclick="start(4, 4)" style="w">4 x 4</button><button onclick="start(4, 5)">4 x 5</button><button onclick="start(5, 6)">5 x 6</button><button onclick="start(6, 6)">6 x 6</button></center>`);
}

let timerInterval;

//Starting the game
function start(r,l) {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    //Timer and moves
    min=0, sec=0, moves=0;
    $("#time").html("Time: 00:00");
    $("#moves").html("Moves: 0");
    timerInterval = setInterval(function() {
      sec++;
      if(sec==60) {
          min++; sec=0;
      }
      if(sec<10) 
          $("#time").html("Time: 0"+min+":0"+sec);
      else 
        $("#time").html("Time: 0"+min+":"+sec);
    }, 1000);
    rem=r*l/2, noItems=rem;
    mode = r+"x"+l;
    loadHighScore(mode);
    //Generating item array and shuffling it
    var items = [];
    for (var i=0;i<noItems;i++)
        items.push(cards[i]);
    for (var i=0;i<noItems;i++)
        items.push(cards[i]);
    var temp, c, p = items.length;
    if(p) while(--p) {
        c = Math.floor(Math.random() * (p + 1));
        temp = items[c];
        items[c] = items[p];
        items[p] = temp;
    }
    
    //Creating table
    $("table").html("");
    var n=1;
    for (var i = 1;i<=r;i++) {
        $("table").append("<tr>");
        for (var j = 1;j<=l;j++) {
           $("table").append(`<td id='${n}' onclick="change(${n})"><div class='inner'><div class='front'></div><div class='back'><p>${items[n-1]}</p></div></div></td>`);
           n++;
         }
         $("table").append("</tr>");
    }
    
    //Hiding instructions screen
    $("#overlay").fadeOut(500);
}

//Function for flipping blocks
function change(x) {
  //Variables
  let i = "#"+x+" .inner";
  let f = "#"+x+" .inner .front";
  let b = "#"+x+" .inner .back";
  
  //Dont flip for these conditions
  if (turn==2 || $(i).attr("flip")=="block" || curr_ID==x) {}
  
  //Flip
  else {
    $(i).css(t, flip);
    if (turn==1) {
      //This value will prevent spam clicking
      turn=2;
      
      //If both flipped blocks are not same
      if (pre!=$(b).text()) {
         setTimeout(function() {
            $(prev_ID).css(t, flipBack);
            $(i).css(t, flipBack);
            curr_ID=0;
         },1000);
      }
      
      //If blocks flipped are same
      else {
          rem--;
          $(i).attr("flip", "block");
          $(prev_ID).attr("flip", "block");
      }
      
      setTimeout(function() {
         turn=0;
         //Increase moves
         moves++;
         $("#moves").html("Moves: "+moves);
      },1150);
      
    }
    else {
      pre = $(b).text();
      curr_ID = x;
      prev_ID = "#"+x+" .inner";
      turn=1;
    }
    
    //If all pairs are matched
    if (rem == 0) {
        clearInterval(timerInterval);
        const finalTime = min * 60 + sec;
        updateHighScore(mode, moves + 1, finalTime);
        
        setTimeout(function() {
            $("#overlay").html(`
                <center>
                    <div id="completed-overlay">
                        <h1>Congrats!</h1>
                        <p style="font-size:23px;padding:8px;">You completed the ${mode} mode in ${moves} moves.<br>It took you ${formatTime(finalTime)}.</p>
                        <div style="display: flex; justify-content: space-between; width: 80%; margin: 20px auto; font-size:18px;">
                            <div style="text-align: left;">
                                <div>Moves: ${moves}</div>
                                <div>Least Moves: ${document.getElementById('least-moves').textContent}</div>
                            </div>
                            <div style="text-align: left;">
                                <div>Time: ${formatTime(finalTime)}</div>
                                <div>Least Time: ${document.getElementById('least-time').textContent}</div>
                            </div>
                        </div>
                        <p style="font-size:18px">Play Again ?</p>
                        <button onclick="start(3, 4)">3 x 4</button>
                        <button onclick="start(4, 4)">4 x 4</button>
                        <button onclick="start(4, 5)">4 x 5</button>
                        <button onclick="start(5, 6)">5 x 6</button>
                        <button onclick="start(6, 6)">6 x 6</button>
                    </div>
                </center>`);
            $("#overlay").fadeIn(750);
        }, 1500);
    }
  }
}