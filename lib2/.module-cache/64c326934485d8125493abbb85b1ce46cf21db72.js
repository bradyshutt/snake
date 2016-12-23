'use strict';

var createBoard = function ($) {

   var pen = void 0,
       canvas = void 0;
   var boardReady = false;
   var ops = {};

   function createBoard(options) {
      canvas = document.getElementById(options.canvasID);
      pen = canvas.getContext('2d');
      ops.pixelSize = options.pixelSize || 10;
      ops.gridLinesColor = options.gridLinesColor || '#EEE';
      ops.borderColor = options.borderColor || '#000';
      ops.borderSize = options.borderSize || 5;
      var border = ops.borderSize;
      var pxSize = ops.pixelSize;

      var w = options.boardWidth || canvas.width;
      if (typeof w === 'string' && w[w.length - 1].toLowerCase() === '%') w = $(window).width() * (w.slice(0, -1) / 100);
      ops.boardWidth = parseInt(parseInt(w) / pxSize) * pxSize + border * 2;

      var h = options.boardHeight || canvas.height;
      if (typeof h === 'string' && h[h.length - 1].toLowerCase() === '%') h = $(window).height() * (h.slice(0, -1) / 100);
      ops.boardHeight = parseInt(parseInt(h) / pxSize) * pxSize + border * 2;
      ops.numXCells = (ops.boardWidth - ops.borderSize * 2) / ops.pixelSize;
      ops.numYCells = (ops.boardHeight - ops.borderSize * 2) / ops.pixelSize;
      ops.dimentions = { 'x': ops.numXCells, 'y': ops.numYCells };

      if (options.showButton) {
         $('#' + options.showButton).click(showBoard);
         $(canvas).hide();
      } else showBoard();

      function showBoard() {
         console.log('displaying the board');
         boardReady = true;
         $(this).hide();
         canvas.width = ops.boardWidth;
         canvas.height = ops.boardHeight;
         $(canvas).show();
         _draw.gridLines();
         board.init(ops.dimentions.x, ops.dimentions.y);
         /* Run start function, if supplied */
         options.startFunction && options.startFunction();
      }

      return board;
   }

   var _draw = function () {
      function drawGridLines() {
         var border = ops.borderSize;
         pen.strokeStyle = ops.gridLinesColor;

         for (var col = border; col < ops.boardWidth; col += ops.pixelSize) {
            pen.strokeRect(col, border, 1, ops.boardHeight - border);
         }

         for (var row = border; row < ops.boardHeight; row += ops.pixelSize) {
            pen.strokeRect(border, row, ops.boardWidth - border, 1);
         }

         pen.fillStyle = ops.borderColor;
         pen.fillRect(0, 0, border, ops.boardHeight);
         pen.fillRect(0, 0, ops.boardWidth, border);
         pen.fillRect(ops.boardWidth - border, 0, border, ops.boardHeight);
         pen.fillRect(0, ops.boardHeight - border, ops.boardWidth, border);
      }

      function drawCell(x, y, color) {
         pen.fillStyle = color || '#FCFCFC';
         pen.fillRect(x * ops.pixelSize + ops.borderSize, y * ops.pixelSize + ops.borderSize, ops.pixelSize, ops.pixelSize);
      }

      function drawBoard(grid) {
         //console.log('drawing board')
         for (var col = 0; col < grid.length; col++) {
            for (var row = 0; row < grid[col].length; row++) {
               var color = grid[col][row].content.color;
               switch (grid[col][row].type) {
                  case 'empty':
                     color = '#CCC';
                     break;
                  case 'tail':
                     color = '#F90';
                     break;
                  case 'head':
                     color = '#F00';
                     break;
                  case 'point':
                     color = '#00F';
                     break;

                  default:

               }
               drawCell(col, row, color);
            }
         }
         drawGridLines();
      }

      function clearBoard() {
         pen.fillStyle = '#000000';
         pen.fillRect(0, 0, ops.boardWidth, ops.boardHeight);
      }

      function gameOver(points) {
         pen.fillStyle = '#000';
         pen.fillRect(0, 0, ops.boardWidth, ops.boardHeight);
         pen.textAlign = 'center';
         pen.fillStyle = '#FF9900';
         pen.font = '48px Helvetica';
         pen.fillText('Game Over!', ops.boardWidth / 2, ops.boardHeight / 4);
         pen.font = '32px Helvetica';
         pen.fillText('You ended with ' + points + ' point' + (points > 1 ? 's!' : '!'), ops.boardWidth / 2, ops.boardHeight / 4 * 3);
      }

      return {
         gridLines: drawGridLines,
         cell: drawCell,
         board: drawBoard,
         clear: clearBoard,
         gameOver: gameOver
      };
   }();

   var board = function () {

      var grid = [];
      var numCells = 0;
      var gridWidth = void 0,
          gridHeight = void 0;

      function init(xCells, yCells) {
         gridWidth = xCells;
         gridHeight = yCells;

         for (var col = 0; col < xCells; col++) {
            grid[col] = [];
            for (var row = 0; row < yCells; row++) {
               grid[col][row] = new Cell();
            }
         }
      }

      /* Place an object on the board */
      function placeCell(obj, pos, type) {
         var cell = getCell(pos.x, pos.y).set(obj, type);
         return cell;
      }

      /* Can pass in a cellID, (x,y) coords, or an {x:_, y:_} object */
      function getCell(cellID, yCoord) {
         return typeof cellID === 'number' ? yCoord ? grid[cellID][yCoord] : grid[parseInt(cellID / gridHeight)][cellID % gridHeight] : grid[cellID.x][cellID.y];
      }

      function randomCell() {
         var cell = void 0;
         do {
            cell = getCell({
               x: parseInt(Math.random() * board.getGridWidth()),
               y: parseInt(Math.random() * board.getGridHeight())
            });
         } while (cell.content !== 'empty');
         return cell;
      }

      function moveCell(from, to) {
         to.set(from.content, from.type);
         from.content.cell = to;
         from.empty();
      }

      function Cell(content) {
         var _this = this;

         this.id = numCells++;
         this.x = parseInt(this.id / gridHeight);
         this.y = this.id % gridHeight;
         this.loc = {
            x: this.x,
            y: this.y
         };
         this.neighbors = {
            'N': function N() {
               return _this.north.call(_this);
            },
            'E': function E() {
               return _this.east.call(_this);
            },
            'S': function S() {
               return _this.south.call(_this);
            },
            'W': function W() {
               return _this.west.call(_this);
            }
         };
         this.content = content || 'empty';
         this.type = 'empty';
      }

      Cell.prototype = {
         north: function north() {
            console.log('next = north');
            return this.y > 0 ? getCell(this.id - 1) : -1;
         },
         east: function east() {
            console.log('next = east');
            return this.x < gridWidth - 1 ? getCell(this.id + gridHeight) : -1;
         },
         south: function south() {
            console.log('next = south');
            return this.y < gridHeight - 1 ? getCell(this.id + 1) : -1;
         },
         west: function west() {
            console.log('next = west');
            return this.x > 0 ? getCell(this.id - gridHeight) : -1;
         },
         draw: function draw() {
            _draw.cell(this.x, this.y);
         },
         set: function set(obj, type) {
            this.content = obj;
            this.type = type;
            return this;
         },
         empty: function empty() {
            this.content = 'empty';
            this.type = 'empty';
         },
         step: function step(dir) {
            var dest = {
               'N': this.north, 'E': this.east,
               'S': this.south, 'W': this.west
            }[dir].call(this);
            moveCell(this, dest);
         },
         moveTo: function moveTo(cell) {
            moveCell(this, cell);
         }
      };

      return {
         init: init,
         place: placeCell,
         getCell: getCell,
         draw: function draw() {
            return _draw.board(grid);
         },
         paint: {
            gameOver: _draw.gameOver,
            clear: _draw.clear
         },
         isReady: boardReady,
         getGridHeight: function getGridHeight() {
            return gridHeight;
         },
         getGridWidth: function getGridWidth() {
            return gridWidth;
         },
         randomCell: randomCell
      };
   }();

   return createBoard;
}(jQuery);