const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD = process.env.PASSWORD || '1234';
console.log('PASSWORD:', PASSWORD);
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(express.json());
app.use(express.static(path.join(__dirname)));

function checkAuth(req, res) {
  const pw = req.headers['x-password'];
  if (pw !== PASSWORD) {
    res.status(401).json({ error: '비밀번호가 틀렸어요' });
    return false;
  }
  return true;
}

app.get('/api/data', (req, res) => {
  if (!checkAuth(req, res)) return;
  try {
    if (fs.existsSync(DATA_FILE)) {
      res.json(JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')));
    } else {
      res.json({});
    }
  } catch (e) {
    res.json({});
  }
});

app.post('/api/data', (req, res) => {
  if (!checkAuth(req, res)) return;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(req.body));
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: '저장 실패' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
