import { readFile } from 'fs/promises';
import { join } from 'path';
import {
  PromptConfig,
  RubricConfig,
  ModelsConfig,
  PromptConfigSchema,
  RubricConfigSchema,
  ModelsConfigSchema
} from './types';

export class EvaluationConfigError extends Error {
  constructor(message: string, public readonly path?: string) {
    super(message);
    this.name = 'EvaluationConfigError';
  }
}

export interface EvaluationConfig {
  prompt: PromptConfig;
  rubric: RubricConfig;
  models: ModelsConfig;
}

export async function loadEvaluationConfig(evaluationDir: string): Promise<EvaluationConfig> {
  try {
    // Load and parse all config files
    const [promptJson, rubricJson, modelsJson] = await Promise.all([
      readFile(join(evaluationDir, 'prompt.json'), 'utf-8'),
      readFile(join(evaluationDir, 'rubric.json'), 'utf-8'),
      readFile(join(evaluationDir, 'models.json'), 'utf-8')
    ]);

    // Parse JSON
    const promptData = JSON.parse(promptJson);
    const rubricData = JSON.parse(rubricJson);
    const modelsData = JSON.parse(modelsJson);

    // Validate against schemas
    try {
      const prompt = PromptConfigSchema.parse(promptData);
      const rubric = RubricConfigSchema.parse(rubricData);
      const models = ModelsConfigSchema.parse(modelsData);

      return { prompt, rubric, models };
    } catch (e) {
      if (e instanceof Error) {
        throw new EvaluationConfigError(`Validation error: ${e.message}`);
      }
      throw e;
    }
  } catch (e) {
    if (e instanceof Error) {
      throw new EvaluationConfigError(
        `Failed to load evaluation config: ${e.message}`,
        evaluationDir
      );
    }
    throw e;
  }
}

export async function validateConfig(config: EvaluationConfig): Promise<string[]> {
  const warnings: string[] = [];

  // Check for consistent parameters across configs
  config.models.models.forEach(model => {
    if (model.parameters.max_tokens !== config.prompt.parameters.max_tokens) {
      warnings.push(
        `Model ${model.id} has different max_tokens (${model.parameters.max_tokens}) than prompt config (${config.prompt.parameters.max_tokens})`
      );
    }
  });

  // Validate total points in rubric add up to expected total
  const totalPoints = Object.values(config.rubric.scoring_criteria)
    .reduce((sum, criterion) => sum + criterion.points, 0);
  
  if (totalPoints !== 10) {
    warnings.push(
      `Rubric total points (${totalPoints}) does not match expected total (10)`
    );
  }

  // Check if required API keys are present in environment
  const requiredKeys = config.models.metadata.requirements;
  for (const [provider, envVar] of Object.entries(requiredKeys)) {
    if (!process.env[envVar]) {
      warnings.push(
        `Missing required API key for ${provider} (${envVar} not set in environment)`
      );
    }
  }

  return warnings;
} 