import { PubSub } from 'graphql-subscriptions';
import { GraphQLError, subscribe } from 'graphql';
import { createMessage, getMessages } from './db/messages.ts';

const pubSub = new PubSub();

export const resolvers = {
    Query: {
        messages: (_root, _args, { user }) => {
            if (!user) throw unauthorizedError();

            return getMessages()
        }
    },

    Mutation: {
        addMessage: async (_root, { text }, { user }) => {
            if (!user) throw unauthorizedError();
            const message = await createMessage(user, text);
            pubSub.publish('MESSAGE_ADDED', { messageAdded: message });
            return message;
        },
    },

    Subscription: {
        messageAdded: {
            subscribe: (_root, _args, { user }) => {
                if (!user) throw unauthorizedError();
                console.log(user)
                return pubSub.asyncIterableIterator('MESSAGE_ADDED');
            }
        }
    }
}

function unauthorizedError() {
    return new GraphQLError('Not authenticated', {
        extensions: { code: 'UNAUTHORIZED' },
    });
}
