let slides = $('.js-slider');
let slidesThumbnails = $('.js-slider-thumbnails');

let activeClass = 'slick-active',
    ariaAttribute = 'aria-hidden';

slides.each(function () {
    let slide = $(this);

    slide.slick({
        dots: false,
        arrows: true,
        fade: false,
        autoplay        : true,
        autoplaySpeed   : 3000,
        infinite        : true,
        appendArrows: '.js-slider-arrow',
    });

    $(this).on('afterChange', function(){
        bLazy.revalidate();
    });
});
