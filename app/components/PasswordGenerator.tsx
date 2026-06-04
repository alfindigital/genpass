'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Copy, Eye, EyeOff, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export default function PasswordGenerator() {
  const [isHydrated, setIsHydrated] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong'>('medium')
  const [passwordHistory, setPasswordHistory] = useState<string[]>([])
  const [preferences, setPreferences] = useState({
    length: 16,
    includeUppercase: true,
    includeLowercase: true,
    includeNumbers: true,
    includeSpecial: true,
  })

  useEffect(() => {
    setIsHydrated(true)
    const savedPrefs = localStorage.getItem('passwordPrefs')
    if (savedPrefs) setPreferences(JSON.parse(savedPrefs))
    const savedHistory = localStorage.getItem('passwordGenHistory')
    if (savedHistory) setPasswordHistory(JSON.parse(savedHistory))
  }, [])

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('passwordPrefs', JSON.stringify(preferences))
    }
  }, [preferences, isHydrated])

  const calculateStrength = (password: string): 'weak' | 'medium' | 'strong' => {
    let strength = 0
    if (password.length >= 8) strength++
    if (password.length >= 16) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^a-zA-Z0-9]/.test(password)) strength++
    return strength <= 2 ? 'weak' : strength <= 4 ? 'medium' : 'strong'
  }

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
    const strength = calculateStrength(password)
    setPasswordStrength(strength)

    setPasswordHistory((prev) => {
      const updated = [password, ...prev].slice(0, 5)
      localStorage.setItem('passwordGenHistory', JSON.stringify(updated))
      return updated
    })
  }

  const generateMultiple = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(generatePassword, i * 100)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Password copied to clipboard')
  }

  const clearHistory = () => {
    setPasswordHistory([])
    localStorage.removeItem('passwordGenHistory')
    toast.success('History cleared')
  }

  if (!isHydrated) return null

  const strengthColors = {
    weak: 'from-red-500 to-red-600',
    medium: 'from-yellow-500 to-yellow-600',
    strong: 'from-green-500 to-green-600',
  }

  const strengthBgColors = {
    weak: 'bg-red-500/10',
    medium: 'bg-yellow-500/10',
    strong: 'bg-green-500/10',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 mb-4">
            <Sparkles className="w-6 h-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            SecurePass
          </h1>
          <p className="text-muted-foreground text-sm">Generate strong passwords instantly</p>
        </div>

        {/* Password Display Card */}
        <div className="backdrop-blur-xl bg-card/50 border border-primary/20 rounded-2xl p-6 mb-6 hover:border-primary/40 transition-all duration-300">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Password</p>
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors"
              aria-label="Toggle password visibility"
            >
              {showPassword ? (
                <Eye className="w-4 h-4 text-primary" />
              ) : (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              )}
            </button>
          </div>

          <div className="bg-background/50 rounded-xl p-4 mb-4 font-mono text-lg tracking-wider break-all min-h-12 flex items-center">
            {currentPassword ? (
              showPassword ? (
                <span className="text-primary font-semibold">{currentPassword}</span>
              ) : (
                <span className="text-primary font-semibold">{'•'.repeat(Math.min(currentPassword.length, 32))}</span>
              )
            ) : (
              <span className="text-muted-foreground">Click generate to create a password</span>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`h-2 flex-1 rounded-full bg-gradient-to-r ${strengthColors[passwordStrength]}`}></div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${strengthBgColors[passwordStrength]} ${passwordStrength === 'weak' ? 'text-red-400' : passwordStrength === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>
                {passwordStrength.charAt(0).toUpperCase() + passwordStrength.slice(1)}
              </span>
            </div>
          </div>

          {currentPassword && (
            <button
              onClick={() => copyToClipboard(currentPassword)}
              className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors font-medium text-sm"
            >
              <Copy className="w-4 h-4" />
              Copy Password
            </button>
          )}
        </div>

        {/* Controls Card */}
        <div className="backdrop-blur-xl bg-card/50 border border-primary/20 rounded-2xl p-6 mb-6">
          {/* Length Slider */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-foreground">Length</label>
              <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary font-mono font-semibold text-sm">
                {preferences.length}
              </span>
            </div>
            <input
              type="range"
              min="8"
              max="128"
              value={preferences.length}
              onChange={(e) => setPreferences({ ...preferences, length: parseInt(e.target.value) })}
              className="w-full h-2 bg-secondary/30 rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>8</span>
              <span>128</span>
            </div>
          </div>

          {/* Character Type Options */}
          <div className="space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Include</p>

            {[
              { key: 'includeUppercase', label: 'Uppercase (A-Z)', icon: 'A' },
              { key: 'includeLowercase', label: 'Lowercase (a-z)', icon: 'a' },
              { key: 'includeNumbers', label: 'Numbers (0-9)', icon: '0' },
              { key: 'includeSpecial', label: 'Special (!@#$%)', icon: '#' },
            ].map(({ key, label, icon }) => (
              <label key={key} className="flex items-center gap-3 p-3 rounded-lg hover:bg-primary/5 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={preferences[key as keyof typeof preferences] as boolean}
                  onChange={(e) =>
                    setPreferences({ ...preferences, [key]: e.target.checked })
                  }
                  className="w-4 h-4 rounded accent-primary cursor-pointer"
                />
                <span className="w-6 h-6 flex items-center justify-center rounded-md bg-primary/10 text-primary text-xs font-bold">
                  {icon}
                </span>
                <span className="text-sm text-foreground">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={generatePassword}
            className="px-4 py-3 bg-[#00d9ff] hover:bg-[#00c9ef] text-[#0a0e27] rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/20"
          >
            Generate
          </button>
          <button
            onClick={generateMultiple}
            className="px-4 py-3 bg-[#2a3f5f]/60 hover:bg-[#2a3f5f] text-[#00d9ff] rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 active:scale-95 border border-[#00d9ff]/30"
          >
            5 More
          </button>
        </div>

        {/* History Section */}
        {passwordHistory.length > 0 && (
          <div className="backdrop-blur-xl bg-card/50 border border-primary/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Recent</h2>
              <button
                onClick={clearHistory}
                className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                aria-label="Clear history"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-40 overflow-y-auto">
              {passwordHistory.map((pwd, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors group"
                >
                  <span className="font-mono text-xs text-muted-foreground truncate flex-1">
                    {pwd.substring(0, 20)}
                    {pwd.length > 20 && '...'}
                  </span>
                  <button
                    onClick={() => copyToClipboard(pwd)}
                    className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-primary/10 text-primary rounded transition-all"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
