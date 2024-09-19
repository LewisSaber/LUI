const ArrayHelper = {
  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      let temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
    return array
  },
  sum(array) {
    let sum = 0
    for (let i = 0; i < array.length; i++) {
      sum += array[i]
    }
    return sum
  },
  toDictionary(array) {
    return (values) => {
      let result = {}
      for (let i = 0; i < array.length; i++) {
        result[array[i]] = values[i]
      }
      return result
    }
  },
  createEmptyArray(width, height) {
    let result = new Array(height)
    for (let i = 0; i < height; i++) {
      result[i] = new Array(width)
    }
    return result
  },
  splitToChunks(arr,chunkLength, missingFiller = 0,shouldFill = true){
    const res =new Array(Math.ceil(arr.length/chunkLength))
    let temp = new Array(chunkLength)
    let pointer = 0
    for(let i = 0 ; i< arr.length;i++){
      temp[i%chunkLength] = arr[i]
      if((i+1)%chunkLength ==0){
        res[pointer] = temp
        pointer++
        temp = new Array(chunkLength)
      }
    }
    if(temp.length != 0){
      if(shouldFill){
        temp = temp.concat(Array.from({length:chunkLength - temp.length}).map(()=>missingFiller))
      }
      res[pointer] = temp
    }
    return res
  },
  uint32ArrayToUint8Array(uint32Array) {
  const uint8Array = new Uint8Array(uint32Array.length * 4);
  let i = 0
    uint32Array.forEach((uint32Value)=>{
      uint8Array[i * 4] = (uint32Value >> 24) & 0xFF;
      uint8Array[i * 4 + 1] = (uint32Value >> 16) & 0xFF;
      uint8Array[i * 4 + 2] = (uint32Value >> 8) & 0xFF;
      uint8Array[i * 4 + 3] = uint32Value & 0xFF;
      i++
    })

  return uint8Array;
}
}

export default ArrayHelper