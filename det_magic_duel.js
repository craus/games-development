function start() {
	return {
		players: [
			{
				creatures: [],
				mana: 2,
				hp: 2
			},
			{
				creatures: [],
				mana: 1,
				hp: 1
			}
		],
		creaturesMoved: 'all',
		creatureCreation: false
	}
}

function hit(attacker, target) {
	target.hp -= Math.max(0, attacker.damage - (target.armor || 0))
}

function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj
    var copy = obj.constructor()
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
    }
    return copy
}

function alive(creature) {
	return creature.hp > 0
}

function cleanCreatures(player) {
	player.creatures = player.creatures.filter(alive)
}

function check(game, action) {
	return action(clone(game))
}

function skipMoveWins(game, indent) {
	game = {
		players: [game.players[1], game.players[0]],
		creaturesMoved: game.players[1].creatures.length > 0 ? 0 : 'all',
		creatureCreation: false
	}
	game.players[0].mana += 2
	return !firstWins(game, indent)
}

function createCreatureWins(game, indent) {
	game.players[0].creatures.push({
		hp: 1,
		damage: 1,
		armor: 0,
		splash: false
	})
	game.creatureCreation = true
	game.players[0].mana -= 1
	return firstWins(game, indent)
}

function creatureToString(creature, mover, underCreation) {
	return creature.damage + '/' + creature.hp + (creature.armor > 0 ? 'a'+creature.armor : '') + 
		(creature.splash ? 's' : '') + (mover ? '!' : '') + (underCreation ? '+' : '')
}

function playerToString(player, index, game) {
	var mover = (index == 0)
	return player.creatures.map(function(creature, index) { 
		return creatureToString(
			creature, 
			mover && index == game.creaturesMoved, 
			mover && index == player.creatures.length-1 && game.creatureCreation
		)
	}).join(' ') + (player.creatures.length > 0 ? ' ' : '') + player.hp + ' (' + player.mana + ')' + (mover && game.creaturesMoved == 'all' ? '!' : '')
}

function gameToString(game) {
	return game.players.map(function(player, index) { return playerToString(player, index, game) }).join(' - ')
}

function playerMoveWins(game, indent) {
	if (game.players[0].mana >= 1) {

		if (!game.creatureCreation) {
			if (createCreatureWins(clone(game), indent)) return true
		} else {
			var newGame = clone(game)
			newGame.creatureCreation = false
			if (firstWins(newGame, indent)) return true

			newGame = clone(game)
			newGame.players[0].creatures[newGame.players[0].creatures.length-1].hp += 2
			newGame.players[0].mana -= 1
			if (firstWins(newGame, indent)) return true

			newGame = clone(game)
			newGame.players[0].creatures[newGame.players[0].creatures.length-1].armor += 1
			newGame.players[0].mana -= 1
			if (firstWins(newGame, indent)) return true

			newGame = clone(game)
			newGame.players[0].creatures[newGame.players[0].creatures.length-1].damage += 1
			newGame.players[0].mana -= 1
			if (firstWins(newGame, indent)) return true

			if (game.players[0].mana >= 2) {
				newGame = clone(game)
				newGame.players[0].creatures[newGame.players[0].creatures.length-1].splash = true
				newGame.players[0].mana -= 2
				if (firstWins(newGame, indent)) return true
			}
		}
	}

	if (skipMoveWins(game, indent)) return true
	return false	
}

function nextCreature(game) {
	game.creaturesMoved += 1
	if (game.creaturesMoved == game.players[0].creatures.length) game.creaturesMoved = 'all'
}

function creatureMoveWins(game, indent) {
	creature = game.players[0].creatures[game.creaturesMoved]
	if (creature.splash) {
		game.players[1].creatures.forEach(function(target) { hit(creature, target) })
		hit(creature, game.players[1])
		nextCreature(game)
		cleanCreatures(game.players[1])
		return firstWins(game, indent)
	} else {
		var newGame = clone(game)
		hit(creature, newGame.players[1])
		nextCreature(newGame)
		if (firstWins(newGame, indent)) return true

		for (var i = 0; i < game.players[1].creatures.length; i++) {
			if (game.players[1].creatures[i].armor < creature.damage) {
				var newGame = clone(game)
				hit(creature, newGame.players[1].creatures[i])
				nextCreature(newGame)
				cleanCreatures(newGame.players[1])
				if (firstWins(newGame, indent)) return true
			}
		}
		return false
	}	
}

function firstWins(game, indent) {
	if (verbose) console.log(indent + gameToString(game))
	var newIndent = indent + '  '

	if (game.players[0].hp < 1) return false
	if (game.players[1].hp < 1) return true

	if (game.creaturesMoved == 'all') {
		return playerMoveWins(game, newIndent)
	} else {
		return creatureMoveWins(game, newIndent)
	}
}

function testClone() {
	game = start()
	newGame = clone(game)
	newGame.players[0].hp -= 1
	console.log(game.players[0].hp)
}

var verbose = true
console.log(firstWins(start(), ''))
