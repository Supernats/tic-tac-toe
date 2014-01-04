// NB: This doesn't include any AI.

(function (root) {
  // var readline = require('readline');
  // var READER = readline.createInterface({
  //   input: process.stdin,
  //   output: process.stdout
  // });

  var TTT = root.TTT = (root.TTT || {});

  var Game = TTT.Game = function TT() {
    this.player = Game.marks[0];
    this.board = this.makeBoard();
    this.jQuerify($('#wrapper'));
  }

  Game.marks = ["X", "O"];

  Game.prototype.diagonalWinner = function () {
    var game = this;

    var diagonalPositions1 = [[0, 0], [1, 1], [2, 2]];
    var diagonalPositions2 = [[2, 0], [1, 1], [0, 2]];

    var winner = null;
    _(Game.marks).each(function (mark) {
      function didWinDiagonal (diagonalPositions) {
        return _.every(diagonalPositions, function (pos) {
          return game.board[pos[0]][pos[1]] === mark;
        });
      }

      var won = _.any(
        [diagonalPositions1, diagonalPositions2],
        didWinDiagonal
      );

      if (won) {
        winner = mark;
      }
    });

    return winner;
  };

  Game.prototype.isEmptyPos = function (pos) {
    return (this.board[pos[0]][pos[1]] === null);
  };

  Game.prototype.horizontalWinner = function () {
    var game = this;

    var winner = null;
    _(Game.marks).each(function (mark) {
      var indices = _.range(0, 3);

      var won = _(indices).any(function (i) {
        return _(indices).every(function (j) {
          return game.board[i][j] === mark;
        });
      });

      if (won) {
        winner = mark;
      }
    });

    return winner;
  };

	Game.prototype.jQuerify = function (board) {
    var game = this;
    board.find('.row').each(function(rowIndex, rowEl) {
      $(rowEl).find('.tile').each(function(colIndex, colEl) {
        console.log(colEl);
        $(colEl).data('coord', [rowIndex,colIndex]);
        $(colEl).html(" ");
      });
    });
    $('.tile').on('click', function() {
      game.move($(this));
    });
	};

  Game.prototype.makeBoard = function () {
    return _.times(3, function (i) {
      return _.times(3, function (j) {
        return null;
      });
    });
  };

  Game.prototype.move = function (tile) {
    if (!this.isEmptyPos(tile.data('coord'))) {
      return false;
    }

    this.placeMark(tile);
    this.switchPlayer();
    return true;
  };

  Game.prototype.placeMark = function (tile) {
    var game = this;
    game.board[tile.data('coord')[0]][tile.data('coord')[1]] = game.player;
    tile.text(game.player);
    game.player == 'X' ? tile.addClass('red') : tile.addClass('green');

    if (game.winner()) {
      $('#wrapper').before($('<h1>fucking win state</h1>'))
      $('.tile').off('click');
    }
  };

  Game.prototype.switchPlayer = function () {
    if (this.player === Game.marks[0]) {
      this.player = Game.marks[1];
    } else {
      this.player = Game.marks[0];
    }
  };

  Game.prototype.valid = function (pos) {
    // Check to see if the co-ords are on the board and the spot is
    // empty.

    function isInRange (pos) {
      return (0 <= pos) && (pos < 3);
    }

    return _(pos).all(isInRange) && _.isNull(this.board[pos[0]][pos[1]]);
  };

  Game.prototype.verticalWinner = function () {
    var game = this;

    var winner = null;
    _(Game.marks).each(function (mark) {
      var indices = _.range(0, 3);

      var won = _(indices).any(function (j) {
        return _(indices).every(function (i) {
          return game.board[i][j] === mark;
        });
      });

      if (won) {
        winner = mark;
      }
    });

    return winner;
  };

  Game.prototype.winner = function () {
    return (
      this.diagonalWinner() || this.horizontalWinner() || this.verticalWinner()
    );
  };

  // Game.prototype.printBoard = function () {
  //   var game = this;
  //
  //   game.board.forEach(function(row){
  //     var first = row[0] == null ? " " : row[0];
  //     var second = row[1] == null ? " " : row[1];
  //     var third = row[2] == null ? " " : row[2];
  //
  //     console.log(first + " | " + second + " | " + third);
  //   })
  // }

  // Game.prototype.run = function () {
 //    var game = this;
 //
 //    game.turn(function(){
 //      if (game.winner()) {
 //          // print a win statement to browser
 //        console.log("Someone won!");
 //        // READER.close();
 //      } else {
 //        // game.printBoard();
 //        game.run();
 //      }
 //    });
 //  }
 //
 //
 //
 //  Game.prototype.turn = function (callback) {
 //    var game = this;
 //
 //    // READER.question("Enter coordinates like [row,column]: ",function(strCoords){
 // //      var coords = eval(strCoords); // Totally insecure way to parse the string "[1,2]" into the array [1,2].
 // //
 // //      if (game.valid(coords)) {
 // //        game.move(coords);
 // //        callback();
 // //      } else {
 // //        console.log("Invalid coords!");
 // //        game.turn(callback);
 // //      }
 // //    });
  // }
})(this);

$(document).ready(function(){
  var game = new TTT.Game();
});