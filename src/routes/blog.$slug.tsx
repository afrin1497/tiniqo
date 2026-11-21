import { createFileRoute, notFound } from "@tanstack/react-router";
import { JournalPost } from "@/components/common/ContentPages";
import { getPost } from "@/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => seo({
    title: loaderData?.post.title ?? "Journal Story",
    description: loaderData?.post.excerpt ?? "Stories and practical kidswear advice from the Tiniqo journal.",
  }),
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  return <JournalPost post={post} />;
}
