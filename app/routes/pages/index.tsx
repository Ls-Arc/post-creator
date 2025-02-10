// app/routes/posts/index.tsx
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getAllPages } from "~/utils/pages.server";

export const loader: LoaderFunction = async () => {
  const posts = await getAllPages();
  return { posts };
};

export default function PublicPosts() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <div>
      <h1>Posts Públicos</h1>
      {posts.map((post) => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
        </article>
      ))}
    </div>
  );
}
