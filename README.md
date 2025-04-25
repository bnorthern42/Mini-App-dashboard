# Mini App Dashboard

A modern web app platform for creating, editing, and previewing small apps directly from your browser.

---

## 🚀 Stack

- **Frontend**: Next.js 14 (App Router) + React
- **Editor**: Monaco Editor (VSCode engine)
- **Preview**:
  - HTML (direct iframe rendering)
  - Python (via Pyodide in-browser)
  - Lua (via Fengari Web VM)
- **Backend**: Next.js Server Actions + API Routes
- **Database**: PostgreSQL (⚠️ not fully set up yet — TODO)
- **Authentication**: JWT (JSON Web Tokens)

---

## ✨ Features

- 🔐 User login and authentication
- 📦 Create, edit, and preview mini apps
- 🌎 Private/Public app toggling
- 🔍 Search, filter, and sort apps
- 🎨 Syntax-highlighted code editing
- 📜 Live app execution with safe iframe sandboxing
- 🧩 Modular, expandable architecture

---

## 📦 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Backend / Database Setup (TODO)

- Currently using **Next.js API Routes** for authentication and CRUD operations.
- 🔜 Future work: Connect a **PostgreSQL** database for user mini app storage.
- Database schema and setup scripts will be added later.

---

## 📄 .gitignore

Already includes ignores for:
- `.next/` build artifacts
- `node_modules/`
- `.env*` files (for secrets)
- Editor files like `.vscode/`, `.idea/`
- Deployment folders (`vercel/`)

---

## 🛣 Roadmap

- [ ] Complete PostgreSQL integration
- [ ] Add Dark Mode toggle 🌙
- [ ] App export/import (JSON backup)
- [ ] Share apps via public links
- [ ] Add more languages (JS, Bash, Markdown)
- [ ] Production deployment (Vercel, Railway)

---

## 🤝 Contributing

Pull requests are welcome!

Please open an issue first to discuss major changes.

---

## 📜 License

This project is currently private, but can be modified for personal or educational use.

---

## 👨‍💻 Author

Built by Brad Northern with ❤️ and ☕.

```
(Trying out nonsense these ''' so called... devs call vibe coding. fully built in chat gippity. probably faster for me to get lua working, it was a ton of copy pasting into gippity 'now with this error or same error' over and over and over and ... )
---