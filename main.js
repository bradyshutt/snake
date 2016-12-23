'use strict'
/* global jQuery snake createBoard */

;(function($) {
   $(function pageReady() {

      let board = createBoard({
         canvasID: 'board',
         showButton: 'show-button',
         pixelSize: 13,
         boardWidth: '75%',
         boardHeight: '75%',
         borderColor: 'green',
         borderSize: 2,
         gridLinesColor: '#ddd',
      })

      setTimeout(() => { 
         $('#show-button').click() 
         snake.init(board)
      }, 1000)

      $(document).keydown((event) => {
         console.log(event.which)
         switch (event.which) { 
            case 37: //Left
               snake.arrowKeyPress('W')
               break
            case 38: //Up
               snake.arrowKeyPress('N')
               break
            case 39: //Right
               snake.arrowKeyPress('E')
               break
            case 40: //Down
               snake.arrowKeyPress('S')
               break
               
         }
         
      })

   })

})(jQuery)
