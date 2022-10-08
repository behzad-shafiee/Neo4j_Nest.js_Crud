##### General

1-download and install Neo4j on your pc because for connecting you need that
2-npm i neo4j-driver ===>this package is for using Neo4jDb on Nest.js

##### Connect Neo4j

1-for connecting we use from =>

#code ===> Neo4jModule.forRoot(Neo4jConfig) in App.Module :

this code is declared from two part :

1.1- Neo4jModule ===> Neo4jModule is declared in src/neo4j/neo4j.module

export class Neo4jModule {

    static forRoot(config: Neo4jConfig): DynamicModule {
        return {
            module: Neo4jModule,
            global: true,
            providers: [
                {
                    provide: NEO4J_CONFIG,
                    useValue: config,
                },
                {
                    provide: NEO4J_DRIVER,
                    inject: [ NEO4J_CONFIG ],
                    useFactory: async (config: Neo4jConfig) => createDriver(config),
                },
                Neo4jService,
            ],
            exports: [
                Neo4jService,
            ]
        }
    }

    static forRootAsync(configProvider): DynamicModule {
        return {
            module: Neo4jModule,
            global: true,
            imports: [ ConfigModule ],

            providers: [
                {
                    provide: NEO4J_CONFIG,
                    ...configProvider
                } as Provider<any>,
                {
                    provide: NEO4J_DRIVER,
                    inject: [ NEO4J_CONFIG ],
                    useFactory: async (config: Neo4jConfig) => createDriver(config),
                },
                Neo4jService,
            ],
            exports: [
                Neo4jService,
            ]
        }
    }

}
in code above we declare forRoot and forRootAsync method for Neo4jModule so we can use those in App.Module

1.2-Neo4jConfig ===> Neo4jConfig is config of Neo4j that initialized in src/neo4j/config/neo4j-config
export const Neo4jConfig = {
  scheme: process.env.DB_SHEMA,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASS,
};
for connecting we need a config to enter as argumant in Neo4jModule.forRoot(argumant:configCommonConnectNeo4j)

2-Checking Connection:
for ckecking connection we use below code that initialize in src/neo4j/config/neo4j.util.ts
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

if connection is ok we see (([Nest] 15192  - ۱۴۰۱/۰۷/۱۶ ۱۰:۰۴:۳۳     LOG [Neo4j Db] Neo4j is connected)) in terminal and it returns ((driver))
for us that we can use that in ((service )) for create ((session))
but if we have any err it returns the err

##### Neo4j Serivce Methods#####
in Neo4jService we have some method that you can use as required , below I bring for u the codes in service and explain them for u:

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
      names.map(async (name) =>
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
                `
                ),
             
        
      ))
      console.log('success');
    
    } catch(e) {
      console.log('in catch');
      console.log(e);
      await session.close();
    } finally {
      await session.close()
      console.log(`sesiion close`);
    }
  }
  
}

## explaining methods above ##
1-getDriver()
it returns for us our drivr that created in previous part, it include informations like our host,port connection etc.

2-getConfig()
it returns the config of our connection Neo4j , for example like this:
{
  scheme: 'neo4j',
  host: 'localhost',
  port: 'myport',
  username: 'myUsername',
  password: 'mypass'
}

3-int(value: number)
While the Neo4j type system supports 64-bit integers, JavaScript is unable to handle these correctly.  In order to support Cypher’s type system, the driver will convert integer values into an instance of a neo4j Integer.  In order to work with these 
example => int(2) return Integer { low: 2, high: 0 }

4-
// Create a session to run Cypher statements in.
// Note: Always make sure to close sessions when you are done using them!


read ====> use for read data
write ===> use for create,update and delete data
