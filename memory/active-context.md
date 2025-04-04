# Active Context - Thu Apr 3 18:27:35 EDT 2025

## CRITICAL IMPLEMENTATION RULES
1. ALWAYS use Vercel AI SDK wrappers for ALL providers
   - OpenRouter: @openrouter/ai-sdk-provider
   - Google: @ai-sdk/google
   - Ollama: ollama-ai-provider
2. NEVER use provider-specific SDKs directly (e.g., @google/generative-ai)
3. This ensures consistent interfaces and behavior across all providers
4. All providers must implement the LanguageModelV1 interface from the 'ai' package

## Current Focus
Refactoring model execution architecture to use Vercel AI SDK consistently.

### What's Being Worked On
- [X] Removed execute method from ModelProvider interface
- [X] Updated ModelRunner to use Vercel AI SDK's generateText
- [X] Fixed response handling to match generateText structure
- [X] Added proper token usage calculation
- [X] Improved provider and model identification

### Current State
- Successfully refactored model execution to use Vercel AI SDK
- ModelProvider interface now focused on capabilities and metadata
- ModelRunner handles all execution through generateText
- Proper error handling and retries implemented
- Rate limiting integrated with new execution flow

### Next Steps
1. Update provider implementations to reflect new interface:
   - [ ] Update Google provider
   - [ ] Update OpenRouter provider
   - [ ] Update Ollama provider

2. Add tests for refactored components:
   - [ ] ModelRunner tests
   - [ ] Provider interface tests
   - [ ] Integration tests

3. Update documentation:
   - [ ] Update provider implementation guide
   - [ ] Document new execution flow
   - [ ] Add examples for new pattern

### Blockers
None currently.

### Recent Decisions
1. Moved execution responsibility to ModelRunner
2. Using Vercel AI SDK's generateText for all providers
3. Standardized response handling
4. Improved error handling and retries
5. Better token usage calculation

## Technical Details
### ModelProvider Interface
```typescript
export interface ModelProvider extends ModelRoute {
  capabilities: ModelCapabilities;
  calculateCost(usage: TokenUsage): number;
  listModels(): Promise<ModelDetails[]>;
}
```

### ModelRunner Interface
```typescript
export interface ModelRunner {
  execute(params: {
    prompt: string;
    model: LanguageModelV1;
    options?: ModelOptions;
  }): Promise<ModelResponse>;
}
```

### Response Format
```typescript
interface ModelResponse {
  content: string;
  metadata: {
    startTime: Date;
    endTime: Date;
    tokenUsage: {
      promptTokens: number;
      completionTokens: number;
      total: number;
    };
    cost: number;
    provider: string;
    model: string;
  };
}
```

## Dependencies
Current core dependencies:
- ai: ^4.1.46 (Vercel AI SDK core)
- @ai-sdk/google: Latest (Vercel wrapper)
- @openrouter/ai-sdk-provider: ^0.4.3
- ollama-ai-provider: ^1.2.0
- zod: ^3.22.4

### Implementation Status
- [X] Core interface refactoring
- [X] ModelRunner implementation
- [ ] Provider updates
- [ ] Test coverage
- [ ] Documentation updates

### Next Actions
1. Update provider implementations to match new interface
2. Add comprehensive test suite
3. Update documentation with new patterns
4. Verify all providers work with new execution flow

## Current Status
- [X] Defined model routing architecture
- [X] Implementing model routing system
- [X] Update configuration format
- [X] Update provider implementations
- [X] Update CLI display

## Implementation Plan
### Phase 1: Core Model Routing (Completed)
1. Create ModelRoute interface and utilities
   - [ ] Define types in models/types.ts
   - [ ] Implement parseModelIdentifier
   - [ ] Implement formatModelIdentifier
   - [ ] Add provider inference logic

2. Update Configuration Schema
   - [ ] Update model configuration format
   - [ ] Add route and variant fields
   - [ ] Update validation

3. Update Provider Implementation
   - [ ] Modify getModelProvider to use route information
   - [ ] Update Google provider
   - [ ] Update OpenRouter provider
   - [ ] Update Ollama provider

4. CLI Updates
   - [ ] Update model listing format
   - [ ] Add route information to model info
   - [ ] Update help documentation

### Phase 2: Provider Improvements (Current)
1. OpenRouter Provider Updates
   - [X] Set provider field to 'openrouter'
   - [X] Add originalProvider field for actual provider
   - [X] Update CLI to display both provider fields
   - [X] Fix model listing in CLI

2. CLI Enhancements
   - [X] Update model listing format
   - [X] Add provider/originalProvider display
   - [X] Fix linter errors in display code
   - [X] Improve error handling

### Phase 3: Testing and Documentation
- [ ] Add tests for updated provider implementations
- [ ] Test CLI enhancements
- [ ] Update documentation with new provider fields
- [ ] Add examples for provider usage

## Technical Details
### Model Route Interface
```typescript
interface ModelRoute {
  modelId: string;      // Base model identifier
  provider: string;     // Original provider
  route: "direct" | "openrouter" | "ollama";  // Access method
  variant?: string;     // Optional variant (e.g. "free")
}
```

### Configuration Format
```json
{
  "models": [
    {
      "id": "gemini-2.5-pro-exp-03-25",
      "route": "direct",
      "provider": "google"
    },
    {
      "id": "gemini-2.5-pro-exp-03-25",
      "route": "openrouter",
      "provider": "google",
      "variant": "free"
    }
  ]
}
```

### Model Details Interface Updates
```typescript
interface ModelDetails extends ModelRoute {
  originalProvider?: string; // For OpenRouter models, the actual provider (e.g., 'openai', 'anthropic')
}
```

## Dependencies
Current core dependencies:
- ai: ^4.1.46 (Vercel AI SDK core)
- @ai-sdk/google: Latest (Vercel AI wrapper for Google)
- @openrouter/ai-sdk-provider: ^0.4.3
- ollama-ai-provider: ^1.2.0
- zod: ^3.22.4

### In Progress
- Fixing provider implementation to use Vercel AI SDK wrappers exclusively
- Implementing dynamic model listing
- Fixing TypeScript linting issues in provider implementations

### Dependencies Update Status
All dependencies at latest versions, focusing on Vercel AI SDK ecosystem:
- ai: ^4.1.46 (Core Vercel AI SDK)
- @ai-sdk/google: Latest (Vercel wrapper)
- @openrouter/ai-sdk-provider: ^0.4.3
- ollama-ai-provider: ^1.2.0
- zod: ^3.22.4

### Next Steps
1. Fix TypeScript linting issues in providers:
   - Ensure proper LanguageModelV1 interface implementation
   - Add proper type annotations for parameters
2. Test provider implementations with Vercel AI SDK wrappers
3. Update documentation with provider setup instructions

### Blockers
- Need to verify token counting and cost calculation for all providers through Vercel AI SDK wrappers

### Recent Decisions
1. CRITICAL: Must use Vercel AI SDK wrappers for all providers
2. Using dynamic model listing where available
3. Standardizing on LanguageModelV1 interface from 'ai' package
4. Verified all dependencies are at their latest versions

### Current Status (2025-04-01 08:15:00 EDT)

### Overview
The CLI implementation is now complete with improved formatting, better error handling, and enhanced user experience features.

### Currently Working On
- [X] CLI improvements and polish
  - [X] Model URL linking
  - [X] Context length formatting
  - [X] Date alignment
  - [X] Cost display
  - [X] Error handling

### Notes
- The CLI now provides a polished, user-friendly interface
- All core functionality is implemented and working
- Code organization follows best practices with clear separation of concerns
- Documentation needs to be completed
- CRITICAL: All providers must use Vercel AI SDK wrappers 

### Test Infrastructure
```typescript
// Test utilities
- Console output capture
- Command argument parsing
- Mock data generation
- Cleanup utilities

// Mocking strategy
- Core function mocks
- Console output spies
- Error handling
- Environment variables
```

### Test Patterns
1. Command Testing:
   - Parse arguments
   - Execute command
   - Verify output
   - Clean up mocks

2. Output Verification:
   - Capture console output
   - Parse JSON when needed
   - Check formatting
   - Verify error messages

3. Error Handling:
   - Mock API errors
   - Verify error messages
   - Check error formatting
   - Ensure proper cleanup

### Dependencies
Current test dependencies:
- vitest: Testing framework
- commander: Command parsing
- chalk: Output formatting
- cli-table3: Table formatting

### Testing Guidelines
1. Mock external dependencies
2. Capture and verify console output
3. Clean up mocks after each test
4. Test both success and error cases
5. Verify formatting and display

### Current Test Coverage
- Models Command:
  - [X] Basic listing
  - [X] JSON output
  - [X] Provider filtering
  - [X] Model details
  - [X] Error handling

- Evaluate Command:
  - [ ] Config loading
  - [ ] Model evaluation
  - [ ] Result formatting
  - [ ] Error handling

- Evals Command:
  - [ ] Config management
  - [ ] Batch processing
  - [ ] Progress display
  - [ ] Error handling 