const { paginateResults } = require('./utils');

module.exports = {
    Query: {
        launches: async (_, { pageSize = 20, after }, { dataSources }) => {
            const allLaunches = await dataSources.launchAPI.getAllLaunches();
            // we want these in reverse chronological order
            allLaunches.reverse();
            const launches = paginateResults({
              after,
              pageSize,
              results: allLaunches
            });
            return {
              launches,
              cursor: launches.length ? launches[launches.length - 1].cursor : null,
              // if the cursor of the end of the paginated results is the same as the
              // last item in _all_ results, then there are no more results after this
              hasMore: launches.length
                ? launches[launches.length - 1].cursor !==
                  allLaunches[allLaunches.length - 1].cursor
                : false
            };
          },
      launch: (_, { id }, { dataSources }) =>
        dataSources.launchAPI.getLaunchById({ launchId: id }),
      me: (_, __, { dataSources }) => dataSources.userAPI.findOrCreateUser()
    }
  };
  /*
  (parent, args, context, info)
  For the launches, all we need is the dataSources so the underscores are used to
  indicate that parent and args are irrelevant in this resolver

  For the launch, again the parent is not needed, but we do need the args - the id is 
  destructured from the args for brevity
  */