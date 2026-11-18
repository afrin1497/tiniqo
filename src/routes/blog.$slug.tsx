import { createFileRoute, notFound } from "@tanstack/react-router";

import { PageHeader } from "@/components/common/PageHeader";
import { getPost } from "@/data";
import { seo } from "@/lib/seo";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const p = getPost(params.slug);
    if (!p) throw notFound();
    return { title: p.title, description: p.excerpt };
  },
  head: ({ loaderData }) => seo({ title: loaderData?.title ?? "Journal", description: loaderData?.description ?? "Tiniqo journal." }),
  component: PostPage,
});

function PostPage() {
  const post = getPost(Route.useParams().slug)!;
  return (
    <>
      <PageHeader title={post.title} description={post.excerpt} crumbs={[{ label: "Journal", to: "/blog" }, { label: post.title }]} />
      <article className="container-page prose-tiniqo max-w-3xl py-10">
        {post.body.map((b, i) => b.type === "h2" ? <h2 key={i}>{b.text}</h2> : b.type === "p" ? <p key={i}>{b.text}</p> : <ul key={i}>{b.items.map((x) => <li key={x}>{x}</li>)}</ul>)}
      </article>
    </>
  );
}
