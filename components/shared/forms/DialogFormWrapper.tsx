// สำหรับแสดง form ที่มีช่อง input ไม่เยอะ เนื่องจากอาจมีปัญหาหากฟอร์มยาวจนต้อง scroll
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
type Props = {
  triggerBtn: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
};
export function DialogFormWrapper({
  triggerBtn,
  title,
  description,
  children,
}: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>{triggerBtn}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
