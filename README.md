# AWS CDK AppSync Decorators

Provides decorators for creating appsync apis using aws-cdk and awscdk-appsync-utils.

More information can be found [here](https://github.com/cdklabs/awscdk-appsync-utils).

## Code First Schema

A `SchemaBinder` is used to generate a `CodeFirstSchema`.

```ts
const binder = new SchemaBinder();
const api = new GraphqlApi(this, 'Api', {
    name: 'Demo',
    definition: Definition.fromSchema(binder.schema),
});

binder.addQuery(Query);
binder.addMutation(Mutation);
binder.addSubscription(Subscription);

binder.bindSchema();
```

## Types

The foundations of a schema are it's type definitions.

> ### Scalar

The built-in scalar types can be accessed via the `Scalar` enum (e.g. `Scalar.ID`, `Scalar.AWS_DATE`).

> ### Interface

The `@InterfaceType()` decorator is attached to a class that defines the interface shape.

```ts
@InterfaceType()
class Node {
    id = Scalar.STRING;
}
```

GraphQL

```graphql
interface Node {
    id: String
}
```

> ### Object

The `@ObjectType()` decorator is attached to a class that defines the object shape.

If an object implements any interfaces, then the interface class types should be provided to the decorator.

```ts
@InterfaceType()
class Node {
    id = Scalar.STRING;
}

@ObjectType(Node)
class FilmNode {
    filmName = Scalar.STRING;
}
```

GraphQL

```graphql
interface Node {
    id: String
}

type FilmNode implements Node {
    filmName: String
}
```

> ### Enum

The `@EnumType()` decorator is attached to a class that defines the enum values.

The property names are used as the enum values and the property values are ignored (so can be anything to keep TypeScript happy).

```ts
@EnumType()
class Episode {
    NEWHOPE = Scalar.STRING;
    EMPIRE = Scalar.STRING;
    JEDI = Scalar.STRING;
}
```

GraphQL

```graphql
enum Episode {
    NEWHOPE
    EMPIRE
    JEDI
}
```

> ### Input

The `@InputType()` decorator is attached to a class that defines the input shape.

```ts
@InputType()
class Review {
    stars = Scalar.INT;
    commentary = Scalar.STRING;
}
```

GraphQL

```graphql
input Review {
    stars: Int
    commentary: String
}
```

> ### Union

The `@UnionType()` decorator is attached to a class that defines the union.

All object class types should be provided to the decorator.

```ts
@ObjectType()
class Human {
    name = Scalar.STRING;
}

@ObjectType()
class Droid {
    name = Scalar.STRING;
}

@ObjectType()
class Starship {
    name = Scalar.STRING;
}

@UnionType(Human, Droid, Starship)
class Search {}
```

GraphQL

```graphql
union Search = Human | Droid | Starship
```

> ### Args

The `@Args()` decorator is attached to a property and provides a class type that defines the argument names and types.

```ts
class FilmArgs {
    after = Scalar.STRING;
    first = Scalar.INT;
    before = Scalar.STRING;
    last = Scalar.INT;
}

class Query {
    @Args(FilmArgs)
    allFilms = FilmConnection;
}
```

GraphQL

```graphql
type Query {
    allFilms(after: String, first: Int, before: String, last: Int): FilmConnection
}
```

> ### Modifiers

Modifiers can be attached to properties to define when a value is a list or non-null.

- `@List()`
- `@Required()`
- `@RequiredList()`

If the `@RequiredList()` decorator is attached, then the `@List()` decorator is not needed.

A property is also considered a list when it's return type is an array.

```ts
class FilmArgs {
    @Required()
    id = Scalar.STRING;
}

@ObjectType()
class Film {
    @Required()
    id = Scalar.STRING;

    @Required()
    filmName = Scalar.STRING;

    @List()
    reviews = Review; // can also be Review[] as an alternative
}

class Query {
    @Args(FilmArgs)
    @Required()
    film = Film;
}
```

GraphQL

```graphql
type Film {
    id: String!
    filmName: String!
    reviews: [Review]
}

type Query {
    film(id: String!): Film!
}
```

## Resolvers

Resolvers are defined by extending either `JsResolver` or `VtlResolver` and then using the `@Resolver()` decorator to attach them to properties.

Under the hood, when defining the resolver class, a data source definition is required. As a result, when calling `bindSchema()`, the relevant data source definitions should be included to match the name provided by the resolver.

```ts
class FilmResolver extends JsResolver {
    dataSource = 'Demo';
    code = Code.fromInline('...code...');
}

class AllFilmsResolver extends VtlResolver {
    dataSource = 'Demo';
    requestMappingTemplate = MappingTemplate.fromString('...template...');
    responseMappingTemplate = MappingTemplate.fromString('...template...');
}

class Query {
    @Resolver(FilmResolver)
    film = Film;

    @Resolver(AllFilmsResolver)
    allFilms = Film[];
}

// Bind the schema
const dataSource = api.addNoneDataSource('NoneDataSource');

binder.bindSchema({
    dataSources: {
        'Demo': dataSource,
    },
});
```

If a resolver pipeline is needed, then an array of function names can be provided to the decorator. Note that a data source should not be provided for a pipeline resolver.

As with the data sources, the named function definitions should be included when calling `bindSchema()`.

```ts
class AddFilmResolver extends JsResolver {
    code = Code.fromInline('...code...');
}

class Mutation {
    @Resolver(AddFilmResolver, 'Index', 'Db')
    addFilm = Film;
}

// Bind the schema
const indexFunction = new appsync.AppsyncFunction(this, 'IndexFunction');
const dbFunction = new appsync.AppsyncFunction(this, 'DbFunction');

binder.bindSchema({
    functions: {
        Index: indexFunction,
        Db: dbFunction,
    },
});
```

## Directives

Directives can be attached to both classes and properties.

- `@ApiKey()`
- `@Cognito(groups)`
- `@Custom(statement)`
- `@Iam()`
- `@Lambda()`
- `@Oidc()`
- `@Subscribe(mutations)`

## Caching

When a resolver is attached to a property, then a caching configuration can also be attached using the `@Cache()` decorator. This accepts a time to live (TTL) value in seconds and an optional array of keys.

```ts
class Query {
    @Args(FilmArgs)
    @Resolver(FilmResolver)
    @Cache(30)
    film = Film;
}
```
