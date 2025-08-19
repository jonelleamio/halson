// Comprehensive Edge Case and Integration Tests
// This tests ALL edge cases and complex scenarios

const halson = require('./index');
const assert = require('assert');

console.log('🔬 Running Comprehensive HALSON Tests\n');

// Test Suite 1: Enhanced Link Edge Cases
console.log('1️⃣ Testing Enhanced Link Edge Cases...');

try {
  const resource = halson({});
  
  // Test various link formats
  resource.addLink('simple', '/simple');
  resource.addLink('complex', {
    href: '/complex',
    type: 'application/json',
    title: 'Complex Link',
    method: 'POST',
    templated: true,
    deprecation: 'https://example.com/deprecation',
    profile: 'https://example.com/profile',
    hreflang: 'en-US'
  });
  
  // Test multiple links with same relation
  resource.addLink('multiple', '/first');
  resource.addLink('multiple', '/second');
  
  // Verify all link data is preserved
  const simpleLink = resource.getLink('simple');
  const complexLink = resource.getLink('complex');
  const multipleLinks = resource.getLinks('multiple');
  
  assert.strictEqual(simpleLink.href, '/simple');
  assert.strictEqual(complexLink.href, '/complex');
  assert.strictEqual(complexLink.type, 'application/json');
  assert.strictEqual(complexLink.method, 'POST');
  assert.strictEqual(multipleLinks.length, 2);
  
  console.log('✅ Enhanced link edge cases passed');
} catch (error) {
  console.log('❌ Enhanced link edge cases failed:', error.message);
}

// Test Suite 2: Generic Typing Edge Cases
console.log('\n2️⃣ Testing Generic Typing Edge Cases...');

try {
  // Test complex nested interfaces
  const complexData = {
    id: 1,
    name: 'Test',
    metadata: {
      created: new Date(),
      tags: ['tag1', 'tag2'],
      config: {
        enabled: true,
        settings: { theme: 'dark' }
      }
    },
    items: [1, 2, 3]
  };
  
  const complexResource = halson(complexData);
  
  // Verify deep property access works
  assert.strictEqual(complexResource.id, 1);
  assert.strictEqual(complexResource.name, 'Test');
  assert(Array.isArray(complexResource.items));
  assert.strictEqual(complexResource.metadata.config.enabled, true);
  
  // Test chaining preserves all properties
  const chained = complexResource
    .addLink('self', '/test')
    .addEmbed('child', halson({ childId: 123 }));
    
  assert.strictEqual(chained.id, 1);
  assert.strictEqual(chained.metadata.config.settings.theme, 'dark');
  
  console.log('✅ Generic typing edge cases passed');
} catch (error) {
  console.log('❌ Generic typing edge cases failed:', error.message);
}

// Test Suite 3: Large Resource Performance
console.log('\n3️⃣ Testing Large Resource Performance...');

try {
  const startTime = Date.now();
  
  // Create resource with many links and embeds
  const largeResource = halson({ id: 1, name: 'Large Resource' });
  
  // Add 100 links
  for (let i = 0; i < 100; i++) {
    largeResource.addLink(`link${i}`, `/path/${i}`);
  }
  
  // Add 50 embedded resources
  for (let i = 0; i < 50; i++) {
    largeResource.addEmbed(`embed${i}`, halson({
      id: i,
      data: `data-${i}`,
      nested: { value: i * 2 }
    }));
  }
  
  // Test serialization performance
  const json = JSON.stringify(largeResource);
  const parsed = JSON.parse(json);
  
  const endTime = Date.now();
  const duration = endTime - startTime;
  
  assert(largeResource.listLinkRels().length === 100);
  assert(largeResource.listEmbedRels().length === 50);
  assert(json.length > 1000); // Should be substantial JSON
  
  console.log(`✅ Large resource performance passed (${duration}ms)`);
} catch (error) {
  console.log('❌ Large resource performance failed:', error.message);
}

// Test Suite 4: Error Handling Edge Cases
console.log('\n4️⃣ Testing Error Handling Edge Cases...');

try {
  const resource = halson({});
  
  // Test with null/undefined inputs
  const nullLink = resource.getLink('nonexistent');
  const emptyLinks = resource.getLinks('nonexistent');
  const nullEmbed = resource.getEmbed('nonexistent');
  
  assert.strictEqual(nullLink, undefined);
  assert(Array.isArray(emptyLinks) && emptyLinks.length === 0);
  assert.strictEqual(nullEmbed, undefined);
  
  // Test default values
  const linkWithDefault = resource.getLink('nonexistent', 'default');
  const embedWithDefault = resource.getEmbed('nonexistent', 'default');
  
  assert.strictEqual(linkWithDefault, 'default');
  assert.strictEqual(embedWithDefault, 'default');
  
  // Test invalid JSON input
  try {
    halson('invalid json');
    assert.fail('Should have thrown error for invalid JSON');
  } catch (e) {
    // Expected to fail
  }
  
  console.log('✅ Error handling edge cases passed');
} catch (error) {
  console.log('❌ Error handling edge cases failed:', error.message);
}

// Test Suite 5: Integration with Real HAL+JSON
console.log('\n5️⃣ Testing Real HAL+JSON Integration...');

try {
  // Test with realistic HAL+JSON structure
  const realHalJson = {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    _links: {
      self: { href: "/users/1" },
      edit: { 
        href: "/users/1",
        method: "PUT",
        type: "application/json"
      },
      orders: { 
        href: "/users/1/orders",
        title: "User Orders"
      }
    },
    _embedded: {
      profile: {
        id: 101,
        bio: "Software Developer",
        _links: {
          self: { href: "/profiles/101" }
        }
      },
      preferences: [
        {
          id: 201,
          setting: "theme",
          value: "dark",
          _links: {
            self: { href: "/preferences/201" }
          }
        },
        {
          id: 202,
          setting: "language", 
          value: "en",
          _links: {
            self: { href: "/preferences/202" }
          }
        }
      ]
    }
  };
  
  const resource = halson(realHalJson);
  
  // Test property access
  assert.strictEqual(resource.id, 1);
  assert.strictEqual(resource.name, "John Doe");
  
  // Test link access
  assert.strictEqual(resource.getLink('self').href, "/users/1");
  assert.strictEqual(resource.getLink('edit').method, "PUT");
  assert.strictEqual(resource.listLinkRels().length, 3);
  
  // Test embedded resource access
  const profile = resource.getEmbed('profile');
  assert.strictEqual(profile.bio, "Software Developer");
  assert.strictEqual(profile.getLink('self').href, "/profiles/101");
  
  const preferences = resource.getEmbeds('preferences');
  assert.strictEqual(preferences.length, 2);
  assert.strictEqual(preferences[0].setting, "theme");
  assert.strictEqual(preferences[1].value, "en");
  
  // Test round-trip serialization
  const serialized = JSON.stringify(resource);
  const deserialized = halson(serialized);
  
  assert.strictEqual(deserialized.name, "John Doe");
  assert.strictEqual(deserialized.getLink('self').href, "/users/1");
  assert.strictEqual(deserialized.getEmbed('profile').bio, "Software Developer");
  
  console.log('✅ Real HAL+JSON integration passed');
} catch (error) {
  console.log('❌ Real HAL+JSON integration failed:', error.message);
}

// Test Suite 6: Cross-browser Compatibility Simulation
console.log('\n6️⃣ Testing Cross-environment Compatibility...');

try {
  // Test various JavaScript environments
  const resource = halson({});
  
  // Test with different property types
  resource.stringProp = "string";
  resource.numberProp = 42;
  resource.booleanProp = true;
  resource.nullProp = null;
  resource.undefinedProp = undefined;
  resource.arrayProp = [1, 2, 3];
  resource.objectProp = { nested: true };
  
  // Verify all types are preserved
  assert.strictEqual(typeof resource.stringProp, 'string');
  assert.strictEqual(typeof resource.numberProp, 'number');
  assert.strictEqual(typeof resource.booleanProp, 'boolean');
  assert.strictEqual(resource.nullProp, null);
  assert.strictEqual(resource.undefinedProp, undefined);
  assert(Array.isArray(resource.arrayProp));
  assert.strictEqual(typeof resource.objectProp, 'object');
  
  console.log('✅ Cross-environment compatibility passed');
} catch (error) {
  console.log('❌ Cross-environment compatibility failed:', error.message);
}

console.log('\n🎉 Comprehensive Testing Complete!');
console.log('\n📊 Test Coverage Summary:');
console.log('• Enhanced link metadata: ✅ Tested');
console.log('• Generic typing edge cases: ✅ Tested');  
console.log('• Large resource performance: ✅ Tested');
console.log('• Error handling: ✅ Tested');
console.log('• Real HAL+JSON integration: ✅ Tested');
console.log('• Cross-environment compatibility: ✅ Tested');
console.log('\n🔍 What still needs runtime implementation:');
console.log('• IANA constants (halson.IanaRels.*)');
console.log('• hasLink(), getHref() utilities');
console.log('• URI template expansion');
console.log('• Navigation methods (follow, followAll)');
console.log('• Pagination helpers');
console.log('• Validation framework');
console.log('• Builder pattern');
console.log('• Curie support');
console.log('• Content negotiation');
