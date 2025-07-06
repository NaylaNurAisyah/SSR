import express from 'express';
import cors from 'cors';
import fs from 'fs-extra';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Ambil data user
app.get('/users.json', async (req, res) => {
  try {
    const users = await fs.readJson('./users.json');
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: 'Gagal membaca file users.json' });
  }
});

// Tambah user baru
app.post('/add-user', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: "Username & Password wajib diisi." });
  }

  try {
    const users = await fs.readJson('./users.json');
    const exists = users.find(u => u.username === username);

    if (exists) {
      return res.json({ success: false, message: "Username sudah ada." });
    }

    users.push({ username, password, role: "member" });
    await fs.writeJson('./users.json', users, { spaces: 2 });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Gagal menyimpan data." });
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
