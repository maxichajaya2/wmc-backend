import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Province {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255 })
  name: number;

  @Column({ type: 'int' })
  departmentId: number;
}