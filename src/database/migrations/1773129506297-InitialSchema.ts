import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1773129506297 implements MigrationInterface {
  name = 'InitialSchema1773129506297';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // EXTENSIONS
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // ENUM TYPES
    await queryRunner.query(
      `CREATE TYPE "user_role_enum" AS ENUM ('admin', 'employee', 'manager')`,
    );
    await queryRunner.query(
      `CREATE TYPE "employment_status_enum" AS ENUM ('active', 'resigned', 'contract')`,
    );
    await queryRunner.query(
      `CREATE TYPE "skill_category_enum" AS ENUM ('backend', 'frontend', 'devops')`,
    );
    await queryRunner.query(
      `CREATE TYPE "skill_level_enum" AS ENUM ('beginner', 'intermediate', 'expert')`,
    );
    await queryRunner.query(
      `CREATE TYPE "project_status_enum" AS ENUM ('planning', 'active', 'completed', 'paused')`,
    );
    await queryRunner.query(
      `CREATE TYPE "employee_project_role_enum" AS ENUM ('developer', 'tech_lead', 'pm', 'qa')`,
    );
    await queryRunner.query(
      `CREATE TYPE "sprint_status_enum" AS ENUM ('planning', 'active', 'completed')`,
    );
    await queryRunner.query(
      `CREATE TYPE "task_status_enum" AS ENUM ('todo', 'in_progress', 'done')`,
    );
    await queryRunner.query(
      `CREATE TYPE "task_priority_enum" AS ENUM ('low', 'medium', 'high', 'critical')`,
    );

    // USERS
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"            UUID          NOT NULL DEFAULT uuid_generate_v4(),
        "email"         VARCHAR(255)  NOT NULL,
        "password_hash" VARCHAR(255)  NOT NULL,
        "role"          "user_role_enum" NOT NULL DEFAULT 'employee',
        "is_active"     BOOLEAN       NOT NULL DEFAULT true,
        "created_at"    TIMESTAMP     NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email" UNIQUE ("email"),
        CONSTRAINT "PK_users" PRIMARY KEY ("id")
      )
    `);

    // EMPLOYEES
    await queryRunner.query(`
      CREATE TABLE "employees" (
        "id"                 UUID                     NOT NULL DEFAULT uuid_generate_v4(),
        "user_id"            UUID                     NOT NULL,
        "first_name"         VARCHAR(100)             NOT NULL,
        "last_name"          VARCHAR(100)             NOT NULL,
        "date_of_birth"      DATE,
        "start_working_date" DATE                     NOT NULL,
        "position"           VARCHAR(150)             NOT NULL,
        "team_location"      VARCHAR(150),
        "employment_status"  "employment_status_enum" NOT NULL DEFAULT 'active',
        "phone"              VARCHAR(20),
        "address"            TEXT,
        "created_at"         TIMESTAMP                NOT NULL DEFAULT now(),
        "updated_at"         TIMESTAMP                NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_employees_user_id" UNIQUE ("user_id"),
        CONSTRAINT "PK_employees" PRIMARY KEY ("id"),
        CONSTRAINT "FK_employees_user_id" FOREIGN KEY ("user_id")
          REFERENCES "users" ("id") ON DELETE CASCADE
      )
    `);

    // SKILLS
    await queryRunner.query(`
      CREATE TABLE "skills" (
        "id"          UUID                  NOT NULL DEFAULT uuid_generate_v4(),
        "name"        VARCHAR(100)          NOT NULL,
        "description" TEXT,
        "category"    "skill_category_enum",
        "created_at"  TIMESTAMP             NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP             NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_skills_name" UNIQUE ("name"),
        CONSTRAINT "PK_skills" PRIMARY KEY ("id")
      )
    `);

    // EMPLOYEE_SKILLS
    await queryRunner.query(`
      CREATE TABLE "employee_skills" (
        "id"                  UUID               NOT NULL DEFAULT uuid_generate_v4(),
        "employee_id"         UUID               NOT NULL,
        "skill_id"            UUID               NOT NULL,
        "level"               "skill_level_enum" NOT NULL DEFAULT 'beginner',
        "years_of_experience" NUMERIC(4, 1)      NOT NULL DEFAULT 0,
        "created_at"          TIMESTAMP          NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_employee_skills_employee_skill" UNIQUE ("employee_id", "skill_id"),
        CONSTRAINT "PK_employee_skills" PRIMARY KEY ("id"),
        CONSTRAINT "FK_employee_skills_employee_id" FOREIGN KEY ("employee_id")
          REFERENCES "employees" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_employee_skills_skill_id" FOREIGN KEY ("skill_id")
          REFERENCES "skills" ("id") ON DELETE CASCADE
      )
    `);

    // CLIENTS
    await queryRunner.query(`
      CREATE TABLE "clients" (
        "id"            UUID         NOT NULL DEFAULT uuid_generate_v4(),
        "name"          VARCHAR(200) NOT NULL,
        "country"       VARCHAR(100),
        "industry"      VARCHAR(150),
        "contact_email" VARCHAR(255),
        "contact_phone" VARCHAR(20),
        "created_at"    TIMESTAMP    NOT NULL DEFAULT now(),
        "updated_at"    TIMESTAMP    NOT NULL DEFAULT now(),
        CONSTRAINT "PK_clients" PRIMARY KEY ("id")
      )
    `);

    // PROJECTS
    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id"          UUID                  NOT NULL DEFAULT uuid_generate_v4(),
        "name"        VARCHAR(200)          NOT NULL,
        "description" TEXT,
        "client_id"   UUID,
        "start_date"  DATE                  NOT NULL,
        "end_date"    DATE,
        "status"      "project_status_enum" NOT NULL DEFAULT 'planning',
        "budget"      NUMERIC(15, 2),
        "created_at"  TIMESTAMP             NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMP             NOT NULL DEFAULT now(),
        CONSTRAINT "PK_projects" PRIMARY KEY ("id"),
        CONSTRAINT "FK_projects_client_id" FOREIGN KEY ("client_id")
          REFERENCES "clients" ("id") ON DELETE SET NULL
      )
    `);

    // EMPLOYEE_PROJECTS
    await queryRunner.query(`
      CREATE TABLE "employee_projects" (
        "id"                    UUID                        NOT NULL DEFAULT uuid_generate_v4(),
        "employee_id"           UUID                        NOT NULL,
        "project_id"            UUID                        NOT NULL,
        "role"                  "employee_project_role_enum" NOT NULL DEFAULT 'developer',
        "allocation_percentage" NUMERIC(5, 2)               NOT NULL DEFAULT 100,
        "assigned_date"         DATE                        NOT NULL,
        "released_date"         DATE,
        "created_at"            TIMESTAMP                   NOT NULL DEFAULT now(),
        CONSTRAINT "PK_employee_projects" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_employee_projects_allocation"
          CHECK ("allocation_percentage" > 0 AND "allocation_percentage" <= 100),
        CONSTRAINT "FK_employee_projects_employee_id" FOREIGN KEY ("employee_id")
          REFERENCES "employees" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_employee_projects_project_id" FOREIGN KEY ("project_id")
          REFERENCES "projects" ("id") ON DELETE CASCADE
      )
    `);

    // SPRINTS
    await queryRunner.query(`
      CREATE TABLE "sprints" (
        "id"         UUID                 NOT NULL DEFAULT uuid_generate_v4(),
        "project_id" UUID                 NOT NULL,
        "name"       VARCHAR(150)         NOT NULL,
        "goal"       TEXT,
        "start_date" DATE                 NOT NULL,
        "end_date"   DATE                 NOT NULL,
        "status"     "sprint_status_enum" NOT NULL DEFAULT 'planning',
        "created_at" TIMESTAMP            NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP            NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_sprints_dates" CHECK ("end_date" > "start_date"),
        CONSTRAINT "PK_sprints" PRIMARY KEY ("id"),
        CONSTRAINT "FK_sprints_project_id" FOREIGN KEY ("project_id")
          REFERENCES "projects" ("id") ON DELETE CASCADE
      )
    `);

    // TASKS
    await queryRunner.query(`
      CREATE TABLE "tasks" (
        "id"                   UUID                NOT NULL DEFAULT uuid_generate_v4(),
        "sprint_id"            UUID                NOT NULL,
        "title"                VARCHAR(255)        NOT NULL,
        "description"          TEXT,
        "status"               "task_status_enum"  NOT NULL DEFAULT 'todo',
        "assignee_employee_id" UUID,
        "story_points"         SMALLINT            DEFAULT 0,
        "priority"             "task_priority_enum" NOT NULL DEFAULT 'medium',
        "created_at"           TIMESTAMP           NOT NULL DEFAULT now(),
        "updated_at"           TIMESTAMP           NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_tasks_story_points" CHECK ("story_points" >= 0),
        CONSTRAINT "PK_tasks" PRIMARY KEY ("id"),
        CONSTRAINT "FK_tasks_sprint_id" FOREIGN KEY ("sprint_id")
          REFERENCES "sprints" ("id") ON DELETE CASCADE,
        CONSTRAINT "FK_tasks_assignee_employee_id" FOREIGN KEY ("assignee_employee_id")
          REFERENCES "employees" ("id") ON DELETE SET NULL
      )
    `);

    // INDEXES
    await queryRunner.query(
      `CREATE INDEX "IDX_employees_user_id" ON "employees" ("user_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_employees_employment_status" ON "employees" ("employment_status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_employee_skills_employee_id" ON "employee_skills" ("employee_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_employee_skills_skill_id" ON "employee_skills" ("skill_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_projects_client_id" ON "projects" ("client_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_projects_status" ON "projects" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_employee_projects_employee_id" ON "employee_projects" ("employee_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_employee_projects_project_id" ON "employee_projects" ("project_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_sprints_project_id" ON "sprints" ("project_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_sprints_status" ON "sprints" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tasks_sprint_id" ON "tasks" ("sprint_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tasks_assignee_employee_id" ON "tasks" ("assignee_employee_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_tasks_status" ON "tasks" ("status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // DROP INDEXES
    await queryRunner.query(`DROP INDEX "IDX_tasks_status"`);
    await queryRunner.query(`DROP INDEX "IDX_tasks_assignee_employee_id"`);
    await queryRunner.query(`DROP INDEX "IDX_tasks_sprint_id"`);
    await queryRunner.query(`DROP INDEX "IDX_sprints_status"`);
    await queryRunner.query(`DROP INDEX "IDX_sprints_project_id"`);
    await queryRunner.query(`DROP INDEX "IDX_employee_projects_project_id"`);
    await queryRunner.query(`DROP INDEX "IDX_employee_projects_employee_id"`);
    await queryRunner.query(`DROP INDEX "IDX_projects_status"`);
    await queryRunner.query(`DROP INDEX "IDX_projects_client_id"`);
    await queryRunner.query(`DROP INDEX "IDX_employee_skills_skill_id"`);
    await queryRunner.query(`DROP INDEX "IDX_employee_skills_employee_id"`);
    await queryRunner.query(`DROP INDEX "IDX_employees_employment_status"`);
    await queryRunner.query(`DROP INDEX "IDX_employees_user_id"`);

    // DROP TABLES (reverse FK order)
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TABLE "sprints"`);
    await queryRunner.query(`DROP TABLE "employee_projects"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TABLE "clients"`);
    await queryRunner.query(`DROP TABLE "employee_skills"`);
    await queryRunner.query(`DROP TABLE "skills"`);
    await queryRunner.query(`DROP TABLE "employees"`);
    await queryRunner.query(`DROP TABLE "users"`);

    // DROP ENUMS
    await queryRunner.query(`DROP TYPE "task_priority_enum"`);
    await queryRunner.query(`DROP TYPE "task_status_enum"`);
    await queryRunner.query(`DROP TYPE "sprint_status_enum"`);
    await queryRunner.query(`DROP TYPE "employee_project_role_enum"`);
    await queryRunner.query(`DROP TYPE "project_status_enum"`);
    await queryRunner.query(`DROP TYPE "skill_level_enum"`);
    await queryRunner.query(`DROP TYPE "skill_category_enum"`);
    await queryRunner.query(`DROP TYPE "employment_status_enum"`);
    await queryRunner.query(`DROP TYPE "user_role_enum"`);
  }
}
