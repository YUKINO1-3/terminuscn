import { useEffect, useState } from 'react'

const legacyScripts = [
  'jquery-1.9.1.min.js',
  'jquery.terminal-0.6.3.js',
  'I18n.js',
  'EventTarget.js',
  'Room.js',
  'Item.js',
  'GameObjects.js',
  'Level.js',
  'GameState.js',
  'Game.js',
]

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.async = false
    script.onload = resolve
    script.onerror = () => reject(new Error(`Unable to load ${src}`))
    document.body.appendChild(script)
  })
}

export default function App() {
  const [loadError, setLoadError] = useState('')
  const [language, setLanguage] = useState(
    () => localStorage.getItem('terminus-language') === 'en' ? 'en' : 'zh',
  )

  function toggleLanguage() {
    const nextLanguage = language === 'zh' ? 'en' : 'zh'
    localStorage.setItem('terminus-language', nextLanguage)
    setLanguage(nextLanguage)
    window.location.reload()
  }

  useEffect(() => {
    let cancelled = false

    async function startGame() {
      try {
        const baseUrl = import.meta.env.BASE_URL

        for (const filename of legacyScripts) {
          await loadScript(`${baseUrl}static/javascript/${filename}`)
        }
      } catch (error) {
        if (!cancelled) {
          setLoadError(error instanceof Error ? error.message : String(error))
        }
      }
    }

    startGame()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="game">
      <button className="language-toggle" type="button" onClick={toggleLanguage}>
        {language === 'zh' ? 'English' : '中文'}
      </button>
      <section
        id="term"
        aria-label={language === 'zh' ? 'Terminus 命令终端' : 'Terminus command terminal'}
      />
      <section id="pics" aria-label={language === 'zh' ? '当前位置' : 'Current location'}>
        <img id="scene" alt="" />
      </section>
      {loadError && (
        <div className="load-error" role="alert">
          {language === 'zh' ? 'Terminus 启动失败：' : 'Failed to start Terminus: '}
          {loadError}
        </div>
      )}
    </main>
  )
}
