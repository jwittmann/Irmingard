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

// deals cards to column[][] array - not to the DOM
function dealCards () {
  var count_helper = 0;
  // rows
  for (i = 1; i <= 5; i++) {

    // count_helper is required for proper progression through the cards array, it keeps
    // track of how many cards have already been dealt and how deep into the cards array
    // we already went. count_helper should be 9 for i==2; 16 for i==3; 21 for i==4; and 24 for i==5
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

  return '<div class="draggable_disabled card" style="z-index:' + card.position + '">\n\
    <img class="card" src="' + image_path + '" />\n\
    <div class="snapper' + active_switcher + '"> &nbsp; </div>\n\
    </div>';
}


function OpenCard(card) {
    //console.log($(this));
    //column[$(this).data('column')][$(this).data('position')];
    //console.log(current_card);
    /*var current_column   = parseInt(current_card.data('column'));
    var current_position = parseInt(current_card.data('position'));
    console.log(current_column);
    console.log(current_position); */

    //if (current_card.open == false && current_card.position == column[current_card.column].counter-1) {
      //current_card.open = true;
      //console.log(current_card.column);
      //console.log(current_card.position);
      //console.log('#column_' + current_card.column + ' .position_' + current_card.position  +' img');
  $('#column_' + card.column + ' .position_' + card.position  +' img').attr('src', card.image_path);
    //}
}
