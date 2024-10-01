import type { ByteBuffer } from './structures'

import { NULL } from '@2060.io/ref-napi'

import { uint8ArrayToByteBuffer } from './conversion'

export type Callback = (err: number) => void
export type CallbackWithResponse = (err: number, response: string) => void

type Argument =
  | Record<string, unknown>
  | Array<unknown>
  | Date
  | Uint8Array
  | SerializedArgument

type SerializedArgument =
  | string
  | number
  | Callback
  | CallbackWithResponse
  | ArrayBuffer
  | typeof ByteBuffer

type SerializedArguments = Record<string, SerializedArgument>

export type SerializedOptions<Type> = Required<{
  [Property in keyof Type]: Type[Property] extends string
    ? string
    : Type[Property] extends number
      ? number
      : Type[Property] extends Record<string, unknown>
        ? string
        : Type[Property] extends string | Record<string, unknown>
          ? string
          : Type[Property] extends Array<unknown>
            ? string
            : Type[Property] extends Array<unknown> | undefined
              ? string
              : Type[Property] extends Record<string, unknown> | undefined
                ? string
                : Type[Property] extends Date
                  ? number
                  : Type[Property] extends Date | undefined
                    ? number
                    : Type[Property] extends string | undefined
                      ? string
                      : Type[Property] extends number | undefined
                        ? number
                        : Type[Property] extends Callback
                          ? Callback
                          : Type[Property] extends CallbackWithResponse
                            ? CallbackWithResponse
                            : Type[Property] extends Uint8Array
                              ? typeof ByteBuffer
                              : unknown
}>

const serialize = (arg: Argument): SerializedArgument => {
  switch (typeof arg) {
    case 'undefined':
      return NULL
    case 'string':
      return arg
    case 'number':
      return arg
    case 'function':
      return arg
    case 'object':
      if (arg instanceof Date) {
        return arg.valueOf()
      }
      if (arg instanceof Uint8Array) {
        return uint8ArrayToByteBuffer(
          Buffer.from(arg),
        ) as unknown as typeof ByteBuffer
      }
      return JSON.stringify(arg)
    default:
      throw new Error('could not serialize value')
  }
}

const serializeArguments = <
  T extends Record<string, Argument> = Record<string, Argument>,
>(
  args: T,
): SerializedOptions<T> => {
  const retVal: SerializedArguments = {}

  for (const [key, val] of Object.entries(args)) {
    retVal[key] = serialize(val)
  }
  return retVal as SerializedOptions<T>
}

export { serializeArguments }
