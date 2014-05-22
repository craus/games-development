require('./polyfills.js')

exports.deck = function() {
  return []
}

exports.move = function(game, me) {
  var opponent = game.players.find(function(player) { player != me })
  
  console.log(game.players)
  
  var endMove = function(game) {
    opponent.startMove(game)
  }
  
  return endMove()
}