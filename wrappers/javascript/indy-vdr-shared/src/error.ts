export type IndyVdrErrorObject = {
  code: number
  extra?: string
  message: string
}

export class IndyVdrError extends Error {
  public readonly code: number
  public readonly extra?: string

  public constructor({ code, message, extra }: IndyVdrErrorObject) {
    super(message)
    this.code = code
    this.extra = extra
  }

  public static customError({ message }: { message: string }) {
    return new IndyVdrError({ message, code: 100 })
  }
}

export function handleInvalidNullResponse<T extends null | unknown>(
  response: T,
): Exclude<T, null> {
  if (response === null) {
    throw IndyVdrError.customError({
      message: 'Invalid response. Expected value but received null pointer',
    })
  }

  return response as Exclude<T, null>
}
