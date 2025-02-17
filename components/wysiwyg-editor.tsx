import { Editor } from '@tinymce/tinymce-react';
import { useRef, useEffect, useState } from 'react';
import { useTheme } from 'next-themes';

interface WYSIWYGEditorProps {
  initialValue: string;
  onChange: (content: string) => void;
}

export default function WYSIWYGEditor({ initialValue, onChange }: WYSIWYGEditorProps) {
  const editorRef = useRef<any>(null);
  const { theme } = useTheme();
  const [content, setContent] = useState(initialValue); // Local state for content

  useEffect(() => {
    setContent(initialValue); // Sync initialValue with local content state
  }, [initialValue]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        editorRef.current &&
        editorRef.current.editor &&
        editorRef.current.editor.getContainer().contains(e.target as Node)
      ) {
        e.stopPropagation();
      }
    };

    document.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      value={content} // Controlled value
      onInit={(evt, editor) => {
        editorRef.current = editor;
      }}
      onEditorChange={(newContent) => {
        setContent(newContent); // Update local state
        onChange(newContent); // Propagate change to parent
      }}
      init={{
        height: 500,
        menubar: false,
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'code',
          'help',
          'wordcount',
        ],
        toolbar:
          'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style:
          'body { font-family: -apple-system, BlinkMacSystemFont, San Francisco, Segoe UI, Roboto, Helvetica Neue, sans-serif; font-size: 14px; }',
        skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
        content_css: theme === 'dark' ? 'dark' : 'default',
      }}
    />
  );
}
