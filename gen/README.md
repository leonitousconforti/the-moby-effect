# Schema generator

Parsers the [Moby Swagger API](https://github.com/moby/moby/blob/master/api/swagger.yaml) schema definition into @effect/schema types.

## Why write my own parser over using existing tools?

I started by writing some custom templates for [swagger-codegen](https://github.com/swagger-api/swagger-codegen/tree/master), which didn't work too great. So I tried writing a custom plugin next, but again, it didn't work too great.

The main problems I was having with existing tools like swagger-codegen:

1. Swagger types don't necessarily map very well to @effect/schema types (in particular arrays/nullable/optional/defaults)

If a swagger primitive (string, number, boolean) has a default type then that means that it is optional on both encoding and decoding - Something that I wasn't able to replicate using @effect/schema (if someone knows how though I would love to know!). Also it seems to me like optional properties are optional+nullable by default, unless they are explicitly marked nullable=false then they are just optional. But nullable=true and optional=true is the same thing as just optional=true. But optional=false and nullable=true is not the same thing? IDK if I am interpreting the spec right but that appears to be how the moby schema is working (assuming the daemon correctly implements the schema, which I think it does).

Also for array types, all the existing tools have it hard coded as `Array<T>` where `T` is the inner type, or `Record<string, T>` for record types. But that is not at all how @effect/schema wants it. For primitive types its simple enough to just append `Schema.` to the type but obviously that doesn't work with non-primitive types. I tried using a built-in flag of swagger-codegen called type mappings, but I couldn't get all the types I wanted to work with it. So I had to run some regex's over the generated code to replace some of the mis-generated types, which felt bad.

2. These tools just want to spit out a bunch of types, which doesn't work when you want types to depend on each other.

By default, tools like swagger codegen generate interface types. Why? I think they do this for the main reason that interfaces can be used/referenced before they are defined. In my head though, if I am using @effect/schema I want to get all the benefits which means I am defining my types using classes approach - and classes can not be used before they are defined, not even using suspend. So when I wrote my initial templates and plugins using swagger-codegen, I had to include separating comments between each type so that I could go back after I generated a first pass of the file and split up all the schema sections, determine which ones depend on each other using a couple terrible regex's before sorting them so that no sections that rely on each other are defined before each other and finally piecing the file back together. It felt bad to say the least. Writing my own custom generator meant I had more control over the types it outputted and I could hoist certain sections (like enums) and control the order of sections so it actually compiles

## Structure

Here is a short blurb about each file and the order in which I would look through the source code if I was trying to understand it (for future me)

`types.ts` -> I would start here as it has types defined for all the different schema cases we will try to parse
`main.ts` -> Loads your swagger/openAPI schema file, has the main recursive parsing function `genSchemaType`, and orders the final schema types before saving them
`primitive.ts` -> Generates the schema for a primitive type (string, number, or boolean)
`array.ts` -> Generates the schema for an array type. Makes use of the recursive `genSchemaType` to generate the inner type `T` before wrapping it in an array
`enum.ts` -> Generates the schema for an enum type and hoists the enum declaration to the top level scope so that it can be used directly from TS
`reference.ts` -> Generates the schema for a reference type and a hoist request for the referenced type
`all-of.ts` -> Generates the schema for an allOf type (inherits from a collection of other schemas)
`object.ts` -> Generates the schema for an object type - WTF this needs help
