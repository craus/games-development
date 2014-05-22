require('./polyfills.js')
com = require('./com.js')
player = require('./player.js')

module.exports = function(user1, user2) {
  var game = {
    players: [user1, user2].map(player)
  }
  
  game.mover = com.rndEl(game.players)
  
  game.players.forEach(function(player) {
    player.draw(6)
  })
  
  game.mover.startFirstMove(game)
    
  while (game.players.find(function(player) { return player.dead() })) {
    game.mover.move(game)
  }
  
  return game.players.find(function(player) { return !player.dead() })
}