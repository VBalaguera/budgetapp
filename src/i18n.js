import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          main: {
            title: "my budgets",
            total: "total",
            add: "add",
          },
          buttons: {
            addBudget: "add budget",
            addExpense: "add expense",
            viewExpenses: "view expenses",
            deleteButton: "delete",
          },
          info: {
            name: "name",
            description: "description",
            maximumSpending: "maximum spending",
            notes: "notes",
            amount: "amount",
            budget: "budget",
          },
          messages: {
            hi: "hi",
          },
        },
      },
      es: {
        translation: {
          main: {
            title: "mis presupuestos",
            total: "total",
            add: "añadir",
          },
          buttons: {
            addBudget: "añadir presupuesto",
            addExpense: "añadir gasto",
            viewExpenses: "ver gastos",
            deleteButton: "borrar",
          },
          info: {
            name: "nombre",
            description: "descripción",
            maximumSpending: "cifra límite",
            notes: "notas",
            amount: "cantidad",
            budget: "presupuesto",
          },
          messages: {
            hi: "hola",
          },
        },
      },
    },
  });

export default i18n;
