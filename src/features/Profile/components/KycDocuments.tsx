import React from "react";
import { Card, CardHeader, CardTitle, CardContent} from "@shared/ui/card";
import { FileText, Eye } from "lucide-react";
import { Button } from "@shared/ui/button";
import { Badge } from "@shared/ui/badge";

export const KycDocuments = ({ kycDocuments, onViewDocument }) => (
  <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <div className="p-2 bg-blue-500 rounded-lg">
          <FileText className="h-5 w-5 text-white" />
        </div>
        KYC Documents
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3 pt-4">
        {kycDocuments.map((doc, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-secondary-200 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3 flex-1">
              <div className="p-2 bg-secondary-100 rounded-lg">
                <FileText className="h-4 w-4 text-secondary-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{doc.name}</p>
                <p className="text-xs text-muted-foreground">{doc.fileName}</p>
                <p className="text-xs text-muted-foreground">Uploaded: {doc.uploadDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDocument(doc.fileName, doc.fileUrl)}
                className="flex items-center gap-1"
              >
                <Eye className="h-3 w-3" />
                View
              </Button>
              <Badge
                variant={doc.status === "Verified" ? "default" : "secondary"}
                className="bg-green-100 text-green-800"
              >
                {doc.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
); 