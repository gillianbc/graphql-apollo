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