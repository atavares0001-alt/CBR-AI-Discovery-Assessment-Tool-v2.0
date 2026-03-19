'use client'

import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { StageForm } from '../StageForm'

interface Stage4Props {
  answers: Record<string, string>
  onChange: (answers: Record<string, string>) => void
  onBack: () => void
  onContinue: () => void
  loading?: boolean
}

export function Stage4({ answers, onChange, onBack, onContinue, loading }: Stage4Props) {
  function update(field: string, value: string) {
    onChange({ ...answers, [field]: value })
  }

  const isValid =
    answers.repetitive_task?.trim() &&
    answers.response_time?.trim()

  return (
    <StageForm
      title="Pain Points"
      description="Where are the biggest time drains and frustrations in your business?"
      onBack={onBack}
      onContinue={onContinue}
      continueDisabled={!isValid}
      loading={loading}
    >
      <div className="question-group space-y-5">
        <div className="question-group-label">
          <span className="label-dot" />
          <span>Time & Effort Drains</span>
        </div>
        <Textarea
          id="repetitive_task"
          label="What is the most repetitive, soul-crushing task your team does every week?"
          required
          value={answers.repetitive_task || ''}
          onChange={(e) => update('repetitive_task', e.target.value)}
        />
        <Input
          id="manual_data_entry_hours"
          label="Approximately how many hours per week does your team spend on manual data entry?"
          type="number"
          min={0}
          max={168}
          value={answers.manual_data_entry_hours || ''}
          onChange={(e) => update('manual_data_entry_hours', e.target.value)}
          placeholder="All staff combined"
        />
      </div>

      <div className="question-group space-y-5">
        <div className="question-group-label">
          <span className="label-dot" />
          <span>Errors & Response Time</span>
        </div>
        <Textarea
          id="human_errors"
          label="Where do human errors most commonly occur in your business?"
          value={answers.human_errors || ''}
          onChange={(e) => update('human_errors', e.target.value)}
        />
        <Input
          id="response_time"
          label="What is your typical response time to a new customer enquiry?"
          required
          value={answers.response_time || ''}
          onChange={(e) => update('response_time', e.target.value)}
          placeholder="e.g. Same day, within the hour"
          maxLength={200}
        />
      </div>

      <div className="question-group">
        <div className="question-group-label">
          <span className="label-dot" />
          <span>If You Could Change One Thing</span>
        </div>
        <Textarea
          id="magic_wand_task"
          label="If you could wave a magic wand and delete one recurring task forever, what would it be?"
          value={answers.magic_wand_task || ''}
          onChange={(e) => update('magic_wand_task', e.target.value)}
        />
      </div>
    </StageForm>
  )
}
