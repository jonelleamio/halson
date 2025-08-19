# Testing HALSON Functionality

This guide explains how to test both the existing and newly added features in HALSON.

## Quick Test Commands

```bash
# Run existing Mocha tests
npm test

# Test TypeScript type definitions
npx tsc --noEmit test-working.ts

# Test runtime functionality  
node test-runtime.js
```

## What Currently Works (Runtime + Types)

### ✅ Basic HAL+JSON Operations
- Resource creation with generic TypeScript typing
- Link management (`addLink`, `getLink`, `getLinks`)
- Embedded resource management (`addEmbed`, `getEmbed`, `getEmbeds`) 
- Fluent method chaining that preserves TypeScript types
- JSON serialization to valid HAL+JSON

### ✅ Enhanced TypeScript Support
- Generic typing: `halson<User>(userData)` 
- Type preservation in method chaining
- Rich `HALSONLink` interface with metadata fields
- Type-only imports for better module organization
- Backward compatibility with existing JavaScript

### ✅ Enhanced Link Objects
Links now support rich metadata:
```typescript
userResource.addLink('edit', {
  href: '/users/1',
  type: 'application/json',
  title: 'Edit User Profile',
  method: 'PUT',
  templated: false,
  hreflang: 'en'
});
```

## What Has Type Support But Needs Runtime Implementation

The following features have complete TypeScript type definitions but need runtime implementations:

### 🚧 IANA Link Relations
- **Types**: `halson.IanaRels.SELF`, `halson.IanaRels.EDIT`, etc.
- **Status**: Type constants defined, runtime constants needed
- **Test**: Currently fails at runtime (`halson.IanaRels` is undefined)

### 🚧 URI Templates
- **Types**: `addTemplate()`, `expandTemplate()`, `getTemplateVariables()`
- **Status**: Method signatures defined, implementation needed
- **Use case**: `/users{?name,status}` → `/users?name=John&status=active`

### 🚧 Navigation & Traversal
- **Types**: `follow<T>()`, `followAll<T>()`, `resolve()`
- **Status**: Async method signatures defined 
- **Use case**: `await resource.follow<Order>('orders')`

### 🚧 Link Utilities
- **Types**: `hasLink()`, `getHref()`, `hasAnyLink()`
- **Status**: Method signatures defined
- **Use case**: `if (resource.hasLink('edit')) { ... }`

### 🚧 Pagination Support
- **Types**: `PagedResource<T>`, `PageMetadata`
- **Status**: Complete type definitions, helper methods needed
- **Use case**: Spring-style pagination with HAL+JSON

### 🚧 Builder Pattern
- **Types**: `HALResourceBuilder<T>`
- **Status**: Fluent builder interface defined
- **Use case**: `halson.HALResourceBuilder<User>(data).link().template().build()`

### 🚧 Curie Support
- **Types**: `addCurie()`, `expandCurie()`, `hasCurie()`
- **Status**: Method signatures for compact URI support
- **Use case**: `acme:orders` → `https://api.acme.com/rels/orders`

### 🚧 Validation Framework  
- **Types**: `ValidationOptions`, `ValidationResult`, `validate()`
- **Status**: Complete validation interface defined
- **Use case**: Validate required links, embedded resources

### 🚧 Content Negotiation
- **Types**: `accepts()`, `asJson()`, `asHal()`, `getContentType()`
- **Status**: Method signatures for content type handling
- **Use case**: Handle different representations of resources

## How to Test Each Feature

### Test TypeScript Types Only

```bash
# This verifies type definitions compile correctly
npx tsc --noEmit test-working.ts
```

The `test-working.ts` file tests:
- Basic generic typing
- Enhanced link interface  
- Type preservation in chaining
- Type-only imports
- All interfaces that should compile

### Test Runtime Functionality

```bash  
# This tests what actually works at runtime
node test-runtime.js
```

The `test-runtime.js` file demonstrates:
- Resource creation and property access
- Link management with metadata
- Embedded resources
- Fluent method chaining  
- JSON serialization
- All working runtime features

### Test Against Existing Suite

```bash
# Ensures no regressions in original functionality
npm test
```

This runs the original Mocha test suite (50 tests) that verify:
- Backward compatibility
- All existing HAL+JSON operations
- Edge cases and error handling

## Future Runtime Implementation

When implementing the runtime functionality for advanced features:

1. **Start with IANA constants** - Easy win, just export the object
2. **Implement link utilities** - `hasLink()`, `getHref()` etc.
3. **Add URI template support** - Use a library like `uri-templates`
4. **Build navigation features** - Async methods using fetch/axios
5. **Create validation framework** - Check required links/embeds
6. **Add pagination helpers** - Utility methods for paged responses

Each feature should be:
- ✅ Fully tested with TypeScript compilation
- ✅ Covered by runtime tests
- ✅ Backward compatible  
- ✅ Well documented with examples

## Benefits of Current State

Even without full runtime implementation, the current enhancements provide:

1. **Excellent TypeScript DX** - Full type safety and IntelliSense
2. **Enhanced Link Support** - Rich metadata in link objects
3. **Type-Preserving Chains** - Fluent APIs that maintain type information
4. **Future-Ready API** - Complete interface for Java HATEOAS-like features
5. **Zero Breaking Changes** - All existing code continues to work

The TypeScript definitions serve as both documentation and implementation contracts for future development.
