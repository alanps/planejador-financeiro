// -------------------------------------------------------------------------------------------
// IE9 Console log bug
// -------------------------------------------------------------------------------------------
if (!window.console) {window.console = {};}
if (!console.log) {console.log = function() {};}


// -------------------------------------------------------------------------------------------
// Page dimensions detection
// -------------------------------------------------------------------------------------------
(function($) {
           
    function detectDimensions(){


        var browser = {
                isIe: function () {
                    return navigator.appVersion.indexOf("MSIE") != -1;
                },
                navigator: navigator.appVersion,
                getVersion: function() {
                    var version = 999; // we assume a sane browser
                    if (navigator.appVersion.indexOf("MSIE") != -1)
                        // bah, IE again, lets downgrade version number
                        version = parseFloat(navigator.appVersion.split("MSIE")[1]);
                    return version;
                }
            };

        if (browser.isIe() && browser.getVersion() <= 9) {
            $("html").addClass("ie9")
            console.log("You are currently using Internet Explorer" + browser.getVersion() + " or are viewing the site in Compatibility View, please upgrade for a better user experience.")
        }



        if (window.innerWidth <768){
            $('html').removeClass("tablet").removeClass("desktop").addClass('smartphone');
        }
        else if(window.innerWidth >=768 && window.innerWidth<1280){
            $('html').removeClass("desktop").removeClass("smartphone").addClass('tablet');
        }
        else if(window.innerWidth >=1280){
            $('html').removeClass("tablet").removeClass("smartphone").addClass('desktop');
        }                        

        var browserWidth, browserHeight;
        var browserWidth = $(window).width();
        var browserHeight = $(window).height();
        
        
        //portrait/landscape 
        $('html').removeClass('portrait').removeClass('landscape');   
        if(browserWidth>browserHeight)  $('html').addClass('landscape');
        else $('html').addClass('portrait'); 


        //smallScreen/largeScreen classes
        if($("html").hasClass("smartphone")) $("html").removeClass("largeScreen").addClass("smallScreen");
        else if($("html").hasClass("tablet") && $("html").hasClass("portrait")) $("html").removeClass("largeScreen").addClass("smallScreen");
        else if($("html").hasClass("tablet") && $("html").hasClass("landscape")) $("html").removeClass("smallScreen").addClass("largeScreen");
        else if($("html").hasClass("desktop")) $("html").removeClass("smallScreen").addClass("largeScreen");



        //finished detecion
        //$('html').removeClass('dimensions_unavailable');            
        $.event.trigger({   
          type:    "dimensionUpdate",
          message: "html class update",
          time:    new Date()
        });

    }



    
    $(document).ready(function() {
        detectDimensions();
        $(window).resize(function(){detectDimensions();});
    });

})(jQuery);        


(function($) {
    $(document).scroll(function() {
        if($(window).scrollTop()==0){
            $("html").removeClass('scrolling');
        }
        else{
           if(!$("html").hasClass('scrolling')) $("html").addClass('scrolling');
        }
    });
})(jQuery);      


// -------------------------------------------------------------------------------------------
// Utils
// -------------------------------------------------------------------------------------------

//is url
function isUrl(strUrl) {
    if (strUrl.indexOf('http') >= 0) return true;
    else return false;
}

//guid
var guid = (function() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
               .toString(16)
               .substring(1);
  }
  return function() {
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
           s4() + '-' + s4() + s4() + s4();
  };
})();



//cssClassChanged Event
(function(){
    // Your base, I'm in it!
    var originalAddClassMethod = jQuery.fn.addClass;

    jQuery.fn.addClass = function(){
        // Execute the original method.
        var result = originalAddClassMethod.apply( this, arguments );

        // trigger a custom event
        jQuery(this).trigger('cssClassChanged');

        // return the original result
        return result;
    }
})();





// -------------------------------------------------------------------------------------------
// smoothScrollTo
// -------------------------------------------------------------------------------------------

(function($) {
    window.smoothScrollTo = function(_target,_offset){

        target = $(_target);
        var currentOffset = $('body').scrollTop();
        if(!_offset || isNaN(_offset)) _offset = 0;
        var targetOffset = target.offset().top - _offset;
        var time = Math.abs(currentOffset - targetOffset);
        if (target.length) {
            $('body,html').animate({
                scrollTop: targetOffset,
                easing:"easeInOutQuad"
            },500,function(){
                
                $('header').focus();
            })
        }
    }

})(jQuery);

// -------------------------------------------------------------------------------------------
// stickyfloat
// -------------------------------------------------------------------------------------------
/*(function($){
    $(document).ready(function() {
       $('.sticky').parent().height('1000px');
        $('.sticky').parent().css("position","relative");
        $('.sticky').css("position","relative");
       $('.sticky').stickyfloat();
    });
})(jQuery);
*/

/**
 * ...
 * @author Dex
 * Opens a modal
 */

(function($) {
    $.modal = function(id, _modal) {
        if (_modal === false) _modal = false;
        else _modal = true;
        $.fancybox({
            href: id,
            padding: 0,
            closeBtn: false,
            modal: _modal,
            scrolling: false,
            openEffect: 'fade',
            openSpeed: 250,
            closeEffect: 'fade',
            closeSpeed: 150,
            closeClick: false,
            helpers: {
                title: {
                    type: 'inside'
                },
                overlay: {
                    css: {
                        //'background-color' : '#000'
                    },
                    //opacity:0.95
                }
            },
            type: 'inline'
        });
    };
})(jQuery);






// -------------------------------------------------------------------------------------------
// scrollers
// -------------------------------------------------------------------------------------------
(function($) {
   window.scrollers = []
    var scrollers = window.scrollers;
    $(document).ready(function() {
            if($('.scroller').length==0) return;
            var i = 0;
            $('.scroller').each(function(){
                var id = $(this).attr('id');
                if(id=='' || id==undefined) id = "scroller_" + guid();
                $(this).attr('id',id);
                id = "#" + id;

                    $(this).find("ul").slick({
                        dots: true,
                        speed: 300,
                        slidesToShow: 4,
                        autoplay: false,
                        autoplaySpeed: 3000,            
                        infinite: true,
                        variableWidth: true,
                        adaptiveHeight:true,
                        centerMode: false,
                        responsive: [{
                                      breakpoint: 1024,
                                      settings: {
                                        slidesToShow: 4,
                                      }
                                    },
                                    {
                                      breakpoint: 480,
                                      settings: {
                                        slidesToShow: 1,
                                      }
                                    }]

                    });
                i++;
            });
    });
})(jQuery);

// -------------------------------------------------------------------------------------------
// Copy Protection
// -------------------------------------------------------------------------------------------

(function($) {
   $.fn.extend({
        disableSelection : function() {
            return this.each(function() {
                this.onselectstart = function() {
                    return false;
                };
                this.unselectable = "on";
                $(this).css('user-select', 'none');
                $(this).css('-o-user-select', 'none');
                $(this).css('-moz-user-select', 'none');
                $(this).css('-khtml-user-select', 'none');
                $(this).css('-webkit-user-select', 'none');
            });
        },
        disableSelectedAll : function() {
            return this.each(function() {
                this.onkeydown = function(event) {
                    if( event.ctrlKey && (event.keyCode == 65 || event.keyCode == 97) ){
                        event.preventDefault();
                    }
                };
            });
        }
    });
})(jQuery);


// -------------------------------------------------------------------------------------------
// hasScrollbar
// -------------------------------------------------------------------------------------------
(function($) {
    $.fn.hasScrollbar = function() {
        return this.get(0).scrollHeight > this.height();
    }
})(jQuery);





// -------------------------------------------------------------------------------------------
// Tabs
// -------------------------------------------------------------------------------------------
(function($) {
$.fn.tabs = function (){
    var div = $(this);
    var nav_ul = div.find('ul.nav');
    var nav_select = div.find('select.nav_select');
    var content = div.find('.content');
    nav_ul.find('li:first-child').addClass('active');
    nav_ul.find('option:first-child').prop('selected', true);
    content.find('li:first-child').addClass('active');

    nav_ul.find('li a').click(function(){
        change_tab($(this).attr('href'));
        return false;
    });

    nav_select.change(function(){
        change_tab($(this).val());
        return false;
    });

    var change_tab = function (datatarget) {
        // ul
        nav_ul.find('li').removeClass('active');
        nav_ul.find('li a[href="'+datatarget+'"]').parent().addClass("active");
        // select
        nav_select.find('option').prop('selected', false);
        nav_select.find('option[value="'+datatarget+'"]').prop('selected', true);
        // content
        content.find('li.active').removeClass('active');
        content.find('li'+datatarget).addClass('active');
    }
}

$(document).on("ready", function(){
    if($.fn.tabs) {
        $('.tabs').each(function(){
            $(this).tabs();
        });
    }
});
})(jQuery);
// -------------------------------------------------------------------------------------------
// Accordion
// -------------------------------------------------------------------------------------------
(function($)
{
    $.fn.accordion = function()
    {
        var container = $(this);


        //parse collapsible feature
        var collapsible = false;
        if(container.hasClass('collapsible')) collapsible = true;

        //parse data-active-tab
        var active_tab = parseInt(container.attr('data-active-tab'));
        var target = container.find('.toggler:nth-child('+active_tab+')')
        activateToggler(target);

        //click event
        container.find("a.toggler_heading").tap(function(){
            activateToggler($(this).parent());
            return false;
        })

        //individual toggler activation
        function activateToggler(el){
            var h = el.find('.toggler_content').outerHeight();

            if(el.hasClass('active')){
                el.removeClass('active');
                el.find('.toggler_container').css('max-height','0px');
            }
            else
            {
                if(collapsible) deactivateAllTogglers();
                el.find('.toggler_container').css('max-height',h+'px');
                el.addClass('active');
            }
        }

        function deactivateAllTogglers(){
                container.find('.toggler_container').css('max-height','0px');
                container.find('.toggler').removeClass('active');           
        }
    };

    $(document).on("ready", function(){
        if(jQuery.fn.accordion){
            if(jQuery('.accordion').length>0){
                jQuery('.accordion').accordion();       
            }   
        } 
        
    });



})(jQuery);

// SmoothScroll for websites v1.2.1
// Licensed under the terms of the MIT license.

// People involved
//  - Balazs Galambosi (maintainer)  
//  - Michael Herf     (Pulse Algorithm)

(function(){
  
// Scroll Variables (tweakable)
var defaultOptions = {

    // Scrolling Core
    frameRate        : 150, // [Hz]
    animationTime    : 1000, // [px]
    stepSize         : 100, // [px]

    // Pulse (less tweakable)
    // ratio of "tail" to "acceleration"
    pulseAlgorithm   : true,
    pulseScale       : 8,
    pulseNormalize   : 1,

    // Acceleration
    accelerationDelta : 20,  // 20
    accelerationMax   : 1,   // 1

    // Keyboard Settings
    keyboardSupport   : true,  // option
    arrowScroll       : 50,     // [px]

    // Other
    touchpadSupport   : true,
    fixedBackground   : true, 
    excluded          : ""    
};

var options = defaultOptions;


// Other Variables
var isExcluded = false;
var isFrame = false;
var direction = { x: 0, y: 0 };
var initDone  = false;
var root = document.documentElement;
var activeElement;
var observer;
var deltaBuffer = [ 120, 120, 120 ];

var key = { left: 37, up: 38, right: 39, down: 40, spacebar: 32, 
            pageup: 33, pagedown: 34, end: 35, home: 36 };


/***********************************************
 * SETTINGS
 ***********************************************/

var options = defaultOptions;


/***********************************************
 * INITIALIZE
 ***********************************************/

/**
 * Tests if smooth scrolling is allowed. Shuts down everything if not.
 */
function initTest() {

    var disableKeyboard = false; 
    
    // disable keyboard support if anything above requested it
    if (disableKeyboard) {
        removeEvent("keydown", keydown);
    }

    if (options.keyboardSupport && !disableKeyboard) {
        addEvent("keydown", keydown);
    }
}

/**
 * Sets up scrolls array, determines if frames are involved.
 */
function init() {
  
    if (!document.body) return;

    var body = document.body;
    var html = document.documentElement;
    var windowHeight = window.innerHeight; 
    var scrollHeight = body.scrollHeight;
    
    // check compat mode for root element
    root = (document.compatMode.indexOf('CSS') >= 0) ? html : body;
    activeElement = body;
    
    initTest();
    initDone = true;

    // Checks if this script is running in a frame
    if (top != self) {
        isFrame = true;
    }

    /**
     * This fixes a bug where the areas left and right to 
     * the content does not trigger the onmousewheel event
     * on some pages. e.g.: html, body { height: 100% }
     */
    else if (scrollHeight > windowHeight &&
            (body.offsetHeight <= windowHeight || 
             html.offsetHeight <= windowHeight)) {

        // DOMChange (throttle): fix height
        var pending = false;
        var refresh = function () {
            if (!pending && html.scrollHeight != document.height) {
                pending = true; // add a new pending action
                setTimeout(function () {
                    html.style.height = document.height + 'px';
                    pending = false;
                }, 500); // act rarely to stay fast
            }
        };
        html.style.height = 'auto';
        setTimeout(refresh, 10);

        // clearfix
        if (root.offsetHeight <= windowHeight) {
            var underlay = document.createElement("div");   
            underlay.style.clear = "both";
            body.appendChild(underlay);
        }
    }

    // disable fixed background
    if (!options.fixedBackground && !isExcluded) {
        body.style.backgroundAttachment = "scroll";
        html.style.backgroundAttachment = "scroll";
    }
}


/************************************************
 * SCROLLING 
 ************************************************/
 
var que = [];
var pending = false;
var lastScroll = +new Date;

/**
 * Pushes scroll actions to the scrolling queue.
 */
function scrollArray(elem, left, top, delay) {
    
    delay || (delay = 1000);
    directionCheck(left, top);

    if (options.accelerationMax != 1) {
        var now = +new Date;
        var elapsed = now - lastScroll;
        if (elapsed < options.accelerationDelta) {
            var factor = (1 + (30 / elapsed)) / 2;
            if (factor > 1) {
                factor = Math.min(factor, options.accelerationMax);
                left *= factor;
                top  *= factor;
            }
        }
        lastScroll = +new Date;
    }          
    
    // push a scroll command
    que.push({
        x: left, 
        y: top, 
        lastX: (left < 0) ? 0.99 : -0.99,
        lastY: (top  < 0) ? 0.99 : -0.99, 
        start: +new Date
    });
        
    // don't act if there's a pending queue
    if (pending) {
        return;
    }  

    var scrollWindow = (elem === document.body);
    
    var step = function (time) {
        
        var now = +new Date;
        var scrollX = 0;
        var scrollY = 0; 
    
        for (var i = 0; i < que.length; i++) {
            
            var item = que[i];
            var elapsed  = now - item.start;
            var finished = (elapsed >= options.animationTime);
            
            // scroll position: [0, 1]
            var position = (finished) ? 1 : elapsed / options.animationTime;
            
            // easing [optional]
            if (options.pulseAlgorithm) {
                position = pulse(position);
            }
            
            // only need the difference
            var x = (item.x * position - item.lastX) >> 0;
            var y = (item.y * position - item.lastY) >> 0;
            
            // add this to the total scrolling
            scrollX += x;
            scrollY += y;            
            
            // update last values
            item.lastX += x;
            item.lastY += y;
        
            // delete and step back if it's over
            if (finished) {
                que.splice(i, 1); i--;
            }           
        }

        // scroll left and top
        if (scrollWindow) {
            window.scrollBy(scrollX, scrollY);
        } 
        else {
            if (scrollX) elem.scrollLeft += scrollX;
            if (scrollY) elem.scrollTop  += scrollY;                    
        }
        
        // clean up if there's nothing left to do
        if (!left && !top) {
            que = [];
        }
        
        if (que.length) { 
            requestFrame(step, elem, (delay / options.frameRate + 1)); 
        } else { 
            pending = false;
        }
    };
    
    // start a new queue of actions
    requestFrame(step, elem, 0);
    pending = true;
}


/***********************************************
 * EVENTS
 ***********************************************/

/**
 * Mouse wheel handler.
 * @param {Object} event
 */
function wheel(event) {

    if (!initDone) {
        init();
    }
    
    var target = event.target;
    var overflowing = overflowingAncestor(target);
    
    // use default if there's no overflowing
    // element or default action is prevented    
    if (!overflowing || event.defaultPrevented ||
        isNodeName(activeElement, "embed") ||
       (isNodeName(target, "embed") && /\.pdf/i.test(target.src))) {
        return true;
    }

    var deltaX = event.wheelDeltaX || 0;
    var deltaY = event.wheelDeltaY || 0;
    
    // use wheelDelta if deltaX/Y is not available
    if (!deltaX && !deltaY) {
        deltaY = event.wheelDelta || 0;
    }

    // check if it's a touchpad scroll that should be ignored
    if (!options.touchpadSupport && isTouchpad(deltaY)) {
        return true;
    }

    // scale by step size
    // delta is 120 most of the time
    // synaptics seems to send 1 sometimes
    if (Math.abs(deltaX) > 1.2) {
        deltaX *= options.stepSize / 120;
    }
    if (Math.abs(deltaY) > 1.2) {
        deltaY *= options.stepSize / 120;
    }
    
    scrollArray(overflowing, -deltaX, -deltaY);
    event.preventDefault();
}

/**
 * Keydown event handler.
 * @param {Object} event
 */
function keydown(event) {

    var target   = event.target;
    var modifier = event.ctrlKey || event.altKey || event.metaKey || 
                  (event.shiftKey && event.keyCode !== key.spacebar);
    
    // do nothing if user is editing text
    // or using a modifier key (except shift)
    // or in a dropdown
    if ( /input|textarea|select|embed/i.test(target.nodeName) ||
         target.isContentEditable || 
         event.defaultPrevented   ||
         modifier ) {
      return true;
    }
    // spacebar should trigger button press
    if (isNodeName(target, "button") &&
        event.keyCode === key.spacebar) {
      return true;
    }
    
    var shift, x = 0, y = 0;
    var elem = overflowingAncestor(activeElement);
    var clientHeight = elem.clientHeight;

    if (elem == document.body) {
        clientHeight = window.innerHeight;
    }

    switch (event.keyCode) {
        case key.up:
            y = -options.arrowScroll;
            break;
        case key.down:
            y = options.arrowScroll;
            break;         
        case key.spacebar: // (+ shift)
            shift = event.shiftKey ? 1 : -1;
            y = -shift * clientHeight * 0.9;
            break;
        case key.pageup:
            y = -clientHeight * 0.9;
            break;
        case key.pagedown:
            y = clientHeight * 0.9;
            break;
        case key.home:
            y = -elem.scrollTop;
            break;
        case key.end:
            var damt = elem.scrollHeight - elem.scrollTop - clientHeight;
            y = (damt > 0) ? damt+10 : 0;
            break;
        case key.left:
            x = -options.arrowScroll;
            break;
        case key.right:
            x = options.arrowScroll;
            break;            
        default:
            return true; // a key we don't care about
    }

    scrollArray(elem, x, y);
    event.preventDefault();
}

/**
 * Mousedown event only for updating activeElement
 */
function mousedown(event) {
    activeElement = event.target;
}


/***********************************************
 * OVERFLOW
 ***********************************************/
 
var cache = {}; // cleared out every once in while
setInterval(function () { cache = {}; }, 10 * 1000);

var uniqueID = (function () {
    var i = 0;
    return function (el) {
        return el.uniqueID || (el.uniqueID = i++);
    };
})();

function setCache(elems, overflowing) {
    for (var i = elems.length; i--;)
        cache[uniqueID(elems[i])] = overflowing;
    return overflowing;
}

function overflowingAncestor(el) {
    var elems = [];
    var rootScrollHeight = root.scrollHeight;
    do {
        var cached = cache[uniqueID(el)];
        if (cached) {
            return setCache(elems, cached);
        }
        elems.push(el);
        if (rootScrollHeight === el.scrollHeight) {
            if (!isFrame || root.clientHeight + 10 < rootScrollHeight) {
                return setCache(elems, document.body); // scrolling root in WebKit
            }
        } else if (el.clientHeight + 10 < el.scrollHeight) {
            overflow = getComputedStyle(el, "").getPropertyValue("overflow-y");
            if (overflow === "scroll" || overflow === "auto") {
                return setCache(elems, el);
            }
        }
    } while (el = el.parentNode);
}


/***********************************************
 * HELPERS
 ***********************************************/

function addEvent(type, fn, bubble) {
    window.addEventListener(type, fn, (bubble||false));
}

function removeEvent(type, fn, bubble) {
    window.removeEventListener(type, fn, (bubble||false));  
}

function isNodeName(el, tag) {
    return (el.nodeName||"").toLowerCase() === tag.toLowerCase();
}

function directionCheck(x, y) {
    x = (x > 0) ? 1 : -1;
    y = (y > 0) ? 1 : -1;
    if (direction.x !== x || direction.y !== y) {
        direction.x = x;
        direction.y = y;
        que = [];
        lastScroll = 0;
    }
}

var deltaBufferTimer;

function isTouchpad(deltaY) {
    if (!deltaY) return;
    deltaY = Math.abs(deltaY)
    deltaBuffer.push(deltaY);
    deltaBuffer.shift();
    clearTimeout(deltaBufferTimer);
    var allDivisable = (isDivisible(deltaBuffer[0], 120) &&
                        isDivisible(deltaBuffer[1], 120) &&
                        isDivisible(deltaBuffer[2], 120));
    return !allDivisable;
} 

function isDivisible(n, divisor) {
    return (Math.floor(n / divisor) == n / divisor);
}

var requestFrame = (function () {
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              function (callback, element, delay) {
                  window.setTimeout(callback, delay || (1000/60));
              };
})();


/***********************************************
 * PULSE
 ***********************************************/
 
/**
 * Viscous fluid with a pulse for part and decay for the rest.
 * - Applies a fixed force over an interval (a damped acceleration), and
 * - Lets the exponential bleed away the velocity over a longer interval
 * - Michael Herf, http://stereopsis.com/stopping/
 */
function pulse_(x) {
    var val, start, expx;
    // test
    x = x * options.pulseScale;
    if (x < 1) { // acceleartion
        val = x - (1 - Math.exp(-x));
    } else {     // tail
        // the previous animation ended here:
        start = Math.exp(-1);
        // simple viscous drag
        x -= 1;
        expx = 1 - Math.exp(-x);
        val = start + (expx * (1 - start));
    }
    return val * options.pulseNormalize;
}

function pulse(x) {
    if (x >= 1) return 1;
    if (x <= 0) return 0;

    if (options.pulseNormalize == 1) {
        options.pulseNormalize /= pulse_(1);
    }
    return pulse_(x);
}

var isChrome = /chrome/i.test(window.navigator.userAgent);
var wheelEvent = null;
if ("onwheel" in document.createElement("div"))
    wheelEvent = "wheel";
else if ("onmousewheel" in document.createElement("div"))
    wheelEvent = "mousewheel";

if (wheelEvent && isChrome) {
    addEvent(wheelEvent, wheel);
    addEvent("mousedown", mousedown);
    addEvent("load", init);
}

})();



/*
====================== Onscreen.JS =================================== */

// onScreen jQuery plugin v0.2.1
// (c) 2011-2013 Ben Pickles
//
// http://benpickles.github.io/onScreen
//
// Released under MIT license.
(function($) {
  $.expr[":"].onScreen = function(elem) {
    var $window = $(window)
    var viewport_top = $window.scrollTop()
    var viewport_height = $window.height()
    var viewport_bottom = viewport_top + viewport_height
    var $elem = $(elem)
    var top = $elem.offset().top
    var height = $elem.height()
    var bottom = top + height

    return (top >= viewport_top && top < viewport_bottom) ||
           (bottom > viewport_top && bottom <= viewport_bottom) ||
           (height > viewport_height && top <= viewport_top && bottom >= viewport_bottom)
  }
})(jQuery);




/*
====================== Lazyload ===================================*/
(function($){
    $(document).ready(function(){


        //load event fired
        $('img.lazy').on('load',function(){
            el = $(this);

            if(el.attr('src').indexOf('data:image')>-1) return;  
            if(el.attr('src').indexOf('transparent.png')>-1) return;
            if(el.hasClass('loaded')) return;

            //console.log('finish loading ' + el.attr('src'));
            //listen for end transition event
            if(el.parent().parent().hasClass('post-thumb')){
                //console.log('finished loading ')
                //console.log(el);
            }

            el.removeAttr('style');

            el.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',function(){
                //el.css('transition','none');
                //el.css('-webkit-transition','none');
                //el.height('auto');
                
                //console.log('transition end:',el.css('height'),el);

            })

            el.removeClass('loading');
            el.addClass('loaded');  

        }).each(function(){
            var el = $(this);
            if(el.attr('src').indexOf('data:image')>-1) return;  
            if(el.attr('src').indexOf('transparent.png')>-1) return;
            //console.log('checking:'+this.complete)
            if(this.complete) $(this).load();
        });

         //videos load events
        $("video.lazy").on("error", function(err) {
            for (var i in err.currentTarget.error) {
                console.log(i + ": " + err.currentTarget.error[i]);
            }
        });
        /*
        $("video.lazy").on("progress", function() {
            console.log('video progress');
        });
*/

        $("video.lazy").on("loadstart", function() {
            //console.log('video loadstart');
        });

        $("video.lazy").on("canplaythrough", function() {
            //console.debug("video canplaythrough triggered");
            el = $(this);  
            el.removeClass('loading');
            el.addClass('loaded'); 
        });

        $("video.lazy").on("canplay", function (e) {
          //console.debug("video canplay triggered");
        });


        window.lazyload = function lazyload(el){ 
            if(el.hasClass('loading') || el.hasClass('loaded')) return; 
            //console.log( "loading " + el.attr('data-src'));
            el.addClass('loading'); 

            //images 
            if(el.prop('tagName')=='img' || el.prop('tagName')=='IMG'){
                
                var newsrc=el.attr('data-src');
                el.attr('data-src','');
                el.attr('src',newsrc); 
                //console.log('start loading ' + newsrc);

            }//videos
            else if(el.prop('tagName')=='video' || el.prop('tagName')=='VIDEO'){
                var newsrc=el.find('source')
                el.get(0).pause();
                newsrc.each(function(){
                    var oldsrc = $(this).attr('data-src');
                    $(this).attr('data-src','');
                    $(this).attr('src',oldsrc);              
                });
                el.get(0).load();
                //el.get(0).pause();
            }

           
        }

        //last action 
        //
        
        $('img.lazy').each(function(){
            var el = $(this);
            var h_nominal = el.attr('height');
            var w_nominal = el.attr('width');
            var w_current = el.width();
            var h = (h_nominal*w_current) / w_nominal;
            


            if(el.parent().parent().hasClass('post-thumb')){

            var a_w = el.parent().width();
            var post_thumb_w = el.parent().parent().width();
            var post_width = el.parent().parent().parent().width();
            var li_width = el.parent().parent().parent().parent().width();

                //console.log('calculating height: ' + h + ';parent');
                //console.log(el);

            }
            //console.log('calculating height: ' + h + ';parent');
            //el.css('height',h+'px !important');            
            el.height(h);            
        });                


        function pauseVideo(target){
            target.get(0).pause();
        }

        function playVideo(target){
            target.get(0).play();
        }


        //detect if onscreen
        //
        if($.isFunction($.fn.onScreen)){
            $('.lazy').onScreen({
                //container: window,
                //direction: 'vertical',
                doIn: function() {
                    lazyload($(this));
                    if($(this).prop('tagName')=='VIDEO') playVideo($(this));
                },
                doOut: function() {
                    if($(this).prop('tagName')=='VIDEO') pauseVideo($(this));
                },
                tolerance: 100,
                //throttle: 0
            });
        }


    });

})(jQuery);

/*
====================== WEBFONT.JS ===================================

 * Copyright 2013 Small Batch, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */
;(function(window,document,undefined){
var j=void 0,k=!0,l=null,m=!1;function n(a){return function(){return this[a]}}var o;function t(a,b,c){var d=2<arguments.length?Array.prototype.slice.call(arguments,2):[];return function(){d.push.apply(d,arguments);return b.apply(a,d)}};function aa(a,b){this.P=a;this.K=b||a;this.R=this.K.document;this.ba=j}aa.prototype.createElement=function(a,b,c){a=this.R.createElement(a);if(b)for(var d in b)if(b.hasOwnProperty(d))if("style"==d){var e=a,f=b[d];ba(this)?e.setAttribute("style",f):e.style.cssText=f}else a.setAttribute(d,b[d]);c&&a.appendChild(this.R.createTextNode(c));return a};function u(a,b,c){a=a.R.getElementsByTagName(b)[0];a||(a=document.documentElement);a&&a.lastChild&&a.insertBefore(c,a.lastChild)}
function ca(a){function b(){document.body?a():setTimeout(b,0)}b()}function v(a,b){return a.createElement("link",{rel:"stylesheet",href:b})}function da(a,b){return a.createElement("script",{src:b})}function w(a,b){for(var c=a.className.split(/\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return;c.push(b);a.className=c.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}
function x(a,b){for(var c=a.className.split(/\s+/),d=[],e=0,f=c.length;e<f;e++)c[e]!=b&&d.push(c[e]);a.className=d.join(" ").replace(/\s+/g," ").replace(/^\s+|\s+$/,"")}function ea(a,b){for(var c=a.className.split(/\s+/),d=0,e=c.length;d<e;d++)if(c[d]==b)return k;return m}function ba(a){if(a.ba===j){var b=a.R.createElement("p");b.innerHTML='<a style="top:1px;">w</a>';a.ba=/top/.test(b.getElementsByTagName("a")[0].getAttribute("style"))}return a.ba}
function y(a){var b=a.K.location.protocol;"about:"==b&&(b=a.P.location.protocol);return"https:"==b?"https:":"http:"};function z(a,b,c){this.Ta=a;this.Ra=b;this.Sa=c}z.prototype.J=n("Ta");z.prototype.Y=n("Ra");function A(a,b,c,d,e,f,g,i){this.Ja=a;this.Qa=b;this.wa=c;this.va=d;this.Na=e;this.Ma=f;this.ua=g;this.v=i}o=A.prototype;o.getName=n("Ja");o.Da=n("Qa");o.fa=n("wa");o.Aa=n("va");o.Ba=n("Na");o.Ca=n("Ma");o.za=n("ua");o.z=n("v");function B(a,b){this.a=a;this.q=b}var fa=new A("Unknown","Unknown","Unknown","Unknown","Unknown","Unknown",j,new z(m,m,m));
B.prototype.parse=function(){var a;if(-1!=this.a.indexOf("MSIE")){a=C(this);var b=D(this),c=E(this.a,/(MSIE [\d\w\.]+)/,1);if(""!=c){var d=c.split(" "),c=d[0],d=d[1],e=F(d),f=F(b);a=new A(c,d,c,d,a,b,G(this.q),new z("Windows"==a&&6<=e.e||"Windows Phone"==a&&8<=f.e,m,m))}else a=new A("MSIE","Unknown","MSIE","Unknown",a,b,G(this.q),new z(m,m,m))}else if(-1!=this.a.indexOf("Opera"))a=ga(this);else if(/AppleWeb(K|k)it/.test(this.a)){a=C(this);var b=D(this),c=E(this.a,/AppleWeb(?:K|k)it\/([\d\.\+]+)/,
1),g=m;""==c&&(c="Unknown");d=F(c);g=F(b);e="Unknown";-1!=this.a.indexOf("Chrome")||-1!=this.a.indexOf("CrMo")||-1!=this.a.indexOf("CriOS")?e="Chrome":"BlackBerry"==a||"Android"==a?e="BuiltinBrowser":-1!=this.a.indexOf("Safari")?e="Safari":-1!=this.a.indexOf("AdobeAIR")&&(e="AdobeAIR");f="Unknown";"BuiltinBrowser"==e?f="Unknown":-1!=this.a.indexOf("Version/")?f=E(this.a,/Version\/([\d\.\w]+)/,1):"Chrome"==e?f=E(this.a,/(Chrome|CrMo|CriOS)\/([\d\.]+)/,2):"AdobeAIR"==e&&(f=E(this.a,/AdobeAIR\/([\d\.]+)/,
1));"AdobeAIR"==e?(g=F(f),g=2<g.e||2==g.e&&5<=g.A):g="BlackBerry"==a?10<=g.e:"Android"==a?2<g.e||2==g.e&&1<g.A:526<=d.e||525<=d.e&&13<=d.A;a=new A(e,f,"AppleWebKit",c,a,b,G(this.q),new z(g,536>d.e||536==d.e&&11>d.A,"iPhone"==a||"iPad"==a||"iPod"==a||"Macintosh"==a))}else-1!=this.a.indexOf("Gecko")?(b=a="Unknown",c=m,-1!=this.a.indexOf("Firefox")?(a="Firefox",d=E(this.a,/Firefox\/([\d\w\.]+)/,1),""!=d&&(c=F(d),b=d,c=3<=c.e&&5<=c.A)):-1!=this.a.indexOf("Mozilla")&&(a="Mozilla"),d=E(this.a,/rv:([^\)]+)/,
1),""==d?d="Unknown":c||(c=F(d),c=1<c.e||1==c.e&&9<c.A||1==c.e&&9==c.A&&2<=c.La||d.match(/1\.9\.1b[123]/)!=l||d.match(/1\.9\.1\.[\d\.]+/)!=l),a=new A(a,b,"Gecko",d,C(this),D(this),G(this.q),new z(c,m,m))):a=fa;return a};function C(a){var b=E(a.a,/(iPod|iPad|iPhone|Android|Windows Phone|BB\d{2}|BlackBerry)/,1);if(""!=b)return/BB\d{2}/.test(b)&&(b="BlackBerry"),b;a=E(a.a,/(Linux|Mac_PowerPC|Macintosh|Windows|CrOS)/,1);return""!=a?("Mac_PowerPC"==a&&(a="Macintosh"),a):"Unknown"}
function D(a){var b=E(a.a,/(OS X|Windows NT|Android|CrOS) ([^;)]+)/,2);if(b||(b=E(a.a,/Windows Phone( OS)? ([^;)]+)/,2)))return b;if(b=E(a.a,/(iPhone )?OS ([\d_]+)/,2))return b;if(b=E(a.a,/Linux ([i\d]+)/,1))return b;return(a=E(a.a,/(BB\d{2}|BlackBerry).*?Version\/([^\s]*)/,2))?a:"Unknown"}
function ga(a){var b="Unknown",c="Unknown",d=E(a.a,/(Presto\/[\d\w\.]+)/,1);""!=d?(c=d.split("/"),b=c[0],c=c[1]):(-1!=a.a.indexOf("Gecko")&&(b="Gecko"),d=E(a.a,/rv:([^\)]+)/,1),""!=d&&(c=d));if(-1!=a.a.indexOf("Opera Mini/"))return d=E(a.a,/Opera Mini\/([\d\.]+)/,1),""==d&&(d="Unknown"),new A("OperaMini",d,b,c,C(a),D(a),G(a.q),new z(m,m,m));if(-1!=a.a.indexOf("Version/")){var e=E(a.a,/Version\/([\d\.]+)/,1);if(""!=e)return d=F(e),new A("Opera",e,b,c,C(a),D(a),G(a.q),new z(10<=d.e,m,m))}e=E(a.a,/Opera[\/ ]([\d\.]+)/,
1);return""!=e?(d=F(e),new A("Opera",e,b,c,C(a),D(a),G(a.q),new z(10<=d.e,m,m))):new A("Opera","Unknown",b,c,C(a),D(a),G(a.q),new z(m,m,m))}function F(a){var a=/([0-9]+)(?:\.([0-9]+)(?:\.([0-9]+)?)?)?/.exec(a),b={};a&&(b.e=parseInt(a[1]||-1,10),b.A=parseInt(a[2]||-1,10),b.La=parseInt(a[3]||-1,10));return b}function E(a,b,c){return(a=a.match(b))&&a[c]?a[c]:""}function G(a){if(a.documentMode)return a.documentMode};function ha(a,b,c){this.c=a;this.j=b;this.da=c;this.k="wf";this.h=new ja("-")}function ka(a){w(a.j,a.h.f(a.k,"loading"));H(a,"loading")}function I(a){x(a.j,a.h.f(a.k,"loading"));ea(a.j,a.h.f(a.k,"active"))||w(a.j,a.h.f(a.k,"inactive"));H(a,"inactive")}function H(a,b,c,d){if(a.da[b])a.da[b](c,d)};function la(){this.ma={}}function ma(a,b,c){var d=[],e;for(e in b)if(b.hasOwnProperty(e)){var f=a.ma[e];f&&d.push(f(b[e],c))}return d};function na(a,b){this.width=a;this.height=b};function J(a,b,c,d,e,f,g){this.c=b;this.D=c;this.t=d;this.C=e;this.O=f;this.X=0;this.qa=this.ka=m;this.ca=g;this.v=a.z()}
J.prototype.watch=function(a,b,c,d,e){var f=a.length;if(0===f)I(this.D);else{for(var g=0;g<f;g++){var i=a[g];b[i]||(b[i]=["n4"]);this.X+=b[i].length}e&&(this.ka=e);for(g=0;g<f;g++)for(var i=a[g],e=b[i],p=c[i],h=0,q=e.length;h<q;h++){var s=e[h],r=this.D,S=i,ia=s;w(r.j,r.h.f(r.k,S,ia,"loading"));H(r,"fontloading",S,ia);r=t(this,this.xa);S=t(this,this.ya);(new d(r,S,this.c,this.t,this.C,this.O,i,s,this.v,this.ca,l,p)).start()}}};
J.prototype.xa=function(a,b){var c=this.D;x(c.j,c.h.f(c.k,a,b,"loading"));x(c.j,c.h.f(c.k,a,b,"inactive"));w(c.j,c.h.f(c.k,a,b,"active"));H(c,"fontactive",a,b);this.qa=k;oa(this)};J.prototype.ya=function(a,b){var c=this.D;x(c.j,c.h.f(c.k,a,b,"loading"));ea(c.j,c.h.f(c.k,a,b,"active"))||w(c.j,c.h.f(c.k,a,b,"inactive"));H(c,"fontinactive",a,b);oa(this)};
function oa(a){0==--a.X&&a.ka&&(a.qa?(a=a.D,x(a.j,a.h.f(a.k,"loading")),x(a.j,a.h.f(a.k,"inactive")),w(a.j,a.h.f(a.k,"active")),H(a,"active")):I(a.D))};function K(a,b,c,d,e,f,g,i,p,h,q,s){this.Q=a;this.ha=b;this.c=c;this.t=d;this.C=e;this.O=f;this.M=g;this.s=i;this.H=s||"BESbswy";this.v=p;this.o={};this.ca=h||5E3;this.la=q||l;this.G=this.F=l;a=new L(this.c,this.t,this.H);M(a);for(var r in N)N.hasOwnProperty(r)&&(O(a,N[r],this.s),this.o[N[r]]=a.m());a.remove()}var N={Xa:"serif",Wa:"sans-serif",Va:"monospace",Ua:"Apple Color Emoji"};
K.prototype.start=function(){this.F=new L(this.c,this.t,this.H);M(this.F);this.G=new L(this.c,this.t,this.H);M(this.G);this.pa=this.O();O(this.F,this.M+",serif",this.s);O(this.G,this.M+",sans-serif",this.s);this.W()};function P(a,b,c){return a.v.Sa?!!a.o[c]&&b.width==a.o[c].width:!!a.o[c]&&b.width==a.o[c].width&&!!a.o[c]&&b.height==a.o[c].height}function pa(a,b,c){for(var d in N)if(N.hasOwnProperty(d)&&P(a,b,N[d])&&P(a,c,N[d]))return k;return m}
K.prototype.W=function(){var a=this.F.m(),b=this.G.m();P(this,a,"serif")&&P(this,b,"sans-serif")||this.v.Y()&&pa(this,a,b)?this.O()-this.pa>=this.ca?this.v.Y()&&pa(this,a,b)&&(this.la===l||this.la.hasOwnProperty(this.M))?Q(this,this.Q):Q(this,this.ha):qa(this):Q(this,this.Q)};function qa(a){a.C(function(a,c){return function(){c.call(a)}}(a,a.W),25)}function Q(a,b){a.F.remove();a.G.remove();b(a.M,a.s)};function L(a,b,c){this.c=a;this.t=b;this.H=c;this.Ia=new ra;this.I=new R;this.S=this.c.createElement("span",{},this.H)}function O(a,b,c){var d=a.c,e=a.S,c=c?a.I.expand(c):"",a="position:absolute;top:-999px;left:-999px;font-size:300px;width:auto;height:auto;line-height:normal;margin:0;padding:0;font-variant:normal;white-space:nowrap;font-family:"+a.Ia.quote(b)+";"+c;ba(d)?e.setAttribute("style",a):e.style.cssText=a}function M(a){u(a.c,"body",a.S)}L.prototype.m=function(){return this.t.m(this.S)};
L.prototype.remove=function(){var a=this.S;a.parentNode&&a.parentNode.removeChild(a)};function T(a,b,c,d){this.P=a;this.ea=b;this.C=c;this.a=d;this.Z=this.$=0}T.prototype.u=function(a,b){this.ea.ma[a]=b};T.prototype.load=function(a){var b=a.context||this.P;this.c=new aa(this.P,b);b=new ha(this.c,b.document.documentElement,a);this.a.z().J()?sa(this,b,a):I(b)};T.prototype.Ea=function(a,b,c,d){var e=a.ga?a.ga():K;d?a.load(t(this,this.Ka,b,c,e)):(a=0==--this.$,this.Z--,a&&(0==this.Z?I(b):ka(b)),c.watch([],{},{},e,a))};
T.prototype.Ka=function(a,b,c,d,e,f){var g=0==--this.$;g&&ka(a);this.C(t(this,function(a,b,c,d,e,f){a.watch(b,c||{},d||{},e,f)},b,d,e,f,c,g))};function sa(a,b,c){var d=ma(a.ea,c,a.c),c=c.timeout;a.Z=a.$=d.length;for(var c=new J(a.a,a.c,b,{m:function(a){return new na(a.offsetWidth,a.offsetHeight)}},a.C,function(){return(new Date).getTime()},c),e=0,f=d.length;e<f;e++){var g=d[e];g.L(a.a,t(a,a.Ea,g,b,c))}};function ja(a){this.Fa=a||"-"}ja.prototype.f=function(a){for(var b=[],c=0;c<arguments.length;c++)b.push(arguments[c].replace(/[\W_]+/g,"").toLowerCase());return b.join(this.Fa)};function ra(){this.oa="'"}ra.prototype.quote=function(a){for(var b=[],a=a.split(/,\s*/),c=0;c<a.length;c++){var d=a[c].replace(/['"]/g,"");-1==d.indexOf(" ")?b.push(d):b.push(this.oa+d+this.oa)}return b.join(",")};function R(){this.U=ta;this.p=ua}var ta=["font-style","font-weight"],ua={"font-style":[["n","normal"],["i","italic"],["o","oblique"]],"font-weight":[["1","100"],["2","200"],["3","300"],["4","400"],["5","500"],["6","600"],["7","700"],["8","800"],["9","900"],["4","normal"],["7","bold"]]};function U(a,b,c){this.ia=a;this.Oa=b;this.p=c}U.prototype.compact=function(a,b){for(var c=0;c<this.p.length;c++)if(b==this.p[c][1]){a[this.ia]=this.p[c][0];break}};
U.prototype.expand=function(a,b){for(var c=0;c<this.p.length;c++)if(b==this.p[c][0]){a[this.ia]=this.Oa+":"+this.p[c][1];break}};R.prototype.compact=function(a){for(var b=["n","4"],a=a.split(";"),c=0,d=a.length;c<d;c++){var e=a[c].replace(/\s+/g,"").split(":");if(2==e.length){var f=e[1];a:{for(var e=e[0],g=0;g<this.U.length;g++)if(e==this.U[g]){e=new U(g,e,this.p[e]);break a}e=l}e&&e.compact(b,f)}}return b.join("")};
R.prototype.expand=function(a){if(2!=a.length)return l;for(var b=[l,l],c=0,d=this.U.length;c<d;c++){var e=this.U[c];(new U(c,e,this.p[e])).expand(b,a.substr(c,1))}return b[0]&&b[1]?b.join(";")+";":l};var V=window.WebFont=function(){var a=(new B(navigator.userAgent,document)).parse();return new T(window,new la,function(a,c){setTimeout(a,c)},a)}();V.load=V.load;V.addModule=V.u;A.prototype.getName=A.prototype.getName;A.prototype.getVersion=A.prototype.Da;A.prototype.getEngine=A.prototype.fa;A.prototype.getEngineVersion=A.prototype.Aa;A.prototype.getPlatform=A.prototype.Ba;A.prototype.getPlatformVersion=A.prototype.Ca;A.prototype.getDocumentMode=A.prototype.za;A.prototype.getBrowserInfo=A.prototype.z;
z.prototype.hasWebFontSupport=z.prototype.J;z.prototype.hasWebKitFallbackBug=z.prototype.Y;function W(a,b,c){this.a=a;this.c=b;this.d=c;this.g=[];this.w={}}
W.prototype.L=function(a,b){var c=this,d=c.d.projectId,e=c.d.version;if(d){var f=c.c.createElement("script");f.id="__MonotypeAPIScript__"+d;var g=this.c.K,i=m;f.onload=f.onreadystatechange=function(){if(!i&&(!this.readyState||"loaded"===this.readyState||"complete"===this.readyState)){i=k;if(g["__mti_fntLst"+d]){var e=g["__mti_fntLst"+d]();if(e&&e.length){var h;for(h=0;h<e.length;h++)c.g.push(e[h].fontfamily)}}b(a.z().J());f.onload=f.onreadystatechange=l}};f.src=c.N(d,e);u(this.c,"head",f)}else b(k)};
W.prototype.N=function(a,b){var c=y(this.c),d=(this.d.api||"fast.fonts.com/jsapi").replace(/^.*http(s?):(\/\/)?/,"");return c+"//"+d+"/"+a+".js"+(b?"?v="+b:"")};W.prototype.load=function(a){a(this.g,this.w)};V.u("monotype",function(a,b){var c=(new B(navigator.userAgent,document)).parse();return new W(c,b,a)});function X(a,b){this.c=a;this.d=b;this.g=[];this.w={}}X.prototype.N=function(a){var b=y(this.c);return(this.d.api||b+"//use.typekit.net")+"/"+a+".js"};X.prototype.L=function(a,b){var c=this.d.id,d=this.d,e=this.c.K,f=this;c?(e.__webfonttypekitmodule__||(e.__webfonttypekitmodule__={}),e.__webfonttypekitmodule__[c]=function(c){c(a,d,function(a,c,d){f.g=c;f.w=d;b(a)})},u(this.c,"head",da(this.c,this.N(c)))):b(k)};X.prototype.load=function(a){a(this.g,this.w)};
V.u("typekit",function(a,b){return new X(b,a)});function va(a,b){this.c=a;this.d=b}va.prototype.load=function(a){var b,c,d=this.d.urls||[],e=this.d.families||[];for(b=0,c=d.length;b<c;b++)u(this.c,"head",v(this.c,d[b]));var d=[],f={};for(b=0,c=e.length;b<c;b++){var g=e[b].split(":"),i=g[0],g=g[1];d.push(i);g&&(f[i]=(f[i]||[]).concat(g.split(",")))}a(d,f)};va.prototype.L=function(a,b){return b(a.z().J())};V.u("custom",function(a,b){return new va(b,a)});function Y(a,b,c,d,e,f,g,i,p,h){Y.Pa.call(this,a,b,c,d,e,f,g,i,p,h);a=["Times New Roman","Arial","Times","Sans","Serif"];b=a.length;c={};d=new L(this.c,this.t,this.H);M(d);O(d,a[0],this.s);c[d.m().width]=k;for(e=1;e<b;e++)f=a[e],O(d,f,this.s),c[d.m().width]=k,"4"!=this.s[1]&&(O(d,f,this.s[0]+"4"),c[d.m().width]=k);d.remove();this.B=c;this.ta=m;this.Ga=this.o.serif;this.Ha=this.o["sans-serif"]}(function(a,b){function c(){}c.prototype=a.prototype;b.prototype=new c;b.Pa=a;b.Ya=a.prototype})(K,Y);
var wa={Arimo:k,Cousine:k,Tinos:k};Y.prototype.W=function(){var a=this.F.m(),b=this.G.m();!this.ta&&a.width==b.width&&this.B[a.width]&&(this.B={},this.ta=this.B[a.width]=k);(this.Ga.width!=a.width||this.Ha.width!=b.width)&&!this.B[a.width]&&!this.B[b.width]?Q(this,this.Q):5E3<=this.O()-this.pa?this.B[a.width]&&this.B[b.width]&&wa[this.M]?Q(this,this.Q):Q(this,this.ha):qa(this)};function xa(a,b,c){this.V=a?a:b+ya;this.g=[];this.aa=[];this.ra=c||""}var ya="//fonts.googleapis.com/css";xa.prototype.f=function(){if(0==this.g.length)throw Error("No fonts to load !");if(-1!=this.V.indexOf("kit="))return this.V;for(var a=this.g.length,b=[],c=0;c<a;c++)b.push(this.g[c].replace(/ /g,"+"));a=this.V+"?family="+b.join("%7C");0<this.aa.length&&(a+="&subset="+this.aa.join(","));0<this.ra.length&&(a+="&text="+encodeURIComponent(this.ra));return a};function za(a){this.g=a;this.na=[];this.sa={};this.T={};this.I=new R}
var Aa={latin:"BESbswy",cyrillic:"&#1081;&#1103;&#1046;",greek:"&#945;&#946;&#931;",khmer:"&#x1780;&#x1781;&#x1782;",Hanuman:"&#x1780;&#x1781;&#x1782;"},Ba={thin:"1",extralight:"2","extra-light":"2",ultralight:"2","ultra-light":"2",light:"3",regular:"4",book:"4",medium:"5","semi-bold":"6",semibold:"6","demi-bold":"6",demibold:"6",bold:"7","extra-bold":"8",extrabold:"8","ultra-bold":"8",ultrabold:"8",black:"9",heavy:"9",l:"3",r:"4",b:"7"},Ca={i:"i",italic:"i",n:"n",normal:"n"},Da=RegExp("^(thin|(?:(?:extra|ultra)-?)?light|regular|book|medium|(?:(?:semi|demi|extra|ultra)-?)?bold|black|heavy|l|r|b|[1-9]00)?(n|i|normal|italic)?$");
za.prototype.parse=function(){for(var a=this.g.length,b=0;b<a;b++){var c=this.g[b].split(":"),d=c[0].replace(/\+/g," "),e=["n4"];if(2<=c.length){var f;var g=c[1];f=[];if(g)for(var g=g.split(","),i=g.length,p=0;p<i;p++){var h;h=g[p];if(h.match(/^[\w]+$/))if(h=Da.exec(h.toLowerCase()),h==l)h="";else{var q=j;q=h[1];if(q==l)q="4";else var s=Ba[q],q=s?s:isNaN(q)?"4":q.substr(0,1);h=(h=this.I.expand([h[2]==l?"n":Ca[h[2]],q].join("")))?this.I.compact(h):l}else h="";h&&f.push(h)}0<f.length&&(e=f);3==c.length&&
(c=c[2],f=[],c=!c?f:c.split(","),0<c.length&&(c=Aa[c[0]])&&(this.T[d]=c))}this.T[d]||(c=Aa[d])&&(this.T[d]=c);this.na.push(d);this.sa[d]=e}};function Z(a,b,c){this.a=a;this.c=b;this.d=c}Z.prototype.L=function(a,b){b(a.z().J())};Z.prototype.ga=function(){return"AppleWebKit"==this.a.fa()?Y:K};Z.prototype.load=function(a){"MSIE"==this.a.getName()&&this.d.blocking!=k?ca(t(this,this.ja,a)):this.ja(a)};
Z.prototype.ja=function(a){for(var b=this.c,c=new xa(this.d.api,y(b),this.d.text),d=this.d.families,e=d.length,f=0;f<e;f++){var g=d[f].split(":");3==g.length&&c.aa.push(g.pop());var i="";2==g.length&&""!=g[1]&&(i=":");c.g.push(g.join(i))}d=new za(d);d.parse();u(b,"head",v(b,c.f()));a(d.na,d.sa,d.T)};V.u("google",function(a,b){var c=(new B(navigator.userAgent,document)).parse();return new Z(c,b,a)});function Ea(a,b){this.c=a;this.d=b}var Fa={regular:"n4",bold:"n7",italic:"i4",bolditalic:"i7",r:"n4",b:"n7",i:"i4",bi:"i7"};Ea.prototype.L=function(a,b){return b(a.z().J())};
Ea.prototype.load=function(a){var b,c;u(this.c,"head",v(this.c,y(this.c)+"//webfonts.fontslive.com/css/"+this.d.key+".css"));var d=this.d.families,e,f;e=[];f={};for(var g=0,i=d.length;g<i;g++){c=c=b=j;c=d[g].split(":");b=c[0];if(c[1]){c=c[1].split(",");for(var p=[],h=0,q=c.length;h<q;h++){var s=c[h];if(s){var r=Fa[s];p.push(r?r:s)}}c=p}else c=["n4"];e.push(b);f[b]=c}a(e,f)};V.u("ascender",function(a,b){return new Ea(b,a)});function $(a,b){this.c=a;this.d=b;this.g=[];this.w={};this.I=new R}$.prototype.N=function(a){return y(this.c)+(this.d.api||"//f.fontdeck.com/s/css/js/")+(this.c.K.location.hostname||this.c.P.location.hostname)+"/"+a+".js"};
$.prototype.L=function(a,b){var c=this.d.id,d=this.c.K,e=this;c?(d.__webfontfontdeckmodule__||(d.__webfontfontdeckmodule__={}),d.__webfontfontdeckmodule__[c]=function(a,c){for(var d=0,p=c.fonts.length;d<p;++d){var h=c.fonts[d];e.g.push(h.name);e.w[h.name]=[e.I.compact("font-weight:"+h.weight+";font-style:"+h.style)]}b(a)},u(this.c,"head",da(this.c,this.N(c)))):b(k)};$.prototype.load=function(a){a(this.g,this.w)};V.u("fontdeck",function(a,b){return new $(b,a)});window.WebFontConfig&&V.load(window.WebFontConfig);
})(this,document);




/*
  Formalize - version 1.2

  Note: This file depends on the jQuery library.
*/

// Module pattern:
// http://yuiblog.com/blog/2007/06/12/module-pattern
var FORMALIZE = (function($, window, document, undefined) {
  // Internet Explorer detection.
  function IE(version) {
    var b = document.createElement('b');
    b.innerHTML = '<!--[if IE ' + version + ']><br><![endif]-->';
    return !!b.getElementsByTagName('br').length;
  }

  // Private constants.
  var PLACEHOLDER_SUPPORTED = 'placeholder' in document.createElement('input');
  var AUTOFOCUS_SUPPORTED = 'autofocus' in document.createElement('input');
  var IE6 = IE(6);
  var IE7 = IE(7);

  // Expose innards of FORMALIZE.
  return {
    // FORMALIZE.go
    go: function() {
      var i, j = this.init;

      for (i in j) {
        j.hasOwnProperty(i) && j[i]();
      }
    },
    // FORMALIZE.init
    init: {
      // FORMALIZE.init.disable_link_button
      disable_link_button: function() {
        $(document.documentElement).on('click', 'a.button_disabled', function() {
          return false;
        });
      },
      // FORMALIZE.init.full_input_size
      full_input_size: function() {
        if (!IE7 || !$('textarea, input.input_full').length) {
          return;
        }

        // This fixes width: 100% on <textarea> and class="input_full".
        // It ensures that form elements don't go wider than container.
        $('textarea, input.input_full').wrap('<span class="input_full_wrap"></span>');
      },
      // FORMALIZE.init.ie6_skin_inputs
      ie6_skin_inputs: function() {
        // Test for Internet Explorer 6.
        if (!IE6 || !$('input, select, textarea').length) {
          // Exit if the browser is not IE6,
          // or if no form elements exist.
          return;
        }

        // For <input type="submit" />, etc.
        var button_regex = /button|submit|reset/;

        // For <input type="text" />, etc.
        var type_regex = /date|datetime|datetime-local|email|month|number|password|range|search|tel|text|time|url|week/;

        $('input').each(function() {
          var el = $(this);

          // Is it a button?
          if (this.getAttribute('type').match(button_regex)) {
            el.addClass('ie6_button');

            /* Is it disabled? */
            if (this.disabled) {
              el.addClass('ie6_button_disabled');
            }
          }
          // Or is it a textual input?
          else if (this.getAttribute('type').match(type_regex)) {
            el.addClass('ie6_input');

            /* Is it disabled? */
            if (this.disabled) {
              el.addClass('ie6_input_disabled');
            }
          }
        });

        $('textarea, select').each(function() {
          /* Is it disabled? */
          if (this.disabled) {
            $(this).addClass('ie6_input_disabled');
          }
        });
      },
      // FORMALIZE.init.autofocus
      autofocus: function() {
        if (AUTOFOCUS_SUPPORTED || !$(':input[autofocus]').length) {
          return;
        }

        var el = $('[autofocus]')[0];

        if (!el.disabled) {
          el.focus();
        }
      },
      // FORMALIZE.init.placeholder
      placeholder: function() {
        if (PLACEHOLDER_SUPPORTED || !$(':input[placeholder]').length) {
          // Exit if placeholder is supported natively,
          // or if page does not have any placeholder.
          return;
        }

        FORMALIZE.misc.add_placeholder();

        $(':input[placeholder]').each(function() {
          // Placeholder obscured in older browsers,
          // so there's no point adding to password.
          if (this.type === 'password') {
            return;
          }

          var el = $(this);
          var text = el.attr('placeholder');

          el.focus(function() {
            if (el.val() === text) {
              el.val('').removeClass('placeholder_text');
            }
          }).blur(function() {
            FORMALIZE.misc.add_placeholder();
          });

          // Prevent <form> from accidentally
          // submitting the placeholder text.
          el.closest('form').submit(function() {
            if (el.val() === text) {
              el.val('').removeClass('placeholder_text');
            }
          }).on('reset', function() {
            setTimeout(FORMALIZE.misc.add_placeholder, 50);
          });
        });
      }
    },
    // FORMALIZE.misc
    misc: {
      // FORMALIZE.misc.add_placeholder
      add_placeholder: function() {
        if (PLACEHOLDER_SUPPORTED || !$(':input[placeholder]').length) {
          // Exit if placeholder is supported natively,
          // or if page does not have any placeholder.
          return;
        }

        $(':input[placeholder]').each(function() {
          // Placeholder obscured in older browsers,
          // so there's no point adding to password.
          if (this.type === 'password') {
            return;
          }

          var el = $(this);
          var text = el.attr('placeholder');

          if (!el.val() || el.val() === text) {
            el.val(text).addClass('placeholder_text');
          }
        });
      }
    }
  };
// Alias jQuery, window, document.
})(jQuery, this, this.document);

// Automatically calls all functions in FORMALIZE.init
jQuery(document).ready(function() {
  FORMALIZE.go();
});