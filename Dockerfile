# Stage 1: Build React frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --silent

COPY frontend/ ./
RUN npm run build

# Stage 2: Setup backend and serve frontend build
FROM node:18-alpine

WORKDIR /app

# Install backend dependencies
COPY backend/package.json backend/package-lock.json* ./backend/
RUN cd backend && npm install --production --silent

# Copy backend source and frontend build
COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/build ./backend/public

WORKDIR /app/backend

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "server.js"]
