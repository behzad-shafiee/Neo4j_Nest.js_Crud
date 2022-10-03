
##### General #####

1-download and install Neo4j on your pc because for connecting you need that
2-npm i neo4j-driver ===>this package is for using Neo4jDb on Nest.js

##### Connect Neo4j #####

1-for connecting we use from => (( Neo4jModule.forRoot(Neo4jConfig) )) in App.Module
#Neo4jModule is declared in src/neo4j/neo4j.module
#Neo4jConfig is config of Neo4j that initialized in src/neo4j/config/neo4j-config 

2-in src/neo4j/config/neo4j-utile I Check the connection of Db


##### Neo4j Serivce#####
in Neo4jService we have some method that you can use as required , the main of them is (read) and (write)

read ====> use for read data
write ===> use for create,update and delete data



