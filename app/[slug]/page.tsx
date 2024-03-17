import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import db from "@/db/drizzle";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unstable_noStore } from "next/cache";
import Markdown from "./_components/Markdown";
import { redirect } from "next/navigation";

export async function generateMetadata({ params }: {
  params: {
    slug: string;
  }
}) {
  if (params.slug === 'home') {
    return redirect('/');
  }

  const dbPage = await db.query.pages.findFirst({
    where: eq(pages.slug, params.slug)
  })

  return {
    title: dbPage?.title || 'Page not found'
  }
}

export default async function Page({
  params
}: {
  params: {
    slug: string
  }
}) {
  unstable_noStore();

  if (params.slug === 'home') {
    return redirect('/');
  }

  const dbPage = await db.query.pages.findFirst({
    where: eq(pages.slug, params.slug)
  })

  if (!dbPage) {
    return <div>Page not found</div>
  }

  return (
    <Markdown content={dbPage.content} />
  );
}