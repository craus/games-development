module.exports = function(user) {
  var hp = 16
  var mana = 0
  var deck = user.deck()
  var hand = []
  var discard = []
  var dead = false
  var player = {
    draw: function(amount) {
      for (var i = 0; i < (amount || 1); i++) {
        if (deck.length == 0) {
          player.die()
        } else {
          hand.push(deck.pop())
        }
      }
    },
    startFirstMove: function(game) {
      mana += 1
      game.mover = player
    },
    startMove: function(game) {
      mana += 1
      draw()
      game.mover = player
    },
    move: function(game) {
      action = user.move(game, player)
      action.apply(game, player)
    },
    die: function() {
      dead = true
    },
    dead: function() {
      return dead || hp == 0
    }
  }
  return player
}