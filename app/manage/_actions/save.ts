"use server";

import db from "@/db/drizzle";
import { navigation } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function SaveAction({
  structure,
}: InferSelectModel<typeof navigation>) {
  try {
    await db.update(navigation).set({
      structure: structure,
    });
  } catch (e: any) {
    throw new Error(e.message);
  }
  revalidatePath("/", "layout");
}
