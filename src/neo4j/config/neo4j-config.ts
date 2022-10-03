export type Neo4jScheme =
  | 'neo4j'
  | 'neo4j+s'
  | 'neo4j+ssc'
  | 'bolt'
  | 'bolt+s'
  | 'bolt+ssc';

export interface Neo4jConfig {
  scheme: Neo4jScheme | string;
  host: string;
  port: number | string;
  username: string;
  password: string;
  database?: string;
}

const config = require('dotenv').config();

export const Neo4jConfig = {
  scheme: process.env.DB_SHEMA,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
};
