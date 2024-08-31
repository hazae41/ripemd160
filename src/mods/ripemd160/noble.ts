import type Ripemd160Noble from "@noble/hashes/ripemd160"
import { BytesOrCopiable, Copied } from "libs/copiable/index.js"
import { Adapter } from "./adapter.js"

export function fromNoble(noble: typeof Ripemd160Noble) {
  const { ripemd160 } = noble

  function getBytes(bytes: BytesOrCopiable) {
    return "bytes" in bytes ? bytes.bytes : bytes
  }

  class Hasher {

    constructor(
      readonly inner: ReturnType<typeof Ripemd160Noble.ripemd160.create>
    ) { }

    [Symbol.dispose]() { }

    static create(inner: ReturnType<typeof Ripemd160Noble.ripemd160.create>) {
      return new Hasher(inner)
    }

    static createOrThrow() {
      return new Hasher(ripemd160.create())
    }

    cloneOrThrow() {
      return new Hasher(this.inner.clone())
    }

    updateOrThrow(bytes: BytesOrCopiable) {
      this.inner.update(getBytes(bytes))

      return this
    }

    finalizeOrThrow() {
      return new Copied(this.inner.clone().digest())
    }

  }

  function hashOrThrow(bytes: BytesOrCopiable) {
    return new Copied(ripemd160(getBytes(bytes)))
  }

  return { Hasher, hashOrThrow } satisfies Adapter
}