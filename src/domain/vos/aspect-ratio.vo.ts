export class AspectRatio {
  private readonly value: string
  constructor(width: number, height: number) {
    const gcd = (a: number, b: number): number => {
      return b === 0 ? a : gcd(b, a % b)
    }
    const divisor = gcd(width, height)
    const aspectRatioWidth = width / divisor
    const aspectRatioHeight = height / divisor
    this.value = `${aspectRatioWidth}:${aspectRatioHeight}`
  }

  getValue(): string {
    return this.value
  }
}
