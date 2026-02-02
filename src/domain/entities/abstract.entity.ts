import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity({ name: "abstract" })
export class Abstract {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 200, nullable: true })
  codigo: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  name: string | null;

  @Column({ type: "varchar", length: 255, nullable: true })
  lastname: string | null;

  @Column({ type: "varchar", length: 255 })
  email: string; // único NOT NULL (además del id)

  @Column({ type: "text", nullable: true })
  title: string | null;
}
