import { useEffect } from 'react';

const isTypingTarget = (target) => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
};

const hasModifier = (event) =>
  event.ctrlKey || event.metaKey || event.altKey;

export function useKeyboardShortcuts(shortcuts) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (hasModifier(event) || event.key.length !== 1) return;
      if (isTypingTarget(event.target)) return;

      const shortcut = shortcuts[event.key.toLowerCase()];
      if (!shortcut) return;

      const handled = shortcut(event);
      if (handled !== false) {
        event.preventDefault();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}
