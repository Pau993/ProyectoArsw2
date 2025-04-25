import { Player } from './Player'

export class PlayersManager {
    constructor(SCREEN_WIDTH, SCREEN_HEIGHT, TILE_SIZE) {
        this.players = new Map()
        this.localPlayerId = null
        this.SCREEN_WIDTH = SCREEN_WIDTH
        this.SCREEN_HEIGHT = SCREEN_HEIGHT
        this.TILE_SIZE = TILE_SIZE
    }

    addPlayer(id, x, y, direction, hasPerson) {
        const player = new Player(this.SCREEN_WIDTH, this.SCREEN_HEIGHT, this.TILE_SIZE)
        player.x = x
        player.y = y
        player.direction = direction
        player.hasPerson = hasPerson
        player.isLocalPlayer = (id === this.localPlayerId)
        this.players.set(id, player)
        return player
    }

    removePlayer(id) {
        this.players.delete(id)
    }

    updatePlayerPosition(id, x, y, direction, hasPerson) {
        const player = this.players.get(id)
        if (player) {
            player.x = x
            player.y = y
            player.direction = direction
            player.hasPerson = hasPerson
        }
    }

    getLocalPlayer() {
        return this.players.get(this.localPlayerId)
    }

    async loadAllPlayersImages() {
        for (const player of this.players.values()) {
            await player.loadImages()
        }
    }

    drawAll(ctx) {
        for (const player of this.players.values()) {
            player.draw(ctx)
        }
    }
}