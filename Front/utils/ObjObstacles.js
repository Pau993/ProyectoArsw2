import { SuperObject } from './SuperObject'

export class ObjObstacles extends SuperObject {
  constructor(imageName) {
    super()
    this.name = 'obstacles'
    this.collision = true
    this.loadImage(imageName)
  }

  async loadImage(imageName) {
    return new Promise((resolve) => {
      this.image = new Image()
      this.image.onload = () => resolve()
      this.image.src = `/objects/${imageName}`
    })
  }
}