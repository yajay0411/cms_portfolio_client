import { setupServer } from 'msw/node';
import { handlers } from './handlers';

// Setup MSW for Node environment
export const server = setupServer(...handlers);

// Initialize MSW
export async function initMocks() {
  server.listen();
}

// Cleanup MSW
export async function cleanupMocks() {
  server.close();
}
