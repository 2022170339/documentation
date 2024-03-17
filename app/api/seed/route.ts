import db from "@/db/drizzle";
import { navigation } from "@/db/schema";

export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  const nav = await db.query.navigation.findFirst();
  if (!nav) {
    //seed
    await db.insert(navigation).values({
      structure: {
        navigation: [
          {
            label: "Introduction",
            isHeader: true,
          },
          {
            label: "Home",
            url: "/",
          },
        ],
      },
    });
    return new Response("No navigation found", { status: 404 });
  } else {
    return new Response(JSON.stringify(nav.structure), {
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
