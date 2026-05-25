// ─── SUPABASE CLIENT ────────────────────────────────────────
const SUPA_URL  = 'https://bxzbabkngdveobfewuxp.supabase.co';
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4emJhYmtuZ2R2ZW9iZmV3dXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzkwNDUsImV4cCI6MjA2NDkxNTA0NX0.Fc5bcB9RLiXZqEADLt6a_KwJKOTgr2qGQ-VcLwsyGzo';

const { createClient } = supabase;
const sb = createClient(SUPA_URL, SUPA_ANON, {
  auth: {
    flowType: 'implicit',
    detectSessionInUrl: true
  }
});

// ─── AUTH HELPERS ────────────────────────────────────────────
async function signInGoogle() {
  await sb.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + window.location.pathname
    }
  });
}

async function signOut() {
  await sb.auth.signOut();
  window.location.reload();
}

// ─── AUTH STATE LISTENER ─────────────────────────────────────
async function initAuth(onAuthenticated, onUnauthenticated) {
  let resolved = false;
  sb.auth.onAuthStateChange(async (event, session) => {
    if (event === 'INITIAL_SESSION') {
      if (session) {
        resolved = true;
        await onAuthenticated(session.user);
      } else {
        if (!resolved) onUnauthenticated();
      }
    } else if (event === 'SIGNED_IN' && session) {
      resolved = true;
      await onAuthenticated(session.user);
    } else if (event === 'SIGNED_OUT') {
      resolved = false;
      onUnauthenticated();
    }
  });
}

// ─── DB HELPERS ──────────────────────────────────────────────
async function dbLoadUser(userId) {
  const { data } = await sb.from('hydro_users').select('*').eq('user_id', userId).maybeSingle();
  return data;
}

async function dbSaveUser(userId, config, profile) {
  await sb.from('hydro_users').upsert({
    user_id:           userId,
    nome:              profile.nome,
    peso:              profile.peso,
    meta_ml:           config.meta,
    volume_garrafa_ml: config.garrafa,
    hora_inicio:       config.inicio,
    hora_fim:          config.fim,
    atualizado_em:     new Date().toISOString()
  }, { onConflict: 'user_id' });
}

async function dbLoadDays(userId) {
  const { data } = await sb.from('hydro_days').select('*').eq('user_id', userId);
  return data || [];
}

async function dbSaveDay(userId, dateStr, slots, config) {
  const marcados = Object.values(slots).filter(Boolean).length;
  const n        = Math.ceil(config.meta / config.garrafa);
  const ml       = marcados * config.garrafa;
  const pct      = Math.round((ml / config.meta) * 100);
  const pts      = marcados * 10;
  const medalha  = pct >= 100 ? 'ouro' : pct >= 75 ? 'prata' : pct >= 50 ? 'bronze' : null;
  await sb.from('hydro_days').upsert({
    user_id:       userId,
    data:          dateStr,
    ml_bebidos:    ml,
    percentual:    pct,
    garrafas:      marcados,
    total_slots:   n,
    pontos:        pts,
    medalha:       medalha,
    slots:         slots,
    atualizado_em: new Date().toISOString()
  }, { onConflict: 'user_id,data' });

  // atualiza pontos totais
  const { data: dias } = await sb.from('hydro_days').select('pontos').eq('user_id', userId);
  const total = (dias || []).reduce((s, d) => s + d.pontos, 0);
  await sb.from('hydro_points').upsert({
    user_id:       userId,
    pontos_total:  total,
    atualizado_em: new Date().toISOString()
  }, { onConflict: 'user_id' });
}