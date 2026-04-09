import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { jsPDF } from "jspdf";
import { useTranslation } from "@/i18n";
import {
  User, Building2, Car, PhoneCall, FileText, CheckSquare,
  Upload, X, AlertCircle, CheckCircle2, Loader2, CalendarDays,
  MapPin, ChevronDown, ChevronUp, Home,
} from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────

const NATIONALITIES = [
  "Schweiz", "Deutschland", "Österreich", "Frankreich", "Italien",
  "Spanien", "Portugal", "Polen", "Rumänien", "Türkei", "Kosovo",
  "Albanien", "Nordmazedonien", "Bosnien und Herzegowina", "Serbien",
  "Kroatien", "Slowenien", "Ungarn", "Slowakei", "Tschechien",
  "Belgien", "Niederlande", "Schweden", "Norwegen", "Dänemark",
  "Finnland", "Irland", "Vereinigtes Königreich", "USA", "Kanada",
  "Australien", "Neuseeland", "Indien", "China", "Japan",
  "Brasilien", "Argentinien", "Kolumbien", "Mexiko", "Afghanistan",
  "Albanien", "Algerien", "Andorra", "Angola", "Armenien",
  "Aserbaidschan", "Bahamas", "Bahrain", "Bangladesch", "Barbados",
  "Belize", "Benin", "Bhutan", "Bolivien", "Botswana", "Brunei",
  "Bulgarien", "Burkina Faso", "Burundi", "Kambodscha", "Kamerun",
  "Chile", "Dominikanische Republik", "Ecuador", "Ägypten",
  "El Salvador", "Estland", "Äthiopien", "Georgien", "Ghana",
  "Griechenland", "Guatemala", "Honduras", "Island", "Indonesien",
  "Iran", "Irak", "Israel", "Jordanien", "Kenia", "Kuwait",
  "Laos", "Lettland", "Libanon", "Liechtenstein", "Litauen",
  "Luxemburg", "Malaysia", "Malta", "Monaco", "Mongolei",
  "Marokko", "Namibia", "Nepal", "Nigeria", "Pakistan",
  "Panama", "Paraguay", "Peru", "Philippinen",
  "Russland", "Saudi-Arabien", "Singapur", "Südafrika",
  "Südkorea", "Sri Lanka", "Syrien", "Taiwan", "Tansania",
  "Thailand", "Tunesien", "Uganda", "Ukraine",
  "Vereinigte Arabische Emirate", "Uruguay", "Usbekistan",
  "Venezuela", "Vietnam", "Sambia", "Simbabwe",
];

const LANGUAGES = ["Deutsch", "Französisch", "Englisch", "Spanisch", "Italienisch", "Portugiesisch", "Arabisch", "Türkisch", "Andere"];

const MIETORTE = ["Muri bei Bern", "Kerzers", "Münchenbuchsee"];

const INITIAL = {
  // Miete
  mietbeginn: "",
  mietende: "",
  mietort: [],
  // Bewerber
  vorname: "",
  nachname: "",
  strasse: "",
  plz: "",
  ort: "",
  geburtsdatum: "",
  nationalitaet: "",
  sprache: "",
  beruf: "",
  handynummer: "",
  email: "",
  whatsapp: "Nein",
  // Firma
  firma: "",
  firmaKontaktVorname: "",
  firmaKontaktNachname: "",
  firmaStrasse: "",
  firmaPlz: "",
  firmaOrt: "",
  firmaTelefon: "",
  // Fahrzeug
  fahrzeug: "Nein",
  fahrzeugmarke: "",
  fahrzeugfarbe: "",
  kennzeichen: "",
  // Notfallkontakt
  notfallVorname: "",
  notfallNachname: "",
  notfallHandynummer: "",
  notfallEmail: "",
  // Sonstiges
  bemerkungen: "",
  akzept1: false,
  akzept2: false,
  akzept3: false,
};

// ─── PDF Generator ────────────────────────────────────────────────────────────

function generatePDF(data, docFiles) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const MARGIN = 18;
  const COL2 = W / 2 + 2;
  let y = 20;

  const addPage = () => { doc.addPage(); y = 20; };
  const checkPage = (needed = 10) => { if (y + needed > 280) addPage(); };

  // ── Logo / Header ──────────────────────────────────────────────────────────
  // Square bracket logo (left)
  doc.setDrawColor(30, 64, 175);
  doc.setLineWidth(1.2);
  const lx = MARGIN;
  // Outer bracket
  doc.line(lx, 10, lx, 28);       // left bar
  doc.line(lx, 10, lx + 5, 10);   // top bracket
  doc.line(lx, 28, lx + 5, 28);   // bottom bracket
  // Inner notch to give the "N" shape
  doc.setFillColor(30, 64, 175);
  doc.setFontSize(13);
  doc.setFont("helvetica", "black");
  doc.setTextColor(30, 64, 175);
  doc.text("N", lx + 1.5, 24);
  // "N's HOTEL" text
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text("N's HOTEL", lx + 8, 18);
  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text("LONGSTAY", lx + 8, 25);
  // Document reference (right)
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(17, 24, 39);
  doc.text("MIETANFRAGE", W - MARGIN, 20, { align: "right" });
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(107, 114, 128);
  doc.text(new Date().toLocaleDateString("de-CH"), W - MARGIN, 26, { align: "right" });
  // Separator line
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(MARGIN, 32, W - MARGIN, 32);
  y = 40;

  const sectionTitle = (title, icon = "") => {
    checkPage(14);
    doc.setFillColor(243, 244, 246);
    doc.rect(MARGIN - 2, y - 4, W - MARGIN * 2 + 4, 10, "F");
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(title, MARGIN, y + 3);
    y += 12;
  };

  const field = (label, value, x = MARGIN, w = W - MARGIN * 2) => {
    if (!value && value !== 0) return;
    const val = String(value);
    checkPage(8);
    doc.setTextColor(107, 114, 128);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.text(label, x, y);
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    const lines = doc.splitTextToSize(val, w - 2);
    doc.text(lines, x, y + 5);
    y += 5 + lines.length * 5 + 2;
  };

  const twoFields = (l1, v1, l2, v2) => {
    const halfW = (W - MARGIN * 2) / 2 - 4;
    const startY = y;
    field(l1, v1, MARGIN, halfW);
    const afterLeft = y;
    y = startY;
    field(l2, v2, COL2, halfW);
    y = Math.max(afterLeft, y);
  };

  // Section 1: Mietdetails
  sectionTitle("Angaben Miete");
  twoFields("Mietbeginn", data.mietbeginn ? new Date(data.mietbeginn).toLocaleDateString("de-CH") : "", "Mietende", data.mietende ? new Date(data.mietende).toLocaleDateString("de-CH") : "");
  field("Gewünschter Mietort", data.mietort?.join(", ") || "");
  y += 4;

  // Section 2: Bewerber
  sectionTitle("Angaben Bewerber");
  twoFields("Vorname", data.vorname, "Nachname", data.nachname);
  field("Adresse", [data.strasse, `${data.plz} ${data.ort}`.trim()].filter(Boolean).join(", "));
  twoFields("Geburtsdatum", data.geburtsdatum ? new Date(data.geburtsdatum).toLocaleDateString("de-CH") : "", "Nationalität", data.nationalitaet);
  twoFields("Sprache", data.sprache, "Beruf", data.beruf);
  twoFields("Handynummer", data.handynummer, "E-Mail", data.email);
  twoFields("WhatsApp", data.whatsapp, "", "");
  y += 4;

  // Section 3: Firma (if provided)
  if (data.firma || data.firmaTelefon) {
    sectionTitle("Angaben Firma");
    field("Firmenname", data.firma);
    twoFields("Kontaktperson Vorname", data.firmaKontaktVorname, "Kontaktperson Name", data.firmaKontaktNachname);
    field("Adresse", [data.firmaStrasse, `${data.firmaPlz} ${data.firmaOrt}`.trim()].filter(Boolean).join(", "));
    field("Telefon", data.firmaTelefon);
    y += 4;
  }

  // Section 4: Fahrzeug
  sectionTitle("Angaben Fahrzeug");
  field("Fahrzeug vorhanden", data.fahrzeug);
  if (data.fahrzeug === "Ja") {
    twoFields("Fahrzeugmarke", data.fahrzeugmarke, "Fahrzeugfarbe", data.fahrzeugfarbe);
    field("Kennzeichen", data.kennzeichen);
  }
  y += 4;

  // Section 5: Notfallkontakt
  sectionTitle("Angaben Notfallkontakt");
  twoFields("Vorname", data.notfallVorname, "Nachname", data.notfallNachname);
  twoFields("Handynummer", data.notfallHandynummer, "E-Mail", data.notfallEmail);
  y += 4;

  // Section 6: Bemerkungen
  if (data.bemerkungen) {
    sectionTitle("Bemerkungen");
    checkPage(20);
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(data.bemerkungen, W - MARGIN * 2);
    doc.text(lines, MARGIN, y);
    y += lines.length * 5 + 6;
  }

  // Section 7: Hochgeladene Dokumente
  if (docFiles && docFiles.length > 0) {
    sectionTitle("Hochgeladene Dokumente");
    docFiles.forEach((f, i) => {
      checkPage(8);
      doc.setTextColor(37, 99, 235);
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.text(`${i + 1}. ${f.name} (${(f.size / 1024).toFixed(0)} KB)`, MARGIN, y);
      y += 6;
    });
    y += 4;
  }

  // Section 8: Einwilligung
  sectionTitle("Einwilligung");
  const consents = [
    "Ich habe sämtliche Informationen dieses Gesuchs wahrheitsgetreu und richtig angegeben.",
    "Ich habe die Hausordnung gelesen und akzeptiere diese.",
    "Ich habe die Allgemeinen Geschäftsbedingungen gelesen und akzeptiere diese.",
  ];
  consents.forEach((text) => {
    checkPage(10);
    doc.setFillColor(220, 252, 231);
    doc.circle(MARGIN + 2, y + 1, 2, "F");
    doc.setTextColor(17, 24, 39);
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "normal");
    const lines = doc.splitTextToSize(text, W - MARGIN * 2 - 10);
    doc.text(lines, MARGIN + 7, y + 2);
    y += lines.length * 5 + 4;
  });
  y += 6;

  // Footer
  checkPage(15);
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.3);
  doc.line(MARGIN, y, W - MARGIN, y);
  y += 5;
  doc.setTextColor(156, 163, 175);
  doc.setFontSize(7.5);
  doc.text("Hans Amonn AG  |  Blümlisalpstrasse 4, 3074 Muri bei Bern  |  office@reto-amonn.ch  |  +41 (0)31 951 85 54", MARGIN, y);

  return doc;
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ icon: Icon, title, children, className = "" }) {
  return (
    <div className={`bg-white border border-gray-200 overflow-hidden ${className}`}>
      <div className="flex items-center gap-3 px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="w-8 h-8 bg-gray-100 flex items-center justify-center flex-shrink-0">
          <Icon size={16} style={{ color: 'var(--brand-color, #1D3D78)' }} />
        </div>
        <h3 className="text-base font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="p-6 space-y-5">{children}</div>
    </div>
  );
}

// ─── Field helpers ────────────────────────────────────────────────────────────

const inp = "w-full border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-[#1D3D78] transition bg-white";
const sel = inp + " cursor-pointer";
const lbl = "block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide";

function Field({ label, required, children, className = "" }) {
  return (
    <div className={className}>
      <label className={lbl}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}

function Grid({ children, cols = 2 }) {
  return (
    <div className={`grid gap-4 ${cols === 2 ? "md:grid-cols-2" : cols === 3 ? "md:grid-cols-3" : ""}`}>
      {children}
    </div>
  );
}

// ─── Radio button group ───────────────────────────────────────────────────────

function RadioGroup({ name, value, onChange, options }) {
  return (
    <div className="flex gap-4">
      {options.map((opt) => (
        <label key={opt} className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={onChange}
            className="accent-[#1D3D78]"
          />
          <span className="text-sm text-gray-700">{opt}</span>
        </label>
      ))}
    </div>
  );
}

// ─── File upload area ─────────────────────────────────────────────────────────

function FileUploadArea({ label, required, files, onAdd, onRemove, accept = "*", hint, uploadText }) {
  const ref = useRef(null);
  return (
    <div>
      <label className={lbl}>
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div
        onClick={() => ref.current?.click()}
        className="relative border-2 border-dashed border-gray-200 hover:border-[#1D3D78] p-5 cursor-pointer transition group bg-gray-50 hover:bg-gray-100"
      >
        <input
          ref={ref}
          type="file"
          accept={accept}
          multiple
          className="hidden"
          onChange={(e) => {
            Array.from(e.target.files || []).forEach((f) => onAdd(f));
            e.target.value = "";
          }}
        />
        <div className="flex flex-col items-center gap-2 text-gray-400 group-hover:text-[#1D3D78] transition">
          <Upload size={24} />
          <span className="text-sm font-medium">{uploadText || 'Dateien hier ablegen oder klicken'}</span>
          {hint && <span className="text-xs">{hint}</span>}
        </div>
      </div>
      {files.length > 0 && (
        <div className="mt-3 space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between bg-white border border-gray-200 px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <FileText size={14} className="flex-shrink-0" style={{ color: 'var(--brand-color, #1D3D78)' }} />
                <span className="text-xs text-gray-700 truncate">{f.name}</span>
                <span className="text-xs text-gray-400 flex-shrink-0">({(f.size / 1024).toFixed(0)} KB)</span>
              </div>
              <button type="button" onClick={() => onRemove(i)} className="p-1 hover:bg-red-50 rounded">
                <X size={12} className="text-gray-400 hover:text-gray-700" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MietanfrageForm() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(INITIAL);
  const [idFiles, setIdFiles] = useState([]);
  const [extraFiles, setExtraFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});

  // Pre-fill from query params
  useEffect(() => {
    const ort = searchParams.get("objekt");
    if (ort && MIETORTE.includes(ort)) {
      setForm((f) => ({ ...f, mietort: [ort] }));
    }
  }, [searchParams]);

  const set = (name, value) => {
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((e) => ({ ...e, [name]: undefined }));
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    set(name, type === "checkbox" ? checked : value);
  };

  const toggleMietort = (ort) => {
    setForm((f) => {
      const prev = f.mietort || [];
      return {
        ...f,
        mietort: prev.includes(ort) ? prev.filter((o) => o !== ort) : [...prev, ort],
      };
    });
  };

  const validate = () => {
    const required = t('mietanfrage.errRequired') || 'Pflichtfeld';
    const e = {};
    if (!form.mietbeginn) e.mietbeginn = required;
    if (form.mietort.length === 0) e.mietort = t('mietanfrage.errLocation') || required;
    if (!form.vorname.trim()) e.vorname = required;
    if (!form.nachname.trim()) e.nachname = required;
    if (!form.strasse.trim()) e.strasse = required;
    if (!form.plz.trim()) e.plz = required;
    if (!form.ort.trim()) e.ort = required;
    if (!form.geburtsdatum) e.geburtsdatum = required;
    if (!form.nationalitaet) e.nationalitaet = required;
    if (!form.sprache) e.sprache = required;
    if (!form.beruf.trim()) e.beruf = required;
    if (!form.handynummer.trim()) e.handynummer = required;
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t('mietanfrage.errEmail') || 'Gültige E-Mail erforderlich';
    if (idFiles.length === 0) e.idFiles = t('mietanfrage.errId') || required;
    if (!form.notfallVorname.trim() || !form.notfallNachname.trim()) e.notfall = required;
    if (!form.notfallHandynummer.trim()) e.notfallHandynummer = required;
    if (!form.notfallEmail.trim()) e.notfallEmail = required;
    if (!form.akzept1 || !form.akzept2 || !form.akzept3) e.akzept = t('mietanfrage.errConsent') || 'Bitte alle Punkte bestätigen';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      // Scroll to first error
      document.querySelector("[data-error]")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setLoading(true);
    try {
      const allFiles = [...idFiles, ...extraFiles];
      const uploadedUrls = [];

      // Upload all documents to Supabase storage
      for (const file of allFiles) {
        const ext = file.name.split(".").pop();
        const fname = `${Date.now()}-${form.vorname.replace(/\s/g, "-")}-${form.nachname.replace(/\s/g, "-")}-${file.name}`;
        const { error } = await supabase.storage.from("bewerber-dokumente").upload(fname, file);
        if (!error) uploadedUrls.push(fname);
      }

      // Save to Supabase
      await supabase.from("mietanfragen").insert([{
        vorname: form.vorname,
        nachname: form.nachname,
        email: form.email,
        telefon: form.handynummer,
        nationalitaet: form.nationalitaet,
        beruf: form.beruf,
        objekt: form.mietort.join(", "),
        nachricht: JSON.stringify({ ...form, dokumente: uploadedUrls }),
        dokument_url: uploadedUrls[0] || null,
      }]);

      // Email notification to admin (fire-and-forget — don't block on failure)
      supabase.functions.invoke('send-email', {
        body: {
          subject: `Neue Mietanfrage: ${form.vorname} ${form.nachname}`,
          html: `<h2>Neue Mietanfrage eingegangen</h2>
<table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
<tr><td style="padding:4px 12px 4px 0;color:#666">Name</td><td><strong>${form.vorname} ${form.nachname}</strong></td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#666">E-Mail</td><td>${form.email}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#666">Telefon</td><td>${form.handynummer}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#666">Objekt</td><td>${form.mietort.join(', ')}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#666">Mietbeginn</td><td>${form.mietbeginn}</td></tr>
<tr><td style="padding:4px 12px 4px 0;color:#666">Beruf</td><td>${form.beruf}</td></tr>
</table>
<p style="margin-top:16px;color:#666;font-size:12px">Vollständige Anfrage im Admin-Panel einsehen.</p>`,
          replyTo: form.email,
        },
      }).catch(() => {});

      // Generate and download PDF for the applicant
      const pdf = generatePDF(form, allFiles);
      const pdfName = `Mietanfrage_${form.vorname}_${form.nachname}_${new Date().toLocaleDateString("de-CH").replace(/\./g, "-")}.pdf`;
      pdf.save(pdfName);

      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      alert(t('mietanfrage.errSend') || "Unerwarteter Fehler beim Senden. Bitte versuchen Sie es erneut.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Success screen ───────────────────────────────────────────────────────

  if (done) {
    const successText = (t('mietanfrage.successText') || 'Vielen Dank, {{name}}!')
      .replace('{{name}}', `${form.vorname} ${form.nachname}`);
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="w-20 h-20 bg-gray-100 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} style={{ color: 'var(--brand-color, #1D3D78)' }} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">{t('mietanfrage.successTitle')}</h2>
        <p className="text-gray-600 mb-4 leading-relaxed" dangerouslySetInnerHTML={{ __html: successText.replace('\n', '<br />') }} />
        <div className="bg-gray-50 border border-gray-200 p-5 text-left mb-6">
          <p className="text-sm font-semibold text-gray-800 mb-2">{t('mietanfrage.successNext') || 'Was passiert als nächstes?'}</p>
          <ul className="text-sm text-gray-700 space-y-1.5 list-disc list-inside">
            <li>{t('mietanfrage.successPdf')}</li>
            <li>{t('mietanfrage.successReply')}</li>
            <li>{t('mietanfrage.successContact')} <a href="mailto:office@reto-amonn.ch" className="underline">office@reto-amonn.ch</a> {t('common.or') || 'oder'} +41 31 951 85 54</li>
          </ul>
        </div>
        <button
          onClick={() => { setDone(false); setForm(INITIAL); setIdFiles([]); setExtraFiles([]); }}
          className="px-6 py-3 text-white font-semibold transition text-sm"
          style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
          onMouseOver={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
          onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
        >
          {t('mietanfrage.newRequest')}
        </button>
      </div>
    );
  }

  // ─── Form ──────────────────────────────────────────────────────────────────

  const errMsg = (key) =>
    errors[key] ? (
      <p data-error className="text-xs text-red-500 mt-1 flex items-center gap-1">
        <AlertCircle size={11} /> {errors[key]}
      </p>
    ) : null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">{t('mietanfrage.title')}</h1>
        <p className="text-gray-500 text-base leading-relaxed max-w-2xl">
          {t('mietanfrage.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-6">

        {/* ── 1. Angaben Miete ── */}
        <Section icon={CalendarDays} title={t('mietanfrage.sectionMiete')}>
          <Grid>
            <Field label={t('mietanfrage.mietbeginn')} required>
              <input type="date" name="mietbeginn" value={form.mietbeginn} onChange={handleChange} className={inp} />
              {errMsg("mietbeginn")}
            </Field>
            <Field label={t('mietanfrage.mietende')}>
              <input type="date" name="mietende" value={form.mietende} onChange={handleChange} className={inp} />
            </Field>
          </Grid>

          <Field label={t('mietanfrage.mietort')} required>
            <div className="flex flex-wrap gap-3 mt-1">
              {MIETORTE.map((ort) => (
                <button
                  key={ort}
                  type="button"
                  onClick={() => toggleMietort(ort)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-2 transition ${
                    form.mietort.includes(ort)
                      ? "border-[#1D3D78] bg-gray-50 text-[#1D3D78]"
                      : "border-gray-200 bg-white text-gray-600 hover:border-[#1D3D78]"
                  }`}
                >
                  <MapPin size={13} />
                  {ort}
                </button>
              ))}
            </div>
            {errMsg("mietort")}
          </Field>
        </Section>

        {/* ── 2. Angaben Bewerber ── */}
        <Section icon={User} title={t('mietanfrage.sectionBewerber')}>
          <Grid>
            <Field label={t('mietanfrage.vorname')} required>
              <input name="vorname" value={form.vorname} onChange={handleChange} placeholder={t('mietanfrage.vorname')} className={inp} />
              {errMsg("vorname")}
            </Field>
            <Field label={t('mietanfrage.nachname')} required>
              <input name="nachname" value={form.nachname} onChange={handleChange} placeholder={t('mietanfrage.nachname')} className={inp} />
              {errMsg("nachname")}
            </Field>
          </Grid>

          <Field label={t('mietanfrage.strasse')} required>
            <input name="strasse" value={form.strasse} onChange={handleChange} placeholder="Strasse und Hausnummer" className={inp} />
            {errMsg("strasse")}
          </Field>
          <Grid cols={2}>
            <Field label={t('mietanfrage.plz')} required>
              <input name="plz" value={form.plz} onChange={handleChange} placeholder="PLZ" className={inp} />
              {errMsg("plz")}
            </Field>
            <Field label={t('mietanfrage.ort')} required>
              <input name="ort" value={form.ort} onChange={handleChange} placeholder={t('mietanfrage.ort')} className={inp} />
              {errMsg("ort")}
            </Field>
          </Grid>

          <Grid>
            <Field label={t('mietanfrage.geburtsdatum')} required>
              <input type="date" name="geburtsdatum" value={form.geburtsdatum} onChange={handleChange} className={inp} />
              {errMsg("geburtsdatum")}
            </Field>
            <Field label={t('mietanfrage.nationalitaet')} required>
              <select name="nationalitaet" value={form.nationalitaet} onChange={handleChange} className={sel}>
                <option value="">{t('common.selectOption') || 'Bitte wählen...'}</option>
                {NATIONALITIES.map((n) => <option key={n}>{n}</option>)}
              </select>
              {errMsg("nationalitaet")}
            </Field>
          </Grid>

          <Grid>
            <Field label={t('mietanfrage.sprache')} required>
              <select name="sprache" value={form.sprache} onChange={handleChange} className={sel}>
                <option value="">{t('common.selectOption') || 'Bitte wählen...'}</option>
                {LANGUAGES.map((l) => <option key={l}>{l}</option>)}
              </select>
              {errMsg("sprache")}
            </Field>
            <Field label={t('mietanfrage.beruf')} required>
              <input name="beruf" value={form.beruf} onChange={handleChange} placeholder={t('mietanfrage.beruf')} className={inp} />
              {errMsg("beruf")}
            </Field>
          </Grid>

          <Grid>
            <Field label={t('mietanfrage.handynummer')} required>
              <input name="handynummer" value={form.handynummer} onChange={handleChange} placeholder="+41 79 000 00 00" className={inp} />
              {errMsg("handynummer")}
            </Field>
            <Field label={t('mietanfrage.email')} required>
              <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="beispiel@gmail.com" className={inp} />
              {errMsg("email")}
            </Field>
          </Grid>

          <Field label={t('mietanfrage.whatsapp')}>
            <RadioGroup name="whatsapp" value={form.whatsapp} onChange={handleChange} options={["Ja", "Nein"]} />
          </Field>

          <FileUploadArea
            label={t('mietanfrage.idUpload')}
            required
            files={idFiles}
            onAdd={(f) => setIdFiles((prev) => [...prev, f])}
            onRemove={(i) => setIdFiles((prev) => prev.filter((_, idx) => idx !== i))}
            accept="image/*,.pdf"
            hint={t('mietanfrage.idHint')}
            uploadText={t('mietanfrage.uploadArea')}
          />
          {errors.idFiles && (
            <p data-error className="text-xs text-red-500 flex items-center gap-1">
              <AlertCircle size={11} /> {errors.idFiles}
            </p>
          )}

          <FileUploadArea
            label={t('mietanfrage.extraDocs')}
            files={extraFiles}
            onAdd={(f) => setExtraFiles((prev) => [...prev, f])}
            onRemove={(i) => setExtraFiles((prev) => prev.filter((_, idx) => idx !== i))}
            hint={t('mietanfrage.extraDocsHint')}
            uploadText={t('mietanfrage.uploadArea')}
          />
        </Section>

        {/* ── 3. Angaben Firma ── */}
        <Section icon={Building2} title={t('mietanfrage.sectionFirma')}>
          <p className="text-xs text-gray-400 -mt-1">{t('mietanfrage.sectionFirmaHint')}</p>
          <Field label={t('mietanfrage.firma')}>
            <input name="firma" value={form.firma} onChange={handleChange} placeholder={t('mietanfrage.firma')} className={inp} />
          </Field>
          <Grid>
            <Field label={t('mietanfrage.firmaKontaktVorname')}>
              <input name="firmaKontaktVorname" value={form.firmaKontaktVorname} onChange={handleChange} placeholder={t('mietanfrage.vorname')} className={inp} />
            </Field>
            <Field label={t('mietanfrage.firmaKontaktNachname')}>
              <input name="firmaKontaktNachname" value={form.firmaKontaktNachname} onChange={handleChange} placeholder={t('mietanfrage.nachname')} className={inp} />
            </Field>
          </Grid>
          <Field label={t('mietanfrage.firmaStrasse')}>
            <input name="firmaStrasse" value={form.firmaStrasse} onChange={handleChange} placeholder="Strasse und Hausnummer" className={inp} />
          </Field>
          <Grid>
            <Field label={t('mietanfrage.firmaPlz')}>
              <input name="firmaPlz" value={form.firmaPlz} onChange={handleChange} placeholder="PLZ" className={inp} />
            </Field>
            <Field label={t('mietanfrage.firmaOrt')}>
              <input name="firmaOrt" value={form.firmaOrt} onChange={handleChange} placeholder={t('mietanfrage.ort')} className={inp} />
            </Field>
          </Grid>
          <Field label={t('mietanfrage.firmaTelefon')}>
            <input name="firmaTelefon" value={form.firmaTelefon} onChange={handleChange} placeholder="+41 31 000 00 00" className={inp} />
          </Field>
        </Section>

        {/* ── 4. Angaben Fahrzeug ── */}
        <Section icon={Car} title={t('mietanfrage.sectionFahrzeug')}>
          <Field label={t('mietanfrage.fahrzeugVorhanden')}>
            <RadioGroup name="fahrzeug" value={form.fahrzeug} onChange={handleChange} options={["Ja", "Nein"]} />
          </Field>
          {form.fahrzeug === "Ja" && (
            <Grid cols={3}>
              <Field label={t('mietanfrage.fahrzeugmarke')}>
                <input name="fahrzeugmarke" value={form.fahrzeugmarke} onChange={handleChange} placeholder="z.B. VW, BMW" className={inp} />
              </Field>
              <Field label={t('mietanfrage.fahrzeugfarbe')}>
                <input name="fahrzeugfarbe" value={form.fahrzeugfarbe} onChange={handleChange} placeholder="z.B. Schwarz" className={inp} />
              </Field>
              <Field label={t('mietanfrage.kennzeichen')}>
                <input name="kennzeichen" value={form.kennzeichen} onChange={handleChange} placeholder="z.B. BE 123 456" className={inp} />
              </Field>
            </Grid>
          )}
        </Section>

        {/* ── 5. Notfallkontakt ── */}
        <Section icon={PhoneCall} title={t('mietanfrage.sectionNotfall')}>
          <Grid>
            <Field label={t('mietanfrage.notfallVorname')} required>
              <input name="notfallVorname" value={form.notfallVorname} onChange={handleChange} placeholder={t('mietanfrage.vorname')} className={inp} />
            </Field>
            <Field label={t('mietanfrage.notfallNachname')} required>
              <input name="notfallNachname" value={form.notfallNachname} onChange={handleChange} placeholder={t('mietanfrage.nachname')} className={inp} />
            </Field>
          </Grid>
          {errMsg("notfall")}
          <Grid>
            <Field label={t('mietanfrage.notfallHandynummer')} required>
              <input name="notfallHandynummer" value={form.notfallHandynummer} onChange={handleChange} placeholder="+41 79 000 00 00" className={inp} />
              {errMsg("notfallHandynummer")}
            </Field>
            <Field label={t('mietanfrage.notfallEmail')} required>
              <input name="notfallEmail" value={form.notfallEmail} onChange={handleChange} placeholder="beispiel@gmail.com" className={inp} />
              {errMsg("notfallEmail")}
            </Field>
          </Grid>
        </Section>

        {/* ── 6. Bemerkungen ── */}
        <Section icon={FileText} title={t('mietanfrage.sectionBemerkungen')}>
          <textarea
            name="bemerkungen"
            rows={4}
            value={form.bemerkungen}
            onChange={handleChange}
            placeholder={t('mietanfrage.bemerkungen')}
            className={inp}
          />
        </Section>

        {/* ── 7. Einwilligung ── */}
        <Section icon={CheckSquare} title={t('mietanfrage.sectionEinwilligung')}>
          {[
            { key: "akzept1", text: t('mietanfrage.consent1') },
            { key: "akzept2", text: t('mietanfrage.consent2') },
            { key: "akzept3", text: t('mietanfrage.consent3') },
          ].map(({ key, text }) => (
            <label key={key} className="flex items-start gap-3 cursor-pointer group">
              <div className={`mt-0.5 w-5 h-5 border-2 flex items-center justify-center flex-shrink-0 transition ${form[key] ? "border-[#1D3D78] bg-[#1D3D78]" : "border-gray-300 group-hover:border-[#1D3D78]"}`}>
                {form[key] && <CheckCircle2 size={12} className="text-white" />}
              </div>
              <input type="checkbox" name={key} checked={form[key]} onChange={handleChange} className="sr-only" />
              <span className="text-sm text-gray-700 leading-relaxed">{text}</span>
            </label>
          ))}
          {errMsg("akzept")}

          <div className="bg-gray-50 border border-gray-200 p-4 mt-2">
            <p className="text-xs text-gray-600 flex items-start gap-2">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              {t('mietanfrage.pdfNote')}
            </p>
          </div>
        </Section>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 disabled:opacity-60 text-white font-bold py-4 px-8 text-base transition"
          style={{ backgroundColor: 'var(--brand-color, #1D3D78)' }}
          onMouseOver={e => !loading && e.currentTarget.style.setProperty('background-color', 'var(--brand-color-dark, #162E5A)')}
          onMouseOut={e => e.currentTarget.style.setProperty('background-color', 'var(--brand-color, #1D3D78)')}
        >
          {loading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              {t('mietanfrage.submitting')}
            </>
          ) : (
            <>
              <CheckCircle2 size={20} />
              {t('mietanfrage.submit')}
            </>
          )}
        </button>
      </form>
    </div>
  );
}
