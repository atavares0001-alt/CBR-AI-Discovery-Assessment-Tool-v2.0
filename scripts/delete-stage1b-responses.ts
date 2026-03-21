/**
 * One-time cleanup: Deletes all stage_1b responses from the database.
 *
 * Usage:
 *   npx tsx scripts/delete-stage1b-responses.ts
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

const envPath = resolve(__dirname, '..', '.env.local')
const envContent = readFileSync(envPath, 'utf-8')
for (const line of envContent.split('\n')) {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) continue
  const eqIdx = trimmed.indexOf('=')
  if (eqIdx === -1) continue
  const key = trimmed.slice(0, eqIdx).trim()
  const val = trimmed.slice(eqIdx + 1).trim()
  if (!process.env[key]) process.env[key] = val
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

async function main() {
  console.log('Deleting all stage_1b responses...')

  const { data, error } = await supabase
    .from('responses')
    .delete()
    .eq('stage', 'stage_1b')
    .select('id')

  if (error) {
    console.error('Error:', error.message)
    process.exit(1)
  }

  console.log(`Deleted ${data?.length ?? 0} stage_1b response(s).`)
  console.log('Done.')
}

main().catch((err) => {
  console.error('Failed:', err)
  process.exit(1)
})
