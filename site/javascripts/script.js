function Card (suit, value) {
  this.open = false;
  this.dealt = false;

  var suit_symbol;
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

  /*this.swapWithCard = function (swapperIndex) {
    var dumpster;
    console.log(this);
    dumpster = card[this.index];
    card[this.index] = card[swapperIndex];
    card[swapperIndex] = dumpster;
    return;
  } */

}

function shuffleCards () {
  for (i = 1; i <= 9999; i++) {
    var random_a = Math.floor(Math.random()*104) + 1; // random number from 1 to 104
    var random_b = Math.floor(Math.random()*104) + 1; // random number from 1 to 104
    /*console.log(random_a);
    console.log(random_b);
    if (card[random_a])
      card[random_a].swapWithCard(random_b); */
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

// dealing 25 cards in total, after this card[1-25] will have been dealt
function dealCards () {
  var count_helper = 0;

  // rows
  for (i = 1; i <= 5; i++) {

    // count_helper is required for proper progression through cards array, it keeps
    // track of how many cards have already been dealt and how deep into the cards array
    // we already went.
    // count_helper should be 9 for i==2; 16 for i==3; 21 for i==4; and 24 for i==5
    if (i > 1) count_helper += (9 - 2*(i-2));

    // columns; first row: 9 cards in 9 columns, second row: 7 cards in 7 columns etc.
    for (j = i; j <= (10 - i); j++) {
      index_to_be_dealt = count_helper + (j - i + 1);
      
      if (card[index_to_be_dealt].dealt == false)
        column[j][i] = card[index_to_be_dealt];
      
      column[j][i].card_index = index_to_be_dealt;
      card[index_to_be_dealt].dealt = true;

      if ((j == i) || (j == (10-i))) column[j][i].open = true;
      else column[j][i].open = false;
    }
  }
}

dealCards();
// initialize column counters
column[1].counter = 1;
column[2].counter = 2;
column[3].counter = 3;
column[4].counter = 4;
column[5].counter = 5;
column[6].counter = 4;
column[7].counter = 3;
column[8].counter = 2;
column[9].counter = 1;


$(function() {
  for (i = 1; i <= 9; i++) {
    for (j = 1; j <= column[i].counter; j++) {
      $('#column_' + i).append(put(column[i][j]));
    }
  }

  for (i = 1; i <= 9; i++) {
    for (j=2; j<=60; j++) {
      $('#column_' + i + ' div.card:nth-child('+ j +')').addClass('position_' + j);
      //$('#column_' + i + ' div.card:nth-child('+ j +')').css("top", (j-1)*30+'px').css("position","absolute");
    }
  }
    

 /* $('#column_1').append(put(card[1]));
  $('#column_1').append(put(card[2]));
  $('#column_1').append(put(card[3]));

  $('#column_3').append(put(card[3]));

  $('#column_5').append($('#column_1 .card:first')); */


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
