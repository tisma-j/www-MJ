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

			// Run on document ready
			self.config.$document.ready( function() {

				// Update vars on init
				self.initUpdateConfig();

				// init Page Transitions
				self.initPageTransitions();

				$('.Navbar__Link-toggle').on('click', function(event) {
					event.preventDefault();
					$('.Navbar__Items').toggleClass('Navbar__ToggleShow');
				});

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
		 * Intersection Observer
		 *
		 */
		initPageTransitions: function() {
			let options = {
				debugMode: true,
				elements: ['#page'],
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

				        	Delighters.init();
				        }
				    }
				}
			};
			const swupjs = new Swupjs(options)
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