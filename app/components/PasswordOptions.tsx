'use client'

import { useCallback } from 'react'

interface Preferences {
  length: number
  includeUppercase: boolean
  includeLowercase: boolean
  includeNumbers: boolean
  includeSpecial: boolean
}

interface PasswordOptionsProps {
  preferences: Preferences
  onChange: (preferences: Preferences) => void
}

export default function PasswordOptions({
  preferences,
  onChange,
}: PasswordOptionsProps) {
  const handleLengthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const length = Math.max(8, Math.min(128, parseInt(e.target.value) || 8))
      onChange({ ...preferences, length })
    },
    [preferences, onChange]
  )

  const handleCheckboxChange = useCallback(
    (key: keyof Omit<Preferences, 'length'>) => {
      onChange({ ...preferences, [key]: !preferences[key] })
    },
    [preferences, onChange]
  )

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-5">
      {/* Length Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold text-foreground">Length</label>
          <span className="text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded">
            {preferences.length}
          </span>
        </div>
        <input
          type="range"
          min="8"
          max="128"
          value={preferences.length}
          onChange={handleLengthChange}
          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>8</span>
          <span>128</span>
        </div>
      </div>

      {/* Character Options */}
      <div className="space-y-3 border-t border-border pt-4">
        <p className="text-sm font-semibold text-foreground">Character Types</p>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded transition-colors">
          <input
            type="checkbox"
            checked={preferences.includeUppercase}
            onChange={() => handleCheckboxChange('includeUppercase')}
            className="w-5 h-5 accent-primary rounded"
          />
          <span className="text-sm text-foreground">Uppercase (A-Z)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded transition-colors">
          <input
            type="checkbox"
            checked={preferences.includeLowercase}
            onChange={() => handleCheckboxChange('includeLowercase')}
            className="w-5 h-5 accent-primary rounded"
          />
          <span className="text-sm text-foreground">Lowercase (a-z)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded transition-colors">
          <input
            type="checkbox"
            checked={preferences.includeNumbers}
            onChange={() => handleCheckboxChange('includeNumbers')}
            className="w-5 h-5 accent-primary rounded"
          />
          <span className="text-sm text-foreground">Numbers (0-9)</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer hover:bg-muted p-2 rounded transition-colors">
          <input
            type="checkbox"
            checked={preferences.includeSpecial}
            onChange={() => handleCheckboxChange('includeSpecial')}
            className="w-5 h-5 accent-primary rounded"
          />
          <span className="text-sm text-foreground">Special (!@#$%^&*)</span>
        </label>
      </div>
    </div>
  )
}
