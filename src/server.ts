import app from './app';
import { envConfig } from './config/env.config';
import { DatabaseConfig } from './config/database.config';

const port = envConfig.PORT || 3000;

async function bootstrap(): Promise<void> {
  try {
    await DatabaseConfig.connect();
    console.log('Database connected successfully');
    app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
}

if (envConfig.NODE_ENV !== 'test') {
  bootstrap();
}

export default app;
