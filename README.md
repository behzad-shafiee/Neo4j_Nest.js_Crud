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

if connection is ok we see (([Nest] 15192 - ۱۴۰۱/۰۷/۱۶ ۱۰:۰۴:۳۳ LOG [Neo4j Db] Neo4j is connected)) in terminal and it returns ((driver))
for us that we can use that in ((service )) for create ((session))
but if we have any err it returns the err

##### Neo4j Serivce Methods

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
` match (post_5:POST {tjttle :"222222222222"}) set post_5.tjttle="333" RETURN post_5 limit 10 `,
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

## explaining methods above

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
While the Neo4j type system supports 64-bit integers, JavaScript is unable to handle these correctly. In order to support Cypher’s type system, the driver will convert integer values into an instance of a neo4j Integer. In order to work with these
example => int(2) return Integer { low: 2, high: 0 }

4-What is Session
To run one or more queries, you’ll first need to create a Session. These sessions act as a container for a logical sequence of transactions (queries) and will borrow connections from the driver’s connection pool as necessary. These sessions should be considered lightweight and disposable.
// Note: Always make sure to close sessions when you are done using them!

5-Run() ===>Auto-commit Transactions
Auto-commit transactions are sent to the server and acknowledged immediately. We can do by calling the run method on the session. This method accepts two arguments, a parameterised Cypher query string and an optional object containing parameters in key, value format.

6- transactionTest() ===> Read & Write Transactions

## session.beginTransaction()

## session.readTransaction() ===> deprecated — This method will be removed in version 6.0. Please, use session.executeRead instead.

## session.writeTransaction() ===> deprecated — This method will be removed in version 6.0. Please, use session.executeWrite instead.

We can run a transaction in one of two ways, either by calling session.beginTransaction() which returns a transaction object, or calling session.readTransaction() or session.writeTransaction() with a function containing the work for that transaction. The first argument for this function will be a transaction. We can use this to run queries.
in my example i use from session.executeRead for reading data and from session.executeWrite for two updating data sequential

7-read() and write
read ====> use for read data
write ===> use for create,update and delete data

## Methods in Service Crud Operation

below i bring for u code of my PostService and i explain the methods that i use in it :

async create(param: CreatePostDto) {
try {
const query = ` create ((post1:POST {tjttle:"${param.post_tittle}"}) -[:Of]-> (comment0:COMMENT {name:"${param.comment_name}"})) ,((post1) -[:Of]-> (comment1:COMMENT {name:"comment1"})) return post1`;
return await this.neo4jService.write(query);
} catch (e) {
console.log(e);
throw e;
} finally {
// this.neo4jService.onApplicationShutdown();
}
}

async findOne(findPostDto: FindPostDto) {
try {
console.log(findPostDto.post_id);
console.log(typeof findPostDto.post_id);

      const res = await this.neo4jService.read(
        `match  (post:POST) -[:Of]-> (comment:COMMENT)
        where ID(post)=${findPostDto.post_id}
        return post,comment
        limit 10`,
      );
      if(res.records.length ==0){
        return {
          err:{
            msg:"node with this id not exist",
            success:false
          }
        }
      }
      console.log(res);
      return res;
    } catch (e) {
      console.log('in err');
      console.log(e);
      throw e;
    } finally {
      // this.neo4jService.onApplicationShutdown();
    }

}

async update(post_id: number, createPostDto: CreatePostDto) {
try {
const res = await this.neo4jService
.write(`match (post:POST) -[:Of]-> (comment:COMMENT)
where ID(post)= ${post_id}
        set post.tjttle="${createPostDto.post_tittle}"

        return post,comment`);
      return res;
    } catch (e) {
      console.log(e);
      throw e;
    } finally {
      // this.neo4jService.onApplicationShutdown();
    }

}

async delete(post_id: number) {
try {
const res = await this.neo4jService.write(`match (post:POST) where ID(post)= ${post_id} detach delete post`);
return res;
} catch (e) {
console.log(e);
throw e;
} finally {
// this.neo4jService.onApplicationShutdown();
}
}

# create ===> we write the query of create with cypher like below:

create
((post1:POST {tjttle:"${param.post_tittle}"})  -[:Of]-> (comment0:COMMENT {name:"${param.comment_name}"}))
,((post1) -[:Of]-> (comment1:COMMENT {name:"comment1"}))
return post1

we recieve the required info from client (here is post_tittle and comment_name)

# read ===> we recieve the id of our considered node (here is post_id) and enter that in our query:

` match (post:POST) -[:Of]-> (comment:COMMENT) where ID(post)=${findPostDto.post_id} return post,comment limit 10``match (post:POST) -[:Of]-> (comment:COMMENT) where ID(post)=${findPostDto.post_id} return post,comment limit 10 `

# update ===> we recieve the id of our considered node (here is post_id) and new data(post_tittle) from client then enter that in our query:

`match (post:POST) -[:Of]-> (comment:COMMENT) where ID(post)= ${post_id} set post.tjttle="${createPostDto.post_tittle}" return post,comment`

# delete ===> we recieve the id of our considered node (here is post_id) enter that in our query:

`match (post:POST) where ID(post)= ${post_id} detach delete post`

#### Using npm i neo4j-node-ogm if u want to use entity model for your nodes

export class Comment extends Model {
  constructor(values) {
    const labels = ['COMMENT'];
    const attributes = {
      name: Field.String({
        require:true
      }),
      post: Field.Relationship({
        labels: ['OF'],
        target: Post
      }),
    };
    super(values, labels, attributes);
  }
}

# lables ===> it is lable of our nodes
# attributes ===> it is attribute of our node for example in our code our node is a comment and it has
a name and post ,,, name is name of comment and post is for relation between post and comment 