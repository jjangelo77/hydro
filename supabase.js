// ─── SUPABASE CLIENT ────────────────────────────────────────
var SUPA_URL  = 'https://bxzbabkngdveobfewuxp.supabase.co';
var SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4emJhYmtuZ2R2ZW9iZmV3dXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzkwNDUsImV4cCI6MjA2NDkxNTA0NX0.Fc5bcB9RLiXZqEADLt6a_KwJKOTgr2qGQ-VcLwsyGzo';

var sb = supabase.createClient(SUPA_URL, SUPA_ANON, {
  auth: { flowType: 'implicit', detectSessionInUrl: true }
});

// ─── AUTH ────────────────────────────────────────────────────
function initAuth(onAuthenticated, onUnauthenticated) {
  var log = function(msg) {
    var logs = JSON.parse(localStorage.getItem('hydro_log') || '[]');
    logs.push(new Date().toISOString().slice(11,19) + ' ' + msg);
    localStorage.setItem('hydro_log', JSON.stringify(logs.slice(-30)));
  };

  sb.auth.getSession().then(function(result) {
    var session = result.data.session;
    log('getSession: ' + (session ? session.user.id : 'null'));
    if (session) {
      onAuthenticated(session.user);
    } else {
      onUnauthenticated();
      sb.auth.onAuthStateChange(function(event, session) {
        log('event: ' + event + ' session: ' + (session ? session.user.id : 'null'));
        if (event === 'SIGNED_IN' && session) {
          onAuthenticated(session.user);
        }
      });
    }
  });
}

function signInGoogle() {
  sb.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + window.location.pathname }
  });
}

function signOut() {
  sb.auth.signOut().then(function() { window.location.reload(); });
}

// ─── DB HELPERS ──────────────────────────────────────────────
function dbLoadUser(userId) {
  return sb.from('hydro_users').select('*').eq('user_id', userId).maybeSingle().then(function(r) { return r.data; });
}
function dbSaveUser(userId, config, profile) {
  return sb.from('hydro_users').upsert({
    user_id: userId, nome: profile.nome, peso: profile.peso,
    meta_ml: config.meta, volume_garrafa_ml: config.garrafa,
    hora_inicio: config.inicio, hora_fim: config.fim,
    atualizado_em: new Date().toISOString()
  }, { onConflict: 'user_id' });
}
function dbLoadDays(userId) {
  return sb.from('hydro_days').select('*').eq('user_id', userId).then(function(r) { return r.data || []; });
}
function dbSaveDay(userId, dateStr, slots, config) {
  var marcados = Object.values(slots).filter(Boolean).length;
  var n   = Math.ceil(config.meta / config.garrafa);
  var ml  = marcados * config.garrafa;
  var pct = Math.round((ml / config.meta) * 100);
  var pts = marcados * 10;
  var medalha = pct >= 100 ? 'ouro' : pct >= 75 ? 'prata' : pct >= 50 ? 'bronze' : null;
  return sb.from('hydro_days').upsert({
    user_id: userId, data: dateStr, ml_bebidos: ml, percentual: pct,
    garrafas: marcados, total_slots: n, pontos: pts, medalha: medalha,
    slots: slots, atualizado_em: new Date().toISOString()
  }, { onConflict: 'user_id,data' }).then(function() {
    return sb.from('hydro_days').select('pontos').eq('user_id', userId).then(function(r) {
      var total = (r.data || []).reduce(function(s, d) { return s + d.pontos; }, 0);
      return sb.from('hydro_points').upsert({
        user_id: userId, pontos_total: total, atualizado_em: new Date().toISOString()
      }, { onConflict: 'user_id' });
    });
  });
}