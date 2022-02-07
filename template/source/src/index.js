import {
	ApolloServerPluginDrainHttpServer as enablePlayground,
	ApolloServerPluginLandingPageDisabled as disablePlayground,
} from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import http from 'http';
import app from './express';
import { typeDefs, resolvers, directives } from './graphql';
import { BASE_URL, APP_PORT, IN_PROD } from './config';

let schema = makeExecutableSchema({ typeDefs, resolvers });
Object.entries(directives).forEach(([key, directive]) => (schema = directive(schema, key)));

const httpServer = http.createServer(app);

const server = new ApolloServer({
	introspection: true,
	schema,
	plugins: [IN_PROD ? disablePlayground() : enablePlayground({ httpServer })],
	context: ({ req, res }) => ({ req, res }),
});

server.start().then(() => {
	server.applyMiddleware({ app, path: '/graphql', cors: false });

	httpServer.listen({ port: APP_PORT }, () => {
		console.log(`\n🚀 REST-APIs Docs : ${BASE_URL}/api-docs\n`);

		console.log(`🚀 REST-APIs      : ${BASE_URL}/api`);
		console.log(`🚀 GRAPHQL-APIs   : ${BASE_URL}${server.graphqlPath}`);
	});
});

export default httpServer;
