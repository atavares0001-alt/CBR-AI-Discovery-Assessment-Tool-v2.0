'use client'

import { useState, useCallback } from 'react'
import { useAutoSave } from '@/hooks/useAutoSave'
import { Textarea } from '@/components/ui/Textarea'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ScoreDisplay } from './ScoreDisplay'
import type { Assessment, Stage6Data } from '@/lib/types/database'

const SERVICES = [
  'AI Receptionist', 'Scheduling Automation', 'Lead Qualification',
  'Chatbot Solutions', 'Workflow Automation', 'Data Analytics',
  'CRM Integration', 'AI-Powered Websites', 'Email Automation',
]

interface RecommendationsTabProps {
  assessment: Assessment
  onSave: (data: Partial<Assessment>) => Promise<void>
}

export function RecommendationsTab({ assessment, onSave }: RecommendationsTabProps) {
  const [data, setData] = useState<Stage6Data>(
    assessment.stage_6_data || {
      executive_summary: '',
      recommended_solution: '',
      automation_logic: '',
      key_benefit: '',
      recommended_services: [],
      detailed_recommendations: '',
    }
  )
  const handleAutoSave = useCallback(async (dataToSave: Stage6Data) => {
    await onSave({
      stage_6_data: dataToSave,
      status: 'recommendations_added',
    })
  }, [onSave])

  const { status: autoSaveStatus, manualSave } = useAutoSave(data, handleAutoSave, 1500)
  const isSaving = autoSaveStatus === 'saving'
  const isSaved = autoSaveStatus === 'saved'

  function update<K extends keyof Stage6Data>(field: K, value: Stage6Data[K]) {
    setData({ ...data, [field]: value })
  }

  function toggleService(service: string) {
    const current = data.recommended_services
    const updated = current.includes(service)
      ? current.filter((s) => s !== service)
      : [...current, service]
    update('recommended_services', updated)
  }

  return (
    <div className="space-y-6">
      <ScoreDisplay score={assessment.ai_readiness_score} />

      <div className="space-y-5">
        <Textarea
          id="executive_summary"
          label="Executive Summary"
          value={data.executive_summary}
          onChange={(e) => update('executive_summary', e.target.value)}
          placeholder="High-level summary for the PDF report cover..."
        />
        <Input
          id="recommended_solution"
          label="Recommended AI Model / Solution"
          value={data.recommended_solution}
          onChange={(e) => update('recommended_solution', e.target.value)}
          placeholder="e.g. AI Receptionist + Lead Qualification Pipeline"
        />
        <Textarea
          id="automation_logic"
          label="Automation Logic"
          value={data.automation_logic}
          onChange={(e) => update('automation_logic', e.target.value)}
          placeholder="Step-by-step automation flow description..."
        />
        <Input
          id="key_benefit"
          label="Key Business Benefit"
          value={data.key_benefit}
          onChange={(e) => update('key_benefit', e.target.value)}
          placeholder="e.g. Reduce admin time by 15 hours/week"
        />

        <div>
          <p className="mb-2 text-sm font-medium text-text-secondary">
            Recommended CBR AI Agency Services
          </p>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((service) => (
              <button
                key={service}
                type="button"
                onClick={() => toggleService(service)}
                className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                  data.recommended_services.includes(service)
                    ? 'bg-accent/20 text-accent border border-accent/30'
                    : 'glass-card text-text-muted hover:text-text-primary'
                }`}
              >
                {service}
              </button>
            ))}
          </div>
        </div>

        <Textarea
          id="detailed_recommendations"
          label="Detailed Recommendations"
          value={data.detailed_recommendations}
          onChange={(e) => update('detailed_recommendations', e.target.value)}
          placeholder="Full narrative for the report body..."
        />

        <div className="flex justify-end">
          <Button onClick={manualSave} disabled={isSaving || isSaved}>
            {isSaving ? 'Saving...' : isSaved ? 'Saved' : 'Save Recommendations'}
          </Button>
        </div>
      </div>
    </div>
  )
}
