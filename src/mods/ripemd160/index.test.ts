import "@hazae41/symbol-dispose-polyfill"

import { assert, test } from "@hazae41/phobos"
import { fromNoble } from "./noble.js"
import { fromWasm } from "./wasm.js"

import { RipemdWasm } from "@hazae41/ripemd.wasm"
import Ripemd160Noble from "@noble/hashes/ripemd160"

test("direct", async ({ message }) => {
  const noble = fromNoble(Ripemd160Noble)

  using aaa = noble.hashOrThrow(new Uint8Array([1, 2, 3, 4, 5, 6]))

  await RipemdWasm.initBundled()

  const wasm = fromWasm(RipemdWasm)

  using bbb = wasm.hashOrThrow(new Uint8Array([1, 2, 3, 4, 5, 6]))

  assert(Buffer.from(aaa.bytes).equals(Buffer.from(bbb.bytes)))
})

test("incremental", async ({ message }) => {
  const noble = fromNoble(Ripemd160Noble)

  using nobleh = noble.Hasher.createOrThrow()
  nobleh.updateOrThrow(new Uint8Array([1, 2, 3, 4, 5, 6]))
  nobleh.updateOrThrow(new Uint8Array([1, 2, 3, 4, 5, 6]))

  using aaa = nobleh.finalizeOrThrow()

  await RipemdWasm.initBundled()

  const wasm = fromWasm(RipemdWasm)

  using wasmh = wasm.Hasher.createOrThrow()
  wasmh.updateOrThrow(new Uint8Array([1, 2, 3, 4, 5, 6]))
  wasmh.updateOrThrow(new Uint8Array([1, 2, 3, 4, 5, 6]))

  using bbb = wasmh.finalizeOrThrow()

  assert(Buffer.from(aaa.bytes).equals(Buffer.from(bbb.bytes)))
})