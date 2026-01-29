"use client";

import { ReactNode, useEffect, useCallback, MouseEvent } from "react";
import { createPortal } from "react-dom";

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
  header?: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
}

const TestModal = ({
  isOpen,
  onClose,
  header,
  footer,
  children,
}: TestModalProps) => {

  const twoSum = (nums: number[], target: number) => {
    const map = new Map<number, number>();
    for (let i = 0; i < nums.length; i++) {
      const complement = target - nums[i];
      if (map.has(complement)) {
        // 返回符合条件的下标
        return [map.get(complement)!, i];
      }
      map.set(nums[i], i);
    }
    return [];
  };

  


  // 1. 使用 useCallback 稳定引用，避免 useEffect 频繁触发挂载/卸载
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // 使用 e.key 代替废弃的 e.keyCode
      if (e.key === "Escape") {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      // 2. 优化体验：禁止背景滚动
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleKeyDown]);

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* 4. 移除固定宽高，改用 min-h/max-h 适配移动端 */}
      <div className="w-full max-w-lg bg-white rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {header && (
          <header className="px-6 py-4 border-b font-bold text-lg">
            {header}
          </header>
        )}

        <main className="px-6 py-4 overflow-y-auto flex-1 text-gray-700">
          {children}
        </main>

        {footer && (
          <footer className="px-6 py-4 border-t bg-gray-50 flex justify-end gap-2">
            {footer}
          </footer>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default TestModal;
