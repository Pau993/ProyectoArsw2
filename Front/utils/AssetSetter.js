import { ObjPerson } from './ObjPerson'
import { ObjObstacles } from './ObjObstacles'

export class AssetSetter {
  constructor(tileSize) {
    this.tileSize = tileSize
    this.objects = new Array(15).fill(null)
  }

  async setObjects() {
    // Configuración de personas
    const personSetup = [
      { file: 'PersonaCorbata.png', x: 4, y: 6 },
      { file: 'PersonaNaranja.png', x: 8, y: 5 },
      { file: 'mujer.png', x: 10, y: 3 },
      { file: 'mujer1.png', x: 12, y: 7 },
      { file: 'personaCampesino.png', x: 5, y: 5 },
      { file: 'personaEstudiante.png', x: 2, y: 4 },
      { file: 'personaVerde.png', x: 6, y: 9 },
      { file: 'tombo.png', x: 3, y: 4 },
      { file: 'tombo1.png', x: 14, y: 9 }
    ]

    // Configuración de obstáculos
    const obstaclesSetup = [
      { file: 'huecos.png', x: 6, y: 6 },
      { file: 'motoEnElPiso.png', x: 3, y: 3 },
      { file: 'senal.png', x: 9, y: 11 },
      { file: 'senal1.png', x: 9, y: 10 },
      { file: 'senal2.png', x: 8, y: 9 },
      { file: 'senal3.png', x: 9, y: 9 }
    ]

    const loadPromises = []

    personSetup.forEach((setup, index) => {
      this.objects[index] = new ObjPerson(setup.file)
      this.objects[index].x = setup.x * this.tileSize
      this.objects[index].y = setup.y * this.tileSize
      loadPromises.push(this.objects[index].loadImage(setup.file))
    })

    obstaclesSetup.forEach((setup, index) => {
      const objIndex = index + personSetup.length
      this.objects[objIndex] = new ObjObstacles(setup.file)
      this.objects[objIndex].x = setup.x * this.tileSize
      this.objects[objIndex].y = setup.y * this.tileSize
      loadPromises.push(this.objects[objIndex].loadImage(setup.file))
    })

    await Promise.all(loadPromises)
    return this.objects
  }
}