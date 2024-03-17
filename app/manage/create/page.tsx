"use client"

import { redirect, useRouter } from "next/navigation";
import ClientMDXEditor from "../edit/[id]/_components/ClientMDXEditor";

export default function Page() {
  const router = useRouter();
  return (
    <ClientMDXEditor data={{
      id: "",
      slug: "",
      title: "",
      content: "",
    }}
      onSave={(_) => {
        router.push(`/manage`);
      }}
    />
  )
}