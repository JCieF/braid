# Testing Guide

This project uses multiple testing approaches for different purposes.

## Test Types

### 1. Unit Tests (Vitest)
Located in: `src/**/*.test.ts`

Run unit tests:
```bash
npm test              # Run once
npm run test:watch    # Watch mode
npm run test:ui       # UI mode
```

Unit tests use mocks and don't require browser automation. They test:
- Platform detection logic
- Scraper selection
- Error handling
- Data transformation

### 2. Integration Tests (Playwright Test)
Located in: `tests/integration/**/*.spec.ts`

Run integration tests:
```bash
npm run test:integration
```

Integration tests use real browsers and test:
- End-to-end metadata extraction
- Browser automation
- Real platform scraping

**Note**: Integration tests may require:
- Network access
- Longer execution time
- Some tests may be skipped if platforms require authentication

### 3. Manual Testing
Located in: `test-scraper.ts`

Run manual test:
```bash
npm run test:manual
```

Environment variables:
- `BROWSER=firefox` - Use Firefox instead of Chromium
- `INSTAGRAM_ONLY=true` - Test only Instagram
- `FIREFOX_PROFILE=/path/to/profile` - Use specific Firefox profile

## Writing Tests

### Unit Test Example
```typescript
import { describe, it, expect, vi } from "vitest";

describe("MyClass", () => {
  it("should do something", () => {
    const result = myFunction();
    expect(result).toBe(expected);
  });
});
```

### Integration Test Example
```typescript
import { test, expect } from "@playwright/test";

test("should extract metadata", async () => {
  const metadata = await manager.extractMetadata(url);
  expect(metadata).not.toBeNull();
});
```

## Best Practices

1. **Unit tests** should be fast and isolated
2. **Integration tests** should test real scenarios but may be slower
3. Use `test.skip()` for tests that require special setup
4. Mock external dependencies in unit tests
5. Keep integration tests focused on critical paths
