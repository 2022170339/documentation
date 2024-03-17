import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import db from "@/db/drizzle";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unstable_noStore } from "next/cache";
import Markdown from "./[slug]/_components/Markdown";

export async function generateMetadata() {
  const dbPage = await db.query.pages.findFirst({
    where: eq(pages.slug, "home")
  })

  return {
    title: dbPage?.title || 'Page not found'
  }
}

export default async function Page() {
  unstable_noStore();
  const dbPage = await db.query.pages.findFirst({
    where: eq(pages.slug, "home")
  })

  if (!dbPage) {
    return <div>Page not found</div>
  }

  return (
    <Markdown content={dbPage.content} />
  );
}