import * as ref from '@2060.io/ref-napi'
import refArray from 'ref-array-di'
import refStruct from 'ref-struct-di'

const Struct = refStruct(ref)
const ArrayType = refArray(ref)

export const ByteBufferArray = ArrayType(ref.types.uint8)

export const ByteBuffer = Struct({
  len: ref.types.int64,
  data: ByteBufferArray,
})
