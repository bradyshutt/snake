'use strict'

;(function($) {
  $(function pageReady() {
    let canvas = document.getElementById('board')
    let board = createBoard({
      canvasID: 'board',
      startButtonID: 'start-button',
      pixelSize: 13,
      //boardWidth: $(window).width(),
      //boardHeight: $(window).height(),
      boardWidth: '66%',
      boardHeight: '66%',
      borderColor: 'green',
      borderSize: 2,
      gridLinesColor: '#ddd',
    })

    setTimeout(() => { $('#start-button').click() }, 1000)

  })

})(jQuery)
