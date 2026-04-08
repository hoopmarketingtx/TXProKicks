import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { useToast } from "@/components/ui/use-toast"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, open, onOpenChange, ...rest }) {
        const dataState = open ? "open" : "closed";
        return (
          <Toast key={id} data-state={dataState} {...rest}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose onClick={() => onOpenChange?.(false)} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
