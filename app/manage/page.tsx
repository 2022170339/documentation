import { columns } from "@/components/Columns";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import db from '@/db/drizzle';
import { pages } from "@/db/schema";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import NavigationEditor from "./_components/NavigationEditor";

export default async function Page() {
  unstable_noStore();
  const dbPages = await db.select().from(pages);
  const dbNavigation = await db.query.navigation.findFirst();

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex flex-col gap-4">
        <h1>Pages</h1>
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/manage/create">Create</Link>
          </Button>
        </div>
        <DataTable columns={columns} data={dbPages} />
      </div>
      {
        dbNavigation && (
          <NavigationEditor data={dbNavigation} />
        )
      }
    </div>
  )
}
