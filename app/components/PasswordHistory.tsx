'use client'

import { Copy, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

interface PasswordHistoryProps {
  passwords: string[]
  onClear: () => void
}

export default function PasswordHistory({
  passwords,
  onClear,
}: PasswordHistoryProps) {
  const copyPassword = (password: string) => {
    navigator.clipboard.writeText(password)
    toast.success('Password copied!')
  }

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the history?')) {
      onClear()
      toast.success('History cleared!')
    }
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground text-sm">Recent Passwords</h3>
        <button
          onClick={handleClear}
          className="inline-flex items-center gap-1 px-2 py-1 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors"
        >
          <Trash2 size={16} />
          Clear
        </button>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto">
        {passwords.map((password, index) => (
          <div
            key={`${password}-${index}`}
            className="flex items-center justify-between bg-muted p-3 rounded-lg hover:bg-muted/80 transition-colors group"
          >
            <code className="text-sm font-mono text-foreground break-all flex-1">
              {password}
            </code>
            <button
              onClick={() => copyPassword(password)}
              className="ml-2 p-1.5 text-muted-foreground hover:text-foreground hover:bg-background rounded transition-colors opacity-0 group-hover:opacity-100"
              title="Copy"
            >
              <Copy size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
