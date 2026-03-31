---
title: Creating Your Own MIP Channel and Your First Package
date: 2026-03-31
slug: creating-your-own-mip-channel
author: Jeremy Magland
summary: How to set up a custom MIP channel on GitHub and publish your first MATLAB package.
---

MIP packages are hosted in **channels**, which are GitHub repos that store packages as release assets and publish an index via GitHub Pages. The official channel is `mip-org/core`, but you can create your own to distribute packages for your lab, team, or project.

In this post we'll create a channel from scratch, add a simple package to it, and install that package in MATLAB.

## Setting up your channel

Start by creating a new GitHub repo from the [mip-channel-template](https://github.com/mip-org/mip-channel-template). Click "Use this template" on that page and name your repo `mip-<channel_name>`, for example `mip-mylab`. The name matters: when someone runs `mip install --channel youruser/mylab`, MIP looks for a repo called `mip-mylab` under your GitHub account.

The template includes GitHub Actions workflows that handle the entire build pipeline. When you push to `main`, CI automatically clones your package sources, bundles them into `.mhl` files, uploads them as GitHub release assets, and publishes a package index to GitHub Pages. You don't need to build or upload anything yourself.

To enable this, go to your repo's **Settings > Pages** and set the source to **GitHub Actions**. That's it, your channel is ready to accept packages.

## Creating your package source code

The source code for a MIP package (your `.m` files) lives in its own repo, separate from the channel. The channel repo only contains the formulae that tell MIP how to fetch, build, and host each package. This separation means your source code can be organized however you like, and multiple channels can package the same source.

There's a lot of flexibility in how you structure a MIP package's source. You can have nested directories, MEX source files, multiple MATLAB paths, and so on. But the simplest case is just a repo with some `.m` files in it.

For this tutorial, we'll use [hello_mip](https://github.com/mip-org/hello_mip) as our example. It's a repo with a single function:

```matlab
function result = hello_mip()
%HELLO_MIP Simple test function for MIP.
%   result = hello_mip() returns the string 'Hello from MIP!'
    result = 'Hello from MIP!';
    disp(result);
end
```

If you want to follow along with your own package, just create a public GitHub repo with one or more `.m` files in it. That's all you need.

## Adding a package to your channel

Back in your channel repo, each package is defined by a `prepare.yaml` file at the path `packages/<name>/releases/<version>/prepare.yaml`.

Since we're still developing `hello_mip` and haven't cut a numbered release, we'll use `main` as the version. This means the package always builds from the head of the `main` branch. Later, when you're ready to make a stable release, you can add a new version like `1.0.0` alongside it.

Create `packages/hello_mip/releases/main/prepare.yaml`:

```yaml
name: hello_mip
description: "A simple test package for MIP"
version: "main"
dependencies: []
homepage: "https://github.com/mip-org/hello_mip"
repository: "https://github.com/mip-org/hello_mip"
license: "MIT"

defaults:
  release_number: 1
  prepare:
    clone_git:
      url: "https://github.com/mip-org/hello_mip"
      destination: "hello_mip"
      branch: "main"
  addpaths:
    - path: "hello_mip"

builds:
  - architectures: [any]
```

The `clone_git` section tells MIP where to get the source and which branch to use. Replace the URL with your own repo if you're packaging your own code. `addpaths` lists the directories to add to the MATLAB path when the package is loaded. And since this is pure MATLAB with no compiled code, `architectures: [any]` is all we need.

Commit and push this to `main`, and GitHub Actions will build the package and publish it to your channel's index.

## Installing your package

If you haven't already, [install MIP](https://mip.sh) in MATLAB. Then install your package by specifying your channel:

```matlab
mip install --channel youruser/mylab hello_mip
```

Replace `youruser/mylab` with your GitHub username and channel name (the repo name minus the `mip-` prefix). To load it into your MATLAB path:

```matlab
mip load hello_mip
```

If you have packages with the same name across multiple channels, use the fully qualified name instead:

```matlab
mip load youruser/mylab/hello_mip
```

Once loaded, you can use it like any other MATLAB function:

```matlab
hello_mip()
```

## What's next

That's all it takes to get a package into MIP. From here you can add more packages to your channel, set up versioned releases, or add packages with MEX compilation for multiple architectures. See the [mip-channel-template](https://github.com/mip-org/mip-channel-template) README and the [mip-core](https://github.com/mip-org/mip-core) channel for more examples.
