'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import type { Assessment, AssessmentStatus } from '@/lib/types/database'

interface StatusControlsProps {
  assessment: Assessment
  onStatusChange: (status: AssessmentStatus) => Promise<void>
  onDelete: () => Promise<void>
}

const MANUAL_TRANSITIONS: { status: AssessmentStatus; label: string }[] = [
  { status: 'quote_sent', label: 'Mark as Quote Sent' },
  { status: 'accepted', label: 'Mark as Accepted' },
  { status: 'lost', label: 'Mark as Lost' },
]

export function StatusControls({ assessment, onStatusChange, onDelete }: StatusControlsProps) {
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  async function handleStatusChange(status: AssessmentStatus) {
    setLoading(true)
    await onStatusChange(status)
    setLoading(false)
  }

  async function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    setLoading(true)
    await onDelete()
    setLoading(false)
  }

  return (
    <div className="glass-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-muted">Status:</span>
          <Badge status={assessment.status} />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 hide-scrollbar sm:flex-wrap sm:w-auto sm:pb-0">
          {MANUAL_TRANSITIONS.map(({ status, label }) => (
            <Button
              key={status}
              variant="secondary"
              size="sm"
              onClick={() => handleStatusChange(status)}
              disabled={loading || assessment.status === status}
            >
              {label}
            </Button>
          ))}
          <Button
            variant="danger"
            size="sm"
            onClick={handleDelete}
            disabled={loading}
          >
            {confirmDelete ? 'Confirm Delete' : 'Delete'}
          </Button>
        </div>
      </div>
    </div>
  )
}
