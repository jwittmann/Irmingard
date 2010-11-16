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
    zIndex: 3000,
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

      dropped_card.position = dropped_on.position + 1;

      //column[$(ui.draggable).data('column')][$(ui.draggable).data('position')];
      //var dropped_card = CardFromDOM($(ui.draggable)column[$(ui.draggable).data('column')][$(ui.draggable).data('position')];
      // console.log(dropped_card);
      $(dropped_card_dom).addClass('zindex_' + (dropped_on.position + 1));
      //$(ui.draggable).className = $(ui.draggable).className.replace(/\bbg.*?\b/g, '12');

      /* $(ui.draggable).removeClass(/\bzindex.*?\b/g);
      $(ui.draggable).addClass('zindex_12'); */
      $(dropped_card_dom).removeClass('zindex_' + dropped_card.position);
      $(dropped_card_dom).css('z-index','15');
      $(dropped_card_dom).css('border','3px solid yellow')
    }
  });

  $('div.card').mouseout(function() {
    $(this).children('.snapper').addClass('active');
  });

});
