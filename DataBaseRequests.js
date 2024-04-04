// DataBaseRequests.js

const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'library'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the remote database!');
});

function fetchBooks(begin, end, user_token) {
    begin = Number(begin);
    end = Number(end);
    return new Promise((resolve, reject) => {
        connection.query('SELECT * FROM books WHERE user_id = (SELECT id FROM users WHERE user_token = ?) LIMIT ?, ?', [user_token, begin, end], function (err, results, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function addBook(bookImage, bookName, author, description, genre,rating, user_token) {
    rating = Number(rating)
    const sql = 'INSERT INTO books (book_image,book_name, book_author, book_description, book_genre, book_rating, user_id) VALUES (?,?, ?, ?,?, ?, (SELECT id FROM users WHERE user_token = ?))'
    const values = [bookImage,bookName, author, description, genre, rating, user_token];
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (error, results, fields) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    })
}

function addUser(user_token) {
    return new Promise((resolve, reject) => {
        connection.query('INSERT INTO users (user_token) VALUES (?)', [user_token], function (err, results, fields) {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
}

function updateBook(bookImage, bookName, bookAuthor, bookDescription, bookGenre, bookRating, bookId, user_token){
    const sql = `UPDATE books 
             SET book_image = ?, book_name = ?, book_author = ?, book_description = ?, book_genre = ?, book_rating = ? 
             WHERE id = ? AND user_id = (SELECT id FROM users WHERE user_token = ?)`;

// Параметры для подстановки в запрос (в том же порядке, что и знаки вопроса в запросе)
    const values = [bookImage, bookName, bookAuthor, bookDescription, bookGenre, bookRating, bookId, user_token];

    return new Promise((resolve, reject) => {
        connection.query(sql, values, function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
                console.log('Book updated successfully');
                // Обработка успешного выполнения запроса
            }
        });
    });
}

module.exports = {
    fetchBooks: fetchBooks,
    addBook: addBook,
    addUser: addUser,
    updateBook: updateBook
};
