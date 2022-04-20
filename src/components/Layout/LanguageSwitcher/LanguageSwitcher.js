import React from 'react'
import i18n from '../../../i18n'
import './LanguageSwitcher.css'

export default function LanguageSwitcher() {
  return (
    <div className='languageSwitcher'>
      {i18n.language === 'es' ? (
        <button
          className='languageSwitcher__option'
          type='submit'
          onClick={() => i18n.changeLanguage('en')}
        >
          en
        </button>
      ) : (
        <button
          className='languageSwitcher__option'
          type='submit'
          onClick={() => i18n.changeLanguage('es')}
        >
          es
        </button>
      )}
    </div>
  )
}
