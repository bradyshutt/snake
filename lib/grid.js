'use strict';

var grid = function ($) {

   let myGrid = [];

   function initialize(numXCells, numYCells) {
      for (let col = 0; col < numXCells; col++) {
         grid[col] = [];
         for (let row = 0; row < numYCells; row++) {
            grid[col][row] = new Cell();
         }
      }
   }
}(jQuery);