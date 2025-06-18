const mysql = require('mysql2/promise');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'money_api',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// connection.connect(err => {
//     if (err) {
//         console.error('Erreur Connexion :', err);
//         return;
//     }
//     console.log('Connecté à la base de données money_api');
// });

module.exports = connection;