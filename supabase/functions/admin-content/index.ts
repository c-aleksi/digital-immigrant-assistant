import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
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
      const { content_type, category, search } = params
      let query = sb.from('content_items').select('id, content_type, category, data, updated_at')

      if (content_type) query = query.eq('content_type', content_type)
      if (category) query = query.eq('category', category)

      query = query.order('content_type').order('id')

      const { data, error } = await query
      if (error) return json({ error: error.message }, 400)

      let filtered = data || []
      if (search) {
        const s = search.toLowerCase()
        filtered = filtered.filter((item: Record<string, unknown>) => {
          const d = item.data as Record<string, unknown>
          return (
            item.id.toLowerCase().includes(s) ||
            (d?.title?.en || '').toLowerCase().includes(s) ||
            (d?.title?.ru || '').toLowerCase().includes(s) ||
            (d?.name?.en || '').toLowerCase().includes(s) ||
            (d?.name?.ru || '').toLowerCase().includes(s) ||
            (d?.message?.en || '').toLowerCase().includes(s) ||
            (d?.shortAction?.en || '').toLowerCase().includes(s) ||
            (d?.municipalityId || '').toLowerCase().includes(s) ||
            (d?.categoryId || '').toLowerCase().includes(s)
          )
        })
      }

      return json({ data: filtered })
    }

    // GET
    if (action === 'get') {
      const { id } = params
      const { data, error } = await sb.from('content_items').select('*').eq('id', id).single()
      if (error) return json({ error: error.message }, 404)
      return json({ data })
    }

    // UPDATE
    if (action === 'update') {
      const { id, data: contentData, category: cat } = params
      const updatePayload: Record<string, unknown> = {
        data: contentData,
        updated_at: new Date().toISOString(),
      }
      if (cat !== undefined) {
        updatePayload.category = cat || null
      } else if (contentData?.categoryId) {
        updatePayload.category = contentData.categoryId
      }
      const { data, error } = await sb
        .from('content_items')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single()
      if (error) return json({ error: error.message }, 400)
      return json({ data })
    }

    // CREATE
    if (action === 'create') {
      const { id, content_type, data: contentData, category: cat } = params
      if (!id || !content_type) return json({ error: 'id and content_type required' }, 400)
      const { data, error } = await sb
        .from('content_items')
        .insert({
          id,
          content_type,
          data: contentData,
          category: cat || contentData?.categoryId || null,
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()
      if (error) return json({ error: error.message }, 400)
      return json({ data })
    }

    // SEED
    if (action === 'seed') {
      const { items } = params
      if (!Array.isArray(items) || items.length === 0) {
        return json({ error: 'No items provided' }, 400)
      }

      const { error } = await sb
        .from('content_items')
        .upsert(
          items.map((item: Record<string, unknown>) => ({
            id: item.id as string,
            content_type: item.content_type as string,
            data: item.data,
            category: (item.category as string) || (item.data as Record<string, unknown>)?.categoryId as string || null,
            updated_at: new Date().toISOString(),
          })),
          { onConflict: 'id' }
        )
      if (error) return json({ error: error.message }, 400)
      return json({ success: true, count: items.length })
    }

    // LIST RELATIONS
    if (action === 'list_relations') {
      const { parent_id } = params
      if (!parent_id) return json({ error: 'parent_id required' }, 400)
      const { data, error } = await sb
        .from('content_relations')
        .select('*')
        .eq('parent_id', parent_id)
        .order('position')
      if (error) return json({ error: error.message }, 400)
      return json({ data: data || [] })
    }

    // SET RELATIONS — replace all children for a parent
    if (action === 'set_relations') {
      const { parent_id, child_ids, relation_type } = params
      if (!parent_id || !Array.isArray(child_ids)) {
        return json({ error: 'parent_id and child_ids[] required' }, 400)
      }
      const rt = relation_type || 'bundle_step'

      // Delete existing relations for this parent + type
      const { error: delErr } = await sb
        .from('content_relations')
        .delete()
        .eq('parent_id', parent_id)
        .eq('relation_type', rt)
      if (delErr) return json({ error: delErr.message }, 400)

      // Insert new relations
      if (child_ids.length > 0) {
        const rows = child_ids.map((childId: string, i: number) => ({
          parent_id,
          child_id: childId,
          relation_type: rt,
          position: i,
        }))
        const { error: insErr } = await sb.from('content_relations').insert(rows)
        if (insErr) return json({ error: insErr.message }, 400)
      }

      return json({ success: true, count: child_ids.length })
    }

    return json({ error: 'Unknown action' }, 400)
  } catch (e) {
    return json({ error: 'Internal error' }, 500)
  }
})
