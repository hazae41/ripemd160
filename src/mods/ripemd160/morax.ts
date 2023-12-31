import { Box, BytesOrCopiable } from "@hazae41/box"
import { Morax } from "@hazae41/morax"
import { Result } from "@hazae41/result"
import { Adapter } from "./adapter.js"
import { CreateError, FinalizeError, HashError, UpdateError } from "./errors.js"

export async function fromMorax(): Promise<Adapter> {
  await Morax.initBundledOnce()

  function getMemory(bytesOrCopiable: BytesOrCopiable) {
    if (bytesOrCopiable instanceof Morax.Memory)
      return Box.greedy(bytesOrCopiable)
    if (bytesOrCopiable instanceof Uint8Array)
      return Box.new(new Morax.Memory(bytesOrCopiable))
    return Box.new(new Morax.Memory(bytesOrCopiable.bytes))
  }

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
      return Result.runAndWrapSync(() => {
        return new Morax.Ripemd160Hasher()
      }).mapSync(Hasher.new).mapErrSync(CreateError.from)
    }

    tryUpdate(bytes: BytesOrCopiable) {
      using memory = getMemory(bytes)

      return Result.runAndWrapSync(() => {
        return this.inner.update(memory.inner)
      }).set(this).mapErrSync(UpdateError.from)
    }

    tryFinalize() {
      return Result.runAndWrapSync(() => {
        return this.inner.finalize()
      }).mapErrSync(FinalizeError.from)
    }

  }

  function tryHash(bytes: BytesOrCopiable) {
    using memory = getMemory(bytes)

    return Result.runAndWrapSync(() => {
      return Morax.ripemd160(memory.inner)
    }).mapErrSync(HashError.from)
  }

  return { Hasher, tryHash }
}