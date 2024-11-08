import dotenv from 'dotenv';
import app from './app';

// Load environment variables from .env file
dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default server;