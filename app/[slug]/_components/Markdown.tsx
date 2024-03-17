"use client"

import MarkdownPreview from '@uiw/react-markdown-preview';

export default function Markdown({ content }: { content: string }) {
  return <MarkdownPreview source={content} />;
}