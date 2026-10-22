import React, { lazy, Suspense, useCallback, useId, useRef, useState } from 'react';
import { Loader2, MessageCircle, X } from 'lucide-react';
import { useTranslation } from '@/i18n';

/**
 * Launcher of the website assistant. The chat panel with its answers and knowledge is a
 * separate chunk that loads when someone points at or opens the button, not with every page.
 */
const loadPanel = () => import('@/components/assistant/AssistantPanel');
const AssistantPanel = lazy(loadPanel);

const LABELS = {
  de: ['Fragen?', 'Fragen? Chat öffnen', 'Chat schliessen'],
  en: ['Questions?', 'Questions? Open chat', 'Close chat'],
  fr: ['Des questions ?', 'Des questions ? Ouvrir le chat', 'Fermer le chat'],
  it: ['Domande?', 'Domande? Apri la chat', 'Chiudi la chat'],
  es: ['¿Preguntas?', '¿Preguntas? Abrir el chat', 'Cerrar el chat'],
  pt: ['Dúvidas?', 'Dúvidas? Abrir o chat', 'Fechar o chat'],
};

export default function VirtualAgent() {
  const { lang } = useTranslation();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [ready, setReady] = useState(false);
  const launcherRef = useRef(null);
  const panelId = useId();
  const [label, openLabel, closeLabel] = LABELS[lang] || LABELS.de;

  const prefetch = useCallback(() => { loadPanel().then(() => setReady(true), () => {}); }, []);
  const close = useCallback(() => {
    setOpen(false);
    setTimeout(() => launcherRef.current?.focus(), 0);
  }, []);
  const toggle = () => {
    if (open) return close();
    prefetch();
    setMounted(true);
    setOpen(true);
  };

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={toggle}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        aria-expanded={open}
        aria-controls={mounted ? panelId : undefined}
        aria-label={open ? closeLabel : openLabel}
        className={`floating-raise fixed bottom-6 right-6 z-50 h-12 items-center justify-center gap-2 bg-[#1F497D] text-white shadow-[0_10px_30px_-8px_rgba(18,29,43,0.55)] transition-colors hover:bg-[#173963] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F497D] ${open ? 'hidden w-12 sm:inline-flex' : 'inline-flex w-12 sm:w-auto sm:px-4'}`}
      >
        {open && !ready && <Loader2 size={20} className="animate-spin" aria-hidden="true" />}
        {open && ready && <X size={20} aria-hidden="true" />}
        {!open && (
          <>
            <MessageCircle size={20} aria-hidden="true" />
            <span className="hidden text-sm font-semibold sm:inline">{label}</span>
          </>
        )}
      </button>
      {mounted && (
        <Suspense fallback={null}>
          <AssistantPanel open={open} onClose={close} panelId={panelId} />
        </Suspense>
      )}
    </>
  );
}
