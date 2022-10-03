import { Logger } from '@nestjs/common';
import neo4j, { Driver } from 'neo4j-driver';
import { Neo4jConfig } from 'src/neo4j/config/neo4j-config';

const logger = new Logger('Neo4j Db');

export const createDriver = async (config: Neo4jConfig) => {
  try {
    const driver: Driver = neo4j.driver(
      `${config.scheme}://${config.host}:${config.port}`,
      neo4j.auth.basic(config.username, config.password),
    );

    const checkConnection = await driver.getServerInfo();
    if (checkConnection) {
      logger.log(`Neo4j is connected`);
    }

    return driver;
  } catch (e) {
    console.log(`does not connect ====> ${e}`);
    throw e;
  }
};
