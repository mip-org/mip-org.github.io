import { parseFrontmatter } from "../parseFrontmatter";
import type { BlogPost } from "../types";

import creatingChannel from "./creating-your-own-mip-channel.md?raw";

export const posts: BlogPost[] = [
  parseFrontmatter(creatingChannel),
].sort((a, b) => b.date.localeCompare(a.date));
