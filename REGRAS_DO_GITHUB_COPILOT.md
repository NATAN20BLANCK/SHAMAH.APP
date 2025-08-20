# 🚨 REGRAS DEFINITIVAS - GITHUB COPILOT NÃO PODE ALTERAR

## ⚠️ ATENÇÃO COPILOT: LEIA ANTES DE FAZER QUALQUER MUDANÇA!

### 🔴 NUNCA, JAMAIS, EM HIPÓTESE ALGUMA ALTERAR:

#### 1. **POSIÇÃO DO BOTÃO FAB** 
```tsx
// ✅ POSIÇÃO CORRETA (NÃO MEXER):
container: {
  position: 'absolute',
  top: '50%',        // 🔒 TRAVADO - Centro vertical
  left: '50%',       // 🔒 TRAVADO - Centro horizontal  
  marginTop: -40,    // 🔒 TRAVADO - Centralização
  marginLeft: -40,   // 🔒 TRAVADO - Centralização
  zIndex: 1000,      // 🔒 TRAVADO - Z-index do botão
}

// 🚫 NUNCA MOVER PARA:
// - bottom: X (canto)
// - right: X (lateral)  
// - Qualquer posição que não seja centro!
```

#### 2. **Z-INDEX E POINTER EVENTS**
```tsx
// ✅ CONFIGURAÇÃO CORRETA (NÃO MEXER):
container: {
  zIndex: 1,                    // 🔒 TRAVADO - Baixo para não bloquear botão
  pointerEvents: 'box-none',    // 🔒 TRAVADO - Permite toque no botão
}

// 🚫 NUNCA ALTERAR PARA:
// - zIndex: 9999 (bloqueia botão)
// - pointerEvents: 'auto' (bloqueia botão)
// - Remover pointerEvents
```

#### 3. **ROTAS DO FABMENU**
```tsx
// ✅ ROTAS CORRETAS (NÃO MEXER):
router.push('/tabs/agendados');  // 🔒 TRAVADO
router.push('/tabs/contas');     // 🔒 TRAVADO

// 🚫 NUNCA USAR:
// router.push('/(tabs)/agendados'); // ❌ ERRO
// router.push('/(tabs)/contas');    // ❌ ERRO
```

### 🟢 PODE ALTERAR (MAS SÓ SE PEDIDO):

#### 1. **CONTEÚDO DO TEXTO**
- Título: "Shamah Publi" 
- Subtítulo: "Crie e compartilhe com facilidade"
- Números: 47, 12, 3

#### 2. **ESPAÇAMENTOS MÍNIMOS**
- paddingTop (só para ajustar altura)
- marginBottom entre elementos

#### 3. **CORES E ESTILOS VISUAIS**
- Cores dos gradientes
- Opacidade dos elementos
- Border radius

### 🎯 LAYOUT ATUAL FUNCIONANDO:

```
┌─────────────────────────────────┐
│  [TOPO - paddingTop: 40]        │
│                                 │
│        Shamah Publi             │ ← Título
│   Crie e compartilhe...         │ ← Subtítulo  
│                                 │
│   [47]    [12]    [3]           │ ← Stats
│  Posts  Agendados Contas        │
│                                 │
│                                 │
│              [+]                │ ← FAB (CENTRO!)
│                                 │
│                                 │
│                                 │
└─────────────────────────────────┘
```

### 📋 CHECKLIST ANTES DE ALTERAR QUALQUER COISA:

- [ ] O botão + está no centro da tela?
- [ ] O zIndex do container é baixo (1)?
- [ ] O pointerEvents está como 'box-none'?
- [ ] As rotas usam '/tabs/' e não '/(tabs)/'?
- [ ] O conteúdo está no topo (paddingTop: 40)?

### 🚨 SE O USUÁRIO RECLAMAR DE:

#### "Botão não funciona"
→ Verificar zIndex e pointerEvents

#### "Botão está no lugar errado"  
→ NUNCA mover o botão, mover o CONTEÚDO

#### "Layout quebrado"
→ Verificar se seguiu as regras acima

### 💡 FILOSOFIA:
**"SE ESTÁ FUNCIONANDO, NÃO MEXE!"**
**"BOTÃO NO CENTRO = REGRA SAGRADA"**
**"CONTEÚDO QUE SE ADAPTA AO BOTÃO, NÃO O CONTRÁRIO"**

---
**Data de criação:** 13/07/2025  
**Última atualização:** Quando o Copilot aprender a não bagunçar! 😤
