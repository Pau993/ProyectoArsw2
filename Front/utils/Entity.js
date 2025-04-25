export class Entity {
    constructor() {
      // Position and movement
      this.x = 0
      this.y = 0
      this.speed = 0
      this.direction = 'down'
      this.collisionOn = false
  
      // Collision area
      this.solidArea = {
        x: 0,
        y: 0,
        width: 48,
        height: 48
      }
      this.solidAreaDefaultX = this.solidArea.x
      this.solidAreaDefaultY = this.solidArea.y
  
      // Images for different states
      this.images = {
        up: null,
        down: null,
        left: null,
        right: null,
        front: null,
        upLoaded: null,
        downLoaded: null,
        leftLoaded: null,
        rightLoaded: null,
        upLoadedTwo: null,
        downLoadedTwo: null,
        leftLoadedTwo: null,
        rightLoadedTwo: null
      }

      this.imagesLoaded = false;
    }
  
    async loadImage(key, path) {
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          this.images[key] = img
          resolve()
        }
        img.src = path
      })
    }
  
    draw(ctx, tileSize) {
      const currentImage = this.images[this.direction]
      if (currentImage) {
        ctx.drawImage(currentImage, this.x, this.y, tileSize, tileSize)
      }
    }
  }