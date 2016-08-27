'use strict'

;(function($) {
  $(function pageReady() {
    let canvas = document.getElementById('board')
    canvas.width = $(window).width()
    canvas.height = $(window).height()
    $('#start-button').click(() => {
      $('#start-button').hide()
      $('#board').show()
      let board = gameBoard({
        canvasID: '#board',
        startButtonID: '#start-button'
      })
      board.fill(100, 100)
      
    })

  })



  let game = (function() {

    
    function Game(canvas) {
      let gridX = canvas.width
      let gridY = canvas.height
      let board = []
      let ctx = canvas.getContext('2d')
    }

      
    return function(canvas) {
      
    }
    
  })()
  

})(jQuery)
