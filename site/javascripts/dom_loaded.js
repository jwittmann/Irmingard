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

 
  // add snappers:
  for (i = 1; i<=104; i++) {
    if (card[i].open == true) {
     var open_card = DOMfromCard(card[i]);
     $(open_card).removeClass('draggable_disabled').addClass('draggable');
     $('.snapper', open_card).addClass('active');
    }
  }

  $('.draggable').mouseover(function() {
    if ($(this).children('.snapper').hasClass('active')) {
      $(this).children('.snapper').removeClass('active');
    }
  });

  $('.draggable').mousedown(function() {
    $('img', this).css('border','1px solid #0000ff');
  });

  $('.draggable').mouseup(function() {
    $('img', this).css('border','1px solid #cccccc');
  });

  // remove ghost images that would appear when dragging - even if $('.draggable_disabled').draggable('disable') was set
  $('.draggable_disabled').mousedown(function() {
    return false;
  });

  $('.draggable').draggable({
    containment: '#container',
    snap: '.active',
    snapMode: 'inner',
    snapTolerance: 8,
    zIndex: 300,
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
      //$(this).css('z-index','22');
      var end_pos = $(this).position();
      $("span#end_pos").text("End POS:\n x: " + end_pos.left + " // y: " + end_pos.top);
      $('img', this).css('border','1px solid #cccccc');
      var card = CardFromDOM(this);
      $(this).css('z-index', (card.position + ''));
      $(this).css('left','0px');
      $(this).css('top', (card.position - 1) * 30 + 'px');
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
      
      var dropped_card_dom = ui.draggable;
      var dropped_on_dom   = this;

      $('img', this).css('border', '1px solid #ccc');
      var dropped_card = CardFromDOM(dropped_card_dom);
      var dropped_on   = CardFromDOM(dropped_on_dom);

      if ((dropped_card.position > 1) && (column[dropped_card.column][dropped_card.position - 1] != undefined)) {
        var card_to_open = column[dropped_card.column][dropped_card.position - 1]
        card_to_open.open = true;
        OpenCard(card_to_open);
      }

      // the dropped card's Z-INDEX is updated in draggable's 'stop' event, which is executed AFTER droppable's 'drop'
        
      $(dropped_card_dom).removeClass('position_' + dropped_card.position);
      
      dropped_card.position = dropped_on.position + 1;
      dropped_card.column   = dropped_on.column;

      $(dropped_card_dom).addClass('position_' + dropped_card.position);
      $('#column_' + dropped_card.column).append($(dropped_card_dom));

     
      $('#column_' + dropped_on.column + ' .open').addClass('haha'); // works!

      //$(dropped_card_dom).add('#column_' + dropped_on.column + ' .open').addClass('haha');
      
      
      //  .wrappAll('<div class="wrapper">');

      //column[$(ui.draggable).data('column')][$(ui.draggable).data('position')];
      //var dropped_card = CardFromDOM($(ui.draggable)column[$(ui.draggable).data('column')][$(ui.draggable).data('position')];
      // console.log(dropped_card);
      //$(dropped_card_dom).addClass('zindex_' + (dropped_on.position + 1));
      //$(ui.draggable).className = $(ui.draggable).className.replace(/\bbg.*?\b/g, '12');

    }
  });

  $('.draggable').mouseout(function() {
    $(this).children('.snapper').addClass('active');
  });

});
