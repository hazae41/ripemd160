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

### Morax (WebAssembly)

```bash
npm i @hazae41/morax
```

```typescript
import { Ripemd160 } from "@hazae41/ripemd160"

Ripemd160.set(await Ripemd160.fromMorax())
```

### Noble (JavaScript)

```bash
npm i @noble/hashes
```

```typescript
import { Ripemd160 } from "@hazae41/ripemd160"

Ripemd160.set(Ripemd160.fromNoble())
```

## Usage

### Direct

```tsx
const hashed: Uint8Array = Ripemd160.get().tryHash(new Uint8Array([1,2,3,4,5])).unwrap().copyAndDispose()
```

### Incremental

```tsx
const hasher = Ripemd160.get().Hasher.tryNew().unwrap()
hasher.tryUpdate(new Uint8Array([1,2,3,4,5])).unwrap()
const hashed: Uint8Array = hasher.tryFinalize().unwrap().copyAndDispose()
```