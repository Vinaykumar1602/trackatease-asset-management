
import { Progress } from "@/components/ui/progress";

interface UploadProgressProps {
  isUploading: boolean;
  progress: number;
}

export function UploadProgress({ isUploading, progress }: UploadProgressProps) {
  if (!isUploading) return null;

  return (
    <div className="py-2">
      <p className="text-sm mb-2">Uploading and processing your data...</p>
      <Progress value={progress} className="h-2" />
    </div>
  );
}
