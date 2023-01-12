import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'

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
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          main: {
            title: 'My budgets',
            total: 'total',
            add: 'Add',
            expenses: 'Expenses',
            notes: 'My notes',
            light: 'light mode',
            dark: 'dark mode',
            nobudgets: 'No budgets yet!',
            nonotes: 'No notes yet!',
          },
          buttons: {
            addBudget: 'Add budget',
            addExpense: 'Add expense',
            addNote: 'Add note',
            viewExpenses: 'View expenses',
            delete: 'Delete',
          },
          info: {
            name: 'Name',
            title: 'Title',
            description: 'Description',
            text: 'Text',
            maximumSpending: 'Maximum spending',
            notes: 'Notes',
            amount: 'Amount',
            budget: 'Budget',
            uncategorized: 'Uncategorized',
          },
          total: {
            index: 'total',
            summary: 'This account has the following budgets:',
            initial: 'Initial fonds:',
            spent: 'Amount spent:',
            available: 'Available fonds: ',
          },
          messages: {
            hi: 'hi',
            noexpenses: "No expenses yet, why don't you spend some?",
          },
          copyright: {
            text: 'Made in Madrid, with MongoDB, Express, React and Node.js by',
          },
          faq: {
            title: 'How to',
            about: 'About Carrington',
            text: 'Carrington uses localstorage. Your browser saves all your input. You can always come back and check your progress. Of course, if you access this site from other device/browser, you will not see your saved data...',
          },
        },
      },
      es: {
        translation: {
          main: {
            title: 'Mis presupuestos',
            total: 'Total',
            add: 'Añadir',
            expenses: 'Gastos',
            notes: 'Mis notas',
            light: 'luz',
            dark: 'noche',
            nobudgets: '¡Aún no hay presupuestos!',
            nonotes: '¡Aún no hay notas!',
          },
          buttons: {
            addBudget: 'Añadir presupuesto',
            addExpense: 'Añadir gasto',
            addNote: 'Añadir nota',
            viewExpenses: 'Ver gastos',
            delete: 'Borrar',
          },
          info: {
            name: 'Nombre',
            title: 'Título',
            description: 'Descripción',
            text: 'Texto',
            maximumSpending: 'cifra límite',
            notes: 'notas',
            amount: 'cantidad',
            budget: 'presupuesto',
            uncategorized: 'sin categoría',
          },
          total: {
            index: 'Total',
            summary: 'Esta cuenta tiene los siguientes presupuestos: ',
            initial: 'Fondos iniciales: ',
            spent: 'Cantidad de gastos: ',
            available: 'Fondos disponibles: ',
          },
          messages: {
            hi: 'hola',
            noexpenses: 'Aún no hay gastos, ¿por qué no realizas alguno?',
          },
          copyright: {
            text: 'Hecho en Madrid usando MongoDB, Express, React and Node.js by',
          },
          faq: {
            title: 'Instrucciones',
            about: 'Sobre Carrington',
            text: 'Carrington usa localstorage. Tu navegador guardará todo lo que anotes aquí. Puedes volver más tarde y revisar todo. Por supuesto, si vuelves aquí desde otro dispositivo/navegador, no podrás verlo...',
          },
        },
      },
    },
  })

export default i18n
