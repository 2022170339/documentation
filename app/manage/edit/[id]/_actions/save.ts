"use server";

import db from "@/db/drizzle";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function SaveAction(prevData?: any, data?: any) {
  const { id, slug, title, content } = data;
  if (id) {
    await db
      .update(pages)
      .set({ slug, title, content })
      .where(eq(pages.id, id));
  } else {
    await db.insert(pages).values({ slug, title, content });
  }
  revalidatePath("/");
  revalidatePath("/manage");
  revalidatePath(`/manage/edit/${id}`);
  return { success: true };
}
