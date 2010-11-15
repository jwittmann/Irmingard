function Card (suit, value) {
  this.open = false;

  this.suit = suit;
  if (this.suit == 'hearts')   { this.colour = 'red'; suit_symbol = '♥'; }
  if (this.suit == 'diamonds') { this.colour = 'red'; suit_symbol = '♦'; }
  if (this.suit == 'spades')   { this.colour = 'black'; suit_symbol = '♠'; }
  if (this.suit == 'clubs')    { this.colour = 'black'; suit_symbol = '♣'; }

  this.value = value;

  if (value == 1) this.label = 'Ace';
  if (value > 1 && value < 11) this.label = value.toString();
  if (value == 11) this.label = 'Jack';
  if (value == 12) this.label = 'Queen';
  if (value == 13) this.label = 'King';

  this.full_label = this.label + ' of ' + this.suit;

  this.symbol_label = suit_symbol + ' ' + this.label;

  this.image_path = '/images/' + this.label.toLowerCase() + '_of_' + this.suit.toLowerCase() + ".gif";

  /* this.swapWithCard = function (swapperIndex) {
    var dumpster;
    dumpster = card[this.index];
    card[this.index] = card[swapperIndex];
    card[swapperIndex] = dumpster;
    return;
  } */

}

function shuffleCards () {
  for (i = 1; i <= 9999; i++) {
    var random_a = Math.floor(Math.random() * 104 + 1) // random number from 1 to 104
    var random_b = Math.floor(Math.random() * 104 + 1) // random number from 1 to 104

    var temp = card[random_a];
    card[random_a] = card[random_b];
    card[random_b] = temp;
  }
}



  /*
  for (i = 0; i <= 4; i++) {
    for (j = 1; j <= 5-i; j++) {
      column[5+i] = card[(5-i) + j];
      if (j == (5+i)) column[5-i].open = true;
      
      if (i > 0) {
        column[5-i] = card [];
        if (j == (5-i)) column[5-i].open = true;
      }
    }
  } */


function put (card) {
  
  if (card.open == true) image_path = card.image_path;
  else image_path = '/images/back.gif';
 
  return '<div class="draggable card">\n\
    <img class="card" src="' + image_path + '" />\n\
    <div class="snapper active"> &nbsp; </div>\n\
    </div>';
}

///////////

var card = []
var cards_per_suit = 13;
var total_cards = cards_per_suit * 8; // = 104

// initialize cards
for (var i = 1; i <= 2; i++) {
  
  for (var j = 1; j <= 4; j++) {
    if (j == 1) suit = 'hearts';
    if (j == 2) suit = 'diamonds';
    if (j == 3) suit = 'spades';
    if (j == 4) suit = 'clubs';
    
    for (var k = 1; k <= 13; k++) {
      value = k;
      card[(i-1) * Math.round(total_cards / 2) + (j-1) * cards_per_suit + k] = new Card (suit, value);
    }

  }
}

shuffleCards();

// initialize columns as 2-dimensional array
// 9 = number of columns
// 60 = maximum amount of cards per column; might be too small!
// array index start from 0
// column 0 = stack
// columns 1-9 = playing field
// columns 10 - 17 = eight discard piles
var number_of_columns = 18;
var max_cards_per_column = 60;

var column = new Array(number_of_columns); 
for (i = 0; i < number_of_columns; i++)
  column[i] = new Array(max_cards_per_column);

function dealCards () {
  // rows
  for (i = 1; i <= 5; i++) {
    // columns; first row: 9 cards in 9 columns, second row: 7 cards in 7 columns etc.

    for (j = i; j <= (10 - i); j++) {
      column[j][i] = card[j + (i-1) * (9 - 2 * (i-2))];
      /* if (j == 0 || j == (9 - 2 * (i-1))) column[j+(i-1)][i].open = true;
      else column[j][i].open = false; */
    }
  }
}

dealCards();

//card.swap(39,86);
/*var dump;
dump = card[1];
card[1] = card[2];
card[2] = dump;*/
/* card[1].swapWithCard(86); */

// test data:
/*
test1 = 39;
test2 = 12;

column[1][1] = card[test1];
card[test1].column   = 1;
card[test1].position = 1;

column[1][2] = card[test2];
card[test2].column   = 1;
card[test2].position = 2; */

$(function() {
  $('#column_1').append(put(card[1]));
  $('#column_1').append(put(card[2]));
  $('#column_1').append(put(card[3]));

  $('#column_3').append(put(card[3]));

  $('#column_5').append($('#column_1 .card:first'));

  // populate cards
  /*test_card1 = $('#' + column[1][1].full_label.toLowerCase().replace(/ /g,"_") + ' img');
  test_card2 = $('#' + column[1][2].full_label.toLowerCase().replace(/ /g,"_") + ' img');

  test_card1.attr("src", column[1][1].image_path);
  test_card2.attr("src", column[1][2].image_path); */
  //test_card1.data("suit", column[1][2].suit);
  //test_card2.data('foo', 52);

  $('#frame').append(function(){
    }
  );


  $('div.card').mouseover(function() {
    $(this).children('.snapper').removeClass('active');
  });

  $('.draggable').draggable({
    containment: '#container',
    snap: '.active',
    snapMode: 'inner',
    snapTolerance: 20,
    zIndex: 2700,
    scroll: false,
    start: function(event, ui) { 
      /* $(this).children('.snapper').removeClass('active'); */
      /* $('.draggable').not(this).children('.snapper').addClass('droppable'); */
      var start_pos = $(this).position();
      $("span#start_pos").text("Start POS:\n x: "+ start_pos.left + " // y: " + start_pos.top);
    },
    drag: function(event,ui) {
      var current_pos = $(this).position();
      $("span#current_pos").text("Current POS:\n x: " + current_pos.left + " // y: " + current_pos.top);
    },
    stop: function(event,ui) { 
      /*$(this).children('.snapper').addClass('active'); */
      $('.draggable').not(this).children('.snapper').removeClass('droppable');
      var end_pos = $(this).position();
      $("span#end_pos").text("End POS:\n x: " + end_pos.left + " // y: " + end_pos.top);
    }
  });

  $('div.card').mouseout(function() {
    $(this).children('.snapper').addClass('active');
  });

});
