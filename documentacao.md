**Hydro — Documentação do Projeto**

---

**Stack**
- HTML/CSS/JS puro — single file (`index.html`)
- PWA: `manifest.json` + `service-worker.js`
- Persistência: `localStorage` (sem banco de dados)
- Hospedagem: GitHub Pages (`github.com/jjangelo77/hydro`)
- Domínio: `hydro.iasolution.cloud` via CNAME na Hostinger → `jjangelo77.github.io`

---

**Funcionalidades implementadas**

- Tela de senha (`jon*77`) com autenticação salva no localStorage
- Configuração: horário início/fim, meta diária (ml), volume da garrafa (ml)
- Cálculo automático de slots: divide a janela de horas pelo número de garrafas necessárias
- Check por slot — marca/desmarca com toque
- Ring de progresso animado com % e ml bebidos
- Stats: garrafas feitas, ml restantes, horário do próximo slot
- Banner de meta atingida
- Histórico automático dos últimos 7 dias (salva ao virar o dia)
- Notificações push nativas no horário de cada slot
- Reset manual do dia
- Instalável como PWA via Safari (iOS) ou Chrome (Android)

---

**Arquivos do projeto**
```
iasolution_water/
  index.html        — app completo
  manifest.json     — configuração PWA
  service-worker.js — cache offline
  icon-192.png      — ícone PWA
  icon-512.png      — ícone PWA
```

---

**Configuração DNS (Hostinger)**
- Tipo: CNAME
- Nome: `hydro`
- Aponta para: `jjangelo77.github.io`

---

**Pendente / futuro**
- Migrar localStorage para Supabase (se virar produto)
- Adicionar auth real (se virar produto)
- Screenshot no manifest para banner de instalação mais rico
- Ícone customizado com identidade visual IASolution

---

**Lógica de negócio**
- Meta: 4L/dia, garrafa: 750ml → 6 slots de ~2h35min (07:30–23:00)
- Cada slot representa uma garrafa a ser consumida naquele período
- Notificação push dispara no início de cada slot
- Histórico reseta automaticamente na virada do dia e salva o dia anterior