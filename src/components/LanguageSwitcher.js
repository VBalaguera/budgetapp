import React from "react";
import i18n from "../i18n";
import "./LanguageSwitcher.css";

const lngs = {
  es: { nativeName: "esp" },
  en: { nativeName: "eng" },
};

export default function LanguageSwitcher() {
  return (
    <div className="languageSwitcher">
      {Object.keys(lngs).map((lng) => (
        <button
          className="languageSwitcher__option"
          key={lng}
          style={{
            fontWeight: i18n.resolvedLanguage === lng ? "bold" : "normal",
            marginLeft: ".5rem",
          }}
          type="submit"
          onClick={() => i18n.changeLanguage(lng)}
        >
          {lngs[lng].nativeName}
        </button>
      ))}
    </div>
  );
}
