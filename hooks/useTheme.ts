import { useState, useEffect } from 'react'

export function useTheme() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const savedTheme = localStorage.getItem('theme') || (systemDark ? 'dark' : 'light')
    const isDark = savedTheme === 'dark'
    
    setIsDarkMode(isDark)
    document.documentElement.className = savedTheme
  }, [])

  // Update theme when it changes
  useEffect(() => {
    const theme = isDarkMode ? 'dark' : 'light'
    document.documentElement.className = theme
    localStorage.setItem('theme', theme)
  }, [isDarkMode])

  return { isDarkMode, setIsDarkMode }
}
