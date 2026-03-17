import type { AssessmentStatus } from '@/lib/types/database'

const statusConfig: Record<AssessmentStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-500/20 text-gray-400' },
  sent: { label: 'Link Sent', color: 'bg-blue-500/20 text-blue-400' },
  in_progress: { label: 'In Progress', color: 'bg-amber-500/20 text-amber-400' },
  client_complete: { label: 'Client Complete', color: 'bg-teal-500/20 text-teal-400' },
  recommendations_added: { label: 'Recommendations Added', color: 'bg-emerald-500/20 text-emerald-400' },
  quote_added: { label: 'Quote Added', color: 'bg-emerald-500/20 text-emerald-400' },
  report_generated: { label: 'Report Ready', color: 'bg-emerald-400/20 text-emerald-300' },
  quote_sent: { label: 'Quote Sent', color: 'bg-purple-500/20 text-purple-400' },
  accepted: { label: 'Accepted', color: 'bg-green-500/20 text-green-400' },
  lost: { label: 'Lost', color: 'bg-red-500/20 text-red-400' },
}

interface BadgeProps {
  status: AssessmentStatus
}

export function Badge({ status }: BadgeProps) {
  const config = statusConfig[status]
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.color}`}>
      {config.label}
    </span>
  )
}
