function invalid(deck) {
	return false
}

function player(user) {
	var hp = 16
	var mana = 0
	var hand = []
	var deck = user.createDeck()
	var dead = invalid(deck)
	var player = {
		draw: function(amount) {
			for (var i = 0; i < amount; i++) {
				if (deck.length == 0) {
					die()
				}
				hand.push(deck.pop())
			}
		}
		die: function() {
			dead = true
		}
		dead: function() {
			return dead
		}
		startMove: function(firstMove) {
			mana += 1
			if (!firstMove) {
				draw()
			}
		}
		move: function(game) {
			user.act(game).play(game, player)
		}
	}
	return player
}

function play(user1, user2) {
	var game = {
		players: [user1, user2].map(player)
	}

	game.mover = rndEl(game.players)
	game.mover.firstMove()
	game.mover.startMove()

	game.players.forEach(function(player) { player.draw(6)})

	while (!game.players.find(function(player) player.dead())) {
		game.mover.move(game)
	}

	return game.players.find(function(player) !player.dead())
}
