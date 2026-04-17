---
title: Creating a Package
slug: creating-a-package
summary: Create a MIP package from local MATLAB code and install it.
order: 3
---

A MIP package is a directory of MATLAB code with a `mip.yaml` file that describes it. You can create, install, and use packages locally without publishing them to a channel.

## A minimal package

Start with a directory containing your MATLAB code and a `mip.yaml`:

```
my_package/
├── my_function.m
└── mip.yaml
```

The `mip.yaml` defines the package metadata:

```yaml
name: my_package
description: "My first MIP package"
version: "0.1.0"
license: MIT
dependencies: []

addpaths:
  - path: "."

builds:
  - architectures: [any]
```

The `addpaths` entries tell MIP which directories to add to the MATLAB path when the package is loaded. Only the listed directories are added — subdirectories are not added automatically. `architectures: [any]` means the package is pure MATLAB with no compiled code.

## Installing locally

Install the package by pointing to its directory. The path must start with `.`, `..`, `/`, `~`, or a drive letter — a bare name is always treated as a channel install, even if a local directory of that name exists:

```matlab
mip install ./my_package
mip install /abs/path/to/my_package
```

This bundles and installs the package into MIP's package store. You can then load and use it:

```matlab
mip load my_package
my_function()
```

Local install does **not** auto-install dependencies. They must already be installed (either from a channel or as other local packages) before the local install succeeds.

## Editable installs

During development, you don't want to reinstall every time you change a file. Use an editable install:

```matlab
mip install -e ./my_package
```

An editable install registers the source directory path rather than copying files. MATLAB sees your original files directly, so edits take effect on the next `mip load` — no reinstall needed. It's like `pip install -e` in Python.

A non-editable install, by contrast, copies your source into the package store, strips any pre-existing MEX binaries, and runs your `compile_script` once. Future edits to your original directory have no effect until you run `mip install` again.

Editable installs re-run `compile_script` on every `mip update`. Pass `--no-compile` to skip it for one update, or at install time to skip the initial compile.

## Dependencies

If your package depends on other MIP packages, list them:

```yaml
dependencies: ["chebfun", "finufft"]
```

**Bare names in `dependencies` always resolve to the `mip-org/core` channel.** If your package needs a dependency from a different channel, use the fully qualified name:

```yaml
dependencies:
  - chebfun                       # mip-org/core/chebfun
  - youruser/mylab/some_package   # explicit channel
```

`mip.yaml` dependencies are plain package names only — there is no `@version` suffix and no version-constraint grammar.

When someone installs your package from a channel, MIP installs the dependencies too. When they load it, dependencies are loaded first.

## What's next

For packages that include compiled C/MEX code, see [Building a MEX Package](/docs/building-a-mex-package). To distribute your package to others, see [Hosting a Channel](/docs/hosting-a-channel).
