import { alloc } from '@2060.io/ref-napi'

import { FFI_HANDLE, FFI_STRING } from './primitives'

export const allocateHandle = (): Buffer => alloc(FFI_HANDLE)

export const allocateString = (): Buffer => alloc(FFI_STRING)

export const allocateCallback = (callback: Buffer) =>
  setTimeout(() => callback, 1000000)

export const deallocateCallback = (id: number) =>
  clearTimeout(id as unknown as NodeJS.Timeout)
