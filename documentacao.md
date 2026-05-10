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

- Tela de senha com autenticação salva no `localStorage`
- Tela de configuração em página separada (sem modal)
- Perfil: nome, peso — meta calculada automaticamente (`peso × 35ml`)
- Meta ajustável manualmente após cálculo automático
- Configuração: horário início/fim, meta diária (ml), volume da garrafa (ml)
- Cálculo automático de slots: divide a janela de horas pelo número de garrafas necessárias
- Check por slot — marca/desmarca com toque
- Ring de progresso animado com % e ml bebidos
- Stats: garrafas feitas, ml restantes, horário do próximo slot
- Meta diária sempre visível no header: `sex · 9 mai · meta 4.000 ml`
- Saudação personalizada: `Olá, Jonas` em destaque abaixo do H2O
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

**Header — hierarquia visual**
```
IASOLUTION   ← badge azul escuro fundo branco
H2O          ← título fixo grande
Olá, Jonas   ← nome do usuário em azul (vem do perfil)
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
- Slots calculados: `janela de horas ÷ número de garrafas`
- Exemplo padrão: 4L/dia, 750ml/garrafa → 6 slots de ~2h35min (07:30–23:00)
- Notificação push dispara no início de cada slot
- Histórico reseta automaticamente na virada do dia e salva o dia anterior
- Máximo de 7 dias de histórico no `localStorage`

---

**Pendente / futuro**
- Migrar `localStorage` para Supabase (se virar produto)
- Adicionar auth real (se virar produto)
- Screenshot no manifest para banner de instalação mais rico no Android
- Ícone customizado com identidade visual IASolution