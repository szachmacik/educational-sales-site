"use client";

import { useRef, forwardRef, useImperativeHandle } from "react";
import {
    Bold,
    Italic,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Link2,
    Image,
    Quote,
    Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { cn } from "@/lib/utils";

interface RichEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export interface RichEditorRef {
    insertText: (text: string) => void;
    focus: () => void;
}

const RichEditor = forwardRef<RichEditorRef, RichEditorProps>(
    ({ value, onChange, placeholder, className }, ref) => {
        const { t } = useLanguage();
        const e = t?.adminSettings?.editor || {
            placeholder: "Start typing...",
            prompts: {
                link: "Enter URL:",
                image: "Enter image URL:"
            },
            toolbar: {
                bold: "Bold",
                italic: "Italic",
                h2: "Heading 2",
                h3: "Heading 3",
                list: "Unordered List",
                listOrdered: "Ordered List",
                link: "Insert Link",
                image: "Insert Image",
                quote: "Quote",
                code: "Code Block"
            }
        };

        const editorRef = useRef<HTMLDivElement>(null);
        const activePlaceholder = placeholder || e.placeholder;

        useImperativeHandle(ref, () => ({
            insertText: (text: string) => {
                if (editorRef.current) {
                    editorRef.current.innerHTML += text;
                    onChange(editorRef.current.innerHTML);
                }
            },
            focus: () => {
                editorRef.current?.focus();
            },
        }));

        const execCommand = (command: string, value?: string) => {
            document.execCommand(command, false, value);
            if (editorRef.current) {
                onChange(editorRef.current.innerHTML);
            }
        };

        const handleInput = () => {
            if (editorRef.current) {
                onChange(editorRef.current.innerHTML);
            }
        };

        const insertHeading = (level: number) => {
            execCommand("formatBlock", `h${level}`);
        };

        const insertLink = () => {
            const url = prompt(e.prompts.link);
            if (url) {
                execCommand("createLink", url);
            }
        };

        const insertImage = () => {
            const url = prompt(e.prompts.image);
            if (url) {
                execCommand("insertImage", url);
            }
        };

        const toolbarItems = [
            { icon: Bold, action: () => execCommand("bold"), title: e.toolbar.bold },
            { icon: Italic, action: () => execCommand("italic"), title: e.toolbar.italic },
            { type: "separator" },
            { icon: Heading2, action: () => insertHeading(2), title: e.toolbar.h2 },
            { icon: Heading3, action: () => insertHeading(3), title: e.toolbar.h3 },
            { type: "separator" },
            { icon: List, action: () => execCommand("insertUnorderedList"), title: e.toolbar.list },
            { icon: ListOrdered, action: () => execCommand("insertOrderedList"), title: e.toolbar.listOrdered },
            { type: "separator" },
            { icon: Link2, action: insertLink, title: e.toolbar.link },
            { icon: Image, action: insertImage, title: e.toolbar.image },
            { icon: Quote, action: () => execCommand("formatBlock", "blockquote"), title: e.toolbar.quote },
            { icon: Code, action: () => execCommand("formatBlock", "pre"), title: e.toolbar.code },
        ];

        return (
            <div className={cn("border rounded-lg overflow-hidden", className)}>
                {/* Toolbar */}
                <div className="flex items-center gap-1 p-2 border-b bg-muted/50 flex-wrap">
                    {toolbarItems.map((item, index) =>
                        item.type === "separator" ? (
                            <div key={index} className="w-px h-6 bg-border mx-1" />
                        ) : (
                            <Button
                                key={index}
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={item.action}
                                title={item.title}
                            >
                                {item.icon && <item.icon className="h-4 w-4" />}
                            </Button>
                        )
                    )}
                </div>

                {/* Editor */}
                <div
                    ref={editorRef}
                    contentEditable
                    dangerouslySetInnerHTML={{ __html: value }}
                    onInput={handleInput}
                    className="min-h-[400px] p-4 prose prose-sm max-w-none focus:outline-none"
                    data-placeholder={activePlaceholder}
                    style={{
                        // Placeholder styling
                    }}
                />

                <style jsx>{`
          [contenteditable]:empty:before {
            content: attr(data-placeholder);
            color: #9ca3af;
            pointer-events: none;
          }
        `}</style>
            </div>
        );
    }
);

RichEditor.displayName = "RichEditor";

export { RichEditor };
