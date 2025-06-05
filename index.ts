import 'reflect-metadata';
import { AppDataSource } from './data-source';

async function main() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected!');
  } catch (error) {
    console.error('Error during Data Source initialization:', error);
    process.exit(1);
  }
}

main();
