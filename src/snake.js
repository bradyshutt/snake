'use strict'

const GAME_SPEED = 42

function NextColor() {

   let colors = [
      '#FF0000',
      '#FF5500',
      '#FFAA00',
      '#FFFF00',
      '#AAFF00',
      '#55FF00',
      '#00FF00',
      '#00FF55',
      '#00FFAA',
      '#00FFFF',
      '#00AAFF',
      '#0055FF',
      '#0000FF',
      '#5500FF',
      '#AA00FF',
      '#FF00FF',
      '#FF00AA',
      '#FF0055'
   ]
//   let colors = [
//      '#FF0000',
//      '#FF3B00',
//      '#FF5900',
//      '#FF7700',
//      '#FFA400',
//      '#FFD100',
//      '#FFFF00',
//      '#AAFF00',
//      '#55FF00',
//      '#00FF00',
//      '#00FF55',
//      '#00FFAA',
//      '#00FFFF',
//      '#00AAFF',
//      '#0055FF',
//      '#0000FF',
//      '#5500FF',
//      '#AA00FF',
//      '#FF00FF'
//   ]
   let colorIndex = 0;

   return {
      next: function() {
         return (colors[colorIndex++] || colors[(colorIndex = 0)])
      },
      reset: function() {
         colorIndex = 0;
      }
   }
}

let colors = NextColor();

var snake = (function($) {
   let rate = GAME_SPEED
   let pieces = []
   let player
   let board
   let gameLoop
   let gameOver = false
   let status = 'ready'

   function init(gameBoard) {
      console.log('INIT BOARD')
      board = gameBoard
      player = new Player(board)
      pieces.push(player)
      console.log('gridHeight', board.getGridHeight())
      console.log('gridWidth', board.getGridWidth())
      board.draw()
      start()
   }

   function getStatus() {
      return status
   }

   function arrowKeyPress(dir) {
      player.directionQueue.push(dir)
   }

   function start() {

      status = 'running'
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
      status = 'ended'
      clearInterval(gameLoop)
      board.paint.clear()
      board.paint.gameOver(player.points)
   }

   function restart() {
      board.paint.clear()
      gameOver = false
      player.points = 0
      board.reset()
      colors.reset()
      player.reset()
      start()

   }

   function spawnPoint() {
      let cell = board.randomCell()
      let color = colors.next()
      cell.set({
         color: color
      }, 'point')
      console.log('trying to paint border')
      board.setBorderColor(color)
   }

      
   let Player = (function() {
      let isGrowing = false
      let nextColor;
      let board

      function Player(gameBoard, startPos) {
         board = gameBoard
         this.points = 0
         this.length = 1
         this.directionQueue = []
         this.color = colors.next()
         startPos = startPos || this.randomStartPosition()
//         startPos = startPos ||
//            {
//               x: 3,
//               y: parseInt(Math.random() * (board.getGridHeight() - board.getGridHeight() / 3) + board.getGridHeight() / 3)
//            }
         this.head = new SnakeNode()
         this.head.cell = board.place(this.head, startPos, 'head')
         this.direction = this.awayFromEdge()
      }

      Player.prototype = {
         randomStartPosition() {
            let height = board.getGridHeight()
            let width = board.getGridWidth()
            let y = ~~( (Math.random()*(height - height/3)) + height/6)
            let x = ~~( (Math.random()*(width - width/3)) + width/6)
            return {x: x, y: y}
         },
         reset() {
            //this.head = new SnakeNode()
            this.head.cell = board.place(this.head, this.randomStartPosition(), 'head')
            this.direction = this.awayFromEdge()
            this.head.child = null;
            this.length = 1;
         },
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
            board.drawCell(this.head.x, this.head.y, this.color)
            return this
         },
         setColor(color) {
            this.color = color
            return this
         },
         setDirection(dir) {
            this.direction = dir  
            return this
         },
         isNotReverse(dir) {
         let dirs = ['N', 'E', 'S', 'W']
            switch (this.direction) {
               case 'N':
                  return dir !== 'S'
               case 'E':
                  return dir !== 'W'
               case 'S':
                  return dir !== 'N'
               case 'W':
                  return dir !== 'E'
            }
         },
         move() { 
            if (this.directionQueue[0]) {
               let newDir = this.directionQueue.splice(0,1)[0]
               if (this.isNotReverse(newDir)) {
                  this.setDirection(newDir)
               }
            }
            let next = this.nextCell()
            //console.log(next)
            if (next === -1 || next.type === 'tail') {
               console.log('OOPS!')
               endGame()
               return
            }
            else if (next.type === 'point') {
               this.grow(next.content.color)
               spawnPoint()
               this.points++
            }

            this.head.move(this.direction)
            return this
         },
         nextCell() {
            //console.log('dir::::', this.direction)
            let idx = ['N', 'E', 'S', 'W'].indexOf(this.direction)
            return (idx === -1)
               ? -1
               : this.head.cell[['north', 'east', 'south', 'west'][idx]]()
         },
         grow(color) {
            nextColor = color;
            this.length++
            isGrowing = true
            return this
         }
      }

      function SnakeNode(cell, nextCell, color) {
         this.cell = cell || null
         this.color = color || "#F00"
         //this.nextColor 
         //this.color = "#FFFFFF"
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
               this.child = new SnakeNode(saveCell, this.cell, nextColor)
               isGrowing = false
            }
         }
      }

      return Player
   })()

   return {
      init: init,
      restart: restart,
      arrowKeyPress: arrowKeyPress,
      getStatus: getStatus
   }

})(jQuery)





