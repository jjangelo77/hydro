**Hydro — Documentação do Projeto**

---

**Stack**
- HTML/CSS/JS puro — dois arquivos (`index.html` + `history.html`)
- PWA: `manifest.json` + `service-worker.js`
- Persistência: `localStorage` (sem banco de dados)
- Hospedagem: GitHub Pages (`github.com/jjangelo77/hydro`)
- Domínio: `hydro.iasolution.cloud` via CNAME na Hostinger → `jjangelo77.github.io`

---

**Arquivos do projeto**
```
iasolution_water/
  index.html        — tela principal
  history.html      — dashboard de histórico e stats
  manifest.json     — configuração PWA
  service-worker.js — cache offline (hydro-v4)
  icon-192.png      — ícone PWA
  icon-512.png      — ícone PWA
```

---

**Funcionalidades — index.html**

- Tela de senha com autenticação salva no `localStorage`
- Tela de configuração em página separada (sem modal)
- Perfil: nome, peso — meta calculada automaticamente (`peso × 35ml`)
- Meta ajustável manualmente após cálculo automático
- Configuração: horário início/fim, meta diária (ml), volume da garrafa (ml)
- Cálculo automático de slots: divide a janela de horas pelo número de garrafas
- Check por slot — marca/desmarca com toque
- Ring de progresso animado com % e ml bebidos
- Stats: garrafas feitas, ml restantes, horário do próximo slot
- Meta diária sempre visível no header: `sex · 9 mai · meta 4.000 ml`
- Saudação personalizada: `Olá, Jonas` em azul abaixo do H2O
- Banner de meta atingida
- Card de histórico sempre visível no final (mesmo sem dados), clicável → `history.html`
- Histórico automático dos últimos 7 dias (salva ao virar o dia)
- Notificações push nativas no horário de cada slot
- Reset manual do dia
- Instalável como PWA via Safari (iOS) ou Chrome (Android)

---

**Funcionalidades — history.html**

- Card de pontos totais com badge dinâmico: 💧→🥉→🥈→🥇→💎
- Ring semanal com % médio dos últimos 7 dias e medalha da semana
- Calendário 7 dias com ícone de medalha por dia
- Gráfico de barras: consumo vs meta por dia
- Cards detalhados por dia: garrafas, ml, % e medalha
- Animação com partículas ao ganhar medalha
- Botão voltar → `index.html`

---

**Sistema de medalhas e pontos**

Diário:
- 🥉 Bronze — ≥ 50% — 10 pts
- 🥈 Prata — ≥ 75% — 20 pts
- 🥇 Ouro — 100% — 50 pts

Semanal:
- 🥉 Bronze — ≥ 4 dias com meta — 50 pts
- 🥈 Prata — ≥ 5 dias — 100 pts
- 🥇 Ouro — ≥ 6 dias — 200 pts
- 💎 Diamante — 7 dias + média 100% — 500 pts

Badge do card de pontos:
- 💧 0–99 pts
- 🥉 100–499 pts
- 🥈 500–999 pts
- 🥇 1000–1999 pts
- 💎 2000+ pts

---

**Header — hierarquia visual**
```
IASOLUTION   ← badge azul escuro fundo branco
H2O          ← título fixo grande
Olá, Jonas   ← nome do usuário em azul
sex · 9 mai · meta 4.000 ml  ← data + meta fixa
```

---

**Configuração DNS (Hostinger)**
- Tipo: CNAME
- Nome: `hydro`
- Aponta para: `jjangelo77.github.io`

---

**Lógica de negócio**
- Meta calculada: `peso × 35ml`, arredondada para múltiplos de 250ml
- Meta pode ser sobrescrita manualmente nas configurações
- Slots: `janela de horas ÷ número de garrafas`
- Exemplo padrão: 4L/dia, 750ml/garrafa → 6 slots de ~2h35min (07:30–23:00)
- Notificação push dispara no início de cada slot
- Histórico reseta automaticamente na virada do dia e salva o dia anterior
- Máximo de 7 dias de histórico no `localStorage`
- Pontos e medalhas salvos no `localStorage` — futuro: Supabase para ranking entre usuários

---

**Observações importantes**
- Cada browser tem `localStorage` próprio — dados não sincronizam entre Chrome e Safari
- PWA instalado pelo Safari no iOS é o recomendado
- Ao limpar cache ou reinstalar o PWA os dados locais são perdidos
- Migração para Supabase resolve persistência e competição entre usuários

---

**Pendente / futuro**
- Migrar `localStorage` para Supabase
- Auth real com login
- Ranking entre usuários (hydro points)
- Screenshot no manifest para banner de instalação mais rico no Android
- Ícone customizado com identidade visual IASolution