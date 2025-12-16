# PersonalExpense Tracker

A simple and modern **Personal Expense Tracker** built with **Next.js** that helps users track daily expenses, categorize spending, and get insights into their financial habits.

---

## ✨ Features

* 📊 Track daily income and expenses
* 🗂️ Categorize expenses
* 💾 Persistent storage using SQLite (local development)
* ⚡ Fast and responsive UI with Next.js
* 🔒 Environment-based configuration

---

## 🛠️ Tech Stack

* **Frontend:** Next.js, React, TypeScript
* **Backend:** Next.js API Routes
* **Database:** SQLite (for local development)
* **Styling:** Tailwind CSS
* **Package Manager:** npm

---

## 📂 Project Structure

```
PersonalExpense/
├── app/            # App router pages and layouts
├── components/     # Reusable UI components
├── lib/            # Utility functions & DB helpers
├── providers/      # Context providers
├── public/         # Static assets
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js **v18+** recommended
* npm

### Installation

1. Clone the repository

```bash
git clone https://github.com/mahii1315/PersonalExpense.git
cd PersonalExpense
```

2. Install dependencies

```bash
npm install
```

3. Run the development server

```bash
npm run dev
```

4. Open your browser and visit:

```
http://localhost:3000
```

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory if required:

```env
DATABASE_URL=./dev.db
```

> ⚠️ Do **not** commit `.env` or database files to GitHub.

---

## 🧪 Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run start   # Start production server
```

---

## 📌 Best Practices

* `node_modules`, `.next`, `.env`, and database files are ignored via `.gitignore`
* Use meaningful commit messages
* Keep secrets out of the repository

---

## 📈 Future Improvements

* Authentication
* Charts & analytics
* Cloud database integration
* Export reports (CSV/PDF)

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repo
2. Create a feature branch
3. Commit changes
4. Open a Pull Request

---

## 📄 License

This project is open-source and available under the **MIT License**.

---

## 👤 Author

**Mahii**
GitHub: [https://github.com/mahii1315](https://github.com/mahii1315)