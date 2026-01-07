// Simple logger utility
export function log(message, ...args) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[LOG]`, message, ...args);
  }
}
