"# user-mgmt-js" 
readme_path = "/mnt/data/README.md"

readme_content = """
# 🧑‍💼 User Management System

ระบบจัดการผู้ใช้งานอย่างง่าย โดยใช้เทคโนโลยี:
- 🖥 **Frontend**: Next.js (pages directory) + Bootstrap 5
- 🛠 **Backend**: Express.js + Prisma ORM + SQLite
- 🔐 **Auth**: JWT เก็บใน Cookie (HTTP Only)
- 🔒 **Role-based Access**: แยกระหว่าง `ADMIN` และ `VIEW`

---

## 🚀 ฟีเจอร์หลัก

### 🔐 Authentication
- Login ด้วย email และ password
- Logout ลบ session (JWT)
- Register สมาชิกใหม่ (ไม่ต้อง login)

### 👥 Admin สามารถ:
- ดูรายชื่อผู้ใช้งานทั้งหมด
- เพิ่มผู้ใช้ใหม่
- แก้ไขผู้ใช้งาน
- ลบผู้ใช้งาน

### 👁‍🗨 View-Only Role:
- ดูรายชื่อผู้ใช้ได้เท่านั้น

---

## 🧱 Stack ที่ใช้

| Layer     | Technology              |
|-----------|-------------------------|
| Frontend  | Next.js, React, Bootstrap 5 |
| Backend   | Express.js, Prisma ORM  |
| Database  | SQLite (.db file)       |
| Auth      | JWT (via Cookie)        |

---

## ⚙️ วิธีติดตั้งและรันโปรเจกต์

### 🛠 Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run dev


Frontend Setup

cd frontend
npm install
npm run dev

เส้นทางการใช้งาน

| Path        | Description                         |
| ----------- | ----------------------------------- |
| `/login`    | ฟอร์มเข้าสู่ระบบ                    |
| `/register` | สมัครสมาชิกใหม่                     |
| `/users`    | แสดงรายชื่อผู้ใช้ (ต้อง login ก่อน) |


ตัวอย่างการใช้งาน
สมัครผ่าน /register โดยเลือก role เป็น ADMIN

เข้าระบบที่ /login

ไปยัง /users จะสามารถเพิ่ม แก้ไข และลบผู้ใช้ได้

👤 ถ้าเลือก VIEW จะดูได้อย่างเดียว
