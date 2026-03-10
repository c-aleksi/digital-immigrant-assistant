import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function verifyAdminToken(token: string): Promise<boolean> {
  const adminLogin = Deno.env.get('ADMIN_LOGIN')
  const adminPassword = Deno.env.get('ADMIN_PASSWORD')
  if (!adminLogin || !adminPassword) return false

  try {
    const parts = token.split('.')
    if (parts.length !== 3) return false

    const [header, body, sig] = parts
    const secret = new TextEncoder().encode(adminPassword + adminLogin)
    const key = await crypto.subtle.importKey(
      'raw', secret, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    )

    const padSig = sig.replace(/-/g, '+').replace(/_/g, '/')
    const sigBytes = Uint8Array.from(atob(padSig), (c) => c.charCodeAt(0))

    const valid = await crypto.subtle.verify(
      'HMAC', key, sigBytes, new TextEncoder().encode(`${header}.${body}`)
    )
    if (!valid) return false

    const padBody = body.replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(padBody))
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return false

    return true
  } catch {
    return false
  }
}

function getSupabaseAdmin() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  const json = (data: unknown, status = 200) =>
    new Response(JSON.stringify(data), {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

  try {
    const { token, action, ...params } = await req.json()

    if (!token || !(await verifyAdminToken(token))) {
      return json({ error: 'Unauthorized' }, 401)
    }

    const sb = getSupabaseAdmin()

    // LIST
    if (action === 'list') {
      const { search, language, municipality, scenario, consent, sort_by, sort_dir, page, per_page } = params
      let query = sb.from('subscribers').select('*', { count: 'exact' })

      if (search) {
        query = query.ilike('email', `%${search}%`)
      }
      if (language) query = query.eq('language', language)
      if (municipality) query = query.eq('municipality', municipality)
      if (scenario) query = query.eq('scenario', scenario)
      if (consent === true || consent === false) query = query.eq('consent_status', consent)

      const sortCol = sort_by || 'created_at'
      const ascending = sort_dir === 'asc'
      query = query.order(sortCol, { ascending })

      const p = page || 1
      const pp = per_page || 25
      const from = (p - 1) * pp
      query = query.range(from, from + pp - 1)

      const { data, count, error } = await query
      if (error) return json({ error: error.message }, 400)
      return json({ data, total: count })
    }

    // GET
    if (action === 'get') {
      const { id } = params
      const { data, error } = await sb.from('subscribers').select('*').eq('id', id).single()
      if (error) return json({ error: error.message }, 404)
      return json({ data })
    }

    // UPDATE
    if (action === 'update') {
      const { id, updates } = params
      const allowed = ['email', 'consent_status', 'language', 'municipality', 'scenario']
      const clean: Record<string, unknown> = { updated_at: new Date().toISOString() }
      for (const k of allowed) {
        if (updates && k in updates) clean[k] = updates[k]
      }
      if (clean.email) clean.email = (clean.email as string).toLowerCase().trim()

      const { data, error } = await sb.from('subscribers').update(clean).eq('id', id).select().single()
      if (error) return json({ error: error.message }, 400)
      return json({ data })
    }

    // DELETE
    if (action === 'delete') {
      const { id } = params
      const { error } = await sb.from('subscribers').delete().eq('id', id)
      if (error) return json({ error: error.message }, 400)
      return json({ success: true })
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (e) {
    return json({ error: 'Internal error' }, 500)
  }
})
