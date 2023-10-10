import { Box, Copiable } from "@hazae41/box"
import { Morax } from "@hazae41/morax"
import { Result } from "@hazae41/result"
import { Adapter } from "./adapter.js"
import { CreateError, FinalizeError, HashError, UpdateError } from "./errors.js"

export async function fromMorax(): Promise<Adapter> {
  await Morax.initBundledOnce()

  class Hasher {

    constructor(
      readonly inner: Morax.Ripemd160Hasher
    ) { }

    [Symbol.dispose]() {
      this.inner.free()
    }

    static new(inner: Morax.Ripemd160Hasher) {
      return new Hasher(inner)
    }

    static tryNew() {
      return Result.runAndWrapSync(() => new Morax.Ripemd160Hasher()).mapSync(Hasher.new).mapErrSync(CreateError.from)
    }

    tryUpdate(bytes: Box<Copiable>) {
      return Result.runAndWrapSync(() => this.inner.update(bytes)).mapErrSync(UpdateError.from)
    }

    tryFinalize() {
      return Result.runAndWrapSync(() => this.inner.finalize()).mapErrSync(FinalizeError.from)
    }

  }

  function tryHash(bytes: Box<Copiable>) {
    return Result.runAndWrapSync(() => Morax.ripemd160(bytes)).mapErrSync(HashError.from)
  }

  return { Hasher, tryHash }
}