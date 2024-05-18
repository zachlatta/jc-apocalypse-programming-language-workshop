export class EaselError extends Error {
  constructor(msg) {
    super()
    this.message = msg
  }

  toString() {
    return this.message
  }
}

export default {}
