# 📝 Smart Todo App

A modern and feature-rich **Todo application** built with **React + JSON Server**, featuring a smart task bar, calendar view, dark mode, reminders, repeat options, categories, priority sorting, and more.

---

## 🚀 Features

### ✅ Task Management

- Add tasks with:
  - 📅 Due date
  - ⏰ Reminder
  - 🔁 Repeat (Daily / Weekly / Monthly)
  - 🏷 Category
  - 🔥 Priority (Low / Medium / High)
- Mark tasks as completed
- Completed timestamp tracking
- Delete with confirmation modal
- Undo delete (5 seconds toast)

---

### 📅 Calendar View

- Monthly calendar layout
- Highlight today automatically
- Click task to open sidebar
- Auto-group tasks by due date
- Month navigation

---

### 🎨 UI Features

- Modern smart task input bar
- Icon-based controls
- Floating dropdown menus
- Custom tooltips
- 🌙 Dark mode toggle (persisted in localStorage)
- Fully responsive design
- Professional sidebar panel

---

### 🔍 Productivity Tools

- 🔎 Search tasks
- Filter:
  - All
  - Completed
  - Pending
- Sort by:
  - Priority
  - Due Date
  - Combined (Due Date → Priority)
- Clear completed tasks
- Task statistics dashboard

---

### 🔔 Reminder System

- Browser notifications
- Scheduled reminders
- Automatic permission request

---

## 🛠 Tech Stack

- ⚛️ React (Hooks)
- 🗄 JSON Server (`db.json`)
- 🌐 Axios
- 🎨 React Icons
- 💅 CSS (Custom styling + Dark mode)

---

## 📂 Project Structure

```
src/
 ├── components/
 │    ├── TodoForm.jsx
 │    ├── TodoList.jsx
 │    ├── TodoItem.jsx
 │    ├── TaskSidebar.jsx
 │    ├── CalendarView.jsx
 │
 ├── services/
 │    └── api.js
 │
 ├── styles/
 │    └── App.css
 │
 ├── App.jsx
 └── main.jsx
```

---

## ⚙️ Installation & Setup

### 1️⃣ Clone Repository

```bash
git clone https://github.com/nishanthkumarbs/ToDo.git
cd ToDo
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Start JSON Server

Make sure you have `db.json` in the root directory:

```bash
npx json-server --watch db.json --port 5000
```

### 4️⃣ Start React App

```bash
npm run dev
```

App runs at:

```
http://localhost:5173
```

---

## 🗂 Sample `db.json`

```json
{
  "todos": []
}
```

---

## 🌙 Dark Mode

Dark mode is:

- Toggle-based
- Saved in `localStorage`
- Fully styled including tooltips & dropdowns


---

## 📌 Future Improvements

- Drag & drop between calendar dates
- Weekly view
- PWA support
- User authentication
- Backend integration (Node / Spring Boot)
- Task sharing

---

## ⭐ Contribute

If you like this project, feel free to fork, improve, and submit a pull request!

---

## 📄 License

This project is open-source and available under the MIT License.