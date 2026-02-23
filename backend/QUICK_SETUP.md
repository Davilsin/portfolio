# 🚀 MongoDB Quick Setup Checklist

Copy & paste these commands in order:

## 1️⃣ Verify MongoDB is Running
```powershell
Get-Service -Name MongoDB | Select Status
```
Should show: `Status: Running`

If not running, start it:
```powershell
net start MongoDB
```

---

## 2️⃣ Install Backend Dependencies
```powershell
cd backend
npm install
```

---

## 3️⃣ Verify Database Connection
```powershell
npm run verify-db
```

---

## 4️⃣ Setup Database (Sample Data)
```powershell
npm run setup-db
```

---

## 5️⃣ Create Admin User
```powershell
npm run setup
```

**Credentials:**
- Username: `admin`
- Password: `admin123`

---

## 6️⃣ Start Backend Server
```powershell
npm run dev
```

---

## 7️⃣ Access Admin Dashboard
Open in browser: `http://localhost:3001/admin`

---

## ✅ Done!

Your portfolio backend is now running with MongoDB!

### What You Get:
- ✅ 5 Sample Projects
- ✅ 5 Services  
- ✅ 3 Testimonials
- ✅ Admin Dashboard
- ✅ Contact Form Endpoint
- ✅ API Routes

### In Another Terminal:
Start frontend on port 8000:
```powershell
python -m http.server 8000
```

Open: `http://localhost:8000`

---

## 📝 Need to Reset?

Wipe database and start fresh:
```powershell
npm run setup-db
npm run setup
```

---

## 🔍 View Data (Optional)

Install MongoDB Compass: https://www.mongodb.com/products/compass

Then browse your data visually!

---

**All done! Your portfolio backend is live! 🎉**
