import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

export default defineConfig(({ command }) => {
  const config = {
    plugins: [react()],
    server: {
      host: 'localhost',
      port: 5173,
    }
  };

  if (
    command === 'serve' && 
    fs.existsSync('./certs/localhost.key') && 
    fs.existsSync('./certs/localhost.crt')
  ) {
    config.server.https = {
      key: fs.readFileSync('./certs/localhost.key'),
      cert: fs.readFileSync('./certs/localhost.crt')
    };
  }

  return config;
});