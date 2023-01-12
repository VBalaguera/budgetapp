import { useState, useEffect } from 'react'

const CookieBanner = () => {
  const [showCookieBanner, setShowCookieBanner] = useState(true)

  const hideCookieBanner = () => {
    localStorage.setItem('cookieBanner', 'false')
    setShowCookieBanner(false)
  }

  useEffect(() => {
    // checking if cookieBanner was shown
    const cookieBanner = localStorage.getItem('cookieBanner')
    console.log('cookieBanner', cookieBanner)
    if (cookieBanner !== null) {
      setShowCookieBanner(JSON.parse(cookieBanner))
    }
  }, [])
  return (
    <div>
      {showCookieBanner && (
        <div className='d-flex flex-column my-2'>
          <span>This site uses cookies only for functionality purposes.</span>
          <button
            className='btn btn-primary'
            onClick={() => hideCookieBanner()}
          >
            I understand and accept.
          </button>
        </div>
      )}
    </div>
  )
}

export default CookieBanner
