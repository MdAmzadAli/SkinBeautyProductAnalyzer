import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import MultiStepForm from "./MultiStepForm";

interface ProfileDialogProps {
  open: boolean;
  onComplete: (data: any) => void;
}

export default function ProfileDialog({ open, onComplete }: ProfileDialogProps) {
  return (
    <Dialog open={open} onOpenChange={() => {}} modal>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create Your Skin Profile</DialogTitle>
          <DialogDescription>
            Help us understand your skin better for personalized ingredient analysis
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <MultiStepForm onComplete={onComplete} />
        </div>
      </DialogContent>
    </Dialog>
  );
}