import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Artist } from '../artists/artist.entity';
import { Album } from '../albums/album.entity';
import { Track } from '../tracks/track.entity';
import { User } from '../users/user.entity';

@Entity('favorites')
export class Favorites {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToMany(() => Artist)
  @JoinTable({
    name: 'favorites_artists',
    joinColumn: { name: 'favorites_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'artist_id', referencedColumnName: 'id' },
  })
  artists: Artist[];

  @ManyToMany(() => Album)
  @JoinTable({
    name: 'favorites_albums',
    joinColumn: { name: 'favorites_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'album_id', referencedColumnName: 'id' },
  })
  albums: Album[];

  @ManyToMany(() => Track)
  @JoinTable({
    name: 'favorites_tracks',
    joinColumn: { name: 'favorites_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'track_id', referencedColumnName: 'id' },
  })
  tracks: Track[];
}
