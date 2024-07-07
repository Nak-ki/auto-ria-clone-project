import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersEntities1720093736202 implements MigrationInterface {
    name = 'UsersEntities1720093736202'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."admin_role_enum" AS ENUM('admin', 'manager', 'seller')`);
        await queryRunner.query(`CREATE TYPE "public"."admin_account_enum" AS ENUM('premium')`);
        await queryRunner.query(`CREATE TABLE "admin" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "phone" text, "role" "public"."admin_role_enum" NOT NULL DEFAULT 'admin', "image" text, "account" "public"."admin_account_enum" NOT NULL DEFAULT 'premium', CONSTRAINT "UQ_de87485f6489f5d0995f5841952" UNIQUE ("email"), CONSTRAINT "UQ_605f773f0197434dd12ab652779" UNIQUE ("phone"), CONSTRAINT "PK_e032310bcef831fb83101899b10" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."managers_role_enum" AS ENUM('admin', 'manager', 'seller')`);
        await queryRunner.query(`CREATE TYPE "public"."managers_account_enum" AS ENUM('premium')`);
        await queryRunner.query(`CREATE TABLE "managers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "phone" text, "role" "public"."managers_role_enum" NOT NULL DEFAULT 'manager', "image" text, "account" "public"."managers_account_enum" NOT NULL DEFAULT 'premium', CONSTRAINT "UQ_8d5fd9a2217bf7b16bef11fdf83" UNIQUE ("email"), CONSTRAINT "UQ_2d9710b05598e31f31fcfbd1aa0" UNIQUE ("phone"), CONSTRAINT "PK_e70b8cc457276d9b4d82342a8ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "refresh_tokens" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "refreshToken" text NOT NULL, "deviceId" text NOT NULL, "user_id" uuid, "admin_id" uuid, "manager_id" uuid, CONSTRAINT "PK_7d8bee0204106019488c4c50ffa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'manager', 'seller')`);
        await queryRunner.query(`CREATE TYPE "public"."users_account_enum" AS ENUM('premium', 'base')`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "name" text NOT NULL, "email" text NOT NULL, "password" text NOT NULL, "phone" text NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'seller', "image" text, "isBanned" text NOT NULL DEFAULT false, "account" "public"."users_account_enum" NOT NULL DEFAULT 'base', CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_ecd766716e82c2e0f1cf6cb6281" FOREIGN KEY ("admin_id") REFERENCES "admin"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" ADD CONSTRAINT "FK_4a3d2a11e760de57a0cc674a281" FOREIGN KEY ("manager_id") REFERENCES "managers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_4a3d2a11e760de57a0cc674a281"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_ecd766716e82c2e0f1cf6cb6281"`);
        await queryRunner.query(`ALTER TABLE "refresh_tokens" DROP CONSTRAINT "FK_3ddc983c5f7bcf132fd8732c3f4"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_account_enum"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`DROP TABLE "refresh_tokens"`);
        await queryRunner.query(`DROP TABLE "managers"`);
        await queryRunner.query(`DROP TYPE "public"."managers_account_enum"`);
        await queryRunner.query(`DROP TYPE "public"."managers_role_enum"`);
        await queryRunner.query(`DROP TABLE "admin"`);
        await queryRunner.query(`DROP TYPE "public"."admin_account_enum"`);
        await queryRunner.query(`DROP TYPE "public"."admin_role_enum"`);
    }

}
