const express = require('express');
const path = require('path');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const productRouter = require('./routers/productRoute');
const userRouter = require('./routers/usersRoute');
const globalErrorHandler = require('./controllers/errorController');
const AppError = require('./utils/appError');
const reviewRouter = require('./routers/reviewRoute');
const buyRouter = require('./routers/buyRoute');

const app = express();
app.use(helmet());
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   console.log('middleware is working');
//   next();
// });

app.use(express.json({ limit: '10kb' }));
app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: [
      'duration',
      'category',
      'price',
      'ratingsAverage',
      'brand',
      'ratinngQuantity',
      'product_name'
    ]
  })
);
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'To many request from this IP,Please try again in an hour '
});
app.use('/api', limiter);

app.use('/api/Products', productRouter);
app.use('/api/Users', userRouter);
app.use('/api/reviews', reviewRouter);
app.use('/api/buyProduct', buyRouter);
// app.listen(8000, () => {
//   console.log('server started');
// });
app.all('*', (req, res, next) => {
  next(new AppError(`Can not find ${req.originalUrl} on this Server`, 404));
});

// app.use((err, req, res, next) => {
//   err.statusCode = err.statusCode || 500;
//   err.status = err.status || 'error';
//   res.status(err.statusCode).json({
//     status: err.status,
//     message: err.message
//   });
// });
app.use(globalErrorHandler);

module.exports = app;
