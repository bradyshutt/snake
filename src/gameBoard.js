'use strict'

var createBoard = (function($) {

   let pen, canvas
   let boardReady = false
   let ops = {}

   function createBoard(options) {
      canvas = document.getElementById(options.canvasID)
      pen = canvas.getContext('2d')
      ops.pixelSize = options.pixelSize || 10
      ops.gridLinesColor = options.gridLinesColor || '#EEE'
      ops.borderColor = options.borderColor || '#000'
      ops.borderSize = options.borderSize || 5
      let border = ops.borderSize
      let pxSize = ops.pixelSize

      let w = options.boardWidth || canvas.width
      if (typeof w === 'string' && w[w.length - 1].toLowerCase() === '%')
         w = $(window).width() * (w.slice(0, -1) / 100)
      ops.boardWidth = (parseInt(parseInt(w) / pxSize) * pxSize) + border * 2

      let h = options.boardHeight || canvas.height
      if (typeof h === 'string' && h[h.length - 1].toLowerCase() === '%')
         h = $(window).height() * (h.slice(0, -1) / 100)
      ops.boardHeight = (parseInt(parseInt(h) / pxSize) * pxSize) + border * 2
      ops.numXCells = (ops.boardWidth - (ops.borderSize * 2)) / ops.pixelSize
      ops.numYCells = (ops.boardHeight - (ops.borderSize * 2)) / ops.pixelSize
      ops.dimentions = { 'x': ops.numXCells, 'y': ops.numYCells }

      if (options.showButton) {
         $('.' + options.showButton).click(showBoard)
         $(canvas).hide()
      }
      else
         showBoard()

      function showBoard() {
         console.log('displaying the board')
         boardReady = true
         $(this).hide()
         canvas.width = ops.boardWidth
         canvas.height = ops.boardHeight
         $(canvas).show()
         draw.gridLines()
         board.init(ops.dimentions.x, ops.dimentions.y)
         /* Run start function, if supplied */
         options.startFunction && options.startFunction()
      }

      return board
   }

   function setBorderColor(color) {
      ops.borderColor = color
   }


   let draw = (function() {
      function drawGridLines() {
         let border = ops.borderSize
         pen.strokeStyle = ops.gridLinesColor

         for (let col = border; col < ops.boardWidth; col += ops.pixelSize) {
            pen.strokeRect(col, border, 1, ops.boardHeight - border)
         } 

         for (let row = border; row < ops.boardHeight; row += ops.pixelSize) {
            pen.strokeRect(border, row, ops.boardWidth - border, 1)
         } 
         drawBorder(ops.borderColor)
      }

      function drawBorder(color) {
         console.log('painting border:', color)
         let border = ops.borderSize
         pen.fillStyle = color
         pen.fillRect(0, 0, border, ops.boardHeight)
         pen.fillRect(0, 0, ops.boardWidth, border)
         pen.fillRect(ops.boardWidth - border, 0, border, ops.boardHeight)
         pen.fillRect(0, ops.boardHeight - border, ops.boardWidth, border)
      }

      function drawCell(x, y, color) {
         pen.fillStyle = color || '#FCFCFC'
         pen.fillRect(
            x * ops.pixelSize + ops.borderSize, 
            y * ops.pixelSize + ops.borderSize,
            ops.pixelSize, 
            ops.pixelSize)
      }

      function drawBoard(grid) {
         //console.log('drawing board')
         for (let col = 0; col < grid.length; col++) {
            for (let row = 0; row < grid[col].length; row++) {
               let color = grid[col][row].content.color
               switch (grid[col][row].type) {
                  case 'empty':
                     color = '#CCC'
                     break
                  case 'tail':
                     //color = '#F90'
                     break
                  case 'head':
                     //color = '#F00'
                     break
                  case 'point':
                     //color = '#00F'
                     break
                  
                  default:
                     
               }
               drawCell(col, row, color)
            } 
         } 
         drawGridLines()
      }

      function clearBoard() {
         pen.fillStyle = '#000000'
         pen.fillRect(0, 0, ops.boardWidth, ops.boardHeight)
      }

      function gameOver(points) {
         pen.fillStyle = '#000'
         pen.fillRect(0, 0, ops.boardWidth, ops.boardHeight)
         pen.textAlign = 'center'
         pen.fillStyle = '#FF9900'
         pen.font = '48px Helvetica'
         pen.fillText('Game Over!', ops.boardWidth / 2, ops.boardHeight / 4)
         pen.font = '32px Helvetica'
         pen.fillText('Press enter to restart the game.', ops.boardWidth / 2, ops.boardHeight / 2)
         pen.fillText('You ended with ' + points + ' point' +
            ((points > 1) ? 's!' : '!'), 
            ops.boardWidth / 2, ops.boardHeight / 4 * 3)
      }

      return {
         gridLines: drawGridLines,
         cell: drawCell,
         board: drawBoard,
         clear: clearBoard,
         gameOver: gameOver,
         border: drawBorder
      }
            
   })()

   let board = (function() {

      let grid = []
      let numCells = 0
      let gridWidth, gridHeight

      function init(xCells, yCells) {
         gridWidth = xCells
         gridHeight = yCells

         for (let col = 0; col < xCells; col++) {
            grid[col] = []
            for (let row = 0; row < yCells; row++) {
               grid[col][row] = new Cell()
            } 
         } 
      }

      /* Place an object on the board */
      function placeCell(obj, pos, type) {
         let cell = getCell(pos.x, pos.y).set(obj, type)
         return cell
      }

//      function resetPlayerPos() {
//         grid.forEach(col => col.forEach(cell => {
//            if (cell.type === 'head')
//               cell.empty()
//         }))
//         
//      }

      /* Can pass in a cellID, (x,y) coords, or an {x:_, y:_} object */
      function getCell(cellID, yCoord) {
         return (typeof cellID === 'number')
            ? (yCoord)
               ? grid[cellID][yCoord]
               : grid[parseInt(cellID / gridHeight)][cellID % gridHeight]
            : grid[cellID.x][cellID.y]
      }

      function randomCell() {
         let cell
         do {
            cell = getCell({
               x: parseInt(Math.random() * board.getGridWidth()),
               y: parseInt(Math.random() * board.getGridHeight())
            })
         } while (cell.content !== 'empty')
         return cell
      }

      function reset() {
         grid.forEach(col => col.forEach( cell => cell.empty()))
         
      }

      function moveCell(from, to) {
         to.set(from.content, from.type)
         from.content.cell = to
         from.empty()
      }

      function Cell(content) {
         this.id = numCells++ 
         this.x = parseInt(this.id / gridHeight)
         this.y = this.id % gridHeight
         this.loc = {
            x: this.x,
            y: this.y
         }
         this.neighbors = {
            'N': () => this.north.call(this),
            'E': () => this.east.call(this),
            'S': () => this.south.call(this),
            'W': () => this.west.call(this)
         }
         this.content = content || 'empty'
         this.type = 'empty'
      }

      Cell.prototype = {
         north() { 
            return (this.y > 0) 
               ? getCell(this.id - 1) 
               : -1
         },
         east() { 
            return (this.x < gridWidth - 1) 
               ? getCell(this.id + gridHeight) 
               : -1
         },
         south() { 
            return (this.y < gridHeight - 1) 
               ? getCell(this.id + 1) 
               : -1
         },
         west() { 
            return (this.x > 0) 
               ? getCell(this.id - gridHeight) 
               : -1
         },
         draw() {
            draw.cell(this.x, this.y)
         },
         set(obj, type) {
            this.content = obj
            this.type = type
            return this
         },
         empty() {
            this.content = 'empty'
            this.type = 'empty'
         },
         step(dir) {
            let dest = {
               'N': this.north, 'E':this.east,
               'S': this.south, 'W':this.west
            }[dir].call(this)
            moveCell(this, dest)
         },
         moveTo(cell) {
            moveCell(this, cell)
         }

      }

      return {
         init: init,
         place: placeCell,
         getCell: getCell,
         reset: reset,
         draw: () => draw.board(grid),
         paint: {
            gameOver: draw.gameOver,
            clear: draw.clear,
            border: draw.border
         },
         isReady: boardReady,
         getGridHeight: () => gridHeight,
         getGridWidth: () => gridWidth,
         randomCell: randomCell,
         setBorderColor: setBorderColor
      }

   })()

   return createBoard

})(jQuery)

