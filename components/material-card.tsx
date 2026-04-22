import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Eye, FileText, Presentation } from 'lucide-react';
import { LearningMaterial } from '@/lib/mock-data';

interface MaterialCardProps {
  material: LearningMaterial;
  onDownload?: (materialId: string) => void;
}

export function MaterialCard({ material, onDownload }: MaterialCardProps) {
  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-600" />;
      case 'pptx':
        return <Presentation className="w-6 h-6 text-orange-600" />;
      default:
        return <FileText className="w-6 h-6 text-gray-600" />;
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* File Icon */}
        <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0">
          {getFileIcon(material.fileType)}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-medium text-gray-900 line-clamp-2">{material.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{material.uploadedByName}</p>
            </div>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              {material.fileType.toUpperCase()}
            </Badge>
          </div>

          <p className="text-sm text-gray-600 line-clamp-2 mb-3">{material.description}</p>

          {/* Stats */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {material.views}
              </div>
              <div className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {material.downloads}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownload?.(material.id)}
              className="gap-2"
            >
              <Download className="w-3 h-3" />
              Download
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
