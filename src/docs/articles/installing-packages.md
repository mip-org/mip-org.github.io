---
title: Installing Packages
slug: installing-packages
summary: Install and load MATLAB packages from the MIP package index.
order: 1
---

## Installing MIP

To install MIP, run this in the MATLAB command window:

```matlab
eval(webread('https://mip.sh/install.txt'))
```

This adds the `mip` command to your MATLAB path. It works on Linux, macOS, and Windows, and requires no external tools.

## Installing a package

Install a package from the default channel (`mip-org/core`):

```matlab
mip install chebfun
```

Install multiple packages at once:

```matlab
mip install chebfun finufft
```

MIP resolves dependencies automatically. If a package depends on other packages, they'll be installed too.

## Loading a package

Installing a package downloads it but doesn't add it to your MATLAB path. To use it, load it:

```matlab
mip load chebfun
```

This adds the package (and its dependencies) to your path for the current session. Dependencies are loaded automatically too.

## Unloading

```matlab
mip unload chebfun        % Unload one package
mip unload --all          % Unload all non-sticky packages in this session
mip unload --all --force  % Unload everything except mip itself
```

`mip-org/core/mip` is never unloaded — it's the package manager, and stays available for the duration of the MATLAB session.

When you unload a package, any dependencies it pulled in are pruned too, unless another loaded package still needs them.

## Sticky packages

Pass `--sticky` to keep a package loaded across `mip unload --all`:

```matlab
mip load chebfun --sticky
```

Sticky state lives in the current MATLAB session only — it does **not** persist across MATLAB restarts. To load a package in every new session, add a `mip load` call to your MATLAB startup file (`startup.m`).

## Using other channels

The default channel is `mip-org/core`, but packages can be hosted on any channel. To install from a different channel:

```matlab
mip install --channel youruser/mylab my_package
```

Here `youruser/mylab` refers to the GitHub repo `youruser/mip-mylab`. Channel names must be in `org/channel` form — a bare name like `mylab` is rejected.

You can also use fully qualified package names, which include the channel:

```matlab
mip install youruser/mylab/my_package
mip load youruser/mylab/my_package
```

## Requesting a specific version

Append `@<version>` to request a specific version:

```matlab
mip install chebfun@1.0.0
mip install mip-org/core/chebfun@main
```

This is a request, not a pin — MIP installs that version if it exists in the channel, and fails with `mip:versionNotFound` otherwise. There is no lock file and no version-constraint grammar.

## Architectures

Each package declares which architectures it supports. MIP prefers an exact match for your platform; if the package declares `any`, that's used as a fallback. If the requested version has no compatible build, installation fails — MIP does **not** silently fall back to an older version. To install an older version that does support your platform, use `@version` explicitly.

Run `mip arch` to see your platform's architecture string.
