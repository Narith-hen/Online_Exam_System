import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { DatabaseConfig } from './config/database.config';

export const AppDataSource = DatabaseConfig.getDataSource();
