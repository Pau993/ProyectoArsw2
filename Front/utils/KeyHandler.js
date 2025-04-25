export class KeyHandler {
    constructor() {
      this.upPressed = false
      this.downPressed = false
      this.leftPressed = false
      this.rightPressed = false
  
      // Bind the methods to maintain 'this' context
      this.handleKeyDown = this.handleKeyDown.bind(this)
      this.handleKeyUp = this.handleKeyUp.bind(this)
    }
  
    init() {
      if (typeof window !== 'undefined') {
        window.addEventListener('keydown', this.handleKeyDown)
        window.addEventListener('keyup', this.handleKeyUp)
      }
    }
  
    handleKeyDown(e) {
      switch(e.key.toLowerCase()) {
        case 'w':
          this.upPressed = true
          break
        case 's':
          this.downPressed = true
          break
        case 'a':
          this.leftPressed = true
          break
        case 'd':
          this.rightPressed = true
          break
      }
    }
  
    handleKeyUp(e) {
      switch(e.key.toLowerCase()) {
        case 'w':
          this.upPressed = false
          break
        case 's':
          this.downPressed = false
          break
        case 'a':
          this.leftPressed = false
          break
        case 'd':
          this.rightPressed = false
          break
      }
    }
  
    cleanup() {
      if (typeof window !== 'undefined') {
        window.removeEventListener('keydown', this.handleKeyDown)
        window.removeEventListener('keyup', this.handleKeyUp)
      }
    }
  }