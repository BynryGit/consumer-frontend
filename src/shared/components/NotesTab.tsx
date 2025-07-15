import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Textarea } from "@shared/ui/textarea";
import { MessageSquare, User, Send } from "lucide-react";

export interface Note {
  id: number | string;
  author: string;
  content: string;
  timestamp: string;
  type?: string;
}

interface NotesTabProps {
  notes: Note[];
  onAddNote?: (note: string) => void;
  title?: string;
  icon?: React.ReactNode;
  idPrefix?: string;
}

const NotesTab: React.FC<NotesTabProps> = ({
  notes,
  onAddNote,
  title = "Communication",
  icon = <MessageSquare className="h-4 w-4" />,
  idPrefix = "notes-tab",
}) => {
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (onAddNote && newNote.trim()) {
      onAddNote(newNote);
      setNewNote("");
    }
  };

  return (
    <Card className="bg-amber-50/30 border-amber-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {icon}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Notes */}
        <div className="space-y-4 max-h-80 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-4 rounded-lg border-l-4 ${
                note.type === "staff"
                  ? "bg-blue-50 border-l-blue-500 border border-blue-200"
                  : "bg-gray-50 border-l-gray-500 border border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium text-sm">{note.author}</span>
                  {note.type === "staff" && (
                    <Badge variant="outline" className="text-xs">
                      Staff
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(note.timestamp).toLocaleString()}
                </span>
              </div>
              <p className="text-sm leading-relaxed">{note.content}</p>
            </div>
          ))}
        </div>
        {onAddNote && (
          <div className="border-t pt-6">
            <div className="space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Send className="h-4 w-4" /> Add a Note
              </h4>
              <Textarea
                placeholder="Enter your note or question here..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="resize-none min-h-[100px]"
              />
              <Button
                onClick={handleAddNote}
                disabled={!newNote.trim()}
                className="w-full sm:w-auto"
              >
                <Send className="h-4 w-4 mr-2" /> Add Note
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default NotesTab; 