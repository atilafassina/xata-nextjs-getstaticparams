import "server-only";
import { getXataClient } from "./xata.codegen";

const xata = getXataClient();

export async function getPaginatedPosts() {
  const { records: posts } = await xata.db.Posts.getPaginated();
  return posts;
}

export async function getPostBySlug(slug: string) {
  const post = await xata.db.Posts.filter({ slug }).getFirst();

  return post;
}
