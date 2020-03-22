/*
  (parent, args, context, info)
  For the launches, all we need is the dataSources so the underscores are used to
  indicate that parent and args are irrelevant in this resolver

  For the launch, again the parent is not needed, but we do need the args - the id is 
  destructured from the args for brevity
  */

const {
    paginateResults
} = require('./utils');

module.exports = {
    Query: {
        launches: async (_, {
            pageSize = 20,
            after
        }, {
            dataSources
        }) => {
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
                hasMore: launches.length ?
                    launches[launches.length - 1].cursor !==
                    allLaunches[allLaunches.length - 1].cursor :
                    false
            };
        },
        launch: (_, {
                id
            }, {
                dataSources
            }) =>
            dataSources.launchAPI.getLaunchById({
                launchId: id
            }),
        me: (_, __, {
            dataSources
        }) => dataSources.userAPI.findOrCreateUser(),

    },
    Mission: {
        // make sure the default size is 'large' in case user doesn't specify
        missionPatch: (mission, {
            size
        } = {
            size: 'LARGE'
        }) => {
            console.log(mission.size, mission.missionPatchSmall, mission.missionPatchLarge)
            return size === 'SMALL' ?
                mission.missionPatchSmall :
                mission.missionPatchLarge;
        },
    },
    Launch: {
        isBooked: async (launch, _, {dataSources } ) =>
            dataSources.userAPI.isBookedOnLaunch({
                launchId: launch.id
            }),
    },
    User: {
        trips: async (_, __, {
            dataSources
        }) => {
            // get ids of launches by user
            const launchIds = await dataSources.userAPI.getLaunchIdsByUser();

            if (!launchIds.length) return [];

            // look up those launches by their ids
            return (
                dataSources.launchAPI.getLaunchesByIds({
                    launchIds,
                }) || []
            );
        },
    },
};