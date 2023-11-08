export {}
declare global {
  interface Array<T> {
    chunk(length: number): Array<T[]>
  }
}
