import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { array: true, default: [] })
  artists: string[];

  @Column('text', { array: true, default: [] })
  albums: string[];

  @Column('text', { array: true, default: [] })
  tracks: string[];
}
