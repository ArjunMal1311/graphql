import { getSampleCompanies, GetSampleEmployee, getSingleCompany } from "./db/companies.ts"
import { PubSub } from 'graphql-subscriptions';
const pubSub = new PubSub();

export const resolvers = {
    Query: {
        companies: (_root, _args, { user }) => {
            // if(!user) {
            //     console.log("Hello world no user found")
            //     return
            // }

            return getSampleCompanies()
        },
        breeds: (_root, _args, { user }) => {
            return "NO BREED lol"
        },
        employees: (_root, _args, { user }) => {
            return GetSampleEmployee()
        },
        company: (_root, _args, { user }) => {
            return [getSingleCompany()];
        }
    },
    Mutation: {
        addCompany: (_root, { input }) => {
          const newCompany = {
            id: String(Math.random()), 
            name: input.name, 
            description: input.description
          };
          pubSub.publish('COMPANY_ADDED', { companyAdded: newCompany });
          return newCompany;
        }
      },
    Subscription: {
        companyAdded: {
            subscribe: () => pubSub.asyncIterableIterator('COMPANY_ADDED')
        }
    }
}