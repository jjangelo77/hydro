# Hydro — Documentação do Projeto

---

## Stack
- HTML/CSS/JS puro — dois arquivos (`index.html` + `history.html`)
- PWA: `manifest.json` + `service-worker.js` (desregistrado automaticamente para evitar cache)
- Persistência: **Supabase** (migrado de localStorage) — dados sincronizados entre dispositivos
- Auth: **Supabase Auth** com Google OAuth (implicit flow)
- Hospedagem: GitHub Pages (`github.com/jjangelo77/hydro`)
- Domínio: `hydro.iasolution.cloud` via CNAME na Hostinger → `jjangelo77.github.io`

---

## Arquivos do projeto
```
iasolution_water/
  index.html        — tela principal
  history.html      — dashboard de histórico e stats
  supabase-sdk.js   — SDK do Supabase (local, evita bloqueio de tracking prevention)
  supabase.js       — client, auth helpers e DB helpers
  manifest.json     — configuração PWA
  service-worker.js — desregistrado automaticamente no boot
  icon-192.png      — ícone PWA
  icon-512.png      — ícone PWA
```

---

## Supabase

- **Projeto:** `bxzbabkngdveobfewuxp`
- **URL:** `https://bxzbabkngdveobfewuxp.supabase.co`
- **RLS:** desabilitado (até implementação futura)

### Tabelas

**`hydro_users`**
| Coluna | Tipo |
|---|---|
| user_id | uuid (PK) |
| nome | text |
| peso | numeric |
| meta_ml | integer |
| volume_garrafa_ml | integer |
| hora_inicio | time |
| hora_fim | time |
| atualizado_em | timestamptz |
| criado_em | timestamptz |

**`hydro_days`**
| Coluna | Tipo |
|---|---|
| user_id | uuid |
| data | date |
| ml_bebidos | integer |
| percentual | numeric |
| garrafas | integer |
| total_slots | integer |
| pontos | integer |
| medalha | text |
| slots | jsonb |
| atualizado_em | timestamptz |
| criado_em | timestamptz |

Constraint: `UNIQUE(user_id, data)`

**`hydro_points`**
| Coluna | Tipo |
|---|---|
| user_id | uuid (PK) |
| pontos_total | integer |
| atualizado_em | timestamptz |

---

## Auth — fluxo

- `supabase-sdk.js` e `supabase.js` carregados no `<head>`
- `implicit` flow — token retorna via `#access_token` na URL após OAuth
- `initAuth(onAuthenticated, onUnauthenticated)` chama `getSession()` direto
- `login-screen` oculto por padrão (`display:none`) — aparece só se sem sessão
- Sessão persiste no `localStorage` do Supabase — usuário permanece logado entre sessões
- `history.html` verifica sessão via `initAuth` — redireciona para `index.html` se não autenticado
- Auth aberto — qualquer conta Google pode logar (restrição via RLS no E5)

---

## Funcionalidades — index.html

- Tela de login com botão "Entrar com Google"
- Tela de configuração em página separada (sem modal)
- Perfil: nome e peso — meta calculada automaticamente (`peso × 37ml`, arredondada para múltiplos de 250ml)
- Meta ajustável manualmente após cálculo automático
- Configuração: horário início/fim, meta diária (ml), volume da garrafa (ml)
- Config e perfil salvos no Supabase (`hydro_users`) ao salvar
- Ao autenticar: carrega config do `hydro_users` e histórico do `hydro_days`, popula `state`
- `state.lastDay` usa `todayStr()` (formato `YYYY-M-D`) para consistência com `checkDayReset`
- Slots do dia atual restaurados do Supabase ao recarregar — checks persistem entre navegações
- Check por slot — marca/desmarca com toque — salva no Supabase (`hydro_days`) a cada toggle
- Date format no toggle: ISO `YYYY-MM-DD` para consistência com Supabase
- Slots do Supabase parseados de string JSON para objeto quando necessário
- Ring de progresso animado com % e ml bebidos
- Stats: garrafas feitas, ml restantes, horário do próximo slot (exibe horário fim quando no último slot)
- Meta diária sempre visível no header: `sex · 9 mai · meta 4.000 ml`
- Saudação personalizada: `Olá, Jonas` em azul abaixo do H2O
- Banner de meta atingida
- Animação de medalha com partículas ao atingir meta diária ou semanal
- Sistema de pontos salvo no Supabase (`hydro_points`)
- Card de histórico sempre visível no final — clicável → `history.html`
- Histórico automático salvo ao virar o dia
- Notificações push nativas no horário de cada slot
- Reset manual do dia

---

## Funcionalidades — history.html

- Loading screen inicial evita flash de conteúdo sem autenticação
- Ao autenticar: carrega config do `hydro_users` e histórico completo do `hydro_days`
- `state.history` populado direto do Supabase — independente do localStorage
- Slots parseados de string JSON para objeto quando necessário
- Card de pontos totais com badge dinâmico: 💧→🥉→🥈→🥇→💎
- Pontos calculados incluindo dia atual (via `state.checks`)
- Filtro de mês/ano — setas ‹ › para navegar + clique no nome abre seletor
- Resumo mensal: dias completos, média % do mês, pontos ganhos no mês
- Calendário mensal em grid 7 colunas (semana começa no domingo) — cada dia clicável
- Modal de detalhe ao clicar no dia: data, %, garrafas, ml, pontos e medalha
- Card de resumo semanal — semana fixa (dom–sáb), mostra X/7 dias completos
- Botão voltar → `index.html`

---

## Calendário mensal — código de cores
- 🟢 Verde — 100% da meta atingida
- 🔵 Azul — parcial (> 0%)
- 🔴 Vermelho — 0% (dia registrado mas sem consumo)
- ⬛ Cinza escuro — sem dados
- Desbotado — dias futuros

---

## Sistema de medalhas e pontos

**Diário:**
- 🥉 Bronze — ≥ 50% — 10 pts
- 🥈 Prata — ≥ 75% — 20 pts
- 🥇 Ouro — 100% — 50 pts

**Semanal (semana fixa dom–sáb):**
- 🥉 Bronze — ≥ 4 dias completos — 50 pts
- 🥈 Prata — ≥ 5 dias — 100 pts
- 🥇 Ouro — ≥ 6 dias — 200 pts
- 💎 Diamante — 7 dias + média 100% — 500 pts

**Badge do card de pontos:**
- 💧 0–99 pts
- 🥉 100–499 pts
- 🥈 500–999 pts
- 🥇 1.000–1.999 pts
- 💎 2.000+ pts

---

## Header — hierarquia visual
```
IASOLUTION   ← badge fundo branco (CSS .h-brand com background #e8f4ff)
H2O          ← título fixo grande
Olá, Jonas   ← nome do usuário em azul
sex · 9 mai · meta 4.000 ml  ← data + meta fixa
```

---

## Configuração DNS (Hostinger)
- Tipo: CNAME
- Nome: `hydro`
- Aponta para: `jjangelo77.github.io`

---

## Lógica de negócio
- Meta calculada: `peso × 37ml`, arredondada para múltiplos de 250ml
- Meta pode ser sobrescrita manualmente
- Slots: `janela de horas ÷ número de garrafas`
- Exemplo padrão: 4L/dia, 750ml/garrafa → 6 slots de ~2h35min (07:30–23:00)
- Notificação push dispara no início de cada slot
- Histórico salvo automaticamente na virada do dia
- Dados persistem no Supabase — sincronizados entre dispositivos e browsers
- Pontos calculados: `garrafas marcadas × 10` por dia

---

## Observações importantes
- `supabase-sdk.js` deve ser servido localmente (não via CDN) para evitar bloqueio de tracking prevention nos browsers
- Service worker desregistrado automaticamente no boot para evitar cache de arquivos antigos
- Login persiste entre sessões via `localStorage` do Supabase SDK
- Mesmo usuário pode logar em múltiplos dispositivos simultaneamente
- `todayStr()` retorna formato `YYYY-M-D` — usado em `state.lastDay` e `checkDayReset`
- Supabase usa formato ISO `YYYY-MM-DD` na coluna `data` — toggle usa `new Date().toISOString().slice(0,10)`
- Slots retornados do Supabase podem vir como string JSON — sempre parsear antes de usar

---

## Etapas — status

- E1 ✅ Tabelas Supabase criadas
- E2 ✅ CDN local + `supabase.js` + tela login Google
- E3 ✅ `index.html` — dados salvam e carregam do Supabase, login OAuth funcionando
- E4 ✅ `history.html` — lê histórico do `hydro_days` diretamente do Supabase
- E5 ⏳ Testes + gráfico de consumo + RLS com policies corretas para produção

---

## Roadmap — pendente / futuro
- E5: Testes + RLS com policies por `user_id`
- Ranking entre usuários (hydro points)
- Screenshot no manifest para banner de instalação mais rico no Android
- Ícone customizado com identidade visual IASolution