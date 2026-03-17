import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import type { Assessment, Response } from '@/lib/types/database'

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#050505',
    padding: 40,
  },
  title: {
    fontSize: 28,
    color: '#ffffff',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  accent: {
    color: '#10b981',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: 6,
  },
  text: {
    fontSize: 11,
    color: '#ffffff',
    marginBottom: 4,
    lineHeight: 1.5,
  },
  sectionTitle: {
    fontSize: 16,
    color: '#10b981',
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 6,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  label: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 30,
    gap: 30,
  },
  scoreBox: {
    alignItems: 'center',
    padding: 16,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  scoreLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.6)',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  totalText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#10b981',
  },
})

function getScoreColor(value: number): string {
  if (value >= 70) return '#10b981'
  if (value >= 40) return '#f59e0b'
  return '#ef4444'
}

interface ReportDocumentProps {
  assessment: Assessment
  responses: Response[]
}

const STAGE_LABELS: Record<string, string> = {
  stage_1: 'Business Profile',
  stage_1b: 'Industry-Specific Questions',
  stage_2: 'Software Stack',
  stage_3: 'Workflows & Automations',
  stage_4: 'Pain Points',
  stage_5: 'Future Vision',
}

const FIELD_LABELS: Record<string, string> = {
  business_name: 'Business Name',
  website_url: 'Website URL',
  business_purpose: 'Primary Purpose',
  core_products: 'Core Products/Services',
  employee_count: 'Number of Employees',
  bottleneck_department: 'Biggest Bottleneck Department',
  industry: 'Industry',
  is_decision_maker: 'Is Decision Maker',
  decision_maker_name: 'Decision Maker Name/Role',
  email_calendar: 'Email & Calendar',
  crm_tool: 'CRM/Lead Management',
  project_management: 'Project Management & Comms',
  data_storage: 'Data Storage',
  specialised_software: 'Specialised Software',
  automation_tools: 'Automation Tools',
  lead_process: 'Lead/Enquiry Process',
  invoice_process: 'Invoice & Contract Process',
  auto_replies: 'Auto-replies/Chatbots',
  manual_data_transfer: 'Manual Data Transfer Scale',
  repetitive_task: 'Most Repetitive Task',
  manual_data_entry_hours: 'Manual Data Entry Hours/Week',
  human_errors: 'Common Human Errors',
  response_time: 'Customer Enquiry Response Time',
  magic_wand_task: 'Task to Eliminate',
  success_vision: '6-Month Success Vision',
  automated_focus: 'Focus After Automation',
  ai_autonomy: 'AI Autonomy Comfort Level',
  primary_concern: 'Primary AI Concern',
  timeline: 'Desired Timeline',
  budget: 'Budget Range',
}

export function ReportDocument({ assessment, responses }: ReportDocumentProps) {
  const score = assessment.ai_readiness_score
  const stage6 = assessment.stage_6_data
  const stage7 = assessment.stage_7_data

  return (
    <Document>
      {/* Cover Page */}
      <Page size="A4" style={styles.page}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.title, { fontSize: 18, marginBottom: 30 }]}>
            CBR AI Agency
          </Text>
          <Text style={[styles.title, { fontSize: 32, textAlign: 'center' }]}>
            AI Discovery Report
          </Text>
          <Text style={[styles.subtitle, { fontSize: 16, marginTop: 10 }]}>
            {assessment.client_name}
          </Text>
          {assessment.company_name && (
            <Text style={[styles.subtitle, { fontSize: 13 }]}>
              {assessment.company_name}
            </Text>
          )}
          {assessment.industry && (
            <Text style={[styles.subtitle, { fontSize: 11 }]}>
              {assessment.industry}
            </Text>
          )}
          {score && (
            <View style={styles.scoreContainer}>
              <View style={styles.scoreBox}>
                <Text style={[styles.scoreValue, { color: getScoreColor(score.overall) }]}>
                  {score.overall}
                </Text>
                <Text style={styles.scoreLabel}>AI Readiness Score</Text>
              </View>
            </View>
          )}
          <Text style={[styles.subtitle, { fontSize: 10, marginTop: 20 }]}>
            {new Date().toLocaleDateString('en-AU', { year: 'numeric', month: 'long', day: 'numeric' })}
          </Text>
        </View>
      </Page>

      {/* Executive Summary (if Stage 6 exists) */}
      {stage6 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Executive Summary</Text>
          <View style={styles.card}>
            <Text style={styles.text}>{stage6.executive_summary}</Text>
          </View>
          {score && (
            <View style={styles.scoreContainer}>
              <View style={styles.scoreBox}>
                <Text style={[styles.scoreValue, { color: getScoreColor(score.overall) }]}>
                  {score.overall}/100
                </Text>
                <Text style={styles.scoreLabel}>Overall AI Readiness</Text>
              </View>
              <View style={styles.scoreBox}>
                <Text style={[styles.scoreValue, { fontSize: 24, color: getScoreColor(score.digital_maturity * 10) }]}>
                  {score.digital_maturity}/10
                </Text>
                <Text style={styles.scoreLabel}>Digital Maturity</Text>
              </View>
              <View style={styles.scoreBox}>
                <Text style={[styles.scoreValue, { fontSize: 24, color: getScoreColor(score.automation_potential * 10) }]}>
                  {score.automation_potential}/10
                </Text>
                <Text style={styles.scoreLabel}>Automation Potential</Text>
              </View>
            </View>
          )}
        </Page>
      )}

      {/* Client Responses Pages */}
      {responses.map((response) => (
        <Page key={response.stage} size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>
            {STAGE_LABELS[response.stage] || response.stage}
          </Text>
          {Object.entries(response.answers as Record<string, unknown>).map(([key, value]) => (
            <View key={key} style={styles.card}>
              <Text style={styles.label}>
                {FIELD_LABELS[key] || key.replace(/_/g, ' ')}
              </Text>
              <Text style={styles.text}>
                {String(value || '—')}
              </Text>
            </View>
          ))}
        </Page>
      ))}

      {/* Recommendations (Stage 6) */}
      {stage6 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Recommendations</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Recommended Solution</Text>
            <Text style={styles.text}>{stage6.recommended_solution}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Automation Logic</Text>
            <Text style={styles.text}>{stage6.automation_logic}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Key Business Benefit</Text>
            <Text style={styles.text}>{stage6.key_benefit}</Text>
          </View>
          {stage6.recommended_services.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.label}>Recommended Services</Text>
              <Text style={styles.text}>{stage6.recommended_services.join(', ')}</Text>
            </View>
          )}
          <View style={styles.card}>
            <Text style={styles.label}>Detailed Recommendations</Text>
            <Text style={styles.text}>{stage6.detailed_recommendations}</Text>
          </View>
        </Page>
      )}

      {/* Quote (Stage 7) */}
      {stage7 && (
        <Page size="A4" style={styles.page}>
          <Text style={styles.sectionTitle}>Proposed Investment</Text>
          <View style={styles.card}>
            <Text style={styles.label}>Package</Text>
            <Text style={[styles.text, styles.accent]}>{stage7.package}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>One-Time Costs</Text>
            <View style={styles.row}>
              <Text style={styles.text}>Setup / Implementation</Text>
              <Text style={styles.text}>${stage7.setup_cost.toLocaleString()}</Text>
            </View>
            {stage7.line_items
              .filter((item) => item.one_time_cost > 0)
              .map((item) => (
                <View key={item.id} style={styles.row}>
                  <Text style={styles.text}>{item.name}</Text>
                  <Text style={styles.text}>${item.one_time_cost.toLocaleString()}</Text>
                </View>
              ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total One-Time</Text>
              <Text style={styles.totalText}>
                ${(stage7.setup_cost + stage7.line_items.reduce((sum, i) => sum + i.one_time_cost, 0)).toLocaleString()}
              </Text>
            </View>
          </View>
          <View style={styles.card}>
            <Text style={styles.label}>Monthly Costs</Text>
            <View style={styles.row}>
              <Text style={styles.text}>Monthly Maintenance</Text>
              <Text style={styles.text}>${stage7.monthly_maintenance.toLocaleString()}/mo</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.text}>Monthly API Costs</Text>
              <Text style={styles.text}>${stage7.monthly_api_costs.toLocaleString()}/mo</Text>
            </View>
            {stage7.line_items
              .filter((item) => item.monthly_cost > 0)
              .map((item) => (
                <View key={item.id} style={styles.row}>
                  <Text style={styles.text}>{item.name}</Text>
                  <Text style={styles.text}>${item.monthly_cost.toLocaleString()}/mo</Text>
                </View>
              ))}
            <View style={styles.totalRow}>
              <Text style={styles.totalText}>Total Monthly</Text>
              <Text style={styles.totalText}>
                ${(stage7.monthly_maintenance + stage7.monthly_api_costs + stage7.line_items.reduce((sum, i) => sum + i.monthly_cost, 0)).toLocaleString()}/mo
              </Text>
            </View>
          </View>
          {stage7.proposed_timeline && (
            <View style={styles.card}>
              <Text style={styles.label}>Proposed Timeline</Text>
              <Text style={styles.text}>{stage7.proposed_timeline}</Text>
            </View>
          )}
          {stage7.next_steps && (
            <View style={styles.card}>
              <Text style={styles.label}>Next Steps</Text>
              <Text style={styles.text}>{stage7.next_steps}</Text>
            </View>
          )}
        </Page>
      )}
    </Document>
  )
}
