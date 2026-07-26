import { ApolloServer } from '@apollo/server';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { expressMiddleware } from '@as-integrations/express5';
import createContext from '../context';

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});


async function createApolloMiddleware() {
    await server.start();
    return expressMiddleware(server, {
        context: createContext,
    })
    
}

export default createApolloMiddleware;