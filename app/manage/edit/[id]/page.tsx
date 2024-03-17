import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import dynamic from "next/dynamic";
import db from "@/db/drizzle";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { unstable_noStore } from "next/cache";

const ClientMDXEditor = dynamic(
  () => import("./_components/ClientMDXEditor"),
  { ssr: false }
);

export default async function Page({
  params
}: {
  params: {
    id: string
  }
}) {
  unstable_noStore();
  const dbPage = await db.query.pages.findFirst({
    where: eq(pages.id, parseInt(params.id))
  })

  if (!dbPage) {
    return <div>Page not found</div>
  }

  return (
    <ClientMDXEditor data={{
      id: dbPage.id,
      slug: dbPage.slug,
      title: dbPage.title,
      content: dbPage.content
    }} />
  );
}