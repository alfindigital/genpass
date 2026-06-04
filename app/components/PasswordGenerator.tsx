'use client'

import { useState, useEffect } from 'react'
import PasswordDisplay from './PasswordDisplay'
import PasswordOptions from './PasswordOptions'
import PasswordHistory from './PasswordHistory'

type PasswordStrength = 'weak' | 'medium' | 'strong'

interface Preferences {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSpecial: boolean
}

const DEFAULT_PREFERENCES: Preferences = {
  length: 16,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSpecial: true,
}

export default function PasswordGenerator() {
  const [preferences, setPreferences] = useState<Preferences>(DEFAULT_PREFERENCES)
  const [currentPassword, setCurrentPassword] = useState('')
  const [passwordHistory, setPasswordHistory] = useState<string[]>([])
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>('medium')
  const [isHydrated, setIsHydrated] = useState(false)

  // Load preferences from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('passwordGenPreferences')
    if (saved) {
      try {
        setPreferences(JSON.parse(saved))
      } catch (e) {
        setPreferences(DEFAULT_PREFERENCES)
      }
    }
    const savedHistory = localStorage.getItem('passwordGenHistory')
    if (savedHistory) {
      try {
        setPasswordHistory(JSON.parse(savedHistory))
      } catch (e) {
        setPasswordHistory([])
      }
    }
    setIsHydrated(true)
  }, [])

  // Calculate password strength
  const calculateStrength = (password: string): PasswordStrength => {
    const length = password.length
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumbers = /[0-9]/.test(password)
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)

    const typeCount = [hasUppercase, hasLowercase, hasNumbers, hasSpecial].filter(Boolean).length

    if (length < 8 || typeCount < 2) return 'weak'
    if (length < 16 || typeCount < 3) return 'medium'
    return 'strong'
  }

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
    const strength = calculateStrength(password)
    setPasswordStrength(strength)

    // Add to history (max 5)
    setPasswordHistory((prev) => {
      const updated = [password, ...prev].slice(0, 5)
      localStorage.setItem('passwordGenHistory', JSON.stringify(updated))
      return updated
    })
  }

  // Handle preference changes
  const handlePreferenceChange = (newPrefs: Preferences) => {
    setPreferences(newPrefs)
    localStorage.setItem('passwordGenPreferences', JSON.stringify(newPrefs))
  }

  // Generate multiple passwords
  const generateMultiple = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => generatePassword(), i * 100)
    }
  }

  // Clear history
  const clearHistory = () => {
    setPasswordHistory([])
    localStorage.removeItem('passwordGenHistory')
  }

  if (!isHydrated) return null

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Password Generator</h1>
          <p className="text-muted-foreground text-sm">Generate secure, random passwords instantly</p>
        </div>

        {/* Main Card */}
        <div className="space-y-6">
          {/* Password Display */}
          <PasswordDisplay
            password={currentPassword}
            strength={passwordStrength}
          />

          {/* Password Options */}
          <PasswordOptions
            preferences={preferences}
            onChange={handlePreferenceChange}
          />

          {/* Generate Buttons */}
          <div className="flex gap-2">
            <button
              onClick={generatePassword}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Generate
            </button>
            <button
              onClick={generateMultiple}
              className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/90 transition-colors font-medium"
            >
              Generate 5
            </button>
          </div>

          {/* Password History */}
          {passwordHistory.length > 0 && (
            <PasswordHistory
              passwords={passwordHistory}
              onClear={clearHistory}
            />
          )}
        </div>
      </div>
    </div>
  )
}
