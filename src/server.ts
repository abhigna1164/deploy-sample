import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import { createProxy } from './proxy/proxy';
 
dotenv.config();
 
const app = express();
const PORT = process.env.PORT || 8080;
 
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
 
app.use(morgan('dev'));
app.use(express.json());
 
// Route middleware
app.use('/booking', createProxy(process.env.BOOKING_SERVICE_URL || "", "booking"));
app.use('/user', createProxy(process.env.AUTH_SERVICE_URL || "", "userService"));
app.use('/gym', createProxy(process.env.GYM_SERVICE_URL || "", "gym"));
app.use('/reports', createProxy(process.env.REPORTS_SERVICE_URL || "", "reports"));

 
// Fallback route
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({ message: 'Route not found' });
});
 
app.listen(PORT, () => {
  console.log(`API Gateway running at http://localhost:${PORT}`);
});
 
export default app;