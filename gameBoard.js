'use strict'

var createBoard = (function($) {

  let pen, canvas, run
  let boardReady = false
  let grid = []
  let ops = {}


  /* options: an 'options' object
   *  .canvasID: The canvas element's ID
   *  .startButtonID: (optional) A button ID that shows the [hidden] board
   *   */
  return function createBoard(options) {
    canvas = document.getElementById(options.canvasID)
    pen = canvas.getContext('2d')
    run = null || options.run
    ops.pixelSize = options.pixelSize || 10
    ops.gridLinesColor = options.gridLinesColor || '#EEE'
    ops.borderColor = options.borderColor || '#000'
    ops.borderSize = options.borderSize || 5
    let border = ops.borderSize
    let pxSize = ops.pixelSize

    let w = options.boardWidth || $(window).width()
    if (typeof w === 'string' && w[w.length - 1].toLowerCase() === '%')
      w = $(window).width() * (w.slice(0, -1) / 100)
    ops.boardWidth = (parseInt(parseInt(w) / pxSize) * pxSize) + border * 2

    let h = options.boardHeight || $(window).height()
    if (typeof h === 'string' && h[h.length - 1].toLowerCase() === '%')
      h = $(window).height() * (h.slice(0, -1) / 100)
    ops.boardHeight = (parseInt(parseInt(h) / pxSize) * pxSize) + border * 2

    if (options.startButtonID)
      $('#' + options.startButtonID).click(startButton)


    return {
      fillCell: fillCell,
      isReady() { return boardReady },
    }
  }

  function setupBoard() {
    console.log('setting up board')
    canvas.width = ops.boardWidth
    canvas.height = ops.boardHeight
    drawGrid()
  }


  function startButton() {
    console.log('starting game')
    boardReady = true
    $(this).hide()
    $(canvas).show()
    setupBoard()
    run && run()
  }

  function fillCell(x, y, color) {
    pen.fillStyle = color || 'green'
    pen.fillRect(
      x * ops.pixelSize + ops.borderSize, 
      y * ops.pixelSize + ops.borderSize,
      ops.pixelSize, 
      ops.pixelSize)
  }

  function drawGrid() {

    let border = ops.borderSize
    pen.strokeStyle = ops.gridLinesColor

    for (let col = border; col < ops.boardWidth; col += ops.pixelSize) {
      pen.strokeRect(col, border, 1, ops.boardHeight - border)
    } 

    for (let row = border; row < ops.boardHeight; row += ops.pixelSize) {
      pen.strokeRect(border, row, ops.boardWidth - border, 1)
    } 

    pen.fillStyle = ops.boardBorderColor
    pen.fillRect(0, 0, border, ops.boardWidth)
    pen.fillRect(0, 0, ops.boardWidth, border)
    pen.fillRect(ops.boardWidth - border, 0, border, ops.boardWidth)
    pen.fillRect(0, ops.boardHeight - border, ops.boardWidth, border)



    
  }
  

})(jQuery)
