const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // ou ton mot de passe
    database: 'money_api'
});

connection.connect(err => {
    if (err) {
        console.error('Erreur Connexion :', err);
        return;
    }
    console.log('Connecté à la base de données money_api');
});

module.exports = connection;