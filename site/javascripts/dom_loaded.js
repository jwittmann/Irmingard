$(function() {

  populateDOMwithCards();

  $('.draggable').mouseInteractions();
  // remove ghost images that would appear when dragging - even if $('.draggable_disabled').draggable('disable') was set
  $('.draggable_disabled').mousedown(function() { return false; });

  $('.draggable').draggable({
    containment: '#container',
    snap: '.active',
    snapMode: 'inner',
    snapTolerance: 8,
    zIndex: 300,
    revert: 'invalid',
    revertDuration: 350,
    scroll: false,
    start: function(event,ui){
             dragStart(this);
           },
    drag: function(event,ui) {
            dragActive(this);
          },
    stop: function(event,ui) { 
            dragStop(this);
          }
  });

  var open_card = new Array();
  for (i = 1; i <= 9; i++) {
    if (column[i][column[i].counter].open == true)
      open_card[i] = column[i][column[i].counter];
  }
  //console.log(open_card[9]);
  //console.log(canBeDroppedOn(open_card[4], open_card[5]));

  for (i = 1; i <= 9; i++) {
    for (j = 1; j <=9; j++) {
      if (j != i) 
        if (canBeDroppedOn(open_card[i], open_card[j])) {
          var drag_me         = open_card[i];
          var drag_me_dom     = Card2DOM(drag_me);
          var drop_target     = open_card[j];
          var drop_target_dom = Card2DOM(drop_target);
          
          $(drag_me_dom).makeDraggable();
          $(drag_me_dom).draggable("option", "scope", drop_target.value + '' + drop_target.colour);
          $(drop_target_dom).droppable(); //makeDropTarget();
          $(drop_target_dom).droppable("option", "scope", drop_target.value + '' + drop_target.colour);
        }
    }
  }

  console.log($(drag_me).draggable("scope"));

  /*$('#column_4 .position_4').draggable({
    scope: 'awaaa'
  });*/

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
      var dropped_card = DOM2Card(dropped_card_dom);
      var dropped_on   = DOM2Card(dropped_on_dom);

      if ((dropped_card.position > 1) && (column[dropped_card.column][dropped_card.position - 1] != undefined)) {
        var card_to_open = column[dropped_card.column][dropped_card.position - 1]
        card_to_open.open = true;
        flipCard(card_to_open);
      }

      // the dropped card's Z-INDEX is updated in draggable's 'stop' event, which is executed AFTER droppable's 'drop'
        
      $(dropped_card_dom).removeClass('position_' + dropped_card.position);
      
      dropped_card.position = dropped_on.position + 1;
      dropped_card.column   = dropped_on.column;

      $(dropped_card_dom).addClass('position_' + dropped_card.position);
      $('#column_' + dropped_card.column).append($(dropped_card_dom));

      $('#column_' + dropped_on.column + ' div.open').wrapAll('<div class="card_wrapper_2 draggable" />');
      var wrapper_vertical_margin = $(dropped_on_dom).css('top');
      $('.card_wrapper_2').css('position', 'absolute');
      $('.card_wrapper_2').css('top', wrapper_vertical_margin);
      $('.card_wrapper_2 div.open:eq(0)').css('top','0').draggable("option", "disabled", true).removeClass('draggable');
      $('.card_wrapper_2 div.open:eq(1)').css('top','30px');
      //$('.card_wrapper_2').css('z-index',dropped_on.position);
      $('.card_wrapper_2').draggable({
        containment: '#container',
        snap: '.active',
        snapMode: 'inner',
        snapTolerance: 8,
        zIndex: 300,
        //opacity: 0.95,
        revert: 'invalid',
        revertDuration: 350,
        scroll: false,
      });

      
      // custom unwrapAll
      //$('.card_wrapper_2').replaceWith($('.card_wrapper_2').contents());


      //$('.card_wrapper_2 ').;

      $(this).droppable("option", "disabled", true);
      
      
      /*$('#column_' + dropped_on.column + ' div.open:first').before('<div class="wrapper">'); // works!
      $(dropped_card_dom).after('</div>'); */


      //$(dropped_card_dom).add('#column_' + dropped_on.column + ' .open').addClass('haha');
      
      
      //  .wrappAll('<div class="wrapper">');

      //column[$(ui.draggable).data('column')][$(ui.draggable).data('position')];
      //var dropped_card = DOM2Card($(ui.draggable)column[$(ui.draggable).data('column')][$(ui.draggable).data('position')];
      // console.log(dropped_card);
      //$(dropped_card_dom).addClass('zindex_' + (dropped_on.position + 1));
      //$(ui.draggable).className = $(ui.draggable).className.replace(/\bbg.*?\b/g, '12');

    }
  });

  $('.draggable').mouseout(function() {
    dragged_card = DOM2Card(this);
    if ((dragged_card.open == true) && ((dragged_card.column > 0) && (dragged_card.column < 10)))
      $(this).children('.snapper').addClass('active');
  });

});
