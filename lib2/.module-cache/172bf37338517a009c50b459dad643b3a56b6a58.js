'use strict';

require('babel-polyfill');

var _marked = [nextColor].map(regeneratorRuntime.mark);

function nextColor() {
   var colors, idx;
   return regeneratorRuntime.wrap(function nextColor$(_context) {
      while (1) {
         switch (_context.prev = _context.next) {
            case 0:
               colors = ['#FF0000', '#FF1D00', '#FF3B00', '#FF5900', '#FF7700', '#FFA400', '#FFD100', '#FFFF00', '#AAFF00', '#55FF00', '#00FF00', '#00FF55', '#00FFAA', '#00FFFF', '#00AAFF', '#0055FF', '#0000FF', '#5500FF', '#AA00FF', '#FF00FF'];
               idx = 0;


               while (true) {
                  colors.forEach(function (c) {
                     return yield c;
                  });
               }

            case 3:
            case 'end':
               return _context.stop();
         }
      }
   }, _marked[0], this);
}

console.log('colors:');
var nxtc = nextColor();
console.log(nxtc.next());
console.log(nxtc.next());
console.log(nxtc.next());
console.log(nxtc.next());

var snake = function ($) {
   var rate = 50;
   var pieces = [];
   var player = void 0;
   var board = void 0;
   var gameLoop = void 0;
   var gameOver = false;

   function init(gameBoard) {
      board = gameBoard;
      player = new Player(board);
      pieces.push(player);
      console.log('gridHeight', board.getGridHeight());
      console.log('gridWidth', board.getGridWidth());
      board.draw();
      start();
   }

   function arrowKeyPress(dir) {
      player.directionQueue.push(dir);
   }

   function start() {

      spawnPoint();

      var itv = setInterval(function () {
         var dirs = ['N', 'E', 'S', 'W'];
         dirs.splice(['S', 'W', 'N', 'E'].indexOf(player.direction), 1);
         var randDir = dirs[parseInt(Math.random() * 2)];
         player.setColor('#' + parseInt(Math.random() * 9) + parseInt(Math.random() * 9) + parseInt(Math.random() * 9) + parseInt(Math.random() * 9) + parseInt(Math.random() * 9) + parseInt(Math.random() * 9));
         //.setDirection(randDir)
         //.grow()
      }, 1000);

      gameLoop = setInterval(function GAMELOOP() {
         player.move();
         if (!gameOver) {
            board.draw();
         }
      }, rate);
   }

   function endGame() {
      console.log('Game Over!');
      gameOver = true;
      clearInterval(gameLoop);
      board.paint.clear();
      board.paint.gameOver(player.points);
   }

   function spawnPoint() {
      var cell = board.randomCell();
      cell.set({
         color: '#99FF33'
      }, 'point');
   }

   var Player = function () {
      var isGrowing = false;
      var board = void 0;

      function Player(gameBoard, startPos) {
         board = gameBoard;
         this.points = 0;
         this.length = 1;
         this.directionQueue = [];
         this.color = '#FF9900';
         startPos = startPos || {
            x: 3,
            y: parseInt(Math.random() * board.getGridHeight())
         };
         this.head = new SnakeNode();
         this.head.cell = board.place(this.head, startPos, 'head');
         this.direction = this.awayFromEdge();
      }

      Player.prototype = {
         awayFromEdge: function awayFromEdge() {
            var distances = [this.head.cell.y, board.getGridWidth() - this.head.cell.x, board.getGridHeight() - this.head.cell.y, this.head.cell.x];
            return ['S', 'W', 'N', 'E'][distances.indexOf(Math.min.apply(Math, distances))];
         },
         draw: function draw() {
            board.drawCell(this.head.x, this.head.y);
            return this;
         },
         setColor: function setColor(color) {
            this.color = color;
            return this;
         },
         setDirection: function setDirection(dir) {
            console.log('NEW DIR: ', dir);
            this.direction = dir;
            return this;
         },
         move: function move() {
            console.log('moving cell');
            console.log('DIR: ', this.direction);
            if (this.directionQueue[0]) {
               var newDir = this.directionQueue.splice(0, 1)[0];
               console.log(newDir);
               this.setDirection(newDir);
            }
            var next = this.nextCell();
            if (next === -1 || next.type === 'tail') {
               endGame();
               return;
            } else if (next.type === 'point') {
               this.grow();
               spawnPoint();
               this.points++;
            }

            this.head.move(this.direction);
            return this;
         },
         nextCell: function nextCell() {
            var idx = ['N', 'E', 'S', 'W'].indexOf(this.direction);
            return idx === -1 ? -1 : this.head.cell[['north', 'east', 'south', 'west'][idx]]();
         },
         grow: function grow() {
            this.length++;
            isGrowing = true;
            return this;
         }
      };

      function SnakeNode(cell, nextCell) {
         this.cell = cell || null;
         this.color = '#FF9900';
         this.child = null;
         this.nextCell = nextCell || null;
      }

      SnakeNode.prototype = {
         move: function move(dir) {
            if (this.cell.content === 'empty') {
               this.cell = board.place(this, this.nextCell.loc, 'tail');
               return;
            }
            var saveCell = this.cell;
            if (dir) this.nextCell = this.cell.neighbors[dir]();

            this.cell.moveTo(this.nextCell);
            if (this.child) {
               this.child.nextCell = saveCell;
               this.child.move();
            } else if (isGrowing) {
               this.child = new SnakeNode(saveCell, this.cell);
               isGrowing = false;
            }
         }
      };

      return Player;
   }();

   return {
      init: init,
      arrowKeyPress: arrowKeyPress
   };
}(jQuery);