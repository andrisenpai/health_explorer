# 🏥 Health Explorer - Full Stack Test

This is a **Full Stack Document Explorer** built with:

- **Backend**: Node.js (Elysia + Prisma + SQLite)
- **Frontend**: Vue 3 + Composition API + Bootstrap
- **Database**: SQLite (auto-managed by Prisma)

---

## 📂 Project Structure

```
.
├── backend/        # API server (Elysia + Prisma)
├── frontend/       # Vue 3 application
├── prisma/         # Prisma schema & migrations
└── README.md
```

---

## ⚙️ Backend Setup

### 1. Install dependencies
```bash
cd backend
npm install
```

### 2. Database setup
```bash
# Apply Prisma schema & migration
npx prisma migrate dev --name init

# (Optional) Open Prisma Studio
npx prisma studio
```

### 3. Run the server
```bash
npm run dev
```

By default, the backend runs on **http://localhost:3000**.

### 4. API Endpoints

#### 📁 Folders
- `GET /folders` → list root folders
- `GET /folders/:id/subfolders` → list subfolders
- `POST /folders` → create new folder
- `DELETE /folders/:id` → delete folder (must be empty)

#### 📄 Files
- `GET /folders/:id/files` → list files in folder
- `POST /folders/:id/upload` → upload file
- `DELETE /files/:id` → delete file

---

## 🎨 Frontend Setup

### 1. Install dependencies
```bash
cd frontend
npm install
```

### 2. Run the app
```bash
npm run dev
```

The app will be available on **http://localhost:5173**.

---

## 🗂 Features

- ✅ Create nested folders
- ✅ Upload files into specific folders
- ✅ Delete files and folders
- ✅ File type icons & labels (docx, pdf, xlsx, jpg, png, etc.)
- ✅ Sidebar folder navigation with tree view
- ✅ Responsive design (Bootstrap)

---

## 🚀 Quick Start

```bash
# Clone repo
git clone <repo-url>
cd project-folder

# Setup backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# Setup frontend (new terminal)
cd frontend
npm install
npm run dev
```

Now open **http://localhost:5173** in your browser 🚀

---

## 👤 Author

Full Stack Test submission by **[Andri Nugroho]**
