**Hydro — Documentação do Projeto**

---

**Stack**
- HTML/CSS/JS puro — dois arquivos (`index.html` + `history.html`)
- PWA: `manifest.json` + `service-worker.js`
- Persistência: `localStorage` (sem banco de dados) — até 5 anos de histórico (~365KB)
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
- Perfil: nome e peso — meta calculada automaticamente (`peso × 35ml`, arredondada para múltiplos de 250ml)
- Meta ajustável manualmente após cálculo automático
- Configuração: horário início/fim, meta diária (ml), volume da garrafa (ml)
- Cálculo automático de slots: divide a janela de horas pelo número de garrafas necessárias
- Check por slot — marca/desmarca com toque
- Ring de progresso animado com % e ml bebidos
- Stats: garrafas feitas, ml restantes, horário do próximo slot
- Meta diária sempre visível no header: `sex · 9 mai · meta 4.000 ml`
- Saudação personalizada: `Olá, Jonas` em azul abaixo do H2O
- Banner de meta atingida
- Animação de medalha com partículas ao atingir meta diária ou semanal
- Sistema de pontos salvo no `localStorage`
- Card de histórico sempre visível no final — clicável → `history.html`
- Histórico automático salvo ao virar o dia (até 5 anos / 1.825 dias)
- Notificações push nativas no horário de cada slot
- Reset manual do dia

---

**Funcionalidades — history.html**

- Card de pontos totais com badge dinâmico: 💧→🥉→🥈→🥇→💎
- Filtro de mês/ano — setas ‹ › para navegar + clique no nome abre seletor
- Resumo mensal: dias completos, média % do mês, pontos ganhos no mês
- Calendário mensal em grid 7 colunas — cada dia clicável
- Modal de detalhe ao clicar no dia: data, %, garrafas, ml, pontos e medalha
- Cards dos últimos 7 dias com dados do mês selecionado
- Botão voltar → `index.html`

---

**Calendário mensal — código de cores**
- 🟢 Verde — 100% da meta atingida
- 🔵 Azul — parcial (> 0%)
- 🔴 Vermelho — 0% (dia registrado mas sem consumo)
- ⬛ Cinza escuro — sem dados
- Desbotado — dias futuros

---

**Sistema de medalhas e pontos**

Diário:
- 🥉 Bronze — ≥ 50% — 10 pts
- 🥈 Prata — ≥ 75% — 20 pts
- 🥇 Ouro — 100% — 50 pts

Semanal:
- 🥉 Bronze — ≥ 4 dias completos — 50 pts
- 🥈 Prata — ≥ 5 dias — 100 pts
- 🥇 Ouro — ≥ 6 dias — 200 pts
- 💎 Diamante — 7 dias + média 100% — 500 pts

Badge do card de pontos:
- 💧 0–99 pts
- 🥉 100–499 pts
- 🥈 500–999 pts
- 🥇 1.000–1.999 pts
- 💎 2.000+ pts

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
- Meta calculada: `peso × 37ml`, arredondada para múltiplos de 250ml
- Meta pode ser sobrescrita manualmente
- Slots: `janela de horas ÷ número de garrafas`
- Exemplo padrão: 4L/dia, 750ml/garrafa → 6 slots de ~2h35min (07:30–23:00)
- Notificação push dispara no início de cada slot
- Histórico salvo automaticamente na virada do dia
- Máximo de 1.825 dias (~5 anos) no `localStorage`
- Pontos e medalhas salvos no `localStorage`
- Medalhas e animações disparadas apenas no `index.html`

---

**Observações importantes**
- Cada browser tem `localStorage` próprio — dados não sincronizam entre Chrome e Safari
- PWA instalado pelo Safari no iOS é o recomendado
- Limpar cache ou reinstalar o PWA apaga os dados locais
- Migração para Supabase resolve persistência, sincronização e competição entre usuários

---

**Pendente / futuro**
- Migrar `localStorage` para Supabase
- Auth real com login
- Ranking entre usuários (hydro points)
- Screenshot no manifest para banner de instalação mais rico no Android
- Ícone customizado com identidade visual IASolution