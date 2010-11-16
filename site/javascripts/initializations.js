var card = []
var cards_per_suit = 13;
var suits = 4;
var card_decks = 2;
var total_cards = suits * cards_per_suit * card_decks; // = 104

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

//shuffleCards();

// ===== TESTING ===========
// kos to 5x5
var temp = card[25]; card[25] = card[39]; card[39] = temp;
// qoh to 4x4
var temp = card[22]; card[22] = card[12]; card[12] = temp;
// joc to 3x3
var temp = card[17]; card[17] = card[50]; card[50] = temp; 
// 9os to 1x1
var temp = card[1]; card[1] = card[35]; card[35] = temp;
// 10oh to 9x1
var temp = card[9]; card[9] = card[10]; card[10] = temp;
// 9oc to 8x2
var card_to_set = card_by_label('9 of clubs'); var temp = card[16]; card[16] = card_to_set; card_to_set = temp;

// initialize columns as 2-dimensional array
var number_of_columns = 18; // column 0 = stack; columns 1-9 = playing field; columns 10-17 = eight discard piles
var max_cards_per_column = 60;
var column = new Array(number_of_columns); 
for (i = 0; i < number_of_columns; i++)
  column[i] = new Array(max_cards_per_column);

// dealing 25 cards in total; after this, card[1-25] will have been dealt
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
