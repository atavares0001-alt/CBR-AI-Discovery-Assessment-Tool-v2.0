'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AssessmentRow } from './AssessmentRow'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import type { Assessment } from '@/lib/types/database'

interface AssessmentListProps {
  onNewClick: () => void
}

type SortField = 'updated_at' | 'created_at' | 'client_name' | 'status'

async function fetchData(params: URLSearchParams) {
  const res = await fetch(`/api/assessments?${params}`)
  if (res.ok) return res.json()
  return { assessments: [], total: 0, page: 1, totalPages: 1 }
}

function SkeletonRow() {
  return (
    <div className="glass-card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-40" />
        <div className="skeleton h-3 w-64" />
      </div>
      <div className="flex gap-2">
        <div className="skeleton h-8 w-20 rounded-xl" />
        <div className="skeleton h-8 w-16 rounded-xl" />
      </div>
    </div>
  )
}

export function AssessmentList({ onNewClick }: AssessmentListProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortField>('updated_at')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(true)
  const [fetchCount, setFetchCount] = useState(0)
  const supabase = useMemo(() => createClient(), [])

  async function doFetch(overridePage?: number) {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(overridePage ?? page),
      sort,
      order,
    })
    if (search) params.set('search', search)

    const data = await fetchData(params)
    setAssessments(data.assessments)
    setTotal(data.total)
    setTotalPages(data.totalPages)
    setLoading(false)
  }

  // Trigger initial fetch via useMemo to avoid useEffect setState warnings
  useMemo(() => {
    doFetch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchCount])

  function refresh() {
    setFetchCount(c => c + 1)
  }

  function handleSearchChange(value: string) {
    setSearch(value)
    setPage(1)
    setTimeout(() => refresh(), 0)
  }

  function toggleSort(field: SortField) {
    if (sort === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setSort(field)
      setOrder(field === 'client_name' ? 'asc' : 'desc')
    }
    setPage(1)
    setTimeout(() => refresh(), 0)
  }

  // Status counts
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const a of assessments) {
      counts[a.status] = (counts[a.status] || 0) + 1
    }
    return counts
  }, [assessments])

  return (
    <div>
      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assessments</h1>
          <p className="text-sm text-text-muted">{total} total</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search by name, email, or company..."
            className="glass-input px-4 py-2 text-sm w-full sm:w-64"
            aria-label="Search assessments"
          />
          <Button onClick={onNewClick}>+ New Assessment</Button>
        </div>
      </div>

      {/* Stats bar */}
      {!loading && assessments.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex flex-wrap gap-2"
        >
          {[
            { key: 'draft', label: 'Draft', color: 'bg-gray-500' },
            { key: 'sent', label: 'Sent', color: 'bg-blue-400' },
            { key: 'in_progress', label: 'In Progress', color: 'bg-amber-400' },
            { key: 'complete', label: 'Complete', color: 'bg-emerald-500' },
          ].map(({ key, label, color }) => {
            const count = statusCounts[key] || 0
            if (count === 0) return null
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 rounded-full border border-glass-border bg-glass-bg px-3 py-1 text-xs text-text-secondary"
              >
                <span className={`h-2 w-2 rounded-full ${color}`} />
                {count} {label}
              </span>
            )
          })}
        </motion.div>
      )}

      {/* Sort controls */}
      <div className="mb-4 flex gap-2 text-xs">
        <span className="text-text-muted">Sort by:</span>
        {([
          ['updated_at', 'Updated'],
          ['created_at', 'Created'],
          ['client_name', 'Name'],
          ['status', 'Status'],
        ] as [SortField, string][]).map(([field, label]) => (
          <button
            key={field}
            onClick={() => toggleSort(field)}
            className={`rounded px-2 py-1 transition-colors ${
              sort === field ? 'bg-accent/20 text-accent' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            {label} {sort === field && (order === 'asc' ? '\u2191' : '\u2193')}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }, (_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      ) : assessments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card py-16 text-center"
        >
          {/* Empty state illustration */}
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/10">
            <svg className="h-10 w-10 text-accent" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-lg text-text-secondary">No assessments yet</p>
          <p className="mt-2 text-sm text-text-muted">
            Create your first assessment to get started.
          </p>
          <Button className="mt-6" onClick={onNewClick}>
            + Create First Assessment
          </Button>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {assessments.map((assessment, i) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <AssessmentRow
                assessment={assessment}
                onStatusChange={refresh}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={page === 1}
            onClick={() => { setPage(page - 1); doFetch(page - 1) }}
          >
            Previous
          </Button>
          <span className="text-sm text-text-muted">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="secondary"
            size="sm"
            disabled={page === totalPages}
            onClick={() => { setPage(page + 1); doFetch(page + 1) }}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
