export class SuperObject {
    constructor() {
      this.name = ''
      this.image = null
      this.collision = false
      this.x = 0
      this.y = 0
      // Factor de escala para el tamaño del objeto
      this.scale = 1
    }
  
    draw(ctx, gamePanel) {
      if (this.image) {
        const scaledSize = gamePanel.tileSize * 0.7
        const offsetX = (gamePanel.tileSize - scaledSize) / 2
        const offsetY = (gamePanel.tileSize - scaledSize) / 2
        
        ctx.drawImage(
          this.image, 
          this.x + offsetX, 
          this.y + offsetY, 
          scaledSize, 
          scaledSize
        )
      }
    }
  }