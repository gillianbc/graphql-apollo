module.exports = {
    Query: {
      launches: (_, __, { dataSources }) =>
        dataSources.launchAPI.getAllLaunches(),
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