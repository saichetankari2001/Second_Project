export const PROJECT_DETAILS = {
  'booking-api': {
    summary: 'Express + TypeScript REST API for managing bookings, backed by PostgreSQL via Prisma.',
    highlights: [
      'JWT-based authentication with bcrypt password hashing on every protected route.',
      'Prisma ORM against PostgreSQL, with migrations and a seed script for local development.',
      'Request validation with Zod, plus a Jest unit and integration test suite run in CI.',
      'Dockerized for local development and deployment via Docker Compose.',
    ],
  },
  'live-chat-room': {
    summary: 'Real-time chat room — FastAPI WebSocket backend, React + Vite + TypeScript frontend.',
    highlights: [
      'Every open browser tab holds a WebSocket connection; the backend broadcasts each message to all connected clients instantly.',
      'No accounts or login — just a typed nickname, so anyone can join and start chatting immediately.',
      'No persisted history by design — messages exist only for the current session, keeping the whole thing lightweight.',
    ],
  },
  Agent_Chintu: {
    summary: 'A free, tool-using AI chat agent built with Google Gemini, Gradio, and Tavily.',
    highlights: [
      'Gemini decides on its own when to call a tool — web search (Tavily), reading/writing files, or running Python code.',
      'File operations run inside a sandboxed workspace directory, never the wider filesystem.',
      'An iterative tool-calling loop lets Gemini chain multiple tool calls before producing a final answer.',
    ],
  },
}
