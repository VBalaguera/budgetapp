import React from "react";
import i18n from "../i18n";
const lngs = {
  es: { nativeName: "Español" },
  en: { nativeName: "English" },
};

export default function LanguageSwitcher() {
  return (
    <div>
      <div>
        {Object.keys(lngs).map((lng) => (
          <span
            key={lng}
            style={{
              fontWeight: i18n.resolvedLanguage === lng ? "bold" : "normal",
              marginLeft: "1rem",
            }}
            type="submit"
            onClick={() => i18n.changeLanguage(lng)}
          >
            {lngs[lng].nativeName}
          </span>
        ))}
      </div>
    </div>
  );
}
