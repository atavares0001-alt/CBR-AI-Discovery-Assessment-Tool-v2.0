'use client'

import { useState } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AssessmentList } from '@/components/dashboard/AssessmentList'
import { NewAssessmentModal } from '@/components/dashboard/NewAssessmentModal'

export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  return (
    <DashboardLayout>
      <AssessmentList
        key={refreshKey}
        onNewClick={() => setShowModal(true)}
      />
      <NewAssessmentModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onCreated={() => setRefreshKey((k) => k + 1)}
      />
    </DashboardLayout>
  )
}
