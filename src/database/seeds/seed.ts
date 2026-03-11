import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function seedDatabase(connection: DataSource): Promise<void> {
  const queryRunner = connection.createQueryRunner();

  try {
    await queryRunner.startTransaction();
    // ─── Check if already seeded ───
    const existingUsers = await queryRunner.query(
      `SELECT COUNT(*) as count FROM "users"`,
    );
    if (existingUsers[0].count > 0) {
      console.log('Database already seeded. Skipping...');
      await queryRunner.commitTransaction();
      return;
    }

    // ─── Users ───
    console.log('Seeding users...');
    const adminPassword = await bcrypt.hash('admin12345', 10);
    const userPassword = await bcrypt.hash('user12345', 10);

    const adminId = uuidv4();
    const user1Id = uuidv4();
    const empAdminId = uuidv4();
    const empUser1Id = uuidv4();

    await queryRunner.query(
      `INSERT INTO "users" ("id", "email", "password_hash", "role", "is_active") VALUES ($1, $2, $3, $4, $5)`,
      [adminId, 'admin@slash.co', adminPassword, 'admin', true],
    );
    await queryRunner.query(
      `INSERT INTO "users" ("id", "email", "password_hash", "role", "is_active") VALUES ($1, $2, $3, $4, $5)`,
      [user1Id, 'john@slash.co', userPassword, 'employee', true],
    );

    // ─── Employees ───
    console.log('Seeding employees...');
    await queryRunner.query(
      `INSERT INTO "employees" 
      ("id", "user_id", "first_name", "last_name", "date_of_birth", "start_working_date", "position", "team_location", "employment_status", "phone", "address") 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        empAdminId,
        adminId,
        'Admin',
        'User',
        '1980-01-01',
        '2020-01-01',
        'CTO',
        'New York',
        'active',
        '123-456-7890',
        '123 Main St',
      ],
    );
    await queryRunner.query(
      `INSERT INTO "employees" ("id", "user_id", "first_name", "last_name", "date_of_birth", "start_working_date", "position", "team_location", "employment_status", "phone", "address") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        empUser1Id,
        user1Id,
        'John',
        'Slash',
        '1990-01-01',
        '2021-01-01',
        'Software Engineer',
        'San Francisco',
        'active',
        '123-456-7890',
        '456 Oak Ave',
      ],
    );
    await queryRunner.commitTransaction();
    console.log('All seed data inserted.');
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}
