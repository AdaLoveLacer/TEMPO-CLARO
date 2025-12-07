# 🔧 Guia de Configuração - Login Google

## ❌ Por que o Login Google não está aparecendo?

Os problemas foram corrigidos! Aqui está o que foi feito:

### 1. ✅ Script do Google adicionado ao HTML
- O arquivo `index.html` agora inclui:
  ```html
  <script src="https://accounts.google.com/gsi/client" async defer></script>
  ```
- Este script é **essencial** para que o botão do Google apareça

### 2. ✅ Dependência do React Router adicionada
- Adicionado `react-router-dom@^7.0.0` ao `package.json`
- Necessário para as rotas funcionarem

### 3. ⚠️ Variável de Ambiente (PRÓXIMA ETAPA)
- Você precisa criar um arquivo `.env` na raiz do projeto

---

## 🚀 Próximas Etapas

### Passo 1: Obter Google Client ID

1. Acesse: https://console.cloud.google.com/
2. Crie um novo projeto ou selecione um existente
3. Vá para "Credenciais" → "Criar Credencial" → "ID do Cliente OAuth"
4. Selecione tipo: **Aplicativo da Web**
5. Adicione `http://localhost:5173` às URIs autorizadas (para desenvolvimento)
6. Copie o **Client ID** gerado

### Passo 2: Configurar o arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com:

```env
VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui
```

**Exemplo de como ficaria:**
```env
VITE_GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
```

### Passo 3: Instalar dependências

Execute no terminal:
```bash
npm install
```

### Passo 4: Reiniciar o servidor

```bash
npm run dev
```

---

## ✅ Verificação

Após seguir os passos acima, você deve ver:

1. ✅ Página de login carregada normalmente
2. ✅ Botão do Google com o logo oficial
3. ✅ Ao clicar, abre a janela de autenticação do Google
4. ✅ Após login, você é redirecionado para o Kanban

---

## 🔐 Segurança

- **NÃO** compartilhe o Client ID em repositórios públicos
- O arquivo `.env` não deve ser commitado (adicione ao `.gitignore`)
- Use diferentes Client IDs para desenvolvimento e produção

---

## 🆘 Se Ainda Não Funcionar

Verifique:
1. O arquivo `index.html` tem o script do Google? ✅ (Já corrigido)
2. O arquivo `.env` existe com o VITE_GOOGLE_CLIENT_ID preenchido? 
3. Você rodou `npm install`?
4. Você reiniciou o servidor com `npm run dev`?
5. Abra o console do navegador (F12) e procure por erros

---

**Arquivos Atualizados:**
- ✅ `index.html` - Script Google adicionado
- ✅ `package.json` - React Router adicionado
- ✅ `.env.example` - Criado como referência
- ✅ Este arquivo - `GOOGLE_LOGIN_SETUP.md`
