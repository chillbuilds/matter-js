$(document).ready(()=>{
    $('canvas').addClass('phaserCanvas')
    $('.phaserCanvas').wrap('<div class="canvasContainer"></div>')

    $('.canvasContainer').attr('style', `margin-left:${($(window).width() - $('.phaserCanvas').attr('width'))/2}px;`)
    $('body').append('<div class="repo"></div>')
    $('.repo').html('<a style="color:blue;" href="https://github.com/chillbuilds/phaser-test" target="_blank">github repo</a>')
    $('.repo').attr('style', `
        margin-left:${($(window).width() - $('.phaserCanvas').attr('width'))/2}px;
        margin-top:8px;
        font-size:22px;
        font-family: arial;
    `)
})

// const 