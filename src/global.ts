Array.prototype.chunk = function chunk<T>(this: T[], len: number) {
  let chunks = [],
    i = 0,
    n = this.length

  while (i < n) {
    chunks.push(this.slice(i, (i += len)))
  }

  return chunks
}
export {}
