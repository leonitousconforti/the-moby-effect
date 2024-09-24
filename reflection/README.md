# Reflection

Why use Go reflection to generate the types, even though Moby has an OpenApi document? Because the OpenApi document is not kept up to date and is not even used to generate the types in the moby project. I had lots of problems why trying to generate my types using the OpenApi document, so I opted to just write some Go code to extract the types using reflection instead.

[https://github.com/moby/moby/issues/27919](https://github.com/moby/moby/issues/27919)
