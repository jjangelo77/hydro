// ─── SUPABASE CLIENT ────────────────────────────────────────
const SUPA_URL  = 'https://bxzbabkngdveobfewuxp.supabase.co';
const SUPA_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4emJhYmtuZ2R2ZW9iZmV3dXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzkwNDUsImV4cCI6MjA2NDkxNTA0NX0.Fc5bcB9RLiXZqEADLt6a_KwJKOTgr2qGQ-VcLwsyGzo';

const { createClient } = supabase;
const sb = createClient(SUPA_URL, SUPA_ANON);

// ─── AUTH HELPERS ────────────────────────────────────────────
async function getSession() {
  const { data } = await sb.auth.getSession();
  return data.session;
}

async function getUser() {
  const session = await getSession();
  return session ? session.user : null;
}

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
// Chamado em cada página para decidir mostrar login ou app
async function initAuth(onAuthenticated, onUnauthenticated) {
  // Primeiro checa sessão existente (inclui callback OAuth)
  const { data: { session } } = await sb.auth.getSession();

  if (session) {
    onAuthenticated(session.user);
  } else {
    onUnauthenticated();
  }

  // Escuta mudanças (login/logout em tempo real)
  sb.auth.onAuthStateChange((_event, session) => {
    if (session) {
      onAuthenticated(session.user);
    } else {
      onUnauthenticated();
    }
  });
}