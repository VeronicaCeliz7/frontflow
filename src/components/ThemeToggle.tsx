import { useEffect, useState } from 'react'

export const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('urbanflow-theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('urbanflow-theme', 'light')
    }
  }, [isDark])

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      style={{
        backgroundColor: isDark ? '#3b82f6' : '#e5e7eb'
      }}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all duration-200 ${
          isDark ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  )
}