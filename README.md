# SEO Article Writer - Gemini AI

เครื่องมือสร้างบทความ SEO คุณภาพสูงด้วย Google Gemini AI ที่ออกแบบมาเพื่อผู้ใช้งานภาษาไทย

## ✨ ฟีเจอร์หลัก

### 🤖 AI-Powered Content Generation
- เชื่อมต่อกับ Google Gemini 2.0 Flash API
- สร้างบทความ SEO ที่มีคุณภาพสูง
- รองรับการกำหนดกลุ่มเป้าหมายและคำสำคัญ

### 🎨 Modern UI/UX
- ใช้ Tailwind CSS สำหรับ styling
- Responsive design ทำงานได้ดีในทุกอุปกรณ์
- SVG icons แทน emoji เพื่อความสวยงาม
- Blue gradient theme ที่สบายตา

### 📚 Recent Articles Management
- เก็บบทความล่าสุด 10 รายการใน Local Storage
- คลิกเพื่อโหลดบทความเก่ากลับมาดู
- ลบประวัติได้ตามต้องการ

### 📖 Enhanced Reading Experience
- Typography ที่เหมาะสมกับภาษาไทย
- Table of Contents อัตโนมัติ
- แสดงเวลาอ่านและจำนวนคำ
- Smooth scrolling navigation

## 🚀 การติดตั้งและใช้งาน

### Development Version
```bash
# เปิดไฟล์ index.html ในเบราว์เซอร์
open index.html
```

### Production Version
```bash
# ใช้ไฟล์ที่ optimize แล้ว
open index.prod.html
```

## 📁 โครงสร้างไฟล์

```
├── index.html          # Development version
├── index.prod.html     # Production version (optimized)
├── script.js           # Development JavaScript
├── script.min.js       # Minified JavaScript
└── README.md           # คู่มือการใช้งาน
```

## 🔧 การตั้งค่า

### 1. รับ API Key
1. ไปที่ [Google AI Studio](https://makersuite.google.com/app/apikey)
2. สร้าง API Key ใหม่
3. คัดลอก API Key

### 2. ใช้งานเครื่องมือ
1. เปิดไฟล์ HTML ในเบราว์เซอร์
2. ใส่ API Key (จะถูกเก็บใน Local Storage)
3. กรอกข้อมูลบทความ:
   - หัวข้อบทความ
   - กลุ่มเป้าหมาย
   - คำสำคัญ (ไม่บังคับ)
   - จำนวนคำ
4. กดปุ่ม "สร้างบทความ SEO"

## 🎯 กลุ่มเป้าหมายที่รองรับ

- ผู้เริ่มต้น
- ระดับกลาง
- ระดับสูง
- เจ้าของธุรกิจ
- นักการตลาด
- นักพัฒนา
- นักเรียน/นักศึกษา
- ทั่วไป

## 📊 ความยาวบทความ

- สั้น: 300-500 คำ
- ปานกลาง: 800-1200 คำ
- ยาว: 1500-2000 คำ

## 🔒 ความปลอดภัย

- API Key เก็บใน Local Storage เท่านั้น
- ไม่มีการส่งข้อมูลไปยังเซิฟเวอร์อื่น
- ใช้ HTTPS สำหรับการเชื่อมต่อ API

## 🌐 การใช้งานบนเว็บเซิฟเวอร์

### สำหรับ Production
1. อัปโหลดไฟล์ `index.prod.html` และ `script.min.js`
2. เปลี่ยนชื่อ `index.prod.html` เป็น `index.html`
3. ตรวจสอบให้แน่ใจว่า path ของ script ถูกต้อง

### การ Optimize เพิ่มเติม
- ใช้ CDN สำหรับ Tailwind CSS
- Enable Gzip compression
- ตั้งค่า Cache headers
- ใช้ HTTPS

## 🛠️ การพัฒนาเพิ่มเติม

### การแก้ไข CSS
- แก้ไขใน `<style>` section ของไฟล์ HTML
- ใช้ Tailwind utility classes

### การแก้ไข JavaScript
- แก้ไขใน `script.js` สำหรับ development
- Run minification เพื่อสร้าง `script.min.js` ใหม่

### การเพิ่มฟีเจอร์
- เพิ่ม method ใหม่ใน `SEOArticleWriter` class
- อัปเดต UI ตามต้องการ

## 🐛 การแก้ไขปัญหา

### API Key ไม่ทำงาน
- ตรวจสอบ API Key ว่าถูกต้อง
- ตรวจสอบ quota ของ API
- ลองสร้าง API Key ใหม่

### บทความไม่แสดงผล
- เปิด Developer Console ดู error
- ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
- ลองรีเฟรชหน้าเว็บ

### Recent Articles หายไป
- ตรวจสอบ Local Storage
- อาจถูกลบโดย browser cleanup

## 📝 License

MIT License - ใช้งานได้อย่างอิสระ

## 🤝 การสนับสนุน

หากพบปัญหาหรือต้องการเพิ่มฟีเจอร์ใหม่ สามารถสร้าง issue หรือ pull request ได้

---

**สร้างด้วย ❤️ สำหรับชุมชนไทย**