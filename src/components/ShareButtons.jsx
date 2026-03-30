import React, { useState } from 'react';
import { MessageCircle, Mail, Link2, Check } from 'lucide-react';

const ShareButtons = ({ title, url }) => {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} ${shareUrl}`)}`;
  const mailHref = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareUrl)}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
    } catch {
      // Fallback for browsers without clipboard API
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btnBase =
    'flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-colors';

  return (
    <div>
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
        Teilen
      </p>
      <div className="flex gap-2 flex-wrap">
        {/* WhatsApp */}
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className={btnBase}
          aria-label="Via WhatsApp teilen"
        >
          <MessageCircle size={13} />
          WhatsApp
        </a>

        {/* Email */}
        <a
          href={mailHref}
          className={btnBase}
          aria-label="Per E-Mail teilen"
        >
          <Mail size={13} />
          E-Mail
        </a>

        {/* Copy link */}
        <button
          type="button"
          onClick={handleCopy}
          className={`${btnBase} ${copied ? 'border-gray-400 text-gray-700 bg-gray-100 hover:bg-gray-100' : ''}`}
          aria-label="Link kopieren"
        >
          {copied ? <Check size={13} /> : <Link2 size={13} />}
          {copied ? 'Kopiert!' : 'Link'}
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
