import React from 'react'
import './Footer.css'
import { useTranslation } from 'react-i18next'

export default function Footer() {
  const { t } = useTranslation()
  return (
    <footer className='footer'>
      <div className='text-center p-3'>
        2022. {t('copyright.text')}{' '}
        <a
          href='https://vbalaguera.vercel.app/'
          target='_blank'
          rel='noreferrer'
        >
          Víctor Balaguera
        </a>
      </div>
    </footer>
  )
}
