import { columns } from "@/components/Columns";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import db from '@/db/drizzle';
import { pages } from "@/db/schema";
import { unstable_noStore } from "next/cache";
import Link from "next/link";

export default async function Page() {
  unstable_noStore();
  const dbPages = await db.select().from(pages);

  return (
    <div className="flex flex-col gap-4 w-full h-full">
      <div className="flex justify-end">
        <Button asChild>
          <Link href="/manage/create">Create</Link>
        </Button>
      </div>
      <DataTable columns={columns} data={dbPages} />
    </div>
  )
}
