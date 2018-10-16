'use strict';

/**
 * Card.
 */
var Card = (function(window, undefined) {

  /**
   * Enum of CSS selectors.
   */
  var SELECTORS = {
    container: '.card__container',
    content: '.ajax-content',
    clip: '.clip',
    letters: '.titre-section span'
  };

  /**
   * Enum of CSS classes.
   */
  var CLASSES = {
    containerClosed: 'card__container--closed',
    bodyHidden: 'body--hidden'
  };

  /**
   * Card.
   */
  function Card(id, el) {

    this.id = id;

    this._el = el;

    // Get elements.
    this._container = $(this._el).find(SELECTORS.container)[0];
    this._clip = $(this._el).find(SELECTORS.clip)[0];
    this._content = $('body').find(SELECTORS.content)[0];
    this._letters = $('body').find(SELECTORS.letters);

    this.isOpen = false;

    this._TL = null;
  };

  /**
   * Open card.
   * @param {Function} callback The callback `onCardMove`.
   */
  Card.prototype.openCard = function(callback) {

    this._TL = new TimelineMax({id:'card'});

    var slideContentDown = this._slideContentDown();
    //var clipImageIn = this._clipImageIn();
    var floatContainer = this._floatContainer(callback);
    var clipImageOut = this._clipImageOut();
    var fallingLetters = this._fallingLetters();
    //var slideContentUp = this._slideContentUp();

    // Compose sequence and use duration to overlap tweens.
    this._TL.add(slideContentDown);
    //this._TL.add(clipImageIn, 0);
   this._TL.add(floatContainer, 0);
   this._TL.add(fallingLetters, 0);
   //this._TL.add(clipImageOut, floatContainer.duration());
   //this._TL.add(slideContentUp, '-=' + clipImageOut.duration() * 0.6);

    //GSDevTools.create({id:"card"});
    

    this.isOpen = true;

    return this._TL;
  };

  /**
   * Slide content down.
   * @private
   */
  Card.prototype._slideContentDown = function() {

    var tween = TweenLite.to(this._content, 0.8, {
      y: window.innerHeight,
      ease: Expo.easeInOut
    });

    return tween;
  };

  /**
   * Clip image in.
   * @private
   */
  Card.prototype._clipImageIn = function() {

    // Rect.
    var tween = TweenLite.to(this._clip, 0.8, {
        scaleX: 0.4,
        scaleY: 0.3,
      transformOrigin:"50% 50%",
      ease: Power3.easeOut
    });

    return tween;
  };

  /**
   * Float card to final position.
   * @param {Function} callback The callback `onCardMove`.
   * @private
   */
  Card.prototype._floatContainer = function(callback) {

    $(document.body).addClass(CLASSES.bodyHidden);

    let TL            = new TimelineLite,
        rect          = this._container.getBoundingClientRect(),
        windowW       = window.innerWidth,
        windowH       = window.innerHeight;

    var track = {
      width: 0,
      x: rect.left + (rect.width / 2),
      y: rect.top + (rect.height / 2),
    };

    TL.set(this._container, {
      width: rect.width,
      height: rect.height,
      x: rect.left,
      y: rect.top,
      position: 'fixed',
      overflow: 'hidden'
    });

    TL.to([this._container, track], 0.8, {
      x: windowW / 2,
      y: 0,
      xPercent: -50,
      height: windowH*.9*.3,
      ease: Power2.easeOut,
      //clearProps: 'all',
      className: '-=' + CLASSES.containerClosed,
    })
    .to([this._container, track], 0.3, {
      width: windowW * .9,
      //clearProps: 'all',
      className: '-=' + CLASSES.containerClosed,
      ease: Expo.easeIn
    });

    return TL;
  };

  /**
   * Clip image out.
   * @private
   */
  Card.prototype._clipImageOut = function() {
    var windowW = window.innerWidth;

    var tween = TweenLite.to(this._clip, 0.8, {
      scaleX: 1,
      scaleY: 1,
      autoRound: false,
      transformOrigin:"50% 50%",
      smoothOrigin: true,
      ease: Expo.easeInOut
    });

    // Circle.
    // var radius = $(this._clip).attr('r');

    // var tween = this._clipImageIn();

    // tween.vars.attr.r = radius;

    return tween;
  };

  /**
   * Title letters falls
   * @private
   */
  Card.prototype._fallingLetters = function() {
    TweenMax.set(this._letters, {css:{
          backfaceVisibility:"hidden"}});
    var tween = TweenMax.to(this._letters, 2, {css:{rotationX:"+=180"}, ease:Power2.easeInOut});

    return tween;
  };

  /**
   * Slide content up.
   * @private
   */
  Card.prototype._slideContentUp = function() {

    var tween = TweenLite.to(this._content, 1, {
      y: 0,
      clearProps: 'all',
      ease: Expo.easeInOut
    });

    return tween;
  };

  /**
   * Close card.
   */
  Card.prototype.closeCard = function() {

    TweenLite.to(this._container, 0.4, {
      scrollTo: {
        y: 0
      },
      onComplete: function() {
        $(this._container).css('overflow', 'hidden');
      }.bind(this),
      ease: Power2.easeOut
    });

    this._TL.eventCallback('onReverseComplete', function() {

      TweenLite.set([this._container, this._content], {
        clearProps: 'all'
      });

      $(document.body).removeClass(CLASSES.bodyHidden);

      this.isOpen = false;

    }.bind(this));

    return this._TL.reverse();
  };

  /**
   * Hide card, called for all cards except the selected one.
   */
  Card.prototype.hideCard = function() {

    var tween = TweenLite.to(this._el, 0.4, {
      scale: 0.8,
      autoAlpha: 0,
      transformOrigin: 'center bottom',
      ease: Expo.easeInOut
    });

    return tween;
  };

  /**
   * Show card, called for all cards except the selected one.
   */
  Card.prototype.showCard = function() {

    var tween = TweenLite.to(this._el, 0.5, {
      scale: 1,
      autoAlpha: 1,
      clearProps: 'all',
      ease: Expo.easeInOut
    });

    return tween;
  };

  return Card;

})(window);
