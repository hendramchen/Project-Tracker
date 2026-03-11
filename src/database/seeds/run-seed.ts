import dataSource from '../../config/typeorm.datasource';
import { seedDatabase } from './seed';

async function runSeed() {
  const connection = await dataSource.initialize();
  console.log('Database connected.');

  try {
    await seedDatabase(connection);
    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  } finally {
    await connection.destroy();
    console.log('Database connection closed.');
  }
}

void runSeed();
