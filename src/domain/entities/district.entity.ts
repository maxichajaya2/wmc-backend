import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class District {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ type: 'varchar', length: 255 })
  name: number;

  @Column({ type: 'int' })
  provinceId: number;
}