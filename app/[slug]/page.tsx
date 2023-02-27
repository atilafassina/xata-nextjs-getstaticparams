import { getPaginatedPosts, getPostBySlug } from "~/lib/db.server";

export async function generateStaticParams() {
  const posts = await getPaginatedPosts();

  return posts.map((post) => ({
    slug: "/" + post.slug,
  }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const post = await getPostBySlug(slug);

  return <h1>Post: {post?.title}</h1>;
}
