'use strict'


var snake = (function($) {
   let rate = 50
   let pieces = []
   let player
   let board
   let gameLoop
   let gameOver = false


   function init(gameBoard) {
      board = gameBoard
      player = new Player(board)
      pieces.push(player)
      console.log('gridHeight', board.getGridHeight())
      console.log('gridWidth', board.getGridWidth())
      board.draw()
      start()
   }

   function arrowKeyPress(dir) {
      player.directionQueue.push(dir)
   }

   function start() {

      spawnPoint()

      let itv = setInterval(() => {
         let dirs = ['N', 'E', 'S', 'W']
         dirs.splice(['S', 'W', 'N', 'E'].indexOf(player.direction), 1)
         let randDir = dirs[parseInt(Math.random() * 2)]
         player
            .setColor('#' 
               + parseInt(Math.random() * 9) + parseInt(Math.random() * 9)
               + parseInt(Math.random() * 9) + parseInt(Math.random() * 9)
               + parseInt(Math.random() * 9) + parseInt(Math.random() * 9)
            )
            //.setDirection(randDir)
            //.grow()
      }, 1000)

      gameLoop = setInterval(
         (function GAMELOOP() {
            player.move()
            if (!gameOver) {
               board.draw()
            }
         })
         , rate)
   }

   function endGame() {
      console.log('Game Over!')
      gameOver = true
      clearInterval(gameLoop)
      board.paint.clear()
      board.paint.gameOver(player.points)
   }

   function spawnPoint() {
      let cell = board.randomCell()
      cell.set({
         color: '#99FF33'
      }, 'point')
      
   }

      
   let Player = (function() {
      let isGrowing = false
      let board

      function Player(gameBoard, startPos) {
         board = gameBoard
         this.points = 0
         this.length = 1
         this.directionQueue = []
         this.color = '#FF9900'
         startPos = startPos ||
            {
               x: 3,
               y: parseInt(Math.random() * board.getGridHeight())
            }
         this.head = new SnakeNode()
         this.head.cell = board.place(this.head, startPos, 'head')
         this.direction = this.awayFromEdge()
      }

      Player.prototype = {
         awayFromEdge() {
            let distances = [
               this.head.cell.y,
               board.getGridWidth() - this.head.cell.x,
               board.getGridHeight() - this.head.cell.y,
               this.head.cell.x
            ]
            return ['S', 'W', 'N', 'E'][distances.indexOf(Math.min(...distances))]
         },
         draw() {
            board.drawCell(this.head.x, this.head.y)
            return this
         },
         setColor(color) {
            this.color = color
            return this
         },
         setDirection(dir) {
            console.log('NEW DIR: ', dir)
            this.direction = dir  
            return this
         },
         move() { 
            console.log('moving cell')
            console.log('DIR: ', this.direction)
            if (this.directionQueue[0]) {
               let newDir = this.directionQueue.splice(0,1)[0]
               console.log(newDir)
               this.setDirection(newDir)
            }
            let next = this.nextCell()
            if (next === -1 || next.type === 'tail') {
               endGame()
               return
            }
            else if (next.type === 'point') {
               this.grow()
               spawnPoint()
               this.points++
            }

            this.head.move(this.direction)
            return this
         },
         nextCell() {
            let idx = ['N', 'E', 'S', 'W'].indexOf(this.direction)
            return (idx === -1)
               ? -1
               : this.head.cell[['north', 'east', 'south', 'west'][idx]]()
         },
         grow() {
            this.length++
            isGrowing = true
            return this
         }
      }

      function SnakeNode(cell, nextCell) {
         this.cell = cell || null
         this.color = '#FF9900'
         this.child = null
         this.nextCell = nextCell || null
      }

      SnakeNode.prototype = {
         move(dir) {
            if (this.cell.content === 'empty') {
               this.cell = board.place(this, this.nextCell.loc, 'tail')
               return
            }
            let saveCell = this.cell
            if (dir)
               this.nextCell = this.cell.neighbors[dir]()

            this.cell.moveTo(this.nextCell)
            if (this.child) {
               this.child.nextCell = saveCell
               this.child.move()
            }
            else if (isGrowing) {
               this.child = new SnakeNode(saveCell, this.cell)
               isGrowing = false
            }
         }
      }

      return Player
   })()

   return {
      init: init,
      arrowKeyPress: arrowKeyPress
   }

})(jQuery)




