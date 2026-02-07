import { VariantProps } from "class-variance-authority";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";

interface customTrigerOpts
  extends Omit<React.ComponentProps<"button">, "ref">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export interface AppDialogProps {
  title: string;
  Icon: React.ReactNode;
  children: React.ReactNode;
  onChange?: (open: boolean) => Promise<void> | void;
  disabled?: boolean;
  triggerOpts?: customTrigerOpts;
}

export function AppDialog({
  title,
  Icon,
  children,
  onChange,
  disabled,
  triggerOpts,
}: AppDialogProps) {
  return (
    <Dialog onOpenChange={onChange}>
      <DialogTrigger asChild>
        <Button {...triggerOpts} disabled={disabled}>
          {Icon}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
