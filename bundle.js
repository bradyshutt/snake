(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict'


function* nextColor() {

   let colors = [
      '#FF0000',
      '#FF1D00',
      '#FF3B00',
      '#FF5900',
      '#FF7700',
      '#FFA400',
      '#FFD100',
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
      '#FF00FF'
   ]
   let idx = 0;

   while (true) {
      colors.forEach(c => yield c);
   }
}

console.log('colors:');
let nxtc = nextColor();
console.log(nxtc.next());
console.log(nxtc.next());
console.log(nxtc.next());
console.log(nxtc.next());



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






},{}]},{},[1]);
