'use client'

import { useState, useEffect } from 'react'
import { Eye, EyeOff, Copy, ChevronDown, Sun, Moon, Trash2, RotateCw } from 'lucide-react'
import { toast } from 'sonner'

export default function PasswordGenerator() {
  const [isHydrated, setIsHydrated] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordHistory, setPasswordHistory] = useState<string[]>([])
  const [historyOpen, setHistoryOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const [preferences, setPreferences] = useState({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: true,
  })

  // Load preferences, theme, and generate initial password on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('passwordGenPreferences')
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences))
    }

    const savedHistory = localStorage.getItem('passwordGenHistory')
    if (savedHistory) {
      setPasswordHistory(JSON.parse(savedHistory))
    }

    const savedTheme = localStorage.getItem('theme') || 'dark'
    setIsDarkMode(savedTheme === 'dark')
    setIsHydrated(true)
  }, [])

  // Generate password when preferences change or on first load
  useEffect(() => {
    if (isHydrated) {
      generatePassword()
    }
  }, [isHydrated, preferences])

  // Save preferences whenever they change
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('passwordGenPreferences', JSON.stringify(preferences))
    }
  }, [preferences, isHydrated])

  // Generate password
  const generatePassword = () => {
    const characterSets = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      special: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    }

    let availableChars = ''
    if (preferences.includeUppercase) availableChars += characterSets.uppercase
    if (preferences.includeLowercase) availableChars += characterSets.lowercase
    if (preferences.includeNumbers) availableChars += characterSets.numbers
    if (preferences.includeSpecial) availableChars += characterSets.special

    if (availableChars.length === 0) {
      availableChars = characterSets.lowercase
    }

    let password = ''
    for (let i = 0; i < preferences.length; i++) {
      password += availableChars.charAt(Math.floor(Math.random() * availableChars.length))
    }

    setCurrentPassword(password)

    // Add to history (max 5)
    setPasswordHistory((prev) => {
      const updated = [password, ...prev].slice(0, 5)
      localStorage.setItem('passwordGenHistory', JSON.stringify(updated))
      return updated
    })
  }

  // Copy to clipboard with fallback
  const copyToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(currentPassword)
        toast.success('Password disalin ke clipboard!', {
          duration: 2000,
        })
      } else {
        fallbackCopyToClipboard()
      }
    } catch (err) {
      fallbackCopyToClipboard()
    }
  }

  // Fallback copy to clipboard using textarea
  const fallbackCopyToClipboard = () => {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = currentPassword
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      toast.success('Password disalin ke clipboard!', {
        duration: 2000,
      })
    } catch (err) {
      toast.error('Gagal menyalin password', {
        duration: 2000,
      })
    }
  }

  // Clear history
  const clearHistory = () => {
    setPasswordHistory([])
    localStorage.removeItem('passwordGenHistory')
    toast.success('Riwayat terhapus', { duration: 1500 })
  }

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark'
    setIsDarkMode(!isDarkMode)
    localStorage.setItem('theme', newTheme)

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  if (!isHydrated) return null

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Header with Theme Toggle */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold">GenPass</h1>
            <p className="text-xs text-muted-foreground hidden sm:block">Aman. Lokal. Cepat.</p>
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-lg hover:bg-card transition-colors"
            title={isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <Moon className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex flex-col min-h-screen">
        {/* Settings Section - No Header */}
        <div className="bg-card rounded-lg p-3 sm:p-4 mb-3 border border-border">
          {/* Length Slider */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs sm:text-sm font-medium">Panjang Password</label>
              <span className="text-sm sm:text-base font-semibold text-primary">{preferences.length}</span>
            </div>
            <input
              type="range"
              min="8"
              max="128"
              value={preferences.length}
              onChange={(e) =>
                setPreferences({
                  ...preferences,
                  length: parseInt(e.target.value),
                })
              }
              className="w-full h-2 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>8</span>
              <span>128</span>
            </div>
          </div>

          {/* Character Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
            {[
              { key: 'includeUppercase', label: 'Huruf Besar (A-Z)' },
              { key: 'includeLowercase', label: 'Huruf Kecil (a-z)' },
              { key: 'includeNumbers', label: 'Angka (0-9)' },
              { key: 'includeSpecial', label: 'Karakter Khusus (!@#$)' },
            ].map(({ key, label }) => (
              <label
                key={key}
                className="flex items-center gap-2 p-1.5 sm:p-2 rounded-lg hover:bg-border/50 transition-colors cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={preferences[key as keyof typeof preferences] as boolean}
                  onChange={(e) =>
                    setPreferences({
                      ...preferences,
                      [key]: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded cursor-pointer accent-primary"
                />
                <span className="text-xs sm:text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div className="mb-3">
          <button
            onClick={generatePassword}
            className="w-full px-3 py-3 sm:py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 min-h-[44px] text-sm sm:text-base flex items-center justify-center gap-2"
          >
            <RotateCw className="w-4 h-4 sm:w-5 sm:h-5" />
            Buat Password Baru
          </button>
        </div>

        {/* Password Result Section - Always visible */}
        {currentPassword && (
          <div className="bg-card rounded-lg p-3 sm:p-4 mb-3 border border-border">
            <h3 className="text-sm sm:text-base font-semibold mb-3">Hasil Password</h3>

            {/* Password Display */}
            <div className="flex items-center gap-2 mb-3 bg-input rounded-lg p-2.5 sm:p-3">
              <code className="flex-1 font-mono text-xs sm:text-sm break-all text-primary font-semibold">
                {showPassword ? currentPassword : '•'.repeat(Math.min(currentPassword.length, 40))}
              </code>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="p-2 hover:bg-border rounded-lg transition-colors flex-shrink-0 min-w-[44px] flex items-center justify-center"
                title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>
            </div>

            {/* Copy Button */}
            <button
              onClick={copyToClipboard}
              className="w-full flex items-center justify-center gap-2 px-3 py-2.5 sm:py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium transition-all duration-300 min-h-[44px] text-xs sm:text-sm"
            >
              <Copy className="w-4 h-4 sm:w-5 sm:h-5" />
              Salin Password
            </button>
          </div>
        )}

        {/* History Section - Collapsible */}
        {passwordHistory.length > 0 && (
          <div className="bg-card rounded-lg border border-border overflow-hidden mb-3">
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className="w-full flex items-center justify-between p-2.5 sm:p-3 hover:bg-border/50 transition-colors"
            >
              <h3 className="text-sm sm:text-base font-semibold">Password Terbaru</h3>
              <ChevronDown
                className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 ${historyOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {historyOpen && (
              <div className="border-t border-border px-2.5 sm:px-3 py-2.5 sm:py-3 space-y-1">
                {passwordHistory.map((pwd, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-1.5 sm:p-2 bg-input rounded-lg group">
                    <code className="flex-1 font-mono text-xs break-all text-muted-foreground">
                      {pwd}
                    </code>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(pwd)
                        toast.success('Disalin!', { duration: 1500 })
                      }}
                      className="p-2 hover:bg-border rounded-lg transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100 min-w-[44px] flex items-center justify-center"
                      title="Salin"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {passwordHistory.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 mt-2 bg-destructive/10 hover:bg-destructive/20 text-destructive rounded-lg font-medium transition-colors text-xs min-h-[44px]"
                  >
                    <Trash2 className="w-4 h-4" />
                    Hapus Riwayat
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Spacer to push footer down */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="text-center py-2 sm:py-3 mt-2 border-t border-border/30">
          <p className="text-xs text-muted-foreground">
            Aman. Berjalan Lokal. Tidak ada data yang dikirim ke server.
          </p>
        </div>
      </div>
    </main>
  )
}
