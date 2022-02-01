import {
	ApolloServerPluginLandingPageGraphQLPlayground as enablePlayground,
	ApolloServerPluginLandingPageDisabled as disablePlayground,
} from 'apollo-server-core';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import http from 'http';
import app from './express';
import { typeDefs, resolvers, directives } from './graphql';
import { BASE_URL, APP_PORT, IN_PROD } from './config';

const httpServer = http.createServer(app);

let schema = makeExecutableSchema({ typeDefs, resolvers });
Object.entries(directives).forEach(([key, directive]) => (schema = directive(schema, key)));

const server = new ApolloServer({
	introspection: true,
	schema,
	plugins: [
		IN_PROD
			? disablePlayground()
			: enablePlayground({ settings: { 'request.credentials': 'include' } }),
	],
	context: ({ req, res }) => ({ req, res }),
});

server.start().then(() => {
	server.applyMiddleware({ app, path: '/graphql', cors: false });

	httpServer.listen({ port: APP_PORT }, () => {
		console.log(`🚀 REST-APIs    : ${BASE_URL}/api`);

		console.log(`🚀 GRAPHQL-APIs : ${BASE_URL}${server.graphqlPath}`);
	});
});

export default httpServer;
