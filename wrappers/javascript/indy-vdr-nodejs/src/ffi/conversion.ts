import { ByteBuffer, ByteBufferArray } from './structures'

export const uint8ArrayToByteBuffer = (typedArray: Buffer) => {
  const len = typedArray.length
  const data = new ByteBufferArray(typedArray)

  return ByteBuffer({
    len,
    data,
  })
}
