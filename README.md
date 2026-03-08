# 🎮 Project QUEBEC

### **Author:** Nguyen Quang Thuan
**Course:** CIS 486
**University:** University of North Alabama (UNA)
**Professor:** Barry Cumbie

---

## 📝 Project Overview
This project is a full-stack web application developed as part of the QUEBEC project requirements. It features a game management interface that allows users to interact with data stored in a cloud environment. The project emphasizes modern development practices, including **MVC architecture**, **Persistent Cloud Data**, and **Automated CI/CD**.

---

## 🚀 Live Deployments
The application is successfully deployed and accessible via the following links:

* **Production (GCP + Custom Domain):** [https://waddle.barrycumbie.com/](https://waddle.barrycumbie.com/)
* **Development (Render):** [https://quebec-cizi.onrender.com/](https://quebec-cizi.onrender.com/)
* **Direct IP Access:** [https://34.134.203.82/](https://34.134.203.82/)

---

## 🛠️ Tech Stack & Architecture
* **Backend:** Node.js with Express framework.
* **Database:** MongoDB Atlas (Cloud) for persistent storage.
* **Architecture:** Strictly follows the **Model-View-Controller (MVC)** pattern, with logic separated into `routes/`, `controllers/`, and `models/` directories.
* **CI/CD:** Automated deployment pipeline using **GitHub Actions** to sync the `devvvv` branch with the GCP production server via SSH.
* **Process Management:** Utilizes **PM2** on the GCP instance to ensure continuous uptime and automatic restarts.



---

## 🛡️ Security & Environment Configuration
* **Environment Variables:** Sensitive credentials (like the MongoDB connection string) are managed via `.env` files and GitHub Secrets.
* **Git Safety:** The `.env` file is explicitly excluded from the repository via `.gitignore` to prevent credential leakage.
* **Production Config:** Environment variables are securely injected into the Render and GCP environments during deployment.

---

## 📦 Getting Started Locally
1. Clone the repository: `git clone -b devvvv <repo-url>`.
2. Install dependencies: `npm install`.
3. Create a `.env` file in the root directory and add your `MONGO_URI`.
4. Start the server: `npm run start`.