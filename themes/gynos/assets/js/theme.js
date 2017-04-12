(function($){
"use strict"; // Start of use strict
//Popup Wishlist
function popup_wishlist(){
	$('.wishlist-link').on('click',function(event){
		event.preventDefault();
		$('.wishlist-mask').fadeIn();
		var counter = 10;
		var popup;
		popup = setInterval(function() {
			counter--;
			if(counter < 0) {
				clearInterval(popup);
				$('.wishlist-mask').hide();
			} else {
				$(".wishlist-countdown").text(counter.toString());
			}
		}, 1000);
	});
}
//Menu Responsive
function rep_menu(){
	$('.toggle-mobile-menu').on('click',function(event){
		event.preventDefault();
		$(this).parents('.main-nav').toggleClass('active');
	});
	$('.main-nav li.menu-item-has-children>a').on('click',function(event){
		if($(window).width()<768){
			event.preventDefault();
			$(this).next().stop(true,false).slideToggle();
		}else{
			return false;
		}
	});
}
//Offset Menu
function offset_menu(){
	if($(window).width()>767){
		$('.main-nav .sub-menu').each(function(){
			var wdm = $(window).width();
			var wde = $(this).width();
			var offset = $(this).offset().left;
			var tw = offset+wde;
			if(tw>wdm){
				$(this).addClass('offset-right');
			}
		});
	}else{
		return false;
	}
}
//Fixed Header
function fixed_header(){
	if($('.header-ontop').length>0){
		if($(window).width()>1023){
			var ht = $('#header').height();
			var st = $(window).scrollTop();
			if(st>ht){
				$('.header-ontop').addClass('fixed-ontop');
			}else{
				$('.header-ontop').removeClass('fixed-ontop');
			}
		}else{
			return false;
		}
	}
} 
//Slider Background
function background(){
	$('.bg-slider .item-slider').each(function(){
		var src=$(this).find('.banner-thumb a img').attr('src');
		$(this).css('background-image','url("'+src+'")');
	});	
}
function animated(){
	$('.banner-slider .owl-item').each(function(){
		var check = $(this).hasClass('active');
		if(check==true){
			$(this).find('.animated').each(function(){
				var anime = $(this).attr('data-animated');
				$(this).addClass(anime);
			});
		}else{
			$(this).find('.animated').each(function(){
				var anime = $(this).attr('data-animated');
				$(this).removeClass(anime);
			});
		}
	});
}
function slick_animated(){
	$('.banner-slider .item-slider').each(function(){
		var check = $(this).hasClass('slick-active');
		if(check==true){
			$(this).find('.animated').each(function(){
				var anime = $(this).attr('data-animated');
				$(this).addClass(anime);
			});
		}else{
			$(this).find('.animated').each(function(){
				var anime = $(this).attr('data-animated');
				$(this).removeClass(anime);
			});
		}
	});
}
function slick_control(){
	$('.slick-slider').each(function(){
		$(this).find('.slick-prev-img').html($('.slick-active').prev().find('.banner-thumb a').html());
		$(this).find('.slick-next-img').html($('.slick-active').next().find('.banner-thumb a').html());
	});
}
//Document Ready
jQuery(document).ready(function(){
	//.contact-map
	$('.contact-map').on('click', function () {
		$(this).addClass('focus');
    });

	//Submit Form
    var ContactForm = $('form.contact-form');
    ContactForm.on('submit', function () {
        var data = {};
        $(this).find('input, select, textarea').map(function () {
            var fieldName = $(this).attr('name');
            data[fieldName] = $(this).val();
        });

        $('.spinner').removeClass('hidden');

        $.post('/contact/api/create',
            data,
            function (result, status) {
                if (result.status === 'error' || status === 'error') {
                    $('.spinner').addClass('hidden');
                    swal({
                        title: 'Error!',
                        text: 'Hệ thống xảy ra lỗi. Vui lòng thử lại sau!',
                        type: 'error',
                        timer: 4000
                    });
                } else {
                    $('.spinner').addClass('hidden');
                    swal({
                        title: 'Thank You!',
                        text: result.message,
                        type: 'success',
                        timer: 4000
                    });
                }
            }
        );
        return false;
    });

	//Popup Wishlist
	popup_wishlist();
	//Tab Active
	$('.title-tab1').each(function(){
		$(this).append('<div class="ef-lamp"></div>');
		$(this).find('.ef-lamp').width($(this).find('li.active').width());
		var osl=$(this).find('li.active').offset().left-$(this).offset().left-1;
		$(this).find('.ef-lamp').css('left',osl+'px');
		$(this).find('.list-none li a').on('click',function(){
			$(this).parents('.title-tab1').find('.ef-lamp').width($(this).parent().width());
			var osl=$(this).offset().left-$(this).parents('.title-tab1').offset().left-1;
			$(this).parents('.title-tab1').find('.ef-lamp').css('left',osl+'px');
		});
	});
	//Shop The Look
	$('.box-hover-dir').each( function() {
		$(this).hoverdir(); 
	});
	//Top Deal
	$('.close-top-deal').on('click',function(event){
		event.preventDefault();
		$(this).parents('.top-banner-prl').slideUp();
	});	
	//Deal Gallery
	$('.item-deal11').each(function(){
		$(this).find('.deal-control > ul > li > a').on('click',function(event){
			event.preventDefault();
			$(this).parents('.item-deal11').find('.deal-control > ul > li > a').removeClass('active');
			$(this).addClass('active');
			var img_src=$(this).find('img').attr('src');
			$(this).parents('.item-deal11').find('.product-thumb-link img').attr('src',img_src);
		});
	});
	
	// //Filter Price
	// $( "#slider-range" ).slider({
 //      range: true,
 //      min: 0,
 //      max: 500,
 //      values: [ 49, 419 ],
 //      slide: function( event, ui ) {
 //        $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
 //      }
 //    });
 //    $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ) +
 //      " - $" + $( "#slider-range" ).slider( "values", 1 ) );
	//Attr Filter Price
	// $( "#slider-range-price" ).slider({
 //      range: true,
 //      min: 0,
 //      max: 5000,
 //      values: [ 924, 5000 ],
 //      slide: function( event, ui ) {
 //        $( "#amount-price" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
 //      }
 //    });
 //    $( "#amount-price" ).val( "$" + $( "#slider-range-price" ).slider( "values", 0 ) +
 //      " - $" + $( "#slider-range-price" ).slider( "values", 1 ) );
	//Select Size
	$('body').on('click',function(){
		$('.select-attr-size').slideUp();
	});
	$('.selected-attr-size').on('click',function(event){
		event.preventDefault();
		event.stopPropagation();
		$(this).next().slideToggle();
	});
	$('.select-attr-size a').on('click',function(event){
		event.preventDefault();
		$('.select-attr-size a').removeClass('selected');
		$(this).addClass('selected');
		$(this).parents('.attr-size').find('.selected-attr-size span').text($(this).text());
	});
	//Select Color
	$('.attr-color li a').on('click',function(event){
		event.preventDefault();
		$('.attr-color li a').removeClass('selected');
		$(this).addClass('selected');
	});
	//Qty Up-Down
	$('.info-qty').each(function(){
		var qtyval = parseInt($(this).find('.qty-val').text(),10);
		$(this).find('.qty-up').on('click',function(event){
			event.preventDefault();
			qtyval=qtyval+1;
			$('.qty-val').text(qtyval);
		});
		$(this).find('.qty-down').on('click',function(event){
			event.preventDefault();
			qtyval=qtyval-1;
			if(qtyval>0){
				$('.qty-val').text(qtyval);
			}else{
				qtyval=0;
				$('.qty-val').text(qtyval);
			}
		});
	});
	//Select UI
	if($('.orderby').length>0){
		$('.orderby').selectmenu();	
	}
	//Product Gallery
	if($('.product-gallery .bxslider').length>0){
		$('.product-gallery .bxslider').bxSlider({
			pagerCustom: '.product-gallery #bx-pager',
			nextText:'<i class="fa fa-angle-right" aria-hidden="true"></i>',
			prevText:'<i class="fa fa-angle-left" aria-hidden="true"></i>'
		});
	}
	//Menu Responsive 
	rep_menu();
	//Offset Menu
	offset_menu();
	//Animate
	if($('.wow').length>0){
		new WOW().init();
	}
	// //Product Quick View
	// $('.quickview-link').fancybox();	
	// //img Light Box
	// $('.post-thumb-zoom').fancybox();
	//Back To Top
	$('.scroll-top').on('click',function(event){
		event.preventDefault();
		$('html, body').animate({scrollTop:0}, 'slow');
	});
	//Tag Toggle
	if($('.toggle-tab').length>0){
		$('.toggle-tab').each(function(){
			$(this).find('.item-toggle-tab').first().find('.toggle-tab-content').show();
			$('.toggle-tab-title').on('click',function(){
				$(this).parent().siblings().removeClass('active');
				$(this).parent().toggleClass('active');
				$(this).parents('.toggle-tab').find('.toggle-tab-content').not($(this).next()).slideUp();
				$(this).next().slideToggle();
			});
		});
	}
});
//Window Load
jQuery(window).on('load',function(){ 
	//Product Masonry 
	if($('.list-product-masonry').length>0){
		$('.list-product-masonry').masonry({
			// options
			itemSelector: '.item-product-masonry',
		});
	}
	//Custom ScrollBar
	if($('.custom-scroll').length>0){
		$('.custom-scroll').each(function(){
			$(this).mCustomScrollbar({
				scrollButtons:{
					enable:true
				}
			});
		});
	}
	//Owl Carousel
	if($('.wrap-item').length>0){
		$('.wrap-item').each(function(){
			var data = $(this).data();
			$(this).owlCarousel({
				addClassActive:true,
				stopOnHover:true,
				itemsCustom:data.itemscustom,
				autoPlay:data.autoplay,
				transitionStyle:data.transition, 
				paginationNumbers:data.paginumber,
				beforeInit:background,
				afterAction:animated,
				navigationText:['<i class="fa fa-arrow-circle-left" aria-hidden="true"></i>','<i class="fa fa-arrow-circle-right" aria-hidden="true"></i>'],
			});
			$(this).find('.owl-controls').css('left',data.control+'px');
		});
	}
	//Slick Slider
	if($('.banner-slider .slick').length>0){
		$('.banner-slider .slick').each(function(){
			$(this).slick({
				centerMode: true,
				infinite: true,
				centerPadding: '200px',
				slidesToShow: 1,
				prevArrow:'<div class="slick-prev"><div class="slick-prev-img"></div><div class="slick-nav"><i class="fa fa-arrow-circle-left" aria-hidden="true"></i></div></div>',
				nextArrow:'<div class="slick-next"><div class="slick-next-img"></div><div class="slick-nav"><i class="fa fa-arrow-circle-right" aria-hidden="true"></i></div></div>',
				responsive: [
				{
				  breakpoint: 1200,
				  settings: {
					centerPadding: '0px',
				  }
				}]
			});
			slick_control();
			$('.slick').on('afterChange', function(event){
				slick_control();
				slick_animated();
			});
		});
	}		
	if($('.hotdeal-countdown').length>0){
		$(".hotdeal-countdown").TimeCircles({
			fg_width: 0.03,
			bg_width: 0,
			text_size: 0,
			circle_bg_color: "#000000",
			time: {
				Days: {
					show: true,
					text: "D",
					color: "#ffcc00"
				},
				Hours: {
					show: true,
					text: "H",
					color: "#ffcc00"
				},
				Minutes: {
					show: true,
					text: "M",
					color: "#ffcc00"
				},
				Seconds: {
					show: true,
					text: "S",
					color: "#ffcc00"
				}
			}
		}); 
	}		
	if($('.deal-palallax').length>0){
		$(".deal-palallax").TimeCircles({
			fg_width: 0.05,
			bg_width: 0,
			text_size: 0,
			circle_bg_color: "transparent",
			time: {
				Days: {
					show: true,
					text: "days",
					color: "#fff"
				},
				Hours: {
					show: true,
					text: "hours",
					color: "#fff"
				},
				Minutes: {
					show: true,
					text: "minutes",
					color: "#fff"
				},
				Seconds: {
					show: true,
					text: "seconds",
					color: "#fff"
				}
			}
		}); 
	}
	if($('.countdown-master').length>0){
		$('.countdown-master').each(function(){
			$(this).FlipClock(65100,{
		        clockFace: 'HourlyCounter',
		        countdown: true,
		        autoStart: true,
		    });
		});
	}
});
//Window Resize
jQuery(window).resize(function(){
	offset_menu();
	fixed_header();
});
//Window Scroll
jQuery(window).scroll(function(){
	//Scroll Top
	if($(this).scrollTop()>$(this).height()){
		$('.scroll-top').addClass('active');
	}else{
		$('.scroll-top').removeClass('active');
	}
	//Fixed Header
	fixed_header();
});
})(jQuery); // End of use strict