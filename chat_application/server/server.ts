import { ApolloServer } from '@apollo/server';
import { expressMiddleware as apolloMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from '@graphql-tools/schema';
// @ts-ignore
import cors from 'cors';
import express from 'express';
import { readFile } from 'node:fs/promises';
// @ts-ignore
import { useServer as useWsServer } from 'graphql-ws/use/ws';
import { createServer as createHttpServer } from 'node:http';
import { WebSocketServer } from 'ws';
import { authMiddleware, decodeToken, handleLogin } from './auth.ts';
import { resolvers } from './resolvers.ts';

const PORT = 9000;

const app = express();
app.use(cors(), express.json());

app.post('/login', handleLogin);

function getHttpContext({ req }) {
    if (req.auth) {
        return { user: req.auth.sub };
    }
    return {};
}

function getWsContext({ connectionParams }) {
    const accessToken = connectionParams?.accessToken;
    console.log("Access Token: ", accessToken)
    if (accessToken) {
        const payload = decodeToken(accessToken);
        console.log("PAYLOAD: ", payload)
        return { user: payload.sub };
    }
    return {};
}

const typeDefs = await readFile('./schema.graphql', 'utf8');
const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({ schema });
await apolloServer.start();

app.use('/graphql', authMiddleware, apolloMiddleware(apolloServer, {
    // @ts-ignore
    context: getHttpContext,
}));

const httpServer = createHttpServer(app);
const wsServer = new WebSocketServer({ server: httpServer, path: '/graphql' });
useWsServer({ schema, context: getWsContext }, wsServer);

httpServer.listen({ port: PORT }, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`GraphQL endpoint: http://localhost:${PORT}/graphql`);
});