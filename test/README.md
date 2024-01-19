Basic unit tests to make sure that none of the endpoints throw errors unexpectedly and that they conform to the schema when you call them. These will not catch every issue that could arise, mainly because the point of these unit tests are to test the public api exposed by the-moby-effect not that the docker api returns the correct data as that is outside the scope of these unit tests.

There is now some [e2e](./e2e/) tests which additionally test the correctness of the data returned.
