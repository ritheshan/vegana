import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { notFound, errorHandler } from './middleware/errorHandler';
import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import organizerRoutes from './modules/organizers/organizer.routes';
import tripRoutes from './modules/trips/trip.routes';
import bookingRoutes from './modules/bookings/booking.routes';
import paymentRoutes from './modules/payments/payment.routes';
import reviewRoutes from './modules/reviews/review.routes';
import wishlistRoutes from './modules/wishlist/wishlist.routes';
import adminRoutes from './modules/admin/admin.routes';
import apiRoutes from './routes/api.routes';

const app: Application = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Trip Planner Marketplace API is running...');
});

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/organizers', organizerRoutes);
app.use('/trips', tripRoutes);
app.use('/bookings', bookingRoutes);
app.use('/payments', paymentRoutes);
app.use('/reviews', reviewRoutes);
app.use('/wishlist', wishlistRoutes);
app.use('/admin', adminRoutes);
app.use('/api', apiRoutes);

// Error Handling Middleware
app.use(notFound);
app.use(errorHandler);

export default app;
