export function chunkArray(myArray, chunk_size) {
  let results = [];
  while (myArray.length) {
    results.push(myArray.splice(0, chunk_size));
  }

  return results;
}