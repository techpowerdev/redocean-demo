# Code

## ระวังการใช้ ?? และ ||

# api

# Token/authentication

- getSession เรียกใช้ได้ใน layout หรือ server component

- function fetch api ที่สร้างจาก authAxios (axios instance) ใช้ได้ถูกต้อง และรองรับ refresh token ได้ภายใต้ client component เท่านั้น ไม่สามารถใช้ใน server component หรือ page ตรงๆได้

- authAxios : axios แบบที่ใช้ accessToken จาก cookie ที่ส่งมาจาก api

จะใช้ได้กับ client component เท่านั้น (ใช้ useEffect เรียก api) ถ้ามีการเรียก api ที่ server component ได้ไม่มี token ใน cookie ส่งไปด้วย (อาจต้องใช้ middleware ช่วยได้หรือไม่ ?)

- authAxios : axios แบบที่แนบ accessToken จาก session ใน cookie ของ nextjs ที่สร้างไว้

จะใช้ได้กับ client component เท่านั้น (ใช้ useEffect เรียก api) ถ้ามีการเรียก api ที่ server component ได้ไม่มี token ใน cookie ส่งไปด้วย (อาจต้องใช้ middleware ช่วยได้หรือไม่ ?) อาจเกิด error: 401 authorized และ ui ค้าง error ได้

- การอ่านหรือเปลี่ยนแปลงค่า cookie ใน nextjs จะต้องทำผ่าน server action หรือ route handler เท่านั้น

การพยายาม set cookie (เช่น setSession() หรือ cookies().set(...)) ใน Server Component หรือฟังก์ชัน fetch ธรรมดา ใน Next.js ไม่อนุญาต ใน App Router และจะ error

# ui

- combobox component ไม่สามารถใช้ได้เมื่อไปอยู่ภายใต้ dialog/sheet component (bug:shadcn ui)

# payment

## พร้อมเพย์

- จ่ายเงินแล้ว hold ไม่ได้ ต้อง refund อย่างเดียว (มีค่าธรรมเนียม)
- จำเป็นต้องมีอีเมลลูกค้า เพื่อให้ stripe ใช้ส่งฟอร์มให้กรอกข้อมูลธนาคารเพื่อรับเงินคืน
- ฟอร์มการคืนเงินของ stripe ที่ส่งให้ลูกค้ากรอกเพื่อขอคืนเงิน ไม่สะดวก ตัวข้อมูลที่ต้องกรอกค่อนข้างหายาก เช่น รหัสธนาคาร รหัสสาขา
- ทดสอบแล้วระบบการคืนเงิน ยังคืนไม่ได้จริง ระบบขึ้นข้อมูลไม่ตรง

## บัตรเครดิต

- จ่ายเงินแล้ว hold ได้ หลังจากส่งคำขอคืนเงินแล้ว คืนให้อัตโนมัติ ลูกค้าไม่ต้องดำเนินการใดๆ
- ต้อง capture เงินภายใน 7 วัน(ทางที่ดีควรไม่เกิน 3-4 วัน) ไม่อย่างนั้นเงินจะถูกคืนให้ลูกค้า
- \*\*\*ยังไม่ได้ทดสอบกับบัตรเครดิตของจริง

# ปรับขั้นตอนการสั่งซื้อ

- ปรับไม่ให้มีตะกร้า กรณีของกิจกรรมรวมออเดอร์ ใช้ปุ่มสั่งซื้อตรงๆแทนเลย
- เน้นขายไว จบไว ไม่จำเป็นต้องมีตะกร้า ไม่ต้องมีสินค้าค้างในตะกร้า จัดการง่ายกว่า
- หากใช้ตะกร้า ในอนาคตจะชนกับการสั่งซื้อปกติ ทำให้จัดการออเดอร์แยกออกมาไม่ได้ process ต่อไม่ได้ ยุุ่งยาก
- ใช้ตะกร้าเฉพาะกับกรณีปกติ ที่ไม่ต้องรอการยืนยัน จากลูกค้า ส่วนลดตายตัว หรือกรอกโค้ด

# ปัญหาโปรโมชั่นรวมออเดอร์

## หากมีสินค้าที่กำลังจัดโปรรวมออเดอร์ในตะกร้าอยู่ก่อนหน้านี้ ตอนสั่งจากตะกร้า มันจะได้ราคานั้นๆในโปรรวมออเดอร์ไปเลย ทำไง? เช็คและลบออกจากตะกร้าตอนซื้อในโปรรวมออเดอร์ไหม หรือลบตอนดึงตะกร้าแล้วพบว่าติดโปรรวมออเดอร์อยู่ หรือตอนดึงโปรมาอัปเดตตะกร้า ให้ยกเว้น type : groupbuying (แก้ได้โดยไม่ต้อง apply โปรในตะกร้าอัตโนมัติ แต่ apply เมื่อกดเพิ่มสินค้าจากเวลาจัดโปร แล้วอัปเดตไปในตะกร้าอีกที)

# แก้ bug ใน splidejs (slide lib)

## ให้เพิ่ม "types": "./dist/types/index.d.ts" ใน package.json ใน node_modules/@splidejs/react-splide/package.json

### "exports": {

    ".": {
      "types": "./dist/types/index.d.ts",
      "require": "./dist/js/react-splide.cjs.js",
      "import": "./dist/js/react-splide.esm.js",
      "default": "./dist/js/react-splide.esm.js"
    },

}
