'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { AssessmentRow } from './AssessmentRow'
import { Button } from '@/components/ui/Button'
import { createClient } from '@/lib/supabase/client'
import type { Assessment } from '@/lib/types/database'

interface AssessmentListProps {
  onNewClick: () => void
}

type SortField = 'updated_at' | 'created_at' | 'client_name' | 'status'

export function AssessmentList({ onNewClick }: AssessmentListProps) {
  const [assessments, setAssessments] = useState<Assessment[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortField>('updated_at')
  const [order, setOrder] = useState<'asc' | 'desc'>('desc')
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  const fetchAssessments = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams({
      page: String(page),
      sort,
      order,
    })
    if (search) params.set('search', search)

    const res = await fetch(`/api/assessments?${params}`)
    if (res.ok) {
      const data = await res.json()
      setAssessments(data.assessments)
      setTotal(data.total)
      setTotalPages(data.totalPages)
    }
    setLoading(false)
  }, [page, sort, order, search])

  useEffect(() => {
    fetchAssessments()
  }, [fetchAssessments])

  // Reset page when search changes
  useEffect(() => {
    setPage(1)
  }, [search, sort, order])

  function toggleSort(field: SortField) {
    if (sort === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc')
    } else {
      setSort(field)
      setOrder(field === 'client_name' ? 'asc' : 'desc')
    }
  }

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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or company..."
            className="glass-input px-4 py-2 text-sm w-64"
          />
          <Button onClick={onNewClick}>+ New Assessment</Button>
        </div>
      </div>

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
            {label} {sort === field && (order === 'asc' ? '↑' : '↓')}
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="py-12 text-center text-text-muted">Loading...</div>
      ) : assessments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card py-16 text-center"
        >
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
                onStatusChange={fetchAssessments}
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
            onClick={() => setPage(page - 1)}
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
            onClick={() => setPage(page + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
