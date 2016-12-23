'use strict';

var grid = function ($) {

   var myGrid = [];

   function initialize(numXCells, numYCells) {
      for (var col = 0; col < numXCells; col++) {
         grid[col] = [];
         for (var row = 0; row < numYCells; row++) {
            grid[col][row] = new Cell();
         }
      }
   }
}(jQuery);