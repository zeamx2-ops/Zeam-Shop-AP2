// append-order.js
// مثال Node.js + Express يضيف طلبات إلى ملف orders.json في مستودع GitHub
// تشغيل محلي: انسخ .env.example إلى .env واملأ GITHUB_TOKEN ثم: node append-order.js
// تحذير: لا تعرض GITHUB_TOKEN في المتصفح، هذا كود خادمي فقط.

require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch'); // npm i node-fetch@2
const cors = require('cors');

const btoa = str => Buffer.from(str, 'utf8').toString('base64');
const atob = str => Buffer.from(str, 'base64').toString('utf8');

const app = express();
app.use(express.json());
// للسماح للتجربة المحلية: عدّل origin حسب الحاجة عند النشر
app.use(cors());

const OWNER = process.env.OWNER || 'zeamx2-ops'; // افتراضي: حسابك
const REPO = process.env.REPO || 'Free-Shop-API'; // افتراضي: اسم المستودع الذي ذكرته
const FILE_PATH = process.env.FILE_PATH || 'orders.json';
const BRANCH = process.env.BRANCH || 'main'; // أو الفرع الذي تستخدمه
const API_BASE = 'https://api.github.com';
const TOKEN = process.env.GITHUB_TOKEN; // ضع توكن في متغير بيئة آمن

if (!TOKEN) {
  console.error('ERROR: set GITHUB_TOKEN env variable with repo access');
  process.exit(1);
}

async function getFile() {
  const url = `${API_BASE}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}?ref=${BRANCH}`;
  const res = await fetch(url, {
    headers: { Authorization: `token ${TOKEN}`, 'User-Agent': 'orders-uploader' }
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub GET file failed: ${res.status} ${await res.text()}`);
  return res.json();
}

async function updateFile(contentBase64, sha, message) {
  const url = `${API_BASE}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`;
  const body = {
    message,
    content: contentBase64,
    sha,
    branch: BRANCH
  };
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization: `token ${TOKEN}`,
      'User-Agent': 'orders-uploader',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub PUT failed: ${res.status} ${text}`);
  }
  return res.json();
}

app.post('/orders', async (req, res) => {
  try {
    const order = req.body;
    // تحقق بسيط
    if (!order || !order.offer || !order.playerId || !order.phone) {
      return res.status(400).json({ error: 'invalid payload: required fields missing' });
    }

    const file = await getFile();
    let orders = [];
    let sha = null;
    if (file && file.content) {
      const raw = atob(file.content.replace(/\n/g, ''));
      try {
        orders = JSON.parse(raw || '[]');
      } catch (e) {
        // في حال كان الملف تالفًا؛ نستبدله بمصفوفة جديدة
        orders = [];
      }
      sha = file.sha;
    }

    // أضف الحقول اللازمة مثل created_at و id محلي
    const entry = Object.assign({}, order, {
      created_at: new Date().toISOString()
    });
    orders.push(entry);

    const newContent = btoa(JSON.stringify(orders, null, 2));
    const message = `Add order from web — ${sanitizeForCommit(entry.playerId || 'unknown')} — ${sanitizeForCommit(entry.phone || '')}`;
    const result = await updateFile(newContent, sha, message);

    res.json({ ok: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// مساعدة بسيطة لتجنب حروف غير مرغوبة في رسالة الكوميت
function sanitizeForCommit(s) {
  if (!s) return '';
  return String(s).replace(/[\r\n]/g, ' ').slice(0, 200);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Orders API listening on ${PORT} (repo: ${OWNER}/${REPO}, file: ${FILE_PATH})`));