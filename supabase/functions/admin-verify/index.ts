const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { token } = await req.json();
    if (!token) {
      return new Response(JSON.stringify({ valid: false }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const adminLogin = Deno.env.get('ADMIN_LOGIN');
    const adminPassword = Deno.env.get('ADMIN_PASSWORD');

    if (!adminLogin || !adminPassword) {
      return new Response(JSON.stringify({ valid: false }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const parts = token.split('.');
    if (parts.length !== 3) {
      return new Response(JSON.stringify({ valid: false }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const [header, body, sig] = parts;
    const secret = new TextEncoder().encode(adminPassword + adminLogin);
    const key = await crypto.subtle.importKey(
      'raw', secret, { name: 'HMAC', hash: 'SHA-256' }, false, ['verify']
    );

    // Restore base64 padding
    const padSig = sig.replace(/-/g, '+').replace(/_/g, '/');
    const sigBytes = Uint8Array.from(atob(padSig), (c) => c.charCodeAt(0));

    const valid = await crypto.subtle.verify(
      'HMAC', key, sigBytes, new TextEncoder().encode(`${header}.${body}`)
    );

    if (!valid) {
      return new Response(JSON.stringify({ valid: false }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check expiry
    const padBody = body.replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(padBody));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return new Response(JSON.stringify({ valid: false, reason: 'expired' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ valid: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ valid: false }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
