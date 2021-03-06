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
  if (value == 1)              this.label = 'Ace';
  if (value > 1 && value < 11) this.label = value.toString();
  if (value == 11)             this.label = 'Jack';
  if (value == 12)             this.label = 'Queen';
  if (value == 13)             this.label = 'King';

  this.full_label = this.label + ' of ' + this.suit;
  this.symbol_label = suit_symbol + ' ' + this.label;
  this.image_path = '/images/' + this.label.toLowerCase() + '_of_' + this.suit.toLowerCase() + ".gif";

  /*this.swapWithCard = function (swapperIndex) {
    var dumpster;
    // console.log(this);
    dumpster = card[this.index];
    card[this.index] = card[swapperIndex];
    card[swapperIndex] = dumpster;
    //return;
  } */
}

function card_by_label (label_to_find) {
  var return_value = '';
  for (i=1; i<=104; i++) {
    if (card[i].full_label == label_to_find) { return_value = card[i]; break; }
  }
  return return_value;
}

function areCompatible (cardA, cardB) {
  if ((cardA.value + 1 == cardB.value) && (cardA.colour != cardB.colour))
    return true;
  else return false;
}

function shuffleCards () {
  for (i = 1; i <= 9999; i++) {
    var random_a = Math.floor(Math.random()*104) + 1; // random number from 1 to 104
    var random_b = Math.floor(Math.random()*104) + 1; // random number from 1 to 104
    // swap random cards
    if (random_a != random_b) {
      var temp = card[random_a];
      card[random_a] = card[random_b];
      card[random_b] = temp;
    }
  }
}

function drawToDOM (card) {
  var image_path = '/images/back.gif';
  if (card.open == true) {
    image_path = card.image_path;
    active_switcher = ' active';
  }
 
  var active_switcher = '';
  if (card.open == true) active_switcher = ' active';
  
  //console.log(card);
  if (card.position == column[card.column].counter) {
  }

  return '<div class="draggable card">\n\
    <img class="card" src="' + image_path + '" />\n\
    <div class="snapper' + active_switcher + '"> &nbsp; </div>\n\
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



// ===== SHUFFLE CARDS =====
//shuffleCards();

// ===== TESTING ===========
// kos to 5x5
var temp = card[25];
card[25] = card[39];
card[39] = temp;

// qoh to 4x4
var temp = card[22];
card[22] = card[12];
card[12] = temp;

// joc to 3x3
var temp = card[17];
card[17] = card[50];
card[50] = temp;

// 9os to 1x1
var temp = card[1];
card[1] = card[35];
card[35] = temp;

// 10oh to 9x1
var temp = card[9];
card[9] = card[10];
card[10] = temp;

// 9oc to 8x2
var card_to_set = card_by_label('9 of clubs');
var temp = card[16];
card[16] = card_to_set;
card_to_set = temp;


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
      
      if (card[index_to_be_dealt].dealt == false) {
        column[j][i] = card[index_to_be_dealt];
        card[index_to_be_dealt].column   = j;
        card[index_to_be_dealt].position = i;
      }
      
      column[j][i].card_index = index_to_be_dealt;
      card[index_to_be_dealt].dealt = true;

      if ((j == i) || (j == (10-i))) column[j][i].open = true;
      else column[j][i].open = false;
    }
  }
}

dealCards();


// ========= TEST DATA start ======

// sort cards for testing purposes
/*column[5][5] = card_by_label('King of spades');
column[4][4] = card_by_label('Queen of hearts');
column[3][3] = card_by_label('Jack of clubs');
column[2][2] = card_by_label('10 of diamonds');
column[1][1] = card_by_label('9 of spades');
column[4][2] = card_by_label('Ace of diamonds');
column[5][4] = card_by_label('7 of clubs');

// make all customly added cards visible (this may also make other default cards visible)
for (i=1; i<=2; i++) {
  for (j=1; j<=5; j++) {
    if (i==2 && j==5) break;
    if (i==1) column[j][j].open = true;
    if (i==2) column[5+j][5-j].open = true;
  }
} */

// ========== END test data ======



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

  // populate DOM with cards
  for (i = 1; i <= 9; i++) {
    for (j = 1; j <= column[i].counter; j++) {
      $('#column_' + i).append(drawToDOM(column[i][j]));
      $('#column_' + i + ' div.card:nth-child('+ j +')').addClass('position_' + j).data('column',column[i][j].column + '').data('position',column[i][j].position + '');
    }
  }

  function CardFromDOM(card) {
    return column[$(card).data('column')][$(card).data('position')];
  }

  function DOMfromCard(card) {
    return $('#column_' + card.column + ' .position_' + card.position);
  }

  /*for (i = 1; i <= 9; i++) {
    for (j=2; j<=60; j++) {
      $('#column_' + i + ' div.card:nth-child('+ j +')').addClass('position_' + j);
      //$('#column_' + i + ' div.card:nth-child('+ j +')').css("top", (j-1)*30+'px').css("position","absolute");
    }
  } */
    

 /* $('#column_1').append(put(card[1]));
  $('#column_1').append(put(card[2]));
  $('#column_1').append(put(card[3]));

  $('#column_3').append(put(card[3]));

  $('#column_5').append($('#column_1 .card:first')); */

  $('div.card').dblclick(function() {
    console.log($(this));
    var current_card = CardFromDOM(this); //column[$(this).data('column')][$(this).data('position')];
    console.log(current_card);
    /*var current_column   = parseInt(current_card.data('column'));
    var current_position = parseInt(current_card.data('position'));
    console.log(current_column);
    console.log(current_position); */

    if (current_card.open == false && current_card.position == column[current_card.column].counter-1) {
      current_card.open = true;
      console.log(current_card.column);
      console.log(current_card.position);
      console.log('#column_' + current_card.column + ' .position_' + current_card.position  +' img');
      $('#column_' + current_card.column + ' .position_' + current_card.position  +' img').attr('src', current_card.image_path);
    }
  });


  $('div.card').mouseover(function() {
    $(this).children('.snapper').removeClass('active');
  });

  $('.draggable').mousedown(function() {
    $('img', this).css('border','1px solid #0000ff');
  });

  $('.draggable').mouseup(function() {
    $('img', this).css('border','1px solid #cccccc');
  });

  $('.draggable').draggable({
    containment: '#container',
    snap: '.active',
    snapMode: 'inner',
    snapTolerance: 8,
    zIndex: 4,
    //opacity: 0.95,
    revert: 'invalid',
    revertDuration: 350,
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
      $('img', this).css('border','1px solid #0000ff');
    },
    stop: function(event,ui) { 
      /*$(this).children('.snapper').addClass('active'); */
      $('.draggable').not(this).children('.snapper').removeClass('droppable');
      $(this).css('z-index','22');
      var end_pos = $(this).position();
      $("span#end_pos").text("End POS:\n x: " + end_pos.left + " // y: " + end_pos.top);
      $('img', this).css('border','1px solid #cccccc');
    }
  });

  $('#column_4 .position_4').draggable({
    scope: 'awaaa'
  });

  $('#column_5 .position_5').bind('dropover', function() {
    $('img', this).css('border', '1px solid blue');
  }); 

  $('#column_5 .position_5').bind('dropout', function() {
    $('img', this).css('border', '1px solid #ccc');
  });

  /* $('column_5 .position_5').bind('drop', function() {
    $('.draggable-ui-dragging').addClass('position_' + ($(this).position + 1)).append($('#column_' + $(this).column + ' .card:first'));
  }); */

  $('#column_5 .position_5').droppable({
    scope: 'awaaa',
    addClasses: false,
    tolerance: 'intersect',
    drop: function(event, ui) {
      //console.log($(this).css('z-index'));
      //var z_index_incremented = parseInt($(this).css('z-index')) + 1;
      //console.log(z_index_incremented + '');
      //console.log($(ui.draggable));
      
      dropped_card_dom = ui.draggable;
      dropped_on_dom   = this;

      $('img', this).css('border', '1px solid #ccc');
      var dropped_card = CardFromDOM(dropped_card_dom);
      var dropped_on   = CardFromDOM(dropped_on_dom);

      /* var dropped_card_dom = DOMfromCard(dropped_card);
      var dropped_on_dom   = DOMfromCard(dropped_card); */

      //column[$(ui.draggable).data('column')][$(ui.draggable).data('position')];
      //var dropped_card = CardFromDOM($(ui.draggable)column[$(ui.draggable).data('column')][$(ui.draggable).data('position')];
      // console.log(dropped_card);
      $(dropped_card_dom).addClass('zindex_' + dropped_card.position);
      //$(ui.draggable).className = $(ui.draggable).className.replace(/\bbg.*?\b/g, '12');

      /* $(ui.draggable).removeClass(/\bzindex.*?\b/g);
      $(ui.draggable).addClass('zindex_12'); */
      $(ui.draggable).removeClass
    }
  });

  $('div.card').mouseout(function() {
    $(this).children('.snapper').addClass('active');
  });

});
