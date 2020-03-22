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
    launches {
      id
      mission {
        name
      }
    }
  }
}
`
This will return a numeric string.  Pass this in as the 'after' arg.
