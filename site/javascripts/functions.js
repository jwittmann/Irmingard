// --- INITIALIZATIONS --------------------------

// card constructor
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
}

// use Card constructor to create all cards in ordered sequence
function createCards() {
  card = []
  var cards_per_suit = 13;
  var suits = 4;
  var card_decks = 2;
  total_cards = suits * cards_per_suit * card_decks; // = 104

  // initialize cards
  for (var i = 1; i <= card_decks; i++) {
  
    for (var j = 1; j <= suits; j++) {
      if (j == 1) suit = 'hearts';
      if (j == 2) suit = 'diamonds';
      if (j == 3) suit = 'spades';
      if (j == 4) suit = 'clubs';
    
      for (var k = 1; k <= cards_per_suit; k++) {
        value = k;
        card[(i-1) * Math.round(total_cards / 2) + (j-1) * cards_per_suit + k] = new Card (suit, value);
      }
    }
  }
}

// initialize columns as 2-dimensional array
function createColumns () {
  var number_of_columns = 18; // column 0 = stack; columns 1-9 = playing field; columns 10-17 = eight discard piles
  var max_cards_per_column = 60;
  column = new Array(number_of_columns); 
  for (i = 0; i < number_of_columns; i++)
    column[i] = new Array(max_cards_per_column);
}
  
// required for custom testing initialization - returns a card object
function findCardByLabel (label_to_find) {
  var return_value = '';
  for (i=1; i<=total_cards; i++) {
    if (card[i].full_label == label_to_find) {
      return_value = card[i]; break;
    }
  }
  return return_value;
}

// shuffles cards by randomly swapping around cards in the card[] array
function shuffleCards () {
  for (i = 1; i <= 9999; i++) {
    var random_a = Math.floor(Math.random()*total_cards) + 1; // random number from 1 to 104
    var random_b = Math.floor(Math.random()*total_cards) + 1; // random number from 1 to 104
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
  // ROWS 
  for (i = 1; i <= 5; i++) {
    // count_helper is required for proper progression through the cards array, it keeps
    // track of how many cards have already been dealt and how deep into the cards array
    // we already went. count_helper should be 9 for i==2; 16 for i==3; 21 for i==4; and 24 for i==5
    if (i > 1) count_helper += (9 - 2*(i-2));
    // COLUMNS; first row: 9 cards in 9 columns, second row: 7 cards in 7 columns etc.
    for (j = i; j <= (10 - i); j++) {
      index_to_be_dealt = count_helper + (j - i + 1);
      if (card[index_to_be_dealt].dealt == false) {
        column[j][i] = card[index_to_be_dealt];
        card[index_to_be_dealt].column   = j;
        card[index_to_be_dealt].position = i;
        card[index_to_be_dealt].dealt = true;
        column[j][i].card_index = index_to_be_dealt;
        if ((j == i) || (j == (10-i))) column[j][i].open = true;
        else column[j][i].open = false;
      }
    }
  }
}

// only required for initialization
function drawToDOM (card) {
  var image_path = '/images/back.gif';
  var open_switcher = '';
  var active_switcher = '';
  
  if (card.open == true) {
    image_path = card.image_path;
    active_switcher = ' active';
    open_switcher = ' open';
  }

  return '<div class="draggable_disabled card' + open_switcher + '" style="z-index:' + card.position + '">\n\
      <img src="' + image_path + '" />\n\
      <div class="snapper' + active_switcher + '"> &nbsp; </div>\n\
    </div>';
}

function populateDOMwithCards () {
  // populate DOM with cards
  for (i = 1; i <= 9; i++) {
    for (j = 1; j <= column[i].counter; j++) {
      $('#column_' + i).append(drawToDOM(column[i][j]));
      $('#column_' + i + ' div.card:nth-child('+ j +')').addClass('position_' + j).data('column',column[i][j].column + '').data('position',column[i][j].position + '');
    }
  }
 
  // add snappers:
  for (i = 1; i <= total_cards; i++) {
    if (card[i].open == true) {
     var open_card = Card2DOM(card[i]);
     $(open_card).removeClass('draggable_disabled').addClass('draggable');
     $('.snapper', open_card).addClass('active');
    }
  }
}


// --- USEFUL STUFF --------------

function DOM2Card(card_dom) {
  return column[$(card_dom).data('column')][$(card_dom).data('position')];
}

function Card2DOM(card) {
  return $('#column_' + card.column + ' .position_' + card.position);
}

// enables visual feedback for dragging & dropping & takes care of snapper bug (cards snap to where their own snapper was before dragging)
$.fn.mouseInteractions = function () {
  $(this).mouseover(function() {
    if ($(this).children('.snapper').hasClass('active')) {
      $(this).children('.snapper').removeClass('active');
    }
  });

  $(this).mousedown(function() {
    $('img', this).css('border','1px solid #0000ff');
  });

  $(this).mouseup(function() {
    $('img', this).css('border','1px solid #cccccc');
  });

  $(this).mouseout(function() {
    var dragged_card = DOM2Card(this);
    if ((dragged_card.open == true) && ((dragged_card.column > 0) && (dragged_card.column < 10)))
      $(this).children('.snapper').addClass('active');
  });
}


// custom jQuery function to make previously de-activated card draggable
// can be chained to any jQuery element - e.g.: $('#queen_of_hearts').makeDraggable();
$.fn.makeDraggable = function () {
  $(this).draggable({
    containment: '#container',
    snap: '.active',
    snapMode: 'inner',
    snapTolerance: 8,
    zIndex: 300,
    revert: 'invalid',
    revertDuration: 350,
    scroll: false,
  });
  $(this).removeClass('draggable_disabled');
  $(this).addClass('draggable');
}


// --- DROP HANDLING ------------------------------

// checks whether cardA can be dropped onto cardB
function canBeDroppedOn (cardA, cardB) {
  if ((cardA.value + 1 == cardB.value) && (cardA.colour != cardB.colour))
    return true;
  else return false;
}

// once a card has been dropped, flip the last card in the column from which the dropped card came & make it draggable
function flipCard(card_to_flip) {
  var card_to_flip_dom = Card2DOM(card_to_flip);
  $('img', card_to_flip_dom).attr('src', card_to_flip.image_path);
  $(card_to_flip_dom).makeDraggable();
  $(card_to_flip_dom).mouseInteractions();
}
