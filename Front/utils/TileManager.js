import { Tile } from './Tile'

export class TileManager {
  constructor(maxScreenCol, maxScreenRow, tileSize) {
    this.tiles = []
    this.tileMap = []
    this.maxScreenCol = maxScreenCol
    this.maxScreenRow = maxScreenRow
    this.tileSize = tileSize
    this.tiles = new Array(20).fill(null).map(() => new Tile())
    this.tileMap = Array(maxScreenCol).fill(0).map(() => Array(maxScreenRow).fill(0))
  }

  async loadTiles() {
    const tileConfigs = [
      { path: '/map/SeRenta.png', collision: true },
      { path: '/map/grass.png', collision: true },
      { path: '/map/tree.png', collision: true },
      { path: '/map/Peluqueria.png', collision: true },
      { path: '/map/Bar.png', collision: true },
      { path: '/map/roadNEWS.png', collision: false },
      { path: '/map/roadNS.png', collision: false },
      { path: '/map/Farmacia.png', collision: true },
      { path: '/map/Fotostudio.png', collision: true },
      { path: '/map/Panaderia.png', collision: true },
      { path: '/map/Fruteria.png', collision: true },
      { path: '/map/Musica.png', collision: true },
      { path: '/map/Cafe.png', collision: true },
      { path: null, collision: false }, // Index 13 empty
      { path: '/map/Internet.png', collision: true },
      { path: '/map/roadEW.png', collision: false },
      { path: '/map/roadSW.png', collision: false },
      { path: '/map/roadNE.png', collision: false },
      { path: '/map/roadSE.png', collision: false },
      { path: '/map/roadNW.png', collision: false },
      { path: '/map/tiendasD1.png', collision: true },
      { path: '/map/tiendasAra.png', collision: true }
    ]

    const loadPromises = tileConfigs.map((config, index) => {
      if (!config.path) return Promise.resolve()
      
      return new Promise((resolve) => {
        this.tiles[index] = new Tile()
        this.tiles[index].collision = config.collision
        this.tiles[index].image = new Image()
        this.tiles[index].image.onload = () => resolve()
        this.tiles[index].image.src = config.path
      })
    })

    await Promise.all(loadPromises)
  }

  async loadMap(mapData) {
    const rows = mapData.trim().split('\n')
    for (let row = 0; row < this.maxScreenRow; row++) {
      const cols = rows[row].trim().split(' ')
      for (let col = 0; col < this.maxScreenCol; col++) {
        this.tileMap[col][row] = parseInt(cols[col])
      }
    }
  }

  draw(ctx) {
    for (let row = 0; row < this.maxScreenRow; row++) {
      for (let col = 0; col < this.maxScreenCol; col++) {
        const x = col * this.tileSize
        const y = row * this.tileSize
        const tileNum = this.tileMap[col][row]
        
        if (this.tiles[tileNum] && this.tiles[tileNum].image) {
          ctx.drawImage(
            this.tiles[tileNum].image,
            x,
            y,
            this.tileSize,
            this.tileSize
          )
        }
      }
    }
  }

  getTileCollision(col, row) {
    if (col < 0 || col >= this.maxScreenCol || row < 0 || row >= this.maxScreenRow) {
      return true
    }
    const tileNum = this.tileMap[col][row]
    return this.tiles[tileNum]?.collision ?? false
  }
}