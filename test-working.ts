// TypeScript Test for Currently Working Functionality
// This tests what actually works with current runtime + our type definitions

import halson = require("./index");

// Test basic interfaces
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

interface Repository {
  id: number;
  name: string; 
  language: string;
  stars: number;
}

// Test 1: Basic resource creation with generics
const userData: User = {
  id: 1,
  name: "John Doe",
  email: "john@example.com", 
  isActive: true
};

const userResource = halson<User>(userData);

// Test 2: Verify we have both domain properties and HAL methods
const userId: number = userResource.id;
const userName: string = userResource.name;
const linkRels: string[] = userResource.listLinkRels();

// Test 3: Basic link operations that work
userResource.addLink('self', '/users/1');
userResource.addLink(halson.IanaRels.EDIT, '/users/1/edit');

const selfLink = userResource.getLink('self', null);
const hasEdit: boolean = userResource.hasLink('edit');

// Test 4: Enhanced link with metadata
userResource.addLink('profile', {
  href: '/users/1/profile',
  type: 'application/json',
  title: 'User Profile',
  method: 'GET'
});

// Test 5: IANA constants work
const selfRel: string = halson.IanaRels.SELF;
const editRel: string = halson.IanaRels.EDIT;
const nextRel: string = halson.IanaRels.NEXT;

// Test 6: Embed operations
const repoResource = halson<Repository>({
  id: 101,
  name: "awesome-project",
  language: "TypeScript",
  stars: 42
});

userResource.addEmbed('repositories', repoResource);
const repos = userResource.getEmbeds('repositories');
const firstRepo = userResource.getEmbed('repositories', undefined, null);

// Test 7: Fluent chaining preserves types
const chainedResource = userResource
  .addLink('edit', '/users/1/edit')
  .addEmbed('profile', repoResource);

// Should still have User properties
const chainedId: number = chainedResource.id;
const chainedName: string = chainedResource.name;

// Test 8: Type-only imports work
import type { HALSONResource, HALSONLink } from "./index";

type UserResource = HALSONResource<User>;
type LinkType = HALSONLink;

console.log("✅ Working TypeScript features verified!");
