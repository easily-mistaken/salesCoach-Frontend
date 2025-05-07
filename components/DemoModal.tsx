import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Video from "next-video";
interface DemoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DemoModal({ isOpen, onClose }: DemoModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Product Demo Video
          </DialogTitle>
        </DialogHeader>
        <div className="aspect-video w-full">
          <Video
            src="https://stream.mux.com/uZgrdliSCJCQe9pJE1oQVU4vr7chdFJSbZCtyp5n9bk.m3u8"
            controls
            className="w-full h-full"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
