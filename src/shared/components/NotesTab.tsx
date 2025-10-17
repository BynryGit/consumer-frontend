import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Textarea } from "@shared/ui/textarea";
import { MessageSquare, User, Send, Loader2 } from "lucide-react";

export interface Note {
  id: number | string;
  author: string;
  content: string;
  timestamp: string;
  type?: string;
}

interface NotesTabProps {
  notes: Note[];
  onAddNote?: (note: string) => Promise<void> | void;
  title?: string;
  icon?: React.ReactNode;
  idPrefix?: string;
  isLoading?: boolean;
}

const NotesTab: React.FC<NotesTabProps> = ({
  notes,
  onAddNote,
  title = "Communication",
  icon = <MessageSquare className="h-4 w-4" />,
  idPrefix = "notes-tab",
  isLoading = false,
}) => {
  const [newNote, setNewNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddNote = async () => {
    if (onAddNote && newNote.trim()) {
      setIsSubmitting(true);
      try {
        await onAddNote(newNote);
        setNewNote("");
      } catch (error) {
        console.error("Error adding note:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Card className="bg-blue-50/30 border-blue-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {/* Existing Notes */}
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="border border-gray-200 rounded-lg p-4 bg-white"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-600" />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{note.author}</span>
                    {note.type === "staff" && (
                      <Badge className="bg-blue-100 text-blue-800 border-blue-200 text-xs">
                        Staff
                      </Badge>
                    )}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(note.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {note.content}
              </p>
            </div>
          ))}
        </div>

        {onAddNote && (
          <div className="border-t border-gray-200 pt-6">
            <div className="space-y-4">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Add a Note
              </h4>
              <Textarea
                id={`${idPrefix}-new-note`}
                placeholder="Type your note here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="resize-none min-h-[100px]"
                disabled={isSubmitting || isLoading}
              />
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim() || isSubmitting || isLoading}
                className="w-full sm:w-auto"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {isSubmitting ? "Adding Note..." : "Add Note"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotesTab;