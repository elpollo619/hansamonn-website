<<<<<<< HEAD
import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

const NATIONALITIES = [
  "Afghanistan",
  "Albanien",
  "Algerien",
  "Andorra",
  "Angola",
  "Argentinien",
  "Armenien",
  "Australien",
  "Österreich",
  "Aserbaidschan",
  "Bahamas",
  "Bahrain",
  "Bangladesch",
  "Barbados",
  "Belgien",
  "Belize",
  "Benin",
  "Bhutan",
  "Bolivien",
  "Bosnien und Herzegowina",
  "Botswana",
  "Brasilien",
  "Brunei",
  "Bulgarien",
  "Burkina Faso",
  "Burundi",
  "Kambodscha",
  "Kamerun",
  "Kanada",
  "Chile",
  "China",
  "Kolumbien",
  "Kroatien",
  "Kuba",
  "Zypern",
  "Tschechien",
  "Dänemark",
  "Dominikanische Republik",
  "Ecuador",
  "Ägypten",
  "El Salvador",
  "Estland",
  "Äthiopien",
  "Finnland",
  "Frankreich",
  "Georgien",
  "Deutschland",
  "Ghana",
  "Griechenland",
  "Guatemala",
  "Honduras",
  "Ungarn",
  "Island",
  "Indien",
  "Indonesien",
  "Iran",
  "Irak",
  "Irland",
  "Israel",
  "Italien",
  "Japan",
  "Jordanien",
  "Kenia",
  "Kuwait",
  "Laos",
  "Lettland",
  "Libanon",
  "Liechtenstein",
  "Litauen",
  "Luxemburg",
  "Malaysia",
  "Malta",
  "Mexiko",
  "Monaco",
  "Mongolei",
  "Marokko",
  "Namibia",
  "Nepal",
  "Niederlande",
  "Neuseeland",
  "Nigeria",
  "Norwegen",
  "Pakistan",
  "Panama",
  "Paraguay",
  "Peru",
  "Philippinen",
  "Polen",
  "Portugal",
  "Rumänien",
  "Russland",
  "Saudi-Arabien",
  "Serbien",
  "Singapur",
  "Slowakei",
  "Slowenien",
  "Südafrika",
  "Südkorea",
  "Spanien",
  "Sri Lanka",
  "Schweden",
  "Schweiz",
  "Syrien",
  "Taiwan",
  "Tansania",
  "Thailand",
  "Tunesien",
  "Türkei",
  "Uganda",
  "Ukraine",
  "Vereinigte Arabische Emirate",
  "Vereinigtes Königreich",
  "USA",
  "Uruguay",
  "Usbekistan",
  "Venezuela",
  "Vietnam",
  "Sambia",
  "Simbabwe",
];

const INITIAL_FORM = {
  anfrageart: "",
  objekt: "",
  mietbeginn: "",
  mietende: "",
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
  whatsapp: "",
  firmaMiete: "Privat",
  firma: "",
  kontaktpersonVorname: "",
  kontaktpersonName: "",
  firmaStrasse: "",
  firmaPlz: "",
  firmaOrt: "",
  firmaTelefon: "",
  fahrzeug: "Nein",
  fahrzeugmarke: "",
  fahrzeugfarbe: "",
  kennzeichen: "",
  notfallVorname: "",
  notfallNachname: "",
  notfallHandynummer: "",
  notfallEmail: "",
  bemerkungen: "",
  akzeptiert: false,
};

export default function MietanfrageForm() {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [dokument, setDokument] = useState(null);
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-sky-200 focus:border-sky-400";
  const titleClass = "text-2xl font-bold text-slate-900 mb-6";
  const labelClass = "block text-sm font-semibold mb-2 text-slate-800";
  const sectionClass = "rounded-2xl border border-slate-200 bg-white p-6 md:p-8";

  const objectOptions = useMemo(() => {
    switch (formData.anfrageart) {
      case "Long Stay":
        return ["Kerzers", "Münchenbuchsee", "Muri bei Bern"];
      case "Short Stay":
        return ["N's Hotel", "Casa Reto"];
      case "Apartment":
        return ["Instrasse", "Weiteres Apartment", "Anderes Objekt"];
      default:
        return [];
    }
  }, [formData.anfrageart]);

  const isShortStay = formData.anfrageart === "Short Stay";
  const isLongStay = formData.anfrageart === "Long Stay";
  const isApartment = formData.anfrageart === "Apartment";
  const showFullRentalFields = isLongStay || isApartment;
  const showCompanyFields = showFullRentalFields && formData.firmaMiete === "Firma";
  const showVehicleDetails = showFullRentalFields && formData.fahrzeug === "Ja";
  const showDocumentUpload = showFullRentalFields;

  useEffect(() => {
    const queryAnfrageart = searchParams.get("anfrageart") || "";
    const queryObjekt = searchParams.get("objekt") || "";

    if (!queryAnfrageart && !queryObjekt) return;

    const validObjectsByType = {
      "Long Stay": ["Kerzers", "Münchenbuchsee", "Muri bei Bern"],
      "Short Stay": ["N's Hotel", "Casa Reto"],
      Apartment: ["Instrasse", "Weiteres Apartment", "Anderes Objekt"],
    };

    const validAnfrageart = Object.keys(validObjectsByType).includes(queryAnfrageart)
      ? queryAnfrageart
      : "";

    const validObjekt =
      validAnfrageart && validObjectsByType[validAnfrageart].includes(queryObjekt)
        ? queryObjekt
        : "";

    setFormData((prev) => ({
      ...prev,
      anfrageart: validAnfrageart,
      objekt: validObjekt,
    }));
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "anfrageart"
        ? {
            objekt: "",
            mietbeginn: "",
            mietende: "",
          }
        : {}),
      ...(name === "firmaMiete" && value === "Privat"
        ? {
            firma: "",
            kontaktpersonVorname: "",
            kontaktpersonName: "",
            firmaStrasse: "",
            firmaPlz: "",
            firmaOrt: "",
            firmaTelefon: "",
          }
        : {}),
      ...(name === "fahrzeug" && value === "Nein"
        ? {
            fahrzeugmarke: "",
            fahrzeugfarbe: "",
            kennzeichen: "",
          }
        : {}),
    }));
  };

  const handleFileChange = (e) => {
    setDokument(e.target.files?.[0] || null);
  };

  const validateForm = () => {
    if (!formData.anfrageart) {
      alert("Bitte wählen Sie eine Anfrageart.");
      return false;
    }

    if (!formData.objekt) {
      alert("Bitte wählen Sie ein Objekt.");
      return false;
    }

    if (!formData.vorname || !formData.nachname) {
      alert("Bitte geben Sie Vorname und Nachname an.");
      return false;
    }

    if (!formData.email) {
      alert("Bitte geben Sie eine E-Mail-Adresse an.");
      return false;
    }

    if (!formData.akzeptiert) {
      alert("Bitte akzeptieren Sie die Bedingungen.");
      return false;
    }

    if (showFullRentalFields && !formData.handynummer) {
      alert("Bitte geben Sie eine Handynummer an.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      let dokumentUrl = null;

      if (dokument && showDocumentUpload) {
        const fileExt = dokument.name.split(".").pop();
        const safeVorname =
          formData.vorname?.trim().replace(/\s+/g, "-") || "vorname";
        const safeNachname =
          formData.nachname?.trim().replace(/\s+/g, "-") || "nachname";

        const fileName = `${Date.now()}-${safeVorname}-${safeNachname}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("bewerber-dokumente")
          .upload(fileName, dokument);

        if (uploadError) {
          console.error(uploadError);
          alert("Fehler beim Hochladen des Dokuments.");
          setLoading(false);
          return;
        }

        dokumentUrl = fileName;
      }

      const fullPayload = {
        ...formData,
        dokument_url: dokumentUrl,
      };

      const { error: insertError } = await supabase.from("mietanfragen").insert([
        {
          vorname: formData.vorname,
          nachname: formData.nachname,
          email: formData.email,
          telefon: formData.handynummer,
          nationalitaet: formData.nationalitaet,
          beruf: formData.beruf,
          objekt: `${formData.anfrageart} - ${formData.objekt}`,
          nachricht: JSON.stringify(fullPayload),
          dokument_url: dokumentUrl,
        },
      ]);

      if (insertError) {
        console.error(insertError);
        alert("Fehler beim Senden der Anfrage.");
        setLoading(false);
        return;
      }

      alert("Vielen Dank. Ihre Anfrage wurde erfolgreich gesendet.");

      setFormData({
        ...INITIAL_FORM,
        anfrageart: formData.anfrageart,
        objekt: formData.objekt,
      });
      setDokument(null);
      e.target.reset();
    } catch (error) {
      console.error(error);
      alert("Unerwarteter Fehler beim Senden.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 md:p-10 mt-10">
      <div className="max-w-5xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900">
          Mietanfrage
        </h2>

        <p className="text-slate-600 text-lg leading-8 mb-10 max-w-4xl">
          Nutzen Sie dieses Formular für Apartments, Long Stay oder Short Stay.
          Wählen Sie zuerst die Art Ihrer Anfrage und das gewünschte Objekt.
          Für Long Stay und Apartments stehen zusätzliche Felder zur Verfügung,
          ähnlich wie auf Ihrer bisherigen Webseite.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className={sectionClass}>
          <h3 className={titleClass}>1. Anfrage auswählen</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Anfrageart *</label>
              <select
                name="anfrageart"
                value={formData.anfrageart}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">Bitte wählen...</option>
                <option value="Apartment">Apartment</option>
                <option value="Long Stay">Long Stay</option>
                <option value="Short Stay">Short Stay</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Objekt *</label>
              <select
                name="objekt"
                value={formData.objekt}
                onChange={handleChange}
                className={inputClass}
                disabled={!formData.anfrageart}
              >
                <option value="">
                  {formData.anfrageart
                    ? "Bitte wählen..."
                    : "Bitte zuerst Anfrageart wählen"}
                </option>
                {objectOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {showFullRentalFields && (
          <div className={sectionClass}>
            <h3 className={titleClass}>2. Mietdetails</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Mietbeginn</label>
                <input
                  type="date"
                  name="mietbeginn"
                  value={formData.mietbeginn}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Mietende</label>
                <input
                  type="date"
                  name="mietende"
                  value={formData.mietende}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}

        <div className={sectionClass}>
          <h3 className={titleClass}>
            {isShortStay ? "2. Kontaktperson" : "3. Angaben Bewerber"}
          </h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Vorname *</label>
              <input
                name="vorname"
                value={formData.vorname}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Nachname *</label>
              <input
                name="nachname"
                value={formData.nachname}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {!isShortStay && (
            <>
              <div className="mt-6">
                <label className={labelClass}>Adresse</label>
                <input
                  name="strasse"
                  value={formData.strasse}
                  onChange={handleChange}
                  placeholder="Strasse"
                  className={inputClass}
                />
              </div>

              <div className="grid md:grid-cols-[180px_1fr] gap-6 mt-6">
                <div>
                  <label className={labelClass}>PLZ</label>
                  <input
                    name="plz"
                    value={formData.plz}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Ort</label>
                  <input
                    name="ort"
                    value={formData.ort}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className={labelClass}>Geburtsdatum</label>
                  <input
                    type="date"
                    name="geburtsdatum"
                    value={formData.geburtsdatum}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Nationalität</label>
                  <select
                    name="nationalitaet"
                    value={formData.nationalitaet}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Bitte wählen...</option>
                    {NATIONALITIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className={labelClass}>Sprache</label>
                  <select
                    name="sprache"
                    value={formData.sprache}
                    onChange={handleChange}
                    className={inputClass}
                  >
                    <option value="">Bitte wählen...</option>
                    <option>Deutsch</option>
                    <option>Französisch</option>
                    <option>Englisch</option>
                    <option>Spanisch</option>
                    <option>Italienisch</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Beruf *</label>
                  <input
                    name="beruf"
                    value={formData.beruf}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            </>
          )}

          <div className="grid md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className={labelClass}>
                {isShortStay ? "Telefon" : "Handynummer *"}
              </label>
              <input
                name="handynummer"
                value={formData.handynummer}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>E-Mail *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          {!isShortStay && (
            <div className="mt-6">
              <label className={labelClass}>WhatsApp</label>
              <div className="flex gap-6">
                {["Ja", "Nein"].map((item) => (
                  <label key={item} className="flex items-center gap-2 text-slate-700">
                    <input
                      type="radio"
                      name="whatsapp"
                      value={item}
                      checked={formData.whatsapp === item}
                      onChange={handleChange}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6">
            <label className={labelClass}>Bemerkungen / Nachricht</label>
            <textarea
              name="bemerkungen"
              rows="5"
              value={formData.bemerkungen}
              onChange={handleChange}
              className={inputClass}
              placeholder={
                isShortStay
                  ? "Bitte teilen Sie uns Reisezeitraum, Anzahl Gäste oder besondere Wünsche mit."
                  : "Zusätzliche Informationen zu Ihrer Anfrage."
              }
            />
          </div>

          {showDocumentUpload && (
            <div className="mt-6">
              <label className={labelClass}>Passkopie / ID</label>
              <input
                type="file"
                name="dokument"
                onChange={handleFileChange}
                className={inputClass}
              />
              <p className="text-sm text-slate-500 mt-2">
                Optional. Dokumente werden sicher gespeichert.
              </p>
            </div>
          )}
        </div>

        {showFullRentalFields && (
          <div className={sectionClass}>
            <h3 className={titleClass}>4. Mietart</h3>

            <div className="flex flex-wrap gap-6">
              {["Privat", "Firma"].map((item) => (
                <label key={item} className="flex items-center gap-2 text-slate-700">
                  <input
                    type="radio"
                    name="firmaMiete"
                    value={item}
                    checked={formData.firmaMiete === item}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>
        )}

        {showCompanyFields && (
          <div className={sectionClass}>
            <h3 className={titleClass}>5. Angaben Firma</h3>

            <div>
              <label className={labelClass}>Firma</label>
              <input
                name="firma"
                value={formData.firma}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className={labelClass}>Kontaktperson Vorname</label>
                <input
                  name="kontaktpersonVorname"
                  value={formData.kontaktpersonVorname}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Kontaktperson Name</label>
                <input
                  name="kontaktpersonName"
                  value={formData.kontaktpersonName}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className={labelClass}>Adresse</label>
              <input
                name="firmaStrasse"
                value={formData.firmaStrasse}
                onChange={handleChange}
                className={inputClass}
              />
            </div>

            <div className="grid md:grid-cols-[180px_1fr] gap-6 mt-6">
              <div>
                <label className={labelClass}>PLZ</label>
                <input
                  name="firmaPlz"
                  value={formData.firmaPlz}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Ort</label>
                <input
                  name="firmaOrt"
                  value={formData.firmaOrt}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="mt-6">
              <label className={labelClass}>Telefonnummer</label>
              <input
                name="firmaTelefon"
                value={formData.firmaTelefon}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>
        )}

        {showFullRentalFields && (
          <div className={sectionClass}>
            <h3 className={titleClass}>6. Angaben Fahrzeug</h3>

            <div className="flex flex-wrap gap-6">
              {["Ja", "Nein"].map((item) => (
                <label key={item} className="flex items-center gap-2 text-slate-700">
                  <input
                    type="radio"
                    name="fahrzeug"
                    value={item}
                    checked={formData.fahrzeug === item}
                    onChange={handleChange}
                  />
                  {item}
                </label>
              ))}
            </div>

            {showVehicleDetails && (
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                <div>
                  <label className={labelClass}>Fahrzeugmarke</label>
                  <input
                    name="fahrzeugmarke"
                    value={formData.fahrzeugmarke}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Fahrzeugfarbe</label>
                  <input
                    name="fahrzeugfarbe"
                    value={formData.fahrzeugfarbe}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className={labelClass}>Kennzeichen</label>
                  <input
                    name="kennzeichen"
                    value={formData.kennzeichen}
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {showFullRentalFields && (
          <div className={sectionClass}>
            <h3 className={titleClass}>7. Angaben Notfallkontakt</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Vorname</label>
                <input
                  name="notfallVorname"
                  value={formData.notfallVorname}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Nachname</label>
                <input
                  name="notfallNachname"
                  value={formData.notfallNachname}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className={labelClass}>Handynummer</label>
                <input
                  name="notfallHandynummer"
                  value={formData.notfallHandynummer}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>E-Mail</label>
                <input
                  name="notfallEmail"
                  value={formData.notfallEmail}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        )}

        <div className={sectionClass}>
          <h3 className={titleClass}>
            {showFullRentalFields ? "8. Einwilligung" : "3. Einwilligung"}
          </h3>

          <label className="flex items-start gap-4">
            <input
              type="checkbox"
              name="akzeptiert"
              checked={formData.akzeptiert}
              onChange={handleChange}
            />
            <span className="text-slate-700 leading-7">
              Ich bestätige, dass meine Angaben korrekt sind und dass meine Anfrage
              für den gewählten Bereich bearbeitet werden darf.
            </span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="mt-8 bg-sky-600 text-white px-8 py-4 rounded-xl w-full text-lg font-semibold hover:bg-sky-700 disabled:opacity-60"
          >
            {loading ? "Wird gesendet..." : "Mietanfrage absenden"}
          </button>
        </div>
      </form>
    </div>
  );
}
=======
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, Calendar, Users,
  MessageSquare, CheckCircle2, ChevronRight, ChevronLeft,
  Send, Check, ArrowRight,
} from 'lucide-react';
import { useTranslation } from '@/i18n';
import { getMietanfrageOptions } from '@/data/rentalData';

// ─── Progress bar ────────────────────────────────────────────────────────────

const ProgressBar = ({ step, total }) => (
  <div className="flex items-center gap-0">
    {Array.from({ length: total }, (_, i) => (
      <React.Fragment key={i}>
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all duration-300 ${
          step > i + 1
            ? 'bg-gray-900 text-white'
            : step === i + 1
            ? 'bg-gray-900 text-white ring-4 ring-gray-900/10'
            : 'bg-gray-100 text-gray-400'
        }`}>
          {step > i + 1 ? <Check size={13} /> : i + 1}
        </div>
        {i < total - 1 && (
          <div className={`flex-1 h-px mx-1 transition-colors duration-300 ${step > i + 1 ? 'bg-gray-900' : 'bg-gray-200'}`} />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ─── Input primitives ────────────────────────────────────────────────────────

const inputBase = (err) =>
  `w-full border rounded-xl px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
    err ? 'border-red-300 bg-red-50/50' : 'border-gray-200 bg-white hover:border-gray-300'
  }`;

const Field = ({ label, required, hint, error, children }) => (
  <div className="space-y-1.5">
    <div className="flex items-baseline justify-between">
      <label className="text-sm font-medium text-gray-900">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {hint && <span className="text-xs text-gray-400">{hint}</span>}
    </div>
    {children}
    {error && <p className="text-xs text-red-500 flex items-center gap-1"><span>↑</span>{error}</p>}
  </div>
);

// ─── Duration options ────────────────────────────────────────────────────────

const DURATIONS = [
  { value: '1month',  label: '1 Monat' },
  { value: '3months', label: '3 Monate' },
  { value: '6months', label: '6 Monate' },
  { value: '12months',label: '12 Monate' },
  { value: '24months',label: '24+ Monate' },
  { value: 'open',    label: 'Offen / unbefristet' },
];

// ─── Main component ──────────────────────────────────────────────────────────

const TOTAL = 5;

const MietanfrageForm = ({ preselectedSlug, onSuccess }) => {
  const { t }    = useTranslation();
  const options  = getMietanfrageOptions();

  const [step, setStep]     = useState(1);
  const [done, setDone]     = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm]     = useState({
    firstName: '',
    lastName:  '',
    email:     '',
    phone:     '',
    interest:  preselectedSlug || options[0]?.value || '',
    moveIn:    '',
    duration:  '',
    people:    '1',
    message:   '',
    agb:       false,
  });

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validate = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.firstName.trim()) e.firstName = 'Pflichtfeld';
      if (!form.lastName.trim())  e.lastName  = 'Pflichtfeld';
      if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Gültige E-Mail eingeben';
      if (!form.phone.trim())     e.phone     = 'Pflichtfeld';
    }
    if (s === 2) {
      if (!form.interest) e.interest = 'Bitte auswählen';
    }
    if (s === 3) {
      if (!form.moveIn)   e.moveIn   = 'Pflichtfeld';
      if (!form.duration) e.duration = 'Bitte auswählen';
    }
    if (s === 5) {
      if (!form.agb) e.agb = 'Bitte bestätigen';
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep((s) => Math.min(s + 1, TOTAL));
  };

  const back = () => {
    setErrors({});
    setStep((s) => Math.max(s - 1, 1));
  };

  const submit = () => {
    const e = validate(5);
    if (Object.keys(e).length) { setErrors(e); return; }

    const label    = options.find((o) => o.value === form.interest)?.label ?? form.interest;
    const duration = DURATIONS.find((d) => d.value === form.duration)?.label ?? form.duration;

    const body = [
      `Name: ${form.firstName} ${form.lastName}`,
      `E-Mail: ${form.email}`,
      `Telefon: ${form.phone}`,
      '',
      `Interesse: ${label}`,
      `Einzug: ${form.moveIn}`,
      `Dauer: ${duration}`,
      `Personen: ${form.people}`,
      form.message ? `\nNachricht:\n${form.message}` : '',
    ].filter(Boolean).join('\n');

    window.location.href = `mailto:office@reto-amonn.ch?subject=${encodeURIComponent(`Anfrage – ${label}`)}&body=${encodeURIComponent(body)}`;
    setDone(true);
    onSuccess?.();
  };

  // ── Success ────────────────────────────────────────────────────────────────

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6"
      >
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 size={28} className="text-green-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {t('vermietung.mietanfrage.successTitle')}
        </h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          {t('vermietung.mietanfrage.successText')}
        </p>
      </motion.div>
    );
  }

  const stepTitles = [
    t('vermietung.mietanfrage.step1'),
    t('vermietung.mietanfrage.step2'),
    t('vermietung.mietanfrage.step3'),
    t('vermietung.mietanfrage.step4'),
    t('vermietung.mietanfrage.step5'),
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 pt-6 pb-5 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-gray-900">
              {t('vermietung.mietanfrage.title')}
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">{stepTitles[step - 1]}</p>
          </div>
          <span className="text-xs text-gray-400 font-medium">
            {step} / {TOTAL}
          </span>
        </div>
        <ProgressBar step={step} total={TOTAL} />
      </div>

      {/* Step content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.18 }}
            className="space-y-4"
          >

            {/* Step 1 — Personal */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Vorname" required error={errors.firstName}>
                    <input type="text" autoComplete="given-name" value={form.firstName}
                      onChange={(e) => set('firstName', e.target.value)}
                      className={inputBase(errors.firstName)} placeholder="Hans" />
                  </Field>
                  <Field label="Nachname" required error={errors.lastName}>
                    <input type="text" autoComplete="family-name" value={form.lastName}
                      onChange={(e) => set('lastName', e.target.value)}
                      className={inputBase(errors.lastName)} placeholder="Muster" />
                  </Field>
                </div>
                <Field label="E-Mail" required error={errors.email}>
                  <input type="email" autoComplete="email" value={form.email}
                    onChange={(e) => set('email', e.target.value)}
                    className={inputBase(errors.email)} placeholder="hans@muster.ch" />
                </Field>
                <Field label="Telefon" required error={errors.phone}>
                  <input type="tel" autoComplete="tel" value={form.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    className={inputBase(errors.phone)} placeholder="+41 79 000 00 00" />
                </Field>
              </>
            )}

            {/* Step 2 — Interest */}
            {step === 2 && (
              <Field label="Was interessiert Sie?" required error={errors.interest}>
                <div className="space-y-2">
                  {options.map((o) => (
                    <label
                      key={o.value}
                      className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                        form.interest === o.value
                          ? 'border-gray-900 bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                        form.interest === o.value ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
                      }`}>
                        {form.interest === o.value && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                      <input type="radio" name="interest" value={o.value} checked={form.interest === o.value}
                        onChange={(e) => set('interest', e.target.value)} className="sr-only" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{o.label}</p>
                        <p className="text-xs text-gray-400">{o.group}</p>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.interest && <p className="text-xs text-red-500">{errors.interest}</p>}
              </Field>
            )}

            {/* Step 3 — Dates & people */}
            {step === 3 && (
              <>
                <Field label="Gewünschter Einzug / Ankunft" required error={errors.moveIn}>
                  <input type="date" value={form.moveIn}
                    onChange={(e) => set('moveIn', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={inputBase(errors.moveIn)} />
                </Field>
                <Field label="Aufenthaltsdauer" required error={errors.duration}>
                  <select value={form.duration} onChange={(e) => set('duration', e.target.value)}
                    className={inputBase(errors.duration)}>
                    <option value="">Bitte wählen…</option>
                    {DURATIONS.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Anzahl Personen" hint="optional">
                  <div className="flex items-center gap-2">
                    {['1', '2', '3', '4', '5+'].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => set('people', n)}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${
                          form.people === n
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </Field>
              </>
            )}

            {/* Step 4 — Optional message */}
            {step === 4 && (
              <>
                <Field label="Nachricht" hint="optional">
                  <textarea rows={5} value={form.message}
                    onChange={(e) => set('message', e.target.value)}
                    className={`${inputBase(false)} resize-none`}
                    placeholder="Besondere Wünsche, Fragen, oder weitere Angaben…" />
                </Field>
                <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-500 space-y-1">
                  <p className="font-medium text-gray-700">Dokumente</p>
                  <p>Betreibungsregister, Lohnausweis oder andere Unterlagen können Sie nach Ihrer Anfrage per E-Mail senden an:</p>
                  <a href="mailto:office@reto-amonn.ch" className="text-blue-600 hover:underline font-medium">
                    office@reto-amonn.ch
                  </a>
                </div>
              </>
            )}

            {/* Step 5 — Confirm */}
            {step === 5 && (
              <>
                {/* Summary */}
                <div className="bg-gray-50 rounded-xl divide-y divide-gray-200/70">
                  {[
                    { icon: User,          label: 'Name',       value: `${form.firstName} ${form.lastName}` },
                    { icon: Mail,          label: 'E-Mail',     value: form.email },
                    { icon: Phone,         label: 'Telefon',    value: form.phone },
                    { icon: MapPin,        label: 'Interesse',  value: options.find((o) => o.value === form.interest)?.label ?? '–' },
                    { icon: Calendar,      label: 'Einzug',     value: form.moveIn || '–' },
                    { icon: ArrowRight,    label: 'Dauer',      value: DURATIONS.find((d) => d.value === form.duration)?.label ?? '–' },
                    { icon: Users,         label: 'Personen',   value: form.people },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3 px-4 py-3">
                      <Icon size={14} className="text-gray-400 flex-shrink-0" />
                      <span className="text-xs text-gray-500 w-20 flex-shrink-0">{label}</span>
                      <span className="text-sm font-medium text-gray-900 truncate">{value}</span>
                    </div>
                  ))}
                </div>

                {/* AGB */}
                <label className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  form.agb ? 'border-gray-900 bg-gray-50' : errors.agb ? 'border-red-300 bg-red-50/50' : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <div className={`w-5 h-5 rounded-md border-2 flex-shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                    form.agb ? 'bg-gray-900 border-gray-900' : errors.agb ? 'border-red-400' : 'border-gray-300'
                  }`}>
                    {form.agb && <Check size={12} className="text-white" />}
                  </div>
                  <input type="checkbox" checked={form.agb}
                    onChange={(e) => set('agb', e.target.checked)} className="sr-only" />
                  <span className="text-sm text-gray-700 leading-snug">
                    {t('vermietung.mietanfrage.agb')}
                  </span>
                </label>
                {errors.agb && <p className="text-xs text-red-500">{errors.agb}</p>}
              </>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className={`mt-6 flex gap-3 ${step > 1 ? 'justify-between' : 'justify-end'}`}>
          {step > 1 && (
            <button onClick={back}
              className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
              <ChevronLeft size={15} />
              Zurück
            </button>
          )}
          {step < TOTAL ? (
            <button onClick={next}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-colors">
              Weiter
              <ChevronRight size={15} />
            </button>
          ) : (
            <button onClick={submit}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-xl transition-colors">
              <Send size={14} />
              Anfrage senden
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MietanfrageForm;
>>>>>>> 707d88d0 (Refactor Vermietung system + i18n + Mietanfrage form)
