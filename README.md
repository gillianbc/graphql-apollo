# graphql-apollo
Following https://www.apollographql.com/docs/tutorial/introduction/

I have added extra comments in the code as aide memoires.

Note that Apollo have given very simple names to the queries:
- Launch
- Launches
The expectation is that you give the query a more meaningful name when you use it e.g.

`
query GetLaunches {
  launches(pageSize: 3) {
    launches {
      id
      mission {
        name
      }
    }
  }
}
`

To get the next page of data, request the cursor:
`
query GetSomeStuff {
  launches(pageSize: 3, after: "1578363540") {
    cursor
    hasMore
    launches {
      id
      mission {
        name
        missionPatch
      }
    }
  }
}
`
This will return a numeric string.  Pass this in as the 'after' arg.

## Understanding Apollo's Underscores
In the resolvers, you will see Apollo using _ and __
Recall the arguments for any resolver are (parent, args, context, info).
Info (parsed query information) is rarely used, so it boils down to (parent, args, context)
`
Launch: {
  isBooked: async (launch, _, { dataSources }) =>
    dataSources.userAPI.isBookedOnLaunch({ launchId: launch.id }),
},
`
The way to read the above is:
- It's a resolver for the Launch type
- it's for the isBooked field
- it needs the parent (the details of the launch returned from the database)
- does not need any args specified by the client
- from the context, it only needs the datasources

`
User: {
  trips: async (_, __, { dataSources }) => {
    // get ids of launches by user
    const launchIds = await dataSources.userA...
`
The way to read the above is:
- It's a resolver for the User type
- it's for the trips field
- does not need the parent (i.e. the user details)
- does not need any args specified by the client
- from the context, it only needs the datasources

i.e. for the first not required param, Apollo use _, for the next not needed param,
Apollo use __ etc.

# Appendix
query GetMe {
  me {
    id
    email
    trips {
      id
    }
  }
}

query GetSomeStuff {
  launches(pageSize: 3, after: "1578363540") {
    cursor
    hasMore
    launches {
      id
      mission {
        name
        missionPatch
      }
    }
  }
}
