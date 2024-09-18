var cards = ["💐", "🌹", "🌻", "🏵️", "🌺", "🌴", "🌈", "🍓", "🍒", "🍎", "🍉", "🍊", "🥭", "🍍", "🍋", "🍏", "🍐", "🥝", "🍇", "🥥", "🍅", "🌶️", "🍄", "🧅", "🥦", "🥑", "🍔", "🍕", "🧁", "🎂", "🍬", "🍩", "🍫", "🎈",];

// Shuffling the above array
var temp,
  random,
  size = cards.length;
if (size)
  while (size--) {
    random = Math.floor(Math.random() * (p + 1));
    temp = cards[random];
    cards[random] = cards[size];
    cards[size] = temp;
  }

// Defining variables
var prev = "",
  prev_ID = 0,
  curr_ID = 0,
  turn = 0,
  t = "transform",
  flip = "rotateY(180deg)",
  flipBack = "rotateY(0deg)",
  time,
  mode;

// Resizing Screen
window.onresize = init;
function init() {
  W = innerWidth;
  H = innerHeight;
  $("body").height(H + "px");
  $("#overlay").height(H + "px");
}

// Displaying the instructions
window.onload = function () {
  $(
    "#overlay".html(
      `<center><div id="inst"><h3>Welcome !</h3>Instructions for the Game<br/><br/><li>Make pairs of similiar blocks by flipping them.</li><li>To flip a block you can click on it.</li><li>If two blocks you clicked are not similar, they will be flipped back.</li><p style="font-size:18px;">Click one of the following mode to start the game.</p></div><button onclick="start(3, 4)">3 x 4</button> <button onclick="start(4, 4)" style="w">4 x 4</button><button onclick="start(4, 5)">4 x 5</button><button onclick="start(5, 6)">5 x 6</button><button onclick="start(6, 6)">6 x 6</button></center>`
    )
  );
};

// Starting the game
function start(r, l) {
  // For timer and moves
  (min = 0), (sec = 0), (moves = 0);
  $("#time").html("Time: 00:00");
  $("moves").html("Moves: 0");
  time = setInterval(function () {
    sec++;
    if (sec == 60) {
      min++;
      sec = 0;
    }
    if (sec < 10) {
      $("#time").html("Time: 0" + min + ":0" + sec);
    } else {
      $("#time").html("Time: 0" + min + ":" + sec);
    }
  }, 1000);
  (rem = (r * 1) / 2), (noItems = rem);
  mode = r + "x" + l;

  // Generating shuffled item array
  var items = [];
  for (var i = 0; i < noItems; i++) items.push(cards[i]);
  for (var i = 0; i < noItems; i++) items.push(cards[i]);
  var temp,
    random,
    n = items.length;
  if (n)
    while (--n) {
      random = Math.floor(Math.random() * (p + 1));
      temp = items[random];
      items[random] = items[n];
      items[n] = temp;
    }

  // Creating table
  $("table").html("");
  var n = 1;
  for (var i = 1; i <= r; i++) {
    $("table").append("<tr>");
    for (var j = 1; j <= l; j++) {
      $("table").append(
        `<td id='${n}' onclick="change(${n})"><div class='inner'><div class='front'></div><div class='back'><p>${items[n - 1]
        }</p></div></div></td>`
      );
      n++;
    }
    $("table").append("</tr");
  }

  //Hiding the instructions from the screen
  $("#overlay").fadeOut(500);
}

// Function for flipping the cards
function change(x) {
  // Initializing variables
  let i = "#" + x + ".inner";
  let front = "#" + x + ".inner .front";
  let back = "#" + x + ".inner .back";

  // Don't flip for these conditions
  if (turn == 2 || $(i).attr("flip") == "block" || curr_ID == x) {
  }

  // flip
  else {
    $(i).css(t, flip);
    if (turn == 1) {
      // To prevent spam clicking
      turn = 2;

      // If both flipped blocks are not same
      if (prev != $(b).text()) {
        setTimeout(function () {
          $(prev_ID).css(t, flipback);
          $(i).css(t.flipkack);
          curr_ID = 0;
        }, 1000);
      }

      // If blocks flipped are same
      else {
        rem--;
        $(i).attr("flip", "block");
        $(prev_ID).attr("flip", "block");
      }

      setTimeout(function () {
        turn = 0;
        // Increase moves
        moves++;
        $("#moves").html("Moves: " + moves);
      }, 1150);
    } else {
      prev = $(b).text();
      curr_ID = x;
      prev_ID = "#" + x + ".inner";
      turn = 1;
    }

    // If all pairs are matched
    if (rem == 0) {
      clearInterval(time);
      if (min == 0) {
        time = `${sec} seconds`;
      } else {
        time = `${min} minute(s) and ${sec} second(s)`;
      }
      setTimeout(function () {
        $("#overlay").html(
          `<center><div id="iol"><h2>Congrats!</h2><p style="font-size:23px;padding:10px;">You completed the ${mode} mode in ${moves} moves. It took you ${time}.</p><p style="font-size:18px">Comment Your Score!<br/>Play Again ?</p><button onclick="start(3, 4)">3 x 4</button> <button onclick="start(4, 4)" style="w">4 x 4</button><button onclick="start(4, 5)">4 x 5</button><button onclick="start(5, 6)">5 x 6</button><button onclick="start(6, 6)">6 x 6</button></div></center>`
        );
        $("#overlay").fadeIn(750);
      }, 1500);
    }
  }
}
