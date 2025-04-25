import { SuperObject } from './SuperObject'

export class ObjPerson extends SuperObject {
  constructor(imageName) {
    super()
    this.name = 'person'
    this.loadImage(imageName)
  }

  async loadImage(imageName) {
    return new Promise((resolve) => {
      this.image = new Image()
      this.image.onload = () => resolve()
      this.image.src = `/person/${imageName}`
    })
  }
}