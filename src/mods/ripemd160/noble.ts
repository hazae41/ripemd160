import { Result } from "@hazae41/result"
import { ripemd160 } from "@noble/hashes/ripemd160"
import { Adapter, Copied } from "./adapter.js"
import { CreateError, FinalizeError, HashError, UpdateError } from "./errors.js"

export function fromNoble(): Adapter {

  class Hasher {

    constructor(
      readonly inner: ReturnType<typeof ripemd160.create>
    ) { }

    [Symbol.dispose]() { }

    static new(inner: ReturnType<typeof ripemd160.create>) {
      return new Hasher(inner)
    }

    static tryNew() {
      return Result.runAndWrapSync(() => ripemd160.create()).mapSync(Hasher.new).mapErrSync(CreateError.from)
    }

    tryUpdate(bytes: Uint8Array) {
      return Result.runAndWrapSync(() => this.inner.update(bytes)).clear().mapErrSync(UpdateError.from)
    }

    tryFinalize() {
      return Result.runAndWrapSync(() => this.inner.clone().digest()).mapSync(Copied.new).mapErrSync(FinalizeError.from)
    }

  }

  function tryHash(bytes: Uint8Array) {
    return Result.runAndWrapSync(() => ripemd160(bytes)).mapSync(Copied.new).mapErrSync(HashError.from)
  }

  return { Hasher, tryHash }
}