import { useState, useEffect } from 'react'
import i18n from '../../../i18n'
import './LanguageSwitcher.css'

import { Button } from 'react-bootstrap'

export default function LanguageSwitcher() {
  useEffect(() => {
    // theme
    const theme = localStorage.getItem('theme')
    setTheme(theme)
  }, [])
  // dark mode here:
  const [theme, setTheme] = useState('light')
  return (
    <div>
      {i18n.language === 'es' ? (
        <Button
          variant={theme === 'light' ? 'outline-dark' : 'outline-light'}
          type='submit'
          onClick={() => i18n.changeLanguage('en')}
        >
          en
        </Button>
      ) : (
        <Button
          variant={theme === 'light' ? 'outline-dark' : 'outline-light'}
          type='submit'
          onClick={() => i18n.changeLanguage('es')}
        >
          es
        </Button>
      )}
    </div>
  )
}
