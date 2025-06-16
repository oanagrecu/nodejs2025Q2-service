import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { User } from './src/users/user.entity';
import { Favorites } from './src/favorites/favorites.entity';
import { Track } from './src/tracks/track.entity';
import { Album } from './src/albums/album.entity';
import { Artist } from './src/artists/artist.entity';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'db',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [User, Favorites, Track, Album, Artist],
  migrations: [__dirname + '/migration/*.ts'],
  subscribers: [],
});
