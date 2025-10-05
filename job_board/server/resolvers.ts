import { GraphQLError } from "graphql";
import { getCompany } from "./db/companies.ts";
import { countJobs, createJob, deleteJob, getJob, getJobs, getJobsByCompany, updateJob } from "./db/jobs.ts";

export const resolvers = {
    Query: {
        company: async (_root, { id }) => {
            const company = await getCompany(id);
            if (!company) {
                throw notFoundError('No Company found with id ' + id);
            }
            return company;
        },
        job: async (_root, { id }) => {
            const job = await getJob(id);
            if (!job) {
                throw notFoundError('No Job found with id ' + id);
            }
            return job;
        },
        jobs: async (_root, { limit, offset }) => {
            const items = await getJobs(limit, offset);
            const totalCount = await countJobs();
            return { items, totalCount };
        },
        atg: async(_root, { id }, context, info) => {
          console.log("Query.atg resolver called. args:", { id });
          return { id };
      }
    },

    Mutation: {
        createJob: (_root, { input: { title, description } }, { user }) => { // destructuring user from context passed in server.ts
          if (!user) {
            throw unauthorizedError('Missing authentication');
          }
          return createJob({ companyId: user.companyId, title, description });
        },
    
        deleteJob: async (_root, { id }, { user }) => {
          if (!user) {
            throw unauthorizedError('Missing authentication');
          }
          const job = await deleteJob(id, user.companyId);
          if (!job) {
            throw notFoundError('No Job found with id ' + id);
          }
          return job;
        },
    
        updateJob: async (_root, { input: { id, title, description } }, { user }) => {
          if (!user) {
            throw unauthorizedError('Missing authentication');
          }
          const job = await updateJob({ id, companyId: user.companyId, title, description });
          if (!job) {
            throw notFoundError('No Job found with id ' + id);
          }
          return job;
        },
      },

    Company: {
        jobs: (company) => getJobsByCompany(company.id),
    },

    Job: {
        company: (job, _args, { companyLoader }) => {
            console.log("Job.company resolver called. job:", job);
            return companyLoader.load(job.companyId);
        },
        date: (job) => toIsoDate(job.createdAt),
        salary: () => 5.5,         
        location: () => "CHD"
    },

    ATG: {
      id: (parent, args, context, info) => {
          console.log("ATG.id resolver called. parent:", parent);
          return `ID for ATG: ${parent.id}`;
      },
      name: (parent, args, context, info) => {
          console.log("ATG.name resolver called. parent:", parent);
          return `Name for ATG: ${parent.id}`;
      }
  }
};

function notFoundError(message) {
    return new GraphQLError(message, {
        extensions: { code: 'NOT_FOUND' },
    });
}

function unauthorizedError(message) {
    return new GraphQLError(message, {
        extensions: { code: 'UNAUTHORIZED' },
    });
}

function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length);
}
