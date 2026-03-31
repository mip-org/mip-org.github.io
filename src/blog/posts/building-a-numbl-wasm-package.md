---
title: Building a Numbl WASM Package for MIP
date: 2026-03-31
slug: building-a-numbl-wasm-package
author: Jeremy Magland
summary: How to create a MIP package that compiles C code to WebAssembly for use in Numbl.
---

[Numbl](https://numbl.org) is a MATLAB-compatible computing environment that runs in the browser and on the desktop. It executes `.m` files by compiling them to JavaScript, which works well for basic code. But for computationally intensive operations, you can write functions in C, compile them to WebAssembly, and call them from your numbl code. This is numbl's equivalent of MEX in MATLAB, where you'd compile C/C++ into MEX binaries. MEX compilation for MIP packages is covered elsewhere. WASM gives you better performance than pure JavaScript while still running entirely in the browser. For the CLI and desktop versions of numbl, you can also compile a native binary for even better performance, but that's a topic for another post.

In this post we'll create a MIP package that includes a WASM-compiled C function. We'll use a simple dot product as the example, but the same pattern applies to wrapping larger C/C++ libraries.

## How it works

A numbl WASM function has three parts:

- A **C or C++ source file** that implements the function and exports it for WebAssembly
- A **JavaScript wrapper** that tells numbl how to call the WASM function, handling memory allocation and data copying
- A **build script** that compiles the source to `.wasm` using Emscripten

For this tutorial, we'll keep these files in a `numbl/` subdirectory of the package source repo. When the package is loaded, numbl picks up the `.js` files and uses them to call the compiled WASM functions.

Let's walk through each piece using [hello_mip_wasm](https://github.com/mip-org/hello_mip_wasm), a minimal example package. The repo looks like this:

```
hello_mip_wasm/
  numbl/
    wdot.c            # C implementation
    wdot.js           # JavaScript wrapper
    build_wasm.sh     # Emscripten build script
```

## The C implementation

The C file exports three functions using `__attribute__((export_name(...)))`, which makes them available to JavaScript when the WASM module is loaded.

`my_malloc` and `my_free` are needed so that the JavaScript wrapper can allocate and free memory inside the WASM module. The `wdot` function itself takes two arrays and a length, and returns their dot product.

```c
__attribute__((export_name("my_malloc")))
void *my_malloc(int size) {
    extern void *malloc(unsigned long);
    return malloc(size);
}

__attribute__((export_name("my_free")))
void my_free(void *ptr) {
    extern void free(void *);
    free(ptr);
}

__attribute__((export_name("wdot")))
double wdot(const double *a, const double *b, int n) {
    double sum = 0.0;
    for (int i = 0; i < n; i++) {
        sum += a[i] * b[i];
    }
    return sum;
}
```

## The JavaScript wrapper

The `.js` file tells numbl how to call the WASM function. The `// wasm: wdot` directive at the top links this wrapper to the `wdot.wasm` module. The `register` call defines a function that numbl can resolve and execute.

The main work in the `apply` function is moving data between JavaScript and WASM memory. WASM has its own linear memory, so we need to allocate space inside it, copy the input arrays in, call the function, and free the memory afterward.

```javascript
// wasm: wdot
// wdot(a, b) -> dot product
register({
  resolve: function (argTypes, nargout) {
    if (argTypes.length !== 2) {
      return null;
    }
    return {
      outputTypes: [{ kind: "number" }],
      apply: function (args) {
        var a = args[0];
        var b = args[1];
        var n = a.data.length;

        var BYTES = 8;
        var exports = wasm.exports;
        var mem = exports.memory;

        // Allocate WASM memory for both vectors
        var a_ptr = exports.my_malloc(n * BYTES);
        var b_ptr = exports.my_malloc(n * BYTES);

        // Copy input data to WASM memory
        var view = new Float64Array(mem.buffer);
        view.set(new Float64Array(a.data.buffer, a.data.byteOffset, n), a_ptr / BYTES);
        view.set(new Float64Array(b.data.buffer, b.data.byteOffset, n), b_ptr / BYTES);

        // Call the WASM function
        var result = exports.wdot(a_ptr, b_ptr, n);

        // Free WASM memory
        exports.my_free(a_ptr);
        exports.my_free(b_ptr);

        return result;
      },
    };
  },
});
```

## The build script

The build script compiles the C source to a standalone `.wasm` file using Emscripten:

```bash
#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

emcc "$SCRIPT_DIR/wdot.c" -O2 \
  -s STANDALONE_WASM \
  --no-entry \
  -o "$SCRIPT_DIR/wdot.wasm"
```

`-s STANDALONE_WASM` produces a self-contained WASM module with no JavaScript glue code. `--no-entry` tells the compiler there's no `main` function. `-O2` enables optimization.

## Packaging for MIP

With the source repo ready, we need to add it to a MIP channel. If you don't have a channel yet, see [Creating Your Own MIP Channel and Your First Package](/blog/creating-your-own-mip-channel).

Create `packages/hello_mip_wasm/releases/main/prepare.yaml` in your channel repo:

```yaml
name: hello_mip_wasm
description: "A simple test package demonstrating WASM compilation for numbl"
version: "main"
dependencies: []
homepage: "https://github.com/mip-org/hello_mip_wasm"
repository: "https://github.com/mip-org/hello_mip_wasm"
license: "MIT"

defaults:
  symbol_extensions: [".m", ".js"]
  release_number: 1
  prepare:
    clone_git:
      url: "https://github.com/mip-org/hello_mip_wasm"
      destination: "hello_mip_wasm"
      branch: "main"
  addpaths:
    - path: "hello_mip_wasm/numbl"

builds:
  - architectures: [numbl_wasm]
    build_script: hello_mip_wasm/numbl/build_wasm.sh
```

A few things to note compared to a pure-MATLAB package:

- `symbol_extensions` includes `".js"` so that numbl picks up the JavaScript wrappers as symbols.
- `architectures` is `[numbl_wasm]` instead of `[any]`, since this package only works in numbl with WASM support.
- `build_script` points to our Emscripten build script. The channel's CI will run this automatically using its Emscripten environment.

Push to `main` and the channel's GitHub Actions will clone the source, run the build script to compile `wdot.wasm`, and publish the package.

## Installing and using the package

Go to [numbl.org](https://numbl.org), create a new project, and run the following in the terminal:

```matlab
mip install --channel mip-org/hello hello_mip_wasm
mip load hello_mip_wasm

a = [1, 2, 3, 4, 5];
b = [2, 3, 4, 5, 6];
wdot(a, b)
```

## Try it live

You can try the WASM dot product right now in the browser: [open this example in numbl](https://numbl.org/share#eJyFz00KgzAQBeCrDLNSiC39XSjddtkLqMgYUw0kE2lCXYh3b-ymlC66_WbegzfjXRvlMS9nZLIKc2yN65vR-dAMyhjXWD02E3m7sShQOg6KQ3yLDJp9IGMgy-RAzMpA1Mw9-u07Ct8FRcVryDjqfi8VE1yg3AnYCzgIOAo41dHbVT8k4LyqjDp1LiQkoE0jdNqPiUwLXGqBJIN-qmscdvs7aXkBzvlW2w).

## What's next

This example covers the basics, but the same pattern scales to wrapping larger libraries. For a more involved example, see how [finufft](https://github.com/mip-org/mip-core/tree/main/packages/finufft) is packaged in mip-core. It compiles a full C++ library with Emscripten and exposes multiple functions through the same `register`/`// wasm:` pattern.
