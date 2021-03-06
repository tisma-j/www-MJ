'use strict';

/**
 * Demo.
 */
var transitionPages = (function(window, undefined) {

  /**
   * Enum of CSS selectors.
   */
  var SELECTORS = {
    pattern: '.pattern',
    card: '.card',
    cardImage: '.card__image',
    cardClose: '.div-closecross',
    ajaxContent: '#page',
  };


  /**
   * Container of Card instances.
   */
  var layout = {};

  /**
   * Initialise transitionPages.
   */
  function init() {

    _bindCards();

  };


  /**
   * Bind Card elements.
   * @private
   */
  function _bindCards() {

    var elements = $(SELECTORS.card),
        cardClose = $('body').find(SELECTORS.cardClose);

    elements.each( function(i) {

      var instance = new Card(i, this);

      layout[i] = {
        card: instance
      };

      var cardImage = $(this).find(SELECTORS.cardImage);

      $(cardImage).on('click', {isOpenClick:true, cardId:i}, _playSequence);
      //$(cardImage).on('click', function(){console.log('click !')});
    });

    $(cardClose).on('click', {isOpenClick:false, cardId:-1}, _playSequence);
  };

  /**
   * Create a sequence for the open or close animation and play.
   * @param {boolean} isOpenClick Flag to detect when it's a click to open.
   * @param {number} id The id of the clicked card.
   * @param {Event} e The event object.
   * @private
   *
   */
  function _playSequence(event) {
    let isOpenClick = event.data.isOpenClick,
        id = event.data.cardId,
        cardClose = $('body').find(SELECTORS.cardClose);

    console.log('_playSequence, id avant :'+id);

    if ( id < 0 )
      id = cardClose.data('card');

    console.log('_playSequence, id apres :'+id);

    var card = layout[id].card;

    // Prevent when card already open and user click on image.
    if (card.isOpen && isOpenClick) return;

    // Create timeline for the whole sequence.
    var sequence = new TimelineMax({paused: true, id: 'Main'});

    var tweenOtherCards = _showHideOtherCards(id);

    //var tweenAjaxContent = _showContent();

    if (!card.isOpen) {
      //appCDL.config.$swiperHome.destroy();
      cardClose.data('card', id);

      sequence.add(tweenOtherCards);
      sequence.add(card.openCard(_onCardMove), 0);
      sequence.call(_switchSwiperSlider, 0);
      //sequence.add(tweenAjaxContent);

    } else {
      // Close sequence.

      var closeCard = card.closeCard();
      var position = closeCard.duration() * 0.8; // 80% of close card tween.
      var returnToHome = new TimelineLite;

      onfire.fire('switch_swiper', 'enable');

      returnToHome.to('#page>*', 0.4, {
                y:"+=20",
                alpha:0,
                ease:Power3.esaeOut,
                onComplete:function(){
                  window.location = 'index.html'
                }
              });

      sequence.add(returnToHome);

      sequence.add(closeCard);

      sequence.add(tweenOtherCards, position);


      //appCDL.swiperSlider();
    }

    sequence.play();
  };

  /**
   * Show/Hide all other cards.
   * @param {number} id The id of the clcked card to be avoided.
   * @private
   */
  function _showHideOtherCards(id) {

    var TL = new TimelineLite;

    var selectedCard = layout[id].card;

    for (var i in layout) {

      var card = layout[i].card;

      // When called with `openCard`.
      if (card.id !== id && !selectedCard.isOpen) {
        TL.add(card.hideCard(), 0);
      }

      // When called with `closeCard`.
      if (card.id !== id && selectedCard.isOpen) {
        TL.add(card.showCard(), 0);
      }
    }

    return TL;
  };

  /**
   * Show content when loaded.
   * @private
   */
  function _showContent() {

    var tween = new TimelineLite;

    tween.set($(SELECTORS.ajaxContent), {
      y: window.innerHeight,
      alpha:0
    })
    .to($(SELECTORS.ajaxContent), 10, {
      y: 0,
      alpha:1,
      clearProps: 'all',
      ease: Expo.easeInOut
    });

    return tween;
  };

  /**
   * Show/Hide all other cards.
   * @param {number} id The id of the clcked card to be avoided.
   * @private
   */
  function _switchSwiperSlider() {

    onfire.fire('switch_swiper', 'disable');

  };

  /**
   * Callback to be executed on Tween update, whatever a polygon
   * falls into a circular area defined by the card width the path's
   * CSS class will change accordingly.
   * @param {Object} track The card sizes and position during the floating.
   * @private
   */
  function _onCardMove(track) {
    console.log('update track');

    var radius = track.width / 2;

    var center = {
      x: track.x,
      y: track.y
    };

  }

  /**
   * Detect if a point is inside a circle area.
   * @private
   */
  function _detectPointInCircle(point, radius, center) {

    var xp = point.x;
    var yp = point.y;

    var xc = center.x;
    var yc = center.y;

    var d = radius * radius;

    var isInside = Math.pow(xp - xc, 2) + Math.pow(yp - yc, 2) <= d;

    return isInside;
  };

  // Expose methods.
  return {
    init: init
  };

})(window);

