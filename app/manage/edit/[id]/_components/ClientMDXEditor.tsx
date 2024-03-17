"use client"
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import MarkdownPreview from '@uiw/react-markdown-preview';
import Link from "next/link";
import MDEditor from "@uiw/react-md-editor";
import { SaveAction } from "../_actions/save";
import { Input } from "@/components/ui/input";
import slugify from "slugify";

type Props = {
  data: any;
  onSave?: (data: any) => void;
}

export default function ClientMDXEditor({ data, onSave }: Props) {
  const [content, setContent] = useState<string | undefined>(data?.content || "");
  const [title, setTitle] = useState<string | undefined>(data?.title || "");
  const [slug, setSlug] = useState<string | undefined>(data?.slug || "");
  const [showEditor, setShowEditor] = useState<boolean>(true);

  const handlePublish = async () => {
    if (!title) {
      toast.error("Title is required");
      return;
    }
    if (!content) {
      toast.error("Content is required");
      return;
    }

    if (!slug) {
      toast.error("Slug is required");
      return;
    }

    const slugified = slugify(slug, { lower: true });

    try {
      await SaveAction(data, { ...data, slug: slugified, title: title, content: content });
      toast.success("Published successfully");
      if (onSave) {
        onSave({ id: data.id, slug: slugified, title, content });
      }
    } catch (e: any) {
      toast.error(e.message);
      return;
    }

    setSlug(slugified);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between gap-4">
        <div className="flex-1">
          <Button variant="link" asChild>
            <Link href="/manage">
              Back
            </Link>
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Switch onCheckedChange={(value) => setShowEditor(Boolean(value))} checked={showEditor} id="show-hide-editor" />
          <Label htmlFor="show-hide-editor">Show Editor</Label>
        </div>
        <div className="flex items-center">
          <Button onClick={handlePublish}>Publish</Button>
        </div>
        {
          data.id && data.slug && (
            <div className="flex items-center">
              <Button variant="outline" asChild>
                <Link href={`/${data.slug}`} target="_blank">
                  Preview
                </Link>
              </Button>
            </div>
          )
        }
      </div>
      <Label htmlFor="slug">Slug</Label>
      <Input id="slug" value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="Enter a slug..." required />
      <Label htmlFor="title">Title</Label>
      <Input id="title" value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Enter a title..." required />
      {
        showEditor && (
          <MDEditor
            value={content}
            onChange={setContent}
            preview="edit"
          />
        )
      }
      {
        content && (
          <MarkdownPreview source={content || ""} />
        )
      }
    </div>
  )
}