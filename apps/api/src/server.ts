import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

const allowedOrigins = new Set([
  'http://localhost:3000',
  FRONTEND_URL,
  'https://career-twin-web.vercel.app',
  ...(process.env.EXTRA_ORIGINS?.split(',').map((s) => s.trim()) ?? []),
].filter(Boolean));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
    } else {
      // Allow in development; you can tighten this by setting NODE_ENV=production
      if (process.env.NODE_ENV !== 'production') {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));

// Health check
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    env: process.env.NODE_ENV,
  });
});

app.use('/api/v1', routes);

// 404
app.use((_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[error]', err.message);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`✓ CareerTwin API  http://localhost:${PORT}`);
  console.log(`✓ API base        http://localhost:${PORT}/api/v1`);
  console.log(`✓ Environment     ${process.env.NODE_ENV || 'development'}`);
});

export default app;
