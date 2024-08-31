# Ripemd160

RIPEMD-160 adapter for WebAssembly and JS implementations

```bash
npm i @hazae41/ripemd160
```

[**Node Package 📦**](https://www.npmjs.com/package/@hazae41/ripemd160)

## Features

### Current features
- 100% TypeScript and ESM
- No external dependencies

## Getting started

### WebAssembly

```bash
npm i @hazae41/ripemd.wasm
```

```typescript
import { Ripemd160 } from "@hazae41/ripemd160"
import { RipemdWasm } from "@hazae41/ripemd.wasm"

await RipemdWasm.initBundled()

Ripemd160.set(Ripemd160.fromWasm(RipemdWasm))
```

### Noble (JavaScript)

```bash
npm i @noble/hashes
```

```typescript
import { Ripemd160 } from "@hazae41/ripemd160"
import Ripemd160Noble from "@noble/hashes/ripemd160"

Ripemd160.set(Ripemd160.fromNoble(Ripemd160Noble))
```

## Usage

### Direct

```tsx
using hashed: Copiable = Ripemd160.get().getOrThrow().hashOrThrow(new Uint8Array([1,2,3,4,5]))
const hashed2: Uint8Array = hashed.bytes.slice()
```

### Incremental

```tsx
using hasher: Ripemd160.Hasher = Ripemd160.get().getOrThrow().Hasher.createOrThrow()
hasher.updateOrThrow(new Uint8Array([1,2,3,4,5]))
hasher.updateOrThrow(new Uint8Array([6,7,8,9,10]))

using hashed: Copiable = hasher.finalizeOrThrow()
const hashed2: Uint8Array = hashed.bytes.slice()
```