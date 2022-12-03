export function toGroupsOfN<T>(arr: Array<T>, chunkSize: number) {
  if (!Array.isArray(arr)) {
    throw new Error('Provide an array as first argument')
  }

  const groups = []
  for (let i = 0; i < arr.length; i += chunkSize) {
    groups.push(arr.slice(i, i + chunkSize))
  }
  return groups
}
