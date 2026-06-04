'use client'

import { useState } from 'react'
import { Copy, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'

interface PasswordDisplayProps {
  password: string
  strength: 'weak' | 'medium' | 'strong'
}

export default function PasswordDisplay({
  password,
  strength,
}: PasswordDisplayProps) {
  const [showPassword, setShowPassword] = useState(false)

  const copyToClipboard = () => {
    if (!password) return
    navigator.clipboard.writeText(password)
    toast.success('Password copied to clipboard!')
  }

  const strengthColor = {
    weak: 'bg-red-500/20 text-red-500 border-red-500/30',
    medium: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30',
    strong: 'bg-green-500/20 text-green-500 border-green-500/30',
  }

  const strengthLabel = {
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong',
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      {/* Password Input Display */}
      <div className="relative">
        <div className="flex items-center gap-2 bg-muted rounded-lg p-4 min-h-14">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            readOnly
            className="flex-1 bg-transparent text-foreground text-lg font-mono outline-none"
            placeholder="Click Generate to create a password"
          />
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            title={showPassword ? 'Hide' : 'Show'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
      </div>

      {/* Strength Indicator and Copy Button */}
      <div className="flex items-center justify-between gap-2">
        {password && (
          <div className={`text-xs font-semibold px-3 py-1 rounded-full border ${strengthColor[strength]}`}>
            Strength: {strengthLabel[strength]}
          </div>
        )}
        <div className="flex-1" />
        <button
          onClick={copyToClipboard}
          disabled={!password}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          <Copy size={18} />
          Copy
        </button>
      </div>
    </div>
  )
}
