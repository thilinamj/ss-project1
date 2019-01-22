const Blazy = require('blazy');

window.bLazy = new Blazy({
    offset: 500,
    selector: '.lazy',
    loadInvisible: true,
    breakpoints: [],
});
