import { MigrationInterface, QueryRunner } from "typeorm";

export class InitBd1742072410138 implements MigrationInterface {
    name = 'InitBd1742072410138'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "permission" ("id" SERIAL NOT NULL, "action" character varying(100) NOT NULL, "module" character varying(100) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "category" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "categoryId" integer, "roleId" integer, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."web_user_documenttype_enum" AS ENUM('0', '1', '4', '7', '6', 'A')`);
        await queryRunner.query(`CREATE TYPE "public"."web_user_type_enum" AS ENUM('reviewer', 'user')`);
        await queryRunner.query(`CREATE TABLE "web_user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "lastName" character varying, "documentType" "public"."web_user_documenttype_enum" DEFAULT '1', "documentNumber" character varying, "email" character varying NOT NULL, "password" character varying NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "type" "public"."web_user_type_enum" NOT NULL DEFAULT 'user', "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_a2f8ce470dbeeb6f0aa64d6b8f5" UNIQUE ("email"), CONSTRAINT "PK_6fd2787b14d397d531da0bee245" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "topic" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "isActive" boolean NOT NULL DEFAULT true, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "categoryId" integer, CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "paper_comentary" ("id" SERIAL NOT NULL, "comentary" text, "fileUrl" text, "userId" integer NOT NULL, "paperId" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "reviewerId" integer NOT NULL, CONSTRAINT "PK_5728ec5d98d4b02b9d4f04ae79d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "paper_author" ("id" SERIAL NOT NULL, "paperId" integer, "type" character varying(255) NOT NULL, "name" text, "middle" text, "last" text, "remissive" text, "institution" text, "countryCode" text, "email" character varying(255), "emailCorp" character varying(255), "cellPhone" character varying(255), "createdAt" TIMESTAMP DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_370dd8e5033acf1d7d7017565b6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "paper" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "resume" text, "file" character varying(255), "state" integer NOT NULL, "approvedDate" date, "sentDate" date, "reviewedDate" date, "webUserId" integer, "reviewerUserId" integer, "registeredById" integer NOT NULL, "topicId" integer, "categoryId" integer, "language" character varying(255) NOT NULL, "keywords" text array NOT NULL, "flagEvent" boolean NOT NULL DEFAULT false, "eventWhere" character varying(255), "eventWhich" character varying(255), "eventDate" date, "process" text, "isActive" boolean NOT NULL DEFAULT true, "type" character varying(255), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_ca8320a8e49e70e3de2d843a80a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "department" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_9a2213262c1593bffb581e382f5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "province" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "departmentId" integer NOT NULL, CONSTRAINT "PK_4f461cb46f57e806516b7073659" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "district" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "provinceId" integer NOT NULL, CONSTRAINT "PK_ee5cb6fd5223164bb87ea693f1e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_permissions" ("roleId" integer NOT NULL, "permissionId" integer NOT NULL, CONSTRAINT "PK_d430a02aad006d8a70f3acd7d03" PRIMARY KEY ("roleId", "permissionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b4599f8b8f548d35850afa2d12" ON "role_permissions" ("roleId") `);
        await queryRunner.query(`CREATE INDEX "IDX_06792d0c62ce6b0203c03643cd" ON "role_permissions" ("permissionId") `);
        await queryRunner.query(`CREATE TABLE "topic_users" ("topicId" integer NOT NULL, "webUserId" integer NOT NULL, CONSTRAINT "PK_cad449da4fc9b544fcc5203e61b" PRIMARY KEY ("topicId", "webUserId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4d24160eca314b856961f36b8b" ON "topic_users" ("topicId") `);
        await queryRunner.query(`CREATE INDEX "IDX_ead3ebcaed5f6054d829457974" ON "topic_users" ("webUserId") `);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "paper_comentary" ADD CONSTRAINT "FK_7179dc058f214848f6f3297488f" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "paper_comentary" ADD CONSTRAINT "FK_2fa804676ce6f75b17fb32bae4a" FOREIGN KEY ("paperId") REFERENCES "paper"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "paper_author" ADD CONSTRAINT "FK_372204b2e2c699e76f3c598e5ea" FOREIGN KEY ("paperId") REFERENCES "paper"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "paper" ADD CONSTRAINT "FK_724f30fb358f6009cc69f659ef5" FOREIGN KEY ("webUserId") REFERENCES "web_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "paper" ADD CONSTRAINT "FK_b4592634edaca09002d5ea9768a" FOREIGN KEY ("reviewerUserId") REFERENCES "web_user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "paper" ADD CONSTRAINT "FK_84741ff13f36de84f089e061c54" FOREIGN KEY ("registeredById") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "paper" ADD CONSTRAINT "FK_3d5630fd1fe26e618411b478137" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "role_permissions" ADD CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd" FOREIGN KEY ("permissionId") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "topic_users" ADD CONSTRAINT "FK_4d24160eca314b856961f36b8bc" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "topic_users" ADD CONSTRAINT "FK_ead3ebcaed5f6054d8294579748" FOREIGN KEY ("webUserId") REFERENCES "web_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "topic_users" DROP CONSTRAINT "FK_ead3ebcaed5f6054d8294579748"`);
        await queryRunner.query(`ALTER TABLE "topic_users" DROP CONSTRAINT "FK_4d24160eca314b856961f36b8bc"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_06792d0c62ce6b0203c03643cdd"`);
        await queryRunner.query(`ALTER TABLE "role_permissions" DROP CONSTRAINT "FK_b4599f8b8f548d35850afa2d12c"`);
        await queryRunner.query(`ALTER TABLE "paper" DROP CONSTRAINT "FK_3d5630fd1fe26e618411b478137"`);
        await queryRunner.query(`ALTER TABLE "paper" DROP CONSTRAINT "FK_84741ff13f36de84f089e061c54"`);
        await queryRunner.query(`ALTER TABLE "paper" DROP CONSTRAINT "FK_b4592634edaca09002d5ea9768a"`);
        await queryRunner.query(`ALTER TABLE "paper" DROP CONSTRAINT "FK_724f30fb358f6009cc69f659ef5"`);
        await queryRunner.query(`ALTER TABLE "paper_author" DROP CONSTRAINT "FK_372204b2e2c699e76f3c598e5ea"`);
        await queryRunner.query(`ALTER TABLE "paper_comentary" DROP CONSTRAINT "FK_2fa804676ce6f75b17fb32bae4a"`);
        await queryRunner.query(`ALTER TABLE "paper_comentary" DROP CONSTRAINT "FK_7179dc058f214848f6f3297488f"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ead3ebcaed5f6054d829457974"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d24160eca314b856961f36b8b"`);
        await queryRunner.query(`DROP TABLE "topic_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_06792d0c62ce6b0203c03643cd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b4599f8b8f548d35850afa2d12"`);
        await queryRunner.query(`DROP TABLE "role_permissions"`);
        await queryRunner.query(`DROP TABLE "district"`);
        await queryRunner.query(`DROP TABLE "province"`);
        await queryRunner.query(`DROP TABLE "department"`);
        await queryRunner.query(`DROP TABLE "paper"`);
        await queryRunner.query(`DROP TABLE "paper_author"`);
        await queryRunner.query(`DROP TABLE "paper_comentary"`);
        await queryRunner.query(`DROP TABLE "topic"`);
        await queryRunner.query(`DROP TABLE "web_user"`);
        await queryRunner.query(`DROP TYPE "public"."web_user_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."web_user_documenttype_enum"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "category"`);
        await queryRunner.query(`DROP TABLE "role"`);
        await queryRunner.query(`DROP TABLE "permission"`);
    }

}
