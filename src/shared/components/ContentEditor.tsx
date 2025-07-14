import React, { useState, useEffect, useRef } from "react";
import { Textarea } from "@shared/ui/textarea";

// Types for content formats
export type ContentFormat = "plainText" | "richText" | "html";

interface ContentEditorProps {
  format: ContentFormat;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  maxCharacters?: number;
}

// Rich Text Editor Component
const RichTextEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, disabled, placeholder, className }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isEditorReady, setIsEditorReady] = useState(false);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // Make the div editable
    editor.contentEditable = (!disabled).toString();
    editor.style.minHeight = "200px";
    editor.style.padding = "12px";
    editor.style.border = "1px solid #d1d5db";
    editor.style.borderRadius = "6px";
    editor.style.backgroundColor = disabled ? "#f9fafb" : "white";
    editor.style.fontSize = "14px";
    editor.style.fontFamily =
      'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace';

    // Set initial content
    if (value && editor.innerHTML !== value) {
      editor.innerHTML = value;
    }

    // Add placeholder handling
    const updatePlaceholder = () => {
      if (editor.textContent?.trim() === "" && placeholder) {
        editor.setAttribute("data-placeholder", placeholder);
        editor.style.setProperty("--placeholder-opacity", "1");
      } else {
        editor.style.setProperty("--placeholder-opacity", "0");
      }
    };

    // Add CSS for placeholder
    if (!document.getElementById("rich-editor-styles")) {
      const style = document.createElement("style");
      style.id = "rich-editor-styles";
      style.textContent = `
        [contenteditable][data-placeholder]:empty::before {
          content: attr(data-placeholder);
          opacity: var(--placeholder-opacity, 0.5);
          color: #9ca3af;
          pointer-events: none;
          position: absolute;
        }
        [contenteditable] {
          outline: none;
          position: relative;
        }
      `;
      document.head.appendChild(style);
    }

    updatePlaceholder();
    setIsEditorReady(true);

    const handleInput = () => {
      const content = editor.innerHTML;
      onChange(content);
      updatePlaceholder();
    };

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      const text = e.clipboardData?.getData("text/plain") || "";
      document.execCommand("insertText", false, text);
    };

    editor.addEventListener("input", handleInput);
    editor.addEventListener("paste", handlePaste);
    editor.addEventListener("focus", updatePlaceholder);
    editor.addEventListener("blur", updatePlaceholder);

    return () => {
      editor.removeEventListener("input", handleInput);
      editor.removeEventListener("paste", handlePaste);
      editor.removeEventListener("focus", updatePlaceholder);
      editor.removeEventListener("blur", updatePlaceholder);
    };
  }, [value, onChange, disabled, placeholder]);

  // Toolbar for rich text formatting
  const ToolbarButton: React.FC<{
    command: string;
    icon: string;
    title: string;
  }> = ({ command, icon, title }) => (
    <button
      type="button"
      onClick={() => {
        document.execCommand(command, false);
        editorRef.current?.focus();
      }}
      disabled={disabled}
      className="px-2 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50"
      title={title}
    >
      {icon}
    </button>
  );

  return (
    <div className={className}>
      {/* Toolbar */}
      <div className="flex gap-1 p-2 border-b bg-gray-50 rounded-t-md">
        <ToolbarButton command="bold" icon="B" title="Bold" />
        <ToolbarButton command="italic" icon="I" title="Italic" />
        <ToolbarButton command="underline" icon="U" title="Underline" />
        <div className="w-px bg-gray-300 mx-1" />
        <ToolbarButton
          command="insertUnorderedList"
          icon="•"
          title="Bullet List"
        />
        <ToolbarButton
          command="insertOrderedList"
          icon="1."
          title="Numbered List"
        />
        <div className="w-px bg-gray-300 mx-1" />
        <ToolbarButton command="justifyLeft" icon="⇤" title="Align Left" />
        <ToolbarButton command="justifyCenter" icon="⇔" title="Center" />
        <ToolbarButton command="justifyRight" icon="⇥" title="Align Right" />
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className="focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{ borderTopLeftRadius: 0, borderTopRightRadius: 0 }}
      />
    </div>
  );
};

// HTML Code Editor Component
const HTMLCodeEditor: React.FC<{
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, disabled, placeholder, className }) => {
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);

  useEffect(() => {
    const lines = value.split("\n").length;
    setLineNumbers(
      Array.from({ length: Math.max(lines, 10) }, (_, i) => i + 1)
    );
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <div className="flex border rounded-md overflow-hidden">
        {/* Line Numbers */}
        <div className="bg-gray-50 border-r px-2 py-3 text-xs text-gray-500 font-mono select-none min-w-[40px]">
          {lineNumbers.map((num) => (
            <div key={num} className="leading-5 text-right">
              {num}
            </div>
          ))}
        </div>

        {/* Code Editor */}
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder={placeholder}
          className="font-mono text-sm resize-none border-0 rounded-none min-h-[200px] flex-1"
          style={{
            lineHeight: "1.25rem",
            tabSize: 2,
          }}
          onKeyDown={(e) => {
            // Handle tab indentation
            if (e.key === "Tab") {
              e.preventDefault();
              const target = e.target as HTMLTextAreaElement;
              const start = target.selectionStart;
              const end = target.selectionEnd;
              const newValue =
                value.substring(0, start) + "  " + value.substring(end);
              onChange(newValue);

              // Set cursor position after the inserted spaces
              setTimeout(() => {
                target.selectionStart = target.selectionEnd = start + 2;
              }, 0);
            }
          }}
        />
      </div>

      {/* HTML Preview Toggle */}
      <div className="mt-2">
        <details className="border rounded p-2">
          <summary className="cursor-pointer text-sm font-medium text-gray-700">
            Preview HTML Output
          </summary>
          <div className="mt-2 p-3 bg-gray-50 border rounded">
            <div
              dangerouslySetInnerHTML={{ __html: value }}
              className="prose prose-sm max-w-none"
            />
          </div>
        </details>
      </div>
    </div>
  );
};

// Main ContentEditor Component
export const ContentEditor: React.FC<ContentEditorProps> = ({
  format,
  value,
  onChange,
  disabled = false,
  placeholder = "Enter your template content here...",
  className = "",
  maxCharacters,
}) => {
  // Helper function to strip HTML tags for character counting
  const getTextContent = (html: string): string => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  // Calculate character count based on format
  const getCharacterCount = (): number => {
    switch (format) {
      case "plainText":
        return value.length;
      case "richText":
        return getTextContent(value).length;
      case "html":
        return value.length; // Count all characters including HTML tags
      default:
        return value.length;
    }
  };

  const characterCount = getCharacterCount();
  const isOverLimit = maxCharacters ? characterCount > maxCharacters : false;

  // Enhanced placeholder text based on format
  const getPlaceholder = (): string => {
    const basePlaceholder = placeholder;
    const maxCharText = maxCharacters
      ? ` Max ${maxCharacters} characters.`
      : "";

    switch (format) {
      case "plainText":
        return `${basePlaceholder}${maxCharText}`;
      case "richText":
        return `${basePlaceholder} Use the toolbar above for formatting.${maxCharText}`;
      case "html":
        return `${basePlaceholder} Enter HTML code directly.${maxCharText}`;
      default:
        return basePlaceholder;
    }
  };

  // Render appropriate editor based on format
  const renderEditor = () => {
    const editorClassName = `${className} ${
      isOverLimit ? "border-red-500" : ""
    }`;

    switch (format) {
      case "plainText":
        return (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={getPlaceholder()}
            className={`${editorClassName} min-h-[200px] font-mono`}
          />
        );

      case "richText":
        return (
          <RichTextEditor
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={getPlaceholder()}
            className={editorClassName}
          />
        );

      case "html":
        return (
          <HTMLCodeEditor
            value={value}
            onChange={onChange}
            disabled={disabled}
            placeholder={getPlaceholder()}
            className={editorClassName}
          />
        );

      default:
        return (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            placeholder={getPlaceholder()}
            className={`${editorClassName} min-h-[200px] font-mono`}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      {renderEditor()}

      {/* Format-specific hints */}
      {format === "richText" && (
        <p className="text-xs text-gray-600">
          💡 Tip: Use the toolbar buttons for formatting. Content will be saved
          as HTML.
        </p>
      )}

      {format === "html" && (
        <p className="text-xs text-gray-600">
          💡 Tip: Write HTML directly. Use the preview to see how it will
          render.
        </p>
      )}

      {/* Character limit warning */}
      {isOverLimit && (
        <p className="text-xs text-red-600">
          Content exceeds the maximum character limit.
        </p>
      )}
    </div>
  );
};
