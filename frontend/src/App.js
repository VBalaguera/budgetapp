import Layout from './components/Layout/Layout'
import { useTranslation } from 'react-i18next'

import './App.css'

function App() {
  // i18n:
  const { t } = useTranslation()

  return (
    <>
      <Layout>
        {/* <>
          {backendNotes.map((note, index) => (
            <li key={index}>{note.body}</li>
          ))}
        </> */}

        {/* budgets go here: */}

        {/* miscelaneous info */}
        <div className='secondary'>
          <div className='card  bg-light text-black w-100 bg-opacity-75'>
            <div className='card-header'>{t('faq.title')}</div>
            <div className='card-body'>
              <h5 className='card-title'>{t('faq.about')}</h5>
              <p className='card-text'>{t('faq.text')}</p>
            </div>
          </div>
        </div>
      </Layout>
    </>
  )
}

export default App
