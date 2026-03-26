import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import emailjs from "@emailjs/browser";
import { EMAILJS_CONFIG } from "@/config/emailjs";

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

      // Send email notification via EmailJS (gracefully degrades if not configured)
      try {
        const isConfigured =
          EMAILJS_CONFIG.serviceId !== 'YOUR_SERVICE_ID' &&
          EMAILJS_CONFIG.templateId !== 'YOUR_TEMPLATE_ID' &&
          EMAILJS_CONFIG.publicKey !== 'YOUR_PUBLIC_KEY';

        if (isConfigured) {
          const templateParams = {
            to_email: EMAILJS_CONFIG.toEmail,
            from_name: `${formData.vorname} ${formData.nachname}`,
            from_email: formData.email,
            phone: formData.handynummer || 'nicht angegeben',
            anfrageart: formData.anfrageart || 'nicht angegeben',
            objekt: formData.objekt || 'nicht angegeben',
            mietbeginn: formData.mietbeginn || 'nicht angegeben',
            mietende: formData.mietende || 'nicht angegeben',
            beruf: formData.beruf || 'nicht angegeben',
            nationalitaet: formData.nationalitaet || 'nicht angegeben',
            bemerkungen: formData.bemerkungen || '',
            firma_miete: formData.firmaMiete || 'Privat',
            firma: formData.firma || '',
            fahrzeug: formData.fahrzeug || 'Nein',
            submission_date: new Date().toLocaleDateString('de-CH'),
          };

          await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams,
            EMAILJS_CONFIG.publicKey
          );
        }
      } catch (emailError) {
        // EmailJS failure is non-blocking — log but do not show error to user
        console.error('EmailJS send error:', emailError);
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