import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@shared/ui/card";
import { Tabs } from "@shared/ui/tabs";
import { Badge } from "@shared/ui/badge";
import { Button } from "@shared/ui/button";
import { Textarea } from "@shared/ui/textarea";
import { MessageSquare, Clock, User, Send, CheckCircle } from "lucide-react";

export interface Note {
  id: number | string;
  author: string;
  content: string;
  timestamp: string;
  type?: string;
}

export interface TimelineItem {
  id: number | string;
  action: string;
  description: string;
  timestamp: string;
  status: "completed" | "current" | "pending" | string;
}

interface NotesTimelineTabsProps {
  notes: Note[];
  timeline: TimelineItem[];
  onAddNote?: (note: string) => void;
  idPrefix?: string;
  notesTitle?: string;
  timelineTitle?: string;
  notesTabLabel?: string;
  timelineTabLabel?: string;
  notesTabIcon?: React.ReactNode;
  timelineTabIcon?: React.ReactNode;
}

export const NotesTimelineTabs: React.FC<NotesTimelineTabsProps> = ({
  notes,
  timeline,
  onAddNote,
  idPrefix = "notes-timeline",
  notesTitle = "Communication",
  timelineTitle = "Activity Timeline",
  notesTabLabel = "Notes",
  timelineTabLabel = "Timeline",
  notesTabIcon = <MessageSquare className="h-4 w-4" />,
  timelineTabIcon = <Clock className="h-4 w-4" />,
}) => {
  const [newNote, setNewNote] = useState("");

  const handleAddNote = () => {
    if (onAddNote && newNote.trim()) {
      onAddNote(newNote);
      setNewNote("");
    }
  };

  const NotesContent = (
    <Card className="bg-amber-50/30 border-amber-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {notesTabIcon}
          {notesTitle}
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

  const TimelineContent = (
    <Card className="bg-indigo-50/30 border-indigo-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {timelineTabIcon}
          {timelineTitle}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {timeline.map((activity, index) => (
            <div
              key={activity.id}
              className="relative flex items-start space-x-4"
            >
              <div className="flex-shrink-0 relative">
                {activity.status === "completed" && (
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                )}
                {activity.status === "current" && (
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-blue-600" />
                  </div>
                )}
                {activity.status === "pending" && (
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <div className="h-3 w-3 rounded-full bg-gray-400" />
                  </div>
                )}
                {index < timeline.length - 1 && (
                  <div className="absolute top-10 left-1/2 transform -translate-x-1/2 h-8 w-px bg-gray-200" />
                )}
              </div>
              <div className="flex-1 min-w-0 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">{activity.action}</h4>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                    {new Date(activity.timestamp).toLocaleString()}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activity.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const tabComponents = {
    notes: {
      label: notesTabLabel,
      icon: notesTabIcon,
      component: NotesContent,
      count: notes.length,
      shortLabel: notesTabLabel,
    },
    timeline: {
      label: timelineTabLabel,
      icon: timelineTabIcon,
      component: TimelineContent,
      shortLabel: timelineTabLabel,
    },
  };

  return (
    <Tabs
      defaultValue="notes"
      tabComponents={tabComponents}
      urlMapping={{ notes: "notes", timeline: "timeline" }}
      tabsListClassName="mb-6"
      tabsListFullWidth={true}
      idPrefix={idPrefix}
    />
  );
};

export default NotesTimelineTabs; 