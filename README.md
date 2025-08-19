# HALSON
[![Build Status](https://travis-ci.org/seznam/halson.svg?branch=master)](https://travis-ci.org/seznam/halson)

The [HAL+JSON](http://stateless.co/hal_specification.html) Resource Object with TypeScript support.

## Version
3.1.0

## Installation

### node.js

```sh
npm install halson --save
```

### Bower

```sh
bower install halson --save
```

## Example
```js
var halson = require('halson');

var embed = halson({
        title: "joyent / node",
        description: "evented I/O for v8 javascript"
    })
    .addLink('self', '/joyent/node')
    .addLink('author', {
        href: '/joyent',
        title: 'Joyent'
    });

var resource = halson({
        title: "john doe",
        username: "doe",
        emails: [
            "john.doe@example.com",
            "doe@example.com"
        ]
    })
    .addLink('self', '/doe')
    .addEmbed('starred', embed);

console.log(resource.title);
console.log(resource.emails[0]);
console.log(resource.getLink('self'));
console.log(resource.getEmbed('starred'));
console.log(JSON.stringify(resource));
```

## TypeScript Support

HALSON supports TypeScript with generic typing for strongly-typed HAL+JSON resources. This allows you to work with your domain objects while preserving all HAL+JSON functionality.

### Basic TypeScript Usage

```typescript
import halson from "halson";

// Define your domain interface
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

// Create a typed resource
const userData: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  isActive: true
};

// halson<T>() returns HALSONResource<T> which includes both
// your domain properties AND all HAL+JSON methods
const userResource = halson<User>(userData)
  .addLink('self', '/users/1')
  .addLink('edit', '/users/1/edit');

// ✅ Fully typed access to your domain properties
console.log(userResource.name);     // string
console.log(userResource.isActive); // boolean

// ✅ Plus all HAL+JSON functionality
console.log(userResource.getLink('self')); // HALSONLink | undefined
console.log(userResource.listLinkRels());  // string[]
```

### Import Patterns

**Option 1: Import with namespace access**
```typescript
import halson from "halson";

const resource = halson<User>(userData);
type UserResource = halson.HALSONResource<User>;
```

**Option 2: Import with wildcard**
```typescript
import * as halson from "halson";

const resource = halson<User>(userData);
type UserResource = halson.HALSONResource<User>;
```

**Option 3: Type-only imports (recommended)**
```typescript
import halson from "halson";
import type { HALSONResource } from "halson";

const resource = halson<User>(userData);
type UserResource = HALSONResource<User>;
```

### Working with Embedded Resources

```typescript
interface Repository {
  id: number;
  name: string;
  language: string;
  stars: number;
}

interface UserWithRepos {
  id: number;
  name: string;
  email: string;
}

const userWithRepos = halson<UserWithRepos>({
  id: 1,
  name: "John Doe",
  email: "john@example.com"
})
.addLink('self', '/users/1')
.addEmbed('repositories', [
  halson<Repository>({
    id: 101,
    name: "awesome-project",
    language: "TypeScript",
    stars: 42
  }).addLink('self', '/repos/101'),
  
  halson<Repository>({
    id: 102,
    name: "another-project", 
    language: "JavaScript",
    stars: 23
  }).addLink('self', '/repos/102')
]);

// ✅ Type-safe access to embedded resources
const repos = userWithRepos.getEmbeds<Repository>('repositories');
repos.forEach(repo => {
  console.log(`${repo.name} (${repo.language}) - ${repo.stars} stars`);
});
```

### Function Signatures

```typescript
// Generic function overloads
function halson(data?: string | object): HALSONResource;
function halson<T extends object>(data: string | T): HALSONResource<T>;

// Generic type alias
type HALSONResource<T extends object = object> = HALSONResource & T;
```

### Migration from JavaScript

Existing JavaScript code works unchanged:

```javascript
// This JavaScript code continues to work exactly the same
const resource = halson({
  title: "Hello World",
  count: 42
});

console.log(resource.title); // "Hello World"
```

When migrating to TypeScript, you can gradually add type annotations:

```typescript
// Step 1: Add interface
interface Post {
  title: string;
  count: number;
}

// Step 2: Add generic type parameter
const resource = halson<Post>({
  title: "Hello World",
  count: 42
});

// Now you get full type safety!
console.log(resource.title); // ✅ TypeScript knows this is a string
```

## API

### `halson([data])`
Create a new HAL+JSON Resource Object.
 * `data` (optional): Initial data as serialized string or Object.

```js
// empty HAL+JSON Resource Object
var resource = halson();

// resource from a serialized data
var resource = halson('{title:"Lorem Ipsum",_links:{self:{href:"/ipsum"}}');

// resource from an Object
resource = halson({
    _links: {
        self: {
            href: {"/ipsum"}
        }
    },
    title: "Lorem Ipsum"
});

// resource from another resource (no-op)
var resourceX = halson(resource);
console.log(resource === resourceX); // true
```


### `HALSONResource#listLinkRels()`
List all link relations.

```js
var data = {
    _links: {
        self: {href: '/doe'},
        related: [
            {href: 'http://doe.com'},
            {href: 'https://twitter.com/doe'}
        ]
    }
}

var resource = halson(data);
console.log(resource.listLinkRels()); // ['self', 'related']
```

### `HALSONResource#listEmbedRels()`
List all link relations.

```js
var data = {
    _embedded: {
        starred: {
            _links: {
                self: {href: '/joyent/node'}
            }
            title: "joyent / node",
            description: "evented I/O for v8 javascript"
        }
    }
}

var resource = halson(data);
console.log(resource.listEmbedRels()); // ['starred']
```

### `HALSONResource#getLinks(rel, [filterCallback, [begin, [end]]])`
Get all links with relation `rel`.
 * `rel` (required): Relation name.
 * `filterCallback` (optional): Function used to filter array of links. [doc](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.20)
 * `begin`, `end` (optional): slice filtered links. [doc](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.10)

```js
var twitterLinks = resource.getLinks('related', function(item) {
    return item.name === "twitter";
});
```

### `HALSONResource#getLink(rel, [filterCallback, [default]])`
Get first link with relation `rel`.
 * `rel` (required): Relation name.
 * `filterCallback` (optional): Function used to filter array of links. [doc](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.20)
 * `default` (optional): Default value if the link does not exist.

```js
var firstRelatedLink = resource.getLink('related');
```

### `HALSONResource#getEmbeds(rel, [filterCallback, [begin, [end]]])`
Get all embedded resources with relation `rel`.
 * `rel` (required): Relation name.
 * `filterCallback` (optional): Function used to filter array of embeds. [doc](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.20)
 * `begin`, `end` (optional): slice filtered links. [doc](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.10)

```js
var embeds = resource.getEmbeds('starred');
```

### `HALSONResource#getEmbed(rel, [filterCallback, [default]])`
Get first embedded resource with relation `rel`.
 * `rel` (required): Relation name.
 * `filterCallback` (optional): Function used to filter array of embeds. [doc](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.20)
 * `default` (optional): Default value if the link does not exist.

```js
var nodeProject = resource.getEmbed('starred', function(embed) {
    return embed.getLink('self', {}).href === '/joyent/node';
});
```

### `HALSONResource#addLink(rel, link)`
Add a link with relation `rel`.
 * `rel` (required): Relation name.
 * `link` (required): Link to be added (string or Object).

```js
resource
    .addLink('related', 'http://doe.com')
    .addLink('related', {
        href: 'https://twitter.com/doe',
        name: 'twitter'
    });
```

### `HALSONResource#addEmbed(rel, embed)`
Add a nested resource with relation `rel`.
 * `rel` (required): Relation name.
 * `embed` (required): Resource to be embedded (Object or HALSONResource).

```js
var embed = {
    _links: {
        self: {href: '/joyent/node'}
    },
    title: "joyent / node"
}
resource.addEmbed('starred', embed);
```

### `HALSONResource#insertEmbed(rel, index, embed)`
Add a nested resource with relation `rel`.
 * `rel` (required): Relation name.
 * `index` (required): Index number where embed will be inserted
 * `embed` (required): Resource to be embedded (Object or HALSONResource).

```js
var embed = {
    _links: {
        self: {href: '/joyent/node'}
    },
    title: "joyent / node"
};
resource.addEmbed('starred', embed); // add embed

var embed2 = {
    _links: {
        self: {href: '/joyent/node'}
    },
    title: "joyent / node"
};
resource.insertEmbed('starred', 0, embed2); // insert new embed before first item
```

### `HALSONResource#removeLinks(rel, [filterCallback])`
Remove links with relation `rel`. If `filterCallback` is not defined, all links with relation `rel` will be removed.
 * `rel` (required): Relation name.
 * `filterCallback` (optional): Function used to filter array of links. [doc](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.20)

```js
// remove links with relation 'related' and name 'twitter'
resource.removeLinks('related', function(link) {
    return link.name === "twitter";
});
```

### `HALSONResource#removeEmbeds(rel, [filterCallback])`
Remove embedded resources with relation `rel`. If `filterCallback` is not defined, all embeds with relation `rel` will be removed.
 * `rel` (required): Relation name.
 * `filterCallback` (optional): Function used to filter array of links. [doc](http://www.ecma-international.org/ecma-262/5.1/#sec-15.4.4.20)

```js
// remove embedded resources with relation 'starred' and self-link '/koajs/koa'
resource.removeLinks('starred', function(embed) {
    return embed.getLink('self', {}).href === '/koajs/koa';
});
```
