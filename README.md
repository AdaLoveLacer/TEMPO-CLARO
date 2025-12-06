# TEMPO-CLARO - Projeto de Autenticação com Google

Um projeto de faculdade desenvolvido com React, Vite e autenticação segura do Google OAuth 2.0.

## 🚀 Features

- ✅ Autenticação com Google OAuth 2.0
- ✅ Dashboard responsivo
- ✅ Persistência de sessão (localStorage)
- ✅ Rotas protegidas
- ✅ Design moderno e intuitivo

## 🛠️ Tecnologias Utilizadas

- **React 19.2.0** - Framework frontend
- **Vite 7.2.4** - Bundler e dev server
- **React Router DOM** - Navegação entre páginas
- **HTML5, CSS3, JavaScript ES6+** - Core web technologies

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn
- Conta Google para criar credenciais OAuth

## 🔧 Instalação

### 1. Clone o repositório

```bash
cd /home/labubu/Documentos/GitHub/TEMPO-CLARO
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```bash
VITE_GOOGLE_CLIENT_ID=seu_client_id_aqui.apps.googleusercontent.com
VITE_API_BASE_URL=http://localhost:3001
```

### 4. Obtenha o Client ID do Google

1. Acesse [Google Cloud Console](https://console.cloud.google.com)
2. Crie um novo projeto chamado "TEMPO-CLARO"
3. Ative a API Google+ 
4. Crie credenciais OAuth 2.0:
   - Tipo: Aplicação da Web
   - URLs autorizadas: 
     - `http://localhost:5173`
     - `http://localhost:3000`
   - URIs de redirecionamento:
     - `http://localhost:5173/callback`
5. Copie o Client ID e adicione ao arquivo `.env`

## 🚀 Executar o projeto

### Modo desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para produção

```bash
npm run build
```

### Visualizar o build

```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/
│   ├── Auth/
│   │   ├── GoogleLoginButton.jsx
│   │   ├── GoogleLoginButton.css
│   │   └── ProtectedRoute.jsx
├── context/
│   └── AuthContext.jsx
├── hooks/
│   └── useAuth.js
├── pages/
│   ├── LoginPage.jsx
│   ├── LoginPage.css
│   ├── DashboardPage.jsx
│   └── DashboardPage.css
├── styles/
├── utils/
├── App.jsx
├── App.css
├── index.css
└── main.jsx
```

## 🔐 Como funciona a autenticação

1. **Google Sign-In**: O usuário clica no botão de login com Google
2. **Validação**: O token JWT é validado
3. **Armazenamento**: Dados do usuário são salvos em localStorage
4. **Persistência**: Na próxima visita, o usuário permanece logado
5. **Logout**: Dados são removidos do localStorage

## 🎨 Customização

### Cores
As cores principais estão definidas nos arquivos CSS:
- `#667eea` - Cor primária (roxo)
- `#764ba2` - Cor secundária (roxo escuro)

Para mudar, procure por essas cores nos arquivos `.css`

### Textos
Todos os textos podem ser modificados nos componentes `.jsx`

## 🐛 Troubleshooting

### Erro: "Client ID não configurado"
- Verifique se o `.env` foi criado corretamente
- Certifique-se de que `VITE_GOOGLE_CLIENT_ID` está preenchido
- Reinicie o servidor dev

### Google Sign-In não aparece
- Confirme que o script foi adicionado ao `index.html`
- Verifique se o `VITE_GOOGLE_CLIENT_ID` é válido
- Limpe o cache do navegador

### Login não funciona
- Confirme que a URL está autorizada no Google Console
- Verifique o console do navegador para erros
- Tente em uma nova aba incógnita

## 📚 Documentação

Para documentação detalhada sobre como implementar cada parte, veja `GUIA_DESENVOLVIMENTO.md`

## 🤝 Contribuição

Este é um projeto de faculdade. Contribuições e feedback são bem-vindos!

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato com o desenvolvedor.

---

**Desenvolvido com ❤️ para TEMPO-CLARO**