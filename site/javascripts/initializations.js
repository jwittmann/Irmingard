createCards();
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
var card_to_set = findCardByLabel('9 of clubs'); var temp = card[16]; card[16] = card_to_set; card_to_set = temp;

createColumns();

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
