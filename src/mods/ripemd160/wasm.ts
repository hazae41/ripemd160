import { Box } from "@hazae41/box"
import type { Ripemd160Hasher, RipemdWasm } from "@hazae41/ripemd.wasm"
import { BytesOrCopiable } from "libs/copiable/index.js"
import { Adapter } from "./adapter.js"

export function fromWasm(wasm: typeof RipemdWasm) {
  const { Memory, Ripemd160Hasher, ripemd160 } = wasm

  function getMemory(bytesOrCopiable: BytesOrCopiable) {
    if (bytesOrCopiable instanceof Memory)
      return Box.createAsMoved(bytesOrCopiable)
    if (bytesOrCopiable instanceof Uint8Array)
      return Box.create(new Memory(bytesOrCopiable))
    return Box.create(new Memory(bytesOrCopiable.bytes))
  }

  class Hasher {

    constructor(
      readonly inner: Ripemd160Hasher
    ) { }

    [Symbol.dispose]() {
      using _ = this.inner
    }

    static create(inner: Ripemd160Hasher) {
      return new Hasher(inner)
    }

    static createOrThrow() {
      return new Hasher(new Ripemd160Hasher())
    }

    cloneOrThrow() {
      return new Hasher(this.inner.clone())
    }

    updateOrThrow(bytes: BytesOrCopiable) {
      using memory = getMemory(bytes)

      this.inner.update(memory.inner)

      return this
    }

    finalizeOrThrow() {
      return this.inner.finalize()
    }

  }

  function hashOrThrow(bytes: BytesOrCopiable) {
    using memory = getMemory(bytes)

    return ripemd160(memory.inner)
  }

  return { Hasher, hashOrThrow } satisfies Adapter
}