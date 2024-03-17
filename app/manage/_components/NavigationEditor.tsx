"use client"

import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { navigation } from "@/db/schema";
import { InferSelectModel } from "drizzle-orm";
import { useState } from "react";
import MarkdownPreview from '@uiw/react-markdown-preview';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Button } from "@/components/ui/button";
import { GripHorizontal, Trash } from "lucide-react";
import { SaveAction } from "../_actions/save";
import { toast } from "sonner";
import { useDebounceCallback } from 'usehooks-ts'
import { set } from "react-hook-form";


export default function NavigationEditor({
  data
}: {
  data: InferSelectModel<typeof navigation>
}) {
  const [structure, _] = useState(JSON.parse(JSON.stringify(data?.structure as any)));
  const [navigations, setNavigations] = useState(JSON.parse(JSON.stringify(structure.navigation as any)));
  // use navigations id as array of items
  const [items, setItems] = useState(navigations.map((item: any) => {
    return item.id
  }));

  const [showJson, setShowJson] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((items: number[]) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        for (let i = 0; i < navigations.length; i++) {
          if (navigations[i].id === active.id) {
            const item = navigations.splice(i, 1);
            navigations.splice(newIndex, 0, item[0]);
            break;
          }
        }
        saveToDb([...navigations]);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const updateStructure = (data: any, index: number) => {
    let newItems = [...navigations];
    newItems[index] = data;
    setNavigations([...newItems]);
    saveToDb([...newItems]);
  }

  const saveToDb = async (navigations: any) => {
    try {
      await SaveAction({
        id: data.id,
        structure: {
          navigation: navigations
        }
      });
      toast.success("Saved successfully");
    } catch (e: any) {
      toast.error(e.message);
    }
  }

  const addNew = () => {
    const highest = navigations.length > 0 ? Math.max(...navigations.map((item: any) => item.id)) : 0;
    const newId = highest + 1;
    const newItems = [...navigations, { id: newId, label: "New", url: "", isHeader: false }];
    setNavigations(newItems);
    setItems(newItems.map((item: any) => {
      return item.id
    }));
    saveToDb([...newItems]);
  }
  const onDelete = (id: number) => {
    const newItems = navigations.filter((item: any) => item.id !== id);
    setNavigations(newItems);
    setItems(newItems.map((item: any) => {
      return item.id
    }));
    saveToDb([...newItems]);
  }

  const jsonText = "```js\n//Navigation Structure\n" + JSON.stringify(navigations, null, 2) + "\n```";

  return (
    <div className="flex flex-col gap-4">
      <h1>Navigation</h1>
      <div className="items-center">
        <div className="items-center space-x-2">
          <Label htmlFor="show-json-structure">Show JSON Structure?</Label>
          <Switch id="show-json-structure" checked={showJson} onCheckedChange={(value) => {
            setShowJson(Boolean(value));
          }} />
        </div>
      </div>
      {
        showJson && (
          <div className="flex flex-col gap-2">
            <MarkdownPreview className="bg-slate-50 rounded-lg p-2" source={jsonText} />
          </div>
        )
      }
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={items}
          strategy={verticalListSortingStrategy}
        >
          {items?.map((id: number, index: number) => (
            <SortableItem
              id={id}
              key={id}
              data={navigations[index]}
              updateStructure={(data, _) => updateStructure(data, index)}
              onDelete={(id) => onDelete(id)}
            />
          ))}
        </SortableContext>
        <Button onClick={addNew}>Add New</Button>
      </DndContext>
    </div>
  );
}

const SortableItem = ({
  data,
  id: id,
  updateStructure,
  onDelete,
}: {
  data: any;
  id: number;
  updateStructure: (data: any, index: number) => void;
  onDelete: (id: number) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    id: id
  });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [isHeader, setIsHeader] = useState(data.isHeader);
  const [label, setLabel] = useState(data.label);
  const [url, setUrl] = useState(data.url);

  const debounced = useDebounceCallback(updateStructure, 500);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex flex-row gap-2 justify-between border rounded-lg p-2 mb-2`}>
      {id}
      <div className="flex">
        <Button
          variant={"ghost"}
          size="icon"
          {...listeners}
          {...attributes}
        ><GripHorizontal /></Button>
      </div>
      <div className="flex flex-col gap-2 w-full">
        <div className="items-center space-x-2">
          <Label htmlFor="is-header">Is Header?</Label>
          <Checkbox onCheckedChange={(value) => {
            setIsHeader(Boolean(value));
            debounced({ ...data, isHeader: Boolean(value) }, id);
          }} id="is-header" checked={isHeader ? true : false} />
        </div>
        <div className="flex flex-row gap-2">
          <Input onChange={(event) => {
            setLabel(event.target.value);
            debounced({ ...data, label: event.target.value }, id);
          }} value={label} placeholder="label" />
          {
            !data?.isHeader && (
              <Input onChange={(event) => {
                setUrl(event.target.value);
                debounced({ ...data, url: event.target.value }, id);
              }} value={url} placeholder="url" />
            )
          }
        </div>
      </div>
      <div className="flex my-auto">
        <Button variant="destructive" size="icon" onClick={() => onDelete(id)}><Trash /></Button>
      </div>
    </div>
  )
}