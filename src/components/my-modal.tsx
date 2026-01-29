import { ReactNode, useCallback, useEffect, MouseEvent } from "react";
import { createPortal } from "react-dom";

interface MyModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
}

const MyModal = ({
  isOpen,
  onClose,
  header,
  footer,
  children,
}: MyModalProps) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={handleOverlayClick}
      className="fixed left-0 top-0 right-0 bottom-0 bg-black/20 flex justify-center items-center"
    >
      <div className="bg-red-400 w-[500px]">
        {header && <header className="w-full bg-amber-200">{header}</header>}

        <main className="w-full h-50">{children}</main>

        {footer && <footer className="w-full bg-amber-500">{footer}</footer>}
      </div>
    </div>,
    document.body,
  );
};

export default MyModal;
