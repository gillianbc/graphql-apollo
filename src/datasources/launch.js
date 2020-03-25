const { RESTDataSource } = require('apollo-datasource-rest');

class LaunchAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'https://api.spacexdata.com/v2/';
  }

  //  lean and concise method
  async getAllLaunches() {
    const response = await this.get('launches');
    return Array.isArray(response)
      ? response.map(launchFromDB => this.launchReducer(launchFromDB))
      : [];
  }

  async getLaunchById({ launchId }) {
    const response = await this.get('launches', { flight_number: launchId });
    console.log('LAUNCH FROM DB' + JSON.stringify(response, null, 2))
    console.log(response.length > 0)
    return (response.length ? this.launchReducer(response[0]) : null)
    
  }
  
  getLaunchesByIds({ launchIds }) {
    return Promise.all(
      launchIds.map(launchId => this.getLaunchById({ launchId })),
    );
  }


  // This is where the work happens of mapping the DB response to the schema fields
  // Note that we are resolving inner types here - mission and rocket
  launchReducer(launchFromDB) {
    return {
      id: launchFromDB.flight_number || 0,
      cursor: `${launchFromDB.launch_date_unix}`,
      site: launchFromDB.launch_site && launchFromDB.launch_site.site_name,
      mission: {
        name: launchFromDB.mission_name,
        missionPatchSmall: launchFromDB.links.mission_patch_small,
        missionPatchLarge: launchFromDB.links.mission_patch,
      },
      rocket: {
        id: launchFromDB.rocket.rocket_id,
        name: launchFromDB.rocket.rocket_name,
        type: launchFromDB.rocket.rocket_type,
      },
    };
  }
}



module.exports = LaunchAPI;