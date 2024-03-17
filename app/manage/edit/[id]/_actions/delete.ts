"use server";

import db from "@/db/drizzle";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function DeleteAction(id: number) {
  await db.delete(pages).where(eq(pages.id, id));
  revalidatePath("/");
  return { success: true };
}
