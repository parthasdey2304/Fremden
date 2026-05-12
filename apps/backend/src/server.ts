import https from 'https';
import { createServer } from 'http';
import { URL } from 'url';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
  },
});

const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

const geminiRequestSchema = z.object({
  prompt: z.string().min(1),
  model: z.string().optional(),
});

type GeminiApiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
  error?: {
    message?: string;
  };
  usageMetadata?: {
    promptTokenCount?: number;
    candidatesTokenCount?: number;
    totalTokenCount?: number;
    cachedContentTokenCount?: number;
  };
};

const postExternalJson = async (
  url: string,
  payload: unknown,
  extraHeaders: Record<string, string> = {},
): Promise<{ status: number; data: GeminiApiResponse }> => {
  const parsedUrl = new URL(url);

  if (parsedUrl.protocol !== 'https:') {
    throw new Error('Gemini API base URL must use HTTPS.');
  }
  const body = JSON.stringify(payload);

  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        protocol: parsedUrl.protocol,
        hostname: parsedUrl.hostname,
        port: parsedUrl.port || 443,
        path: `${parsedUrl.pathname}${parsedUrl.search}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
          ...extraHeaders,
        },
      },
      (response) => {
        let responseBody = '';

        response.on('data', (chunk) => {
          responseBody += chunk;
        });

        response.on('end', () => {
          const status = response.statusCode ?? 500;

          if (!responseBody) {
            resolve({ status, data: {} });
            return;
          }

          try {
            const data = JSON.parse(responseBody) as GeminiApiResponse;
            resolve({ status, data });
          } catch (error) {
            reject(
              new Error(
                `Failed to parse Gemini response: ${error instanceof Error ? error.message : 'unknown error'}`,
              ),
            );
          }
        });
      },
    );

    request.on('error', reject);
    request.write(body);
    request.end();
  });
};

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.post('/api/ide/gemini', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { prompt, model } = geminiRequestSchema.parse(req.body);
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      res.status(500).json({ error: 'Gemini API key is not configured.' });
      return;
    }

    const baseUrl = process.env.GEMINI_API_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
    const modelName = model || process.env.GEMINI_DEFAULT_MODEL || 'gemini-1.5-flash';
    const url = `${baseUrl}/models/${encodeURIComponent(modelName)}:generateContent`;

    const { status, data } = await postExternalJson(
      url,
      {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }],
          },
        ],
      },
      {
        'x-goog-api-key': apiKey,
      },
    );

    if (status >= 400) {
      res.status(status).json({
        error: data.error?.message || 'Gemini request failed.',
      });
      return;
    }

    const candidateParts = data.candidates?.[0]?.content?.parts;

    if (!candidateParts || candidateParts.length === 0) {
      res.status(502).json({ error: 'Gemini response missing content.' });
      return;
    }

    const text = candidateParts.map((part) => part.text ?? '').join('');

    res.json({
      text,
      model: modelName,
      usage: data.usageMetadata ?? null,
    });
  } catch (error) {
    next(error);
  }
});

// API routes (to be implemented)
app.use('/api/auth', (req, res) => res.json({ message: 'Auth routes coming soon' }));
app.use('/api/groups', (req, res) => res.json({ message: 'Groups routes coming soon' }));
app.use('/api/users', (req, res) => res.json({ message: 'Users routes coming soon' }));

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`Client connected: ${socket.id}`);

  socket.on('join_group', (groupId: string) => {
    socket.join(`group:${groupId}`);
    console.log(`Socket ${socket.id} joined group ${groupId}`);
  });

  socket.on('leave_group', (groupId: string) => {
    socket.leave(`group:${groupId}`);
    console.log(`Socket ${socket.id} left group ${groupId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
httpServer.listen(PORT, () => {
  console.log(`🚀 FREDMEN API server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export { app, io };
