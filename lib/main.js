'use strict';
(function ($) {
   $(function pageReady() {

      let board = createBoard({
         canvasID: 'board',
         showButton: 'show-button',
         pixelSize: 13,
         boardWidth: '75%',
         boardHeight: '75%',
         borderColor: 'green',
         borderSize: 5,
         gridLinesColor: '#ddd'
      });

      $('.show-button').click(() => {
         console.log('show-button clicked');
         snake.init(board);
      });

      //      setInterval(() => { 
      //         console.log('$nake status= ', snake.getStatus())
      //      }, 1200)

      $(window).keydown(event => {
         console.log(event.which);
         switch (event.which) {
            case 37:
               //Left
               snake.arrowKeyPress('W');
               break;
            case 38:
               //Up
               snake.arrowKeyPress('N');
               break;
            case 39:
               //Right
               snake.arrowKeyPress('E');
               break;
            case 40:
               //Down
               snake.arrowKeyPress('S');
               break;
            case 13:
               //console.log('snake status:', snake.getStatus());
               //console.log('isEnded?: ', snake.getStatus() === 'ended')
               if (snake.getStatus() === 'ready') {
                  //console.log('starting first time')
                  $('#show-button').click();
               } else if (snake.getStatus() === 'ended') {
                  //  console.log('restarting snake')
                  snake.restart();
               }

               break;

         }
      });
   });
})(jQuery);