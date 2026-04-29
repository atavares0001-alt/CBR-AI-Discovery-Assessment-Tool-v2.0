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
  // Safety guard — destructive script.
  if (process.env.NODE_ENV === 'production') {
    console.error('Refusing to run delete script with NODE_ENV=production.')
    process.exit(1)
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  if (!/localhost|127\.0\.0\.1|kong/i.test(supabaseUrl) && process.env.DELETE_CONFIRM !== 'YES_DELETE') {
    console.error(
      `\nThis script will DELETE every stage_1b response in:\n  ${supabaseUrl}\n\n` +
        `That URL does not look like a local Supabase instance.\n` +
        `If you really want to run it, re-run with:\n\n` +
        `  DELETE_CONFIRM=YES_DELETE npx tsx scripts/delete-stage1b-responses.ts\n`,
    )
    process.exit(1)
  }

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
