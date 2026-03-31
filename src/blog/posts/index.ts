import { parseFrontmatter } from "../parseFrontmatter";
import type { BlogPost } from "../types";

import creatingChannel from "./creating-your-own-mip-channel.md?raw";
import numblWasm from "./building-a-numbl-wasm-package.md?raw";

export const posts: BlogPost[] = [
  parseFrontmatter(creatingChannel),
  parseFrontmatter(numblWasm),
].sort((a, b) => b.date.localeCompare(a.date));
