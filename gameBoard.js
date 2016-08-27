'use strict'

var gameBoard = (function($) {

  let grid = []
  let xRes
  let yRes
  let ctx
  let canvas


  /* context: an 'options' object
   *  .canvasID: The canvas element's ID
   *  .startButtonID: (optional) A button ID that shows the [hidden] board
   *   */
  return function initializeBoard(context) {
    canvas = document.getElementById(context.canvasID)
    xRes = canvas.width
    yRes = canvas.height
    ctx = canvas.getContext('2d')


    function fill(x, y) {
      ctx.fillStyle = 'green'
      ctx.fillRect(x, y, 100, 100)
    }

    function start() {
      console.log('starting game')
    }


    return {
      fill: fill
    }
  }
  

})(jQuery)
