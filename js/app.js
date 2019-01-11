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
    this._letters = $(this._el).parent('.swiper-slide').find(SELECTORS.letters);

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
    TweenMax.set('.swiper-slide', {css:{
      transformStyle:"preserve-3d",
      perspective: 500,
      z:0
    }});
    
    TweenMax.set(this._letters, {css:{
          backfaceVisibility:"hidden"}});
    var tween = TweenMax.staggerTo(this._letters, 0.4, {autoAlpha:0, y:"+=20", ease:Power2.easeInOut}, 0.1);

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
        y: 0
      ,
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

// Kickstart transitionPages.
window.onload = transitionPages.init;

/**
 * File app.js.
 *
 * Theme scripts
 *
 */
var appCDL = null;

/*
 * CODE SPECIFIQUE SITE WEB
 */


( function( $ ) {
	'use strict';

    $.exists = function(selector) {
        return ($(selector).length > 0);
    };

	appCDL = {
		
		/**
		 * Main init function
		 *
		 * @since 1.0.0
		 */
		init : function() {
			this.config();
			this.bindEvents();
		},

		/**
		 * Cache Elements
		 *
		 * @since 1.0.0
		 */
		config : function() {

			this.config = {
				// Main
				$window                 : $( window ),
				$document               : $( document ),
				$windowWidth            : $( window ).width(),
				$windowHeight           : $( window ).height(),
				$windowTop              : $( window ).scrollTop(),
				$body                   : $( 'body' ),
				$viewportWidth          : '',
				$is_rtl                 : false,
				$wpAdminBar             : null,
				$eltDom	                : null,

				// Mobile
				$isMobile               : false,
				$mobileMenuStyle        : null,
				$mobileMenuToggleStyle  : null,
				$mobileMenuBreakpoint   : 992,

				// Header
				$siteHeader             : $('header'),
				$siteHeaderStyle        : null,
				$siteHeaderHeight       : 0,
				$siteHeaderTop          : 0,
				$siteHeaderBottom       : 0,
				$verticalHeaderActive   : false,
				$hasHeaderOverlay       : false,
				$hasStickyHeader        : false,
				$hasStickyMobileHeader  : false,
				$hasStickyNavbar        : false,

				// Slider home
				$swiperHome              : null,

				// Logo
				$siteLogo               : null,
				$siteLogoHeight         : 0,
				$siteLogoSrc            : null,
				$siteNavWrap            : null,
				$siteNavDropdowns       : null,

				// Local Scroll
				$localScrollTargets     : 'li.local-scroll a, a.local-scroll, .local-scroll-link',
				$localScrollOffset      : 0,
				$localScrollSpeed       : 600,
				$localScrollSections    : [],	

				// Topbar
				$hasTopBar              : false,
				$hasStickyTopBar        : false,
				$stickyTopBar           : null,
				$hasStickyTopBarMobile  : false,

				// Footer
				$hasFixedFooter         : false
			};

		},

		bindEvents: function() {
			var self = this;

			 // sxupjs events
			document.addEventListener('swup:contentReplaced', event => {
				//console.log();
			    swup.options.elements.forEach((selector) => {
			        console.log(selector);
			    })
			});

			// Run on document ready
			self.config.$document.ready( function() {

				// Update vars on init
				self.initUpdateConfig();

				// init Page Transitions
				self.initPageTransitions();

				// init burger Menu
				self.initBurger();

				// Owl Carousel2 Thumbs
				//self.owlCarouselThumb();

				// Animations on scroll
				self.initDelighters();

				// Swiper slider
				self.swiperSlider();

				// Lightbox image with Magnific Poup
				self.magnificPopup();

			} );

			// Run on Window Load
			self.config.$window.on( 'load', function() {
				var $headerStyle = self.config.$siteHeaderStyle;

				// Update config on window load
				self.windowLoadUpdateConfig();

				if ($.exists('body.home') )
				    self.initHome();

				// Scroll to hash
				window.setTimeout( function() {
					self.scrollMonitor();
					self.scrollToHash( self );
					self.config.$body.addClass( 'is-loaded' );
					self.config.$body.find('.site-loader').removeClass( 'is-visible' );
				}, 500 );

			} );

			// Run on Window Resize
			self.config.$window.resize( function() {

				// Window width change
				if ( self.config.$window.width() != self.config.$windowWidth ) {
					self.resizeUpdateConfig(); // update vars
				}

				// Window height change
				if ( self.config.$window.height() != self.config.$windowHeight ) {
				}

			} );

			// Run on Scroll
			//self.config.$window.scroll( function() {
				//self.config.$windowTop = self.config.$window.scrollTop();				
			//} );

			// On orientation change
			self.config.$window.on( 'orientationchange',function() {
				self.resizeUpdateConfig();
			} );
		},

		/**
		 * Updates config on doc ready
		 *
		 * @since 1.0.0
		 */
		initUpdateConfig: function() {

			// Get Viewport width
			this.config.$viewportWidth = this.viewportWidth();

			// Mobile check & add mobile class to the header
			if ( this.mobileCheck() ) {
				this.config.$isMobile = true;
				this.config.$body.addClass( 'wpsp-is-mobile-device' );
			}

			// Define Wp admin bar
			var $eltDom = $( '#eltDom' );
			if ( $eltDom.length ) {
				this.config.$eltDom = $eltDom;
			}

		},

		/**
		 * Updates config on window load
		 *
		 * @since 1.0.0
		 */
		windowLoadUpdateConfig: function() {

			// Header bottom position
			if ( this.config.$siteHeader ) {
				var $siteHeaderTop = this.config.$siteHeader.offset().top;
				this.config.$windowHeight = this.config.$window.height();
				this.config.$siteHeaderHeight = this.config.$siteHeader.outerHeight();
				this.config.$siteHeaderBottom = $siteHeaderTop + this.config.$siteHeaderHeight;
				this.config.$siteHeaderTop = $siteHeaderTop;
				if ( this.config.$siteLogo ) {
					this.config.$siteLogoHeight = this.config.$siteLogo.height();
				}
			}

		},

		/**
		 * Updates config whenever the window is resized
		 *
		 * @since 1.0.0
		 */
		resizeUpdateConfig: function() {

			// Update main configs
			this.config.$windowHeight  = this.config.$window.height();
			this.config.$windowWidth   = this.config.$window.width();
			this.config.$windowTop     = this.config.$window.scrollTop();
			this.config.$viewportWidth = this.viewportWidth();

			// Update header height
			if ( this.config.$siteHeader ) {
				this.config.$siteHeaderHeight = this.config.$siteHeader.outerHeight();
			}

			// Get logo height
			if ( this.config.$siteLogo ) {
				this.config.$siteLogoHeight = this.config.$siteLogo.height();
			}

			// Vertical Header
			if ( this.config.$windowWidth < 960 ) {
				this.config.$verticalHeaderActive = false;
			} else if ( this.config.$body.hasClass( 'wpsp-has-vertical-header' ) ) {
				this.config.$verticalHeaderActive = true;
			}

		},

		/**
		 * Mobile Check
		 *
		 * @since 1.0.0
		 */
		mobileCheck: function() {
			if ( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test( navigator.userAgent ) ) {
				return true;
			}
		},

		/**
		 * Intersection Observer
		 *
		 */
		initObserver: function() {
			// var options = {
			//     root: document.querySelector('.entry-content'),
			//     rootMargin: '0px',
			//     threshold: 1.0 // trigger only when element comes into view completely
			// };
			// var ob = new IntersectionObserver((entries, observer) => {
			// 	//window[fnName](params);
			// 	console.log(entries);
			//   //entries[0].target.classList.toggle('inViewport');
			// }, options);
		},

		/**
		 * Navigation Burger
		 *
		 */
		initBurger: function() {
			var divrandom = document.querySelectorAll(".Navbar__Link");
			var num = divrandom.length;
			console.log('count:'+num);
			var genRandomPosition = function(index) {
			   return {
			    left: Math.random() * window.innerWidth,
			    top: Math.random() * window.innerHeight
			  };
			}

			$('.Navbar__Link-toggle').on('click', function(event) {
				event.preventDefault();
				$('.Navbar__Items').toggleClass('Navbar__ToggleShow');
				$('header').toggleClass('nav-open');
			  if( $('header').hasClass('nav-open') ) { 
			    positionnerMenu();
			  }
			});

			function positionnerMenu() {
			  divrandom.forEach(function(d, i) {
			    var currentPosition = genRandomPosition(i);
			    d.style.left = currentPosition.left.toFixed(2) + 'px';
			    d.style.top = currentPosition.top.toFixed(2) + 'px';
			    console.log('index', i);
			    var pos=d.getBoundingClientRect();
			    while ((((pos.width + currentPosition.left) > window.innerWidth) || ((pos.height + currentPosition.top) > window.innerHeight) || isOverlapping(i,currentPosition))) {
			      currentPosition = genRandomPosition();
			      d.style.left = currentPosition.left.toFixed(2) + 'px';
			      d.style.top = currentPosition.top.toFixed(2) + 'px';
			    }

			  });
			}

			function isOverlapping(index, currentPosition) {
			  var overlap = false;
			  var rect1 = divrandom[index].getBoundingClientRect();
			  console.log('rectBase',divrandom[index]);
			  for(var i = index-1; i >= 0; i--) {
			       var rect2 = divrandom[i].getBoundingClientRect();
			      console.log('loopRect',divrandom[i]);
			       window.console ? console.log(rect1, rect2 ) : null ;
			       overlap = !(
			               rect1.right < rect2.left+20 || 
			               rect1.left > rect2.right+20 || 
			               rect1.bottom < rect2.top+20 || 
			               rect1.top > rect2.bottom+20
			             )
			       console.log('overlap',overlap);
			       if (overlap) return overlap;
			  }
			  return overlap;
			}
		},

		/**
		 * Intersection Observer
		 *
		 */
		initPageTransitions: function() {
			var self = this;
			let options = {
				debugMode: true,
				elements: ['#page'],
				pageClassPrefix: 'loadpage',
				animationSelector: '.site-loader',
 				LINK_SELECTOR: '.swiper-container a:not([data-no-swup]):not([href$="jpg"]):not([href$="png"]), .navbar a',
 				animations: {
				    '*': {
				        out: function (next) {
				        	// let tl = new TimelineMax();
				        	// let elts2anim = $('[class*="col-"]');
				        	// tl.staggerTo(elts2anim, 0.8, {yPercent:10, onComplete:next}, 0.5);
				        	let loader = $('.site-loader');
				        	loader.addClass('is-visible');
				        	$('#page').addClass('is-invisible');
							setTimeout(next, 2000);
				        },
				        in: function (next) {
				        	let loader = $('.site-loader');
				        	loader.removeClass('is-visible');
				        	//$('body').addClass('is-loaded');
				        	$('#page').removeClass('is-invisible');
				        	TweenMax.to(['.swiper-container', '.swiper-pagination-bullets'], 0.4, {autoAlpha:0});
				        	Delighters.init();
				        	if ($('html').hasClass('to-workhtml'))
				        		self.initProjets();
				        }
				    }
				}
			};
			const swupjs = new Swupjs(options)
		},

		/**
		 * initProjets : scripts de la page work
		 *
		 */
		initProjets: function() {

			var previousProject = document.querySelector('.current');

			var nbrs = document.querySelectorAll('.nbr-work');


			nbrs.forEach(function(n) {
			  n.addEventListener('click', function(event) {
			    nbrs.forEach(function(elt) {
			      elt.classList.remove('active');
			    });
			    //_removeClasses();
			    event.target.classList.add('active');
			    previousProject.classList.remove('current');
			    var targetProject = document.querySelector(n.dataset.target);
			    targetProject.classList.add('current');
			    previousProject = targetProject;
			  });
			})
		},

		/**
		 * scrollMonitor
		 *
		 */
		scrollMonitor: function() {
			var elements = $('.scrollMonitorItem');
			function addClass() {
				let WatchElt = $(this.watchItem),
					$delay = $('.is_inViewPort').length * 0.05;
				if (!this.isInViewport) {
					WatchElt.removeClass('is_inViewPort');
					return;
				} else if (this.isFullyInViewport && !WatchElt.hasClass('animated')) {
					var tl = new TimelineMax();
					WatchElt.addClass('is_inViewPort animated');
					//tl.set(WatchElt.find('.mask-overlay'), {xPercent:10,transformOrigin: "0% 100%"});
					tl.from(WatchElt.find('.grid_projet_img'), 0.7, {x:"+=10%", delay:$delay, ease: Power2.easeOut.config(3)}, "start");
					tl.to(WatchElt.find('.mask-overlay'), 0.7, {xPercent: 100,transformOrigin: "0% 100%", delay:$delay, ease: Power2.easeOut.config(3)}, "start+=0.4");
					tl.timeScale(0.5);
				} else if (this.isAboveViewport) {
					//this.watchItem.style.backgroundColor = '#ccf';
				} else if (this.isBelowViewport) {
					//this.watchItem.style.backgroundColor = '#ffc';
				}
			}
			function makeWatcher( element ) {
				
				var watcher = scrollMonitor.create( element );
				watcher.stateChange(addClass);
				addClass.call( watcher );
			}

			elements.each(function(index, el) {
				//makeWatcher($(this));				
			});
		},

		/**
		 * Viewport width
		 *
		 * @since 1.0.0
		 */
		viewportWidth: function() {
			var e = window, a = 'inner';
			if ( !( 'innerWidth' in window ) ) {
				a = 'client';
				e = document.documentElement || document.body;
			}
			return e[ a+'Width' ];
		},


		/**
		 * Scroll to Hash
		 *
		 * @since 1.0.0
		 */
		scrollToHash: function( $this ) {

			// Declare function vars
			var self  = $this,
				$hash = location.hash;

			// Hash needed
			if ( ! $hash ) {
				return;
			}

			// Scroll to hash for localscroll links
			if ( $hash.indexOf( 'localscroll-' ) != -1 ) {
				self.scrollTo( $hash.replace( 'localscroll-', '' ) );
				return;
			}

			// Check elements with data attributes
			else if ( $( '[data-ls_id="'+ $hash +'"]' ).length ) {
				self.scrollTo( $hash );
			}

		},


		/*
		 * Inititalisation des fonctions pour la home
		 *
		 */
		initHome: function() {

			let allVideos = document.querySelectorAll('.video-home');

			function handler(entries, observer) {
			  for (var entry of entries) {
				let vidElt = $(entry.target).find('video').get(0);

			    if (entry.isIntersecting) {
			      entry.target.className = "video-home inViewport";
			      vidElt.loop = true; 
			      vidElt.controls = false; 
			      vidElt.play();
			    } else {
			      entry.target.className = "video-home outViewport";
			      vidElt.pause();
			    }
			  }
			}

			/* By default, invokes the handler whenever:
			   1. Any part of the target enters the viewport
			   2. The last part of the target leaves the viewport */
			if ('IntersectionObserver' in window) {

				let observer = new IntersectionObserver(handler);
				allVideos.forEach(video => observer.observe(video));
			} else {

			}


		},


		/*
		 * Owl Carousel thumbs
		 *
		 * @since 1.0.0
		 */
		owlCarouselThumb: function() {
			var owl = $('.owl-carousel');
		    owl.owlCarousel({
		        loop: false,
		        items: 1,
		        thumbs: true,
		        thumbsPrerendered: true,
		        responsiveClass:true,
			    responsive:{
			    	// breakpoint from 0 up
			        0:{
			            dots:true
			        },
			        768:{
			            dots:false
			        }
			    }        
		    });
		},

		/**
		 * Delighters : Animation on scroll
		 */
		initDelighters : function() {
			console.log('initDelighters');
		},

		/**
		 * Swiper Slider
		 *
		 * @since 1.0.0
		 */
		swiperSlider : function() {
			console.log('swiperSlider');
			let mySwiper, $swiperContainer;
			var self = this;

			$('body.home').each(
				function() {
					mySwiper = new Swiper('.swiper-container', {
					    slidesPerView: 1,
					    spaceBetween: 0,
					    mousewheel: true,
					    //effect: 'fade',
					    pagination: {
					      
					      el: '.dots',
					      clickable: true,
					      renderBullet: function (index, className) {
					        return '<div class="dot ' + className + '"></div>';
					      },
					    },
					});
					self.config.$swiperHome = mySwiper;
					//gestion des evenements
					// bind event and callback
					var switchSwiperObj = onfire.on('switch_swiper', self.switchSwiper);
				}
			);
		},

		/**
		 * switchSwiper
		 *
		 * @description: cache swiper pour affichage en ajax de la page appelée
		 * @since 1.0.0
		 */
		switchSwiper : function( swiperState ) {

			var self = this;
			switch (swiperState) {
			  case 'disable':
				console.log('appel de l evenement swiper en disable : ' + swiperState );
				$('.swiper-container').css('max-height', '500px');
				$('.swiper-pagination').css('display', 'none');
			    break;
			  case 'enable':
			  default:
				$('.swiper-container').css('max-height', 'auto');
				$('.swiper-pagination').css('display', 'block');
			}
		},

		/**
		 * magnificPopup
		 *
		 * @since 1.0.0
		 */
		magnificPopup : function() {
			console.log('magnificPopup');
			
			if ( ! $.fn.magnificPopup ) {
				return;
			}
			console.log('magnificPopup 2');

			// Setup content a link work with magnificPopup
		    $('a[href*=".jpg"], a[href*=".jpeg"], a[href*=".png"], a[href*=".gif"]').each(function(){
	        	if ($(this).parents('.gallery').length == 0 && $(this).parents('.single-portfolio_page').length == 0) {
		            $(this).magnificPopup({
						type: 'image',
						mainClass: 'mfp-no-margins mfp-with-zoom', // class to remove default margin from left and right side
						closeBtnInside: true,
						closeOnContentClick: true,	                    
						image: {
							verticalFit: false
						},
						zoom: {
							enabled: true,
							duration: 300 // don't foget to change the duration also in CSS
						}
		            });
		        }
		    });

		    // Setup Woo Commerce product image and post gallery work with magnificPopup
			$('.lightbox-images').magnificPopup({
					type: 'image',
					closeOnContentClick: false,
					closeBtnInside: false,
					removalDelay: 300,
		            mainClass: 'mfp-fade',
					gallery:{
						enabled:true
					}
			});

			// Setup page projet work with magnificPopup
		    $('.single-portfolio_page .entry-content').each(function() {
		        $(this).magnificPopup({
		            delegate: 'a[href*=".jpg"], a[href*=".jpeg"], a[href*=".png"], a[href*=".gif"]',
		            type: 'image',
		            removalDelay: 300,
		            mainClass: 'mfp-fade',
		            gallery: {
		            	enabled: true,
		            	navigateByImgClick: true,
		            	arrowMarkupX: '<span title="%title%" class="mfp-arrow mfp-arrow-%dir%"><i class="fa fa-angle-%dir% mfp-prevent-close"></i></span>'
		            },
					 callbacks: {
					   open: function() {
					     $.magnificPopup.instance.next = function() {
					       var self = this;
					       self.wrap.removeClass('mfp-image-loaded');
					       setTimeout(function() {
					         $.magnificPopup.proto.next.call(self); }, 120);
					     }
					     $.magnificPopup.instance.prev = function() {
					       var self = this;
					       self.wrap.removeClass('mfp-image-loaded');
					       setTimeout(function() {
					         $.magnificPopup.proto.prev.call(self); }, 120);
					     }
					   },
					   imageLoadComplete: function() { 
					     var self = this;
					     setTimeout(function() {
					       self.wrap.addClass('mfp-image-loaded'); }, 16);
					   }
					 }
		        });
		    });

			// Setup wp gallery work with magnificPopup
		    $('.gallery').each(function() {
		        $(this).magnificPopup({
		            delegate: 'a',
		            type: 'image',
		            removalDelay: 300,
		            mainClass: 'mfp-fade',
		            gallery: {
		            	enabled: true,
		            	navigateByImgClick: true
		            }
		        });
		    });

		    // Setup video work with magnificPopup
		    $('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
				disableOn: 700,
				type: 'iframe',
				mainClass: 'mfp-fade',
				removalDelay: 160,
				preloader: false,
				fixedContentPos: false
			});

		},

		/**
		 * Parses data to check if a value is defined in the data attribute and if not returns the fallback
		 *
		 * @since 1.0.0
		 */
		parseData: function( val, fallback ) {
			return ( typeof val !== 'undefined' ) ? val : fallback;
		},

		/**
		 * Returns extension from URL
		 */
		getUrlExtension: function( url ) {
			var ext = url.split( '.' ).pop().toLowerCase(),
				extra = ext.indexOf( '?' ) !== -1 ? ext.split( '?' ).pop() : '';
			return ext.replace( extra, '' );
		}
	}

	appCDL.init();

} ) ( jQuery );	