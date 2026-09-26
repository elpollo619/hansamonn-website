import React, { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

/**
 * Privacy information above form submit buttons (Art. 19 DSG), by default with a
 * required confirmation checkbox. The check runs on the form's native submit event,
 * before React's handler, so it also works for forms with noValidate.
 */
export default function FormPrivacyNote({ className = '', checkbox = true }) {
  const id = useId();
  const boxRef = useRef(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!checkbox) return undefined;
    const form = boxRef.current?.closest('form');
    if (!form) return undefined;
    const guard = (e) => {
      if (boxRef.current && !boxRef.current.checked) {
        e.preventDefault();
        e.stopPropagation();
        setMissing(true);
        boxRef.current.focus();
      }
    };
    form.addEventListener('submit', guard);
    return () => form.removeEventListener('submit', guard);
  }, [checkbox]);

  const info = (
    <>
      Wir speichern Ihre Angaben zur Bearbeitung Ihrer Anfrage und erhalten sie per E-Mail (Dienstleister u. a. in
      den USA). Details in der{' '}
      <Link to="/datenschutz" target="_blank" className="underline hover:text-gray-800">Datenschutzerklärung</Link>.
    </>
  );

  if (!checkbox) return <p className={`text-xs text-gray-600 leading-relaxed ${className}`}>{info}</p>;

  return (
    <div className={className}>
      <div className="flex items-start gap-2.5">
        <input
          ref={boxRef}
          id={id}
          type="checkbox"
          aria-describedby={`${id}-info`}
          aria-invalid={missing || undefined}
          onChange={(e) => e.target.checked && setMissing(false)}
          className="mt-0.5 h-4 w-4 shrink-0 accent-[#1D3D78] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D3D78]"
        />
        <label htmlFor={id} className="text-sm text-gray-700 leading-snug cursor-pointer">
          Ich habe die Datenschutzerklärung gelesen und bin einverstanden, dass meine Angaben zur Bearbeitung
          meiner Anfrage gespeichert werden. <span className="text-red-600" aria-hidden="true">*</span>
        </label>
      </div>
      <p id={`${id}-info`} className="mt-1.5 text-xs text-gray-600 leading-relaxed" style={{ paddingLeft: '1.625rem' }}>{info}</p>
      {missing && (
        <p role="alert" className="mt-1.5 text-xs font-semibold text-red-700" style={{ paddingLeft: '1.625rem' }}>
          Bitte bestätigen Sie die Datenschutzerklärung, damit wir Ihre Anfrage senden können.
        </p>
      )}
    </div>
  );
}
