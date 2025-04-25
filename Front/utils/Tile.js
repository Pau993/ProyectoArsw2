export class Tile {
    constructor() {
      this.image = null
      this.collision = false
    }
  
    async loadImage(imagePath) {
      return new Promise((resolve) => {
        this.image = new Image()
        this.image.onload = () => resolve()
        this.image.src = imagePath
      })
    }
  }