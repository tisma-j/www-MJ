'use strict';

/**
 * Demo.
 */
var trasitionPages = (function(window, undefined) {

  /**
   * Enum of CSS selectors.
   */
  var SELECTORS = {
    pattern: '.pattern',
    card: '.card',
    cardImage: '.card__image',
    cardClose: '.card__btn-close',
    ajaxContent: '#page',
  };


  /**
   * Container of Card instances.
   */
  var layout = {};

  /**
   * Initialise trasitionPages.
   */
  function init() {

    _bindCards();
  };


  /**
   * Bind Card elements.
   * @private
   */
  function _bindCards() {

    var elements = $(SELECTORS.card);

    elements.each( function(i) {

      var instance = new Card(i, this);

      layout[i] = {
        card: instance
      };

      var cardImage = $(this).find(SELECTORS.cardImage);
      var cardClose = $('body').find(SELECTORS.cardClose);

      $(cardImage).on('click', {isOpenClick:true, cardId:i}, _playSequence);
      //$(cardImage).on('click', function(){console.log('click !')});
      $(cardClose).on('click', {isOpenClick:false, cardId:i}, _playSequence);
    });
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
    id = event.data.cardId;

    var card = layout[id].card;

    // Prevent when card already open and user click on image.
    if (card.isOpen && isOpenClick) return;

    // Create timeline for the whole sequence.
    var sequence = new TimelineMax({paused: true, id: 'Main'});

    var tweenOtherCards = _showHideOtherCards(id);

    var tweenAjaxContent = _showContent();

    if (!card.isOpen) {
      //appCDL.config.$swiperHome.destroy();

      sequence.add(tweenOtherCards);
      sequence.add(card.openCard(_onCardMove), 0);
      sequence.call(_switchSwiperSlider, 0);

    } else {
      // Close sequence.

      var closeCard = card.closeCard();
      var position = closeCard.duration() * 0.8; // 80% of close card tween.

      onfire.fire('switch_swiper', 'enable');

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

    var tween = TweenLite.to($(SELECTORS.ajaxContent), 1, {
      y: 0,
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

// Kickstart trasitionPages.
window.onload = trasitionPages.init;
