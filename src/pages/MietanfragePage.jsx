import React from "react";
import MietanfrageForm from "@/components/MietanfrageForm";

export default function MietanfragePage() {
  return (
    <div className="container mx-auto px-6 py-16">
      <div className="max-w-6xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Mietanfrage</h1>
        <p className="text-slate-600 text-lg mb-10 max-w-3xl">
          Nutzen Sie das Formular für Long-Stay-Angebote, Apartments und weitere
          Mietobjekte. Ihre Anfrage wird direkt gespeichert.
        </p>

        <MietanfrageForm />
      </div>
    </div>
  );
}