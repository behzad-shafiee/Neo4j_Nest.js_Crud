import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import neo4j, { Driver, int, Result, Transaction } from 'neo4j-driver';
import { Neo4jConfig } from 'src/neo4j/config/neo4j-config';
import { NEO4J_CONFIG, NEO4J_DRIVER } from '../config/neo4j.constants';

@Injectable()
export class Neo4jService implements OnApplicationShutdown {
  constructor(
    @Inject(NEO4J_CONFIG) private readonly config: Neo4jConfig,
    @Inject(NEO4J_DRIVER) private readonly driver: Driver,
  ) {}

  getDriver(): Driver {
    return this.driver;
  }

  getConfig(): Neo4jConfig {
    return this.config;
  }

  int(value: number) {
    return int(value);
  }

  beginTransaction(database?: string): Transaction {
    const session = this.getWriteSession(database);

    return session.beginTransaction();
  }

  getReadSession(database?: string) {
    return this.driver.session({
      database: database || this.config.database,
      defaultAccessMode: neo4j.session.READ,
    });
  }

  getWriteSession(database?: string) {
    return this.driver.session({
      database: database || this.config.database,
      defaultAccessMode: neo4j.session.WRITE,
    });
  }

  read(
    cypher: string,
    params?: Record<string, any>,
    databaseOrTransaction?: string | Transaction,
  ): Result {
    const session = this.getReadSession(<string>databaseOrTransaction);
    return session.run(cypher, params);
  }

  write(
    cypher: string,
    params?: Record<string, any>,
    databaseOrTransaction?: string | Transaction,
  ): Result {
    const session = this.getWriteSession(<string>databaseOrTransaction);
    return session.run(cypher, params);
  }

  onApplicationShutdown() {
    return this.driver.close();
  }

  async transactionTest() {
    const session = this.driver.session();
    try {
      const names = await session.executeRead(async (tx) => {
        const result = await tx.run(
          'MATCH (post:POST) RETURN post.tjttle AS name limit 100',
        );
        return result.records.map((record) => record.get('name'));
      });
      console.log(names);
      const relationshipsCreated = await session.executeWrite(async (tx) =>
        names.map(
          async (name) =>
            await tx.run(
              `
                match (post_5:POST {tjttle :"222222222222"})
                set post_5.tjttle="333"
                RETURN post_5
                limit 10
                `,
            ),

          await tx.run(
            `
                match 
                (post_10:POST {tjttle :"3333333333" })
                set post_10.tjttle="44444444444"
                RETURN post_10
                limit 10
                `,
          ),
        ),
      );
      console.log('success');
    } catch (e) {
      console.log('in catch');
      console.log(e);
      await session.close();
    } finally {
      await session.close();
      console.log(`sesiion close`);
    }
  }
}
