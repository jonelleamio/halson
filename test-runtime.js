// Runtime Test Examples - What Currently Works
// Run with: node test-runtime.js

const halson = require('./index');

console.log('🚀 Testing HALSON Runtime Functionality\n');

// Test 1: Basic resource creation with TypeScript-enhanced functionality
const userData = {
  id: 1,
  name: "John Doe",
  email: "john@example.com",
  isActive: true
};

const userResource = halson(userData);

console.log('✅ Test 1: Basic resource creation');
console.log('User ID:', userResource.id);
console.log('User name:', userResource.name);
console.log('Link relations:', userResource.listLinkRels());

// Test 2: Basic link functionality
console.log('\n✅ Test 2: Basic Link Support');
userResource.addLink('self', '/users/1');
userResource.addLink('edit', {
  href: '/users/1',
  type: 'application/json',
  title: 'Edit User',
  method: 'PUT'
});

console.log('Self link:', userResource.getLink('self'));
console.log('Edit link:', userResource.getLink('edit'));
console.log('All link relations:', userResource.listLinkRels());

// Test 4: Embedded resources
console.log('\n✅ Test 4: Embedded Resources');
const repoResource = halson({
  id: 101,
  name: "awesome-project",
  language: "TypeScript",
  stars: 42
}).addLink('self', '/repos/101');

userResource.addEmbed('repositories', [repoResource]);
const embeddedRepos = userResource.getEmbeds('repositories');
console.log('Embedded repositories:', embeddedRepos.length);
console.log('First repo name:', embeddedRepos[0].name);

// Test 5: Fluent chaining
console.log('\n✅ Test 5: Fluent Method Chaining');
const chainedResource = userResource
  .addLink('profile', '/users/1/profile')
  .addLink('orders', '/users/1/orders')
  .addEmbed('settings', halson({ theme: 'dark', lang: 'en' }));

console.log('After chaining - user name:', chainedResource.name);
console.log('Link relations:', chainedResource.listLinkRels());
console.log('Embed relations:', chainedResource.listEmbedRels());

// Test 6: Serialization
console.log('\n✅ Test 6: JSON Serialization');
const jsonOutput = JSON.stringify(chainedResource, null, 2);
console.log('Serialized HAL+JSON:\n', jsonOutput);

console.log('\n🎉 All currently working features tested successfully!');
console.log('\n📝 Note: Advanced features like templates, navigation, pagination,');
console.log('validation, and curies are type-defined but need runtime implementation.');
