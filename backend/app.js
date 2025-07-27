const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/error');
const cookieParser = require('cookie-parser');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({path:path.join(__dirname,"config/config.env")})

app.use(express.json());
app.use(cookieParser());
app.use('/uploads', express.static(path.join(__dirname,'uploads')));

const products = require('./routes/product');
const auth = require('./routes/auth');
const order = require('./routes/order');
const payment = require('./routes/payment');

app.use('/api/v1/',products);
app.use('/api/v1/', auth);
app.use('/api/v1/', order);
app.use('/api/v1/', payment);

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    const indexPath = path.join(__dirname, '../frontend/build/index.html');
    app.use((req, res, next) => {
        if (req.method === 'GET' && !req.path.startsWith('/api/v1')) {
            res.sendFile(indexPath, (err) => {
                if (err) {
                    console.error("Failed to serve index.html:", err);
                    next(err);
                }
            });
        } else {
            next();
        }
    });
}

app.use(errorMiddleware);

module.exports = app;