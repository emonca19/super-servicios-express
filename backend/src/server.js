// src/server.js
require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 8000;


// Levantar servidor
app.listen(PORT, () => {
  console.log(`API escuchando en puerto ${PORT}`);
});
