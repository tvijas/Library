// index.js
const http = require('http')
const fs = require('fs')
const express = require('express');
const cookieParser = require('cookie-parser');
const dataBaseRequests = require('./DataBaseRequests');
const {v4: uuidv4} = require('uuid');
const multer = require('multer');

const app = express();
app.use(cookieParser());
//app.use(express.json());
const PORT = 3000;
// Установка максимального размера файла 10МБ
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({limit: '1mb'}));
app.use(express.static('view'));

app.use((req, res, next) => {
    if (!req.cookies.userId) {
        const userId = uuidv4();
        dataBaseRequests.addUser(userId)
            .then(result => {
                console.log(result)
            })
            .catch(error => {
                console.log(error)
            })
        res.cookie('userId', userId, {
            expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            httpOnly: true
        })
    }
    next();
});
app.post('/updateBook', (req, res) => {
    const user_token = req.cookies.userId
    const {id, book_image, book_name, book_author, book_description, book_genre, book_rating} = req.body;
    try {
        dataBaseRequests.updateBook(book_image, book_name, book_author, book_description, book_genre, book_rating, id, user_token)
            .then(result => {
                console.log(result)
                res.status(200)
            })
            .catch(error => {
                console.log(error)
                res.status(400)
            })
    } catch (error) {
        res.status(400)
    }
})

app.get('/item/:begin/:end', (req, res) => {
    const user_token = req.cookies.userId
    try {
        const begin = req.params.begin; // Assuming the id is passed in the request parameters
        const end = req.params.end
        dataBaseRequests.fetchBooks(begin, end, user_token)
            .then(result => {
                res.send(result)
            })
            .catch(error => {
                console.log(error)
                res.status(500).json({error: 'ERORR'})
            })
        // Sending the book data as JSON response
    } catch (error) {
        console.error('Error fetching book data:', error);
        res.status(500).json({error: 'Internal server error'}); // Sending a generic error response
    }
});
app.get('/item', async (req, res) => {
    res.sendFile(__dirname + "/view/index.html");
});

app.post('/addBook', (req, res) => {
    const user_token = req.cookies.userId
    const {image, bookName, author, description, genre, rating} = req.body;
    dataBaseRequests.addBook(image, bookName, author, description, genre, rating, user_token)
        .then(result => {
            res.status(202)
        })
        .catch(error => {
            console.log(error)
            res.status(400)
        })
    res.json({message: 'Book added successfully'});
})

app.listen(PORT, () => {
    console.log(`Server started: http://localhost:${PORT}`);
});
