import { ContentEntry, ContentInput, GenerateResultOutput, SeedContext } from './types';
import { createSeedContext } from './hash';
import { generateFortune } from './fortune';
import { generateSaju } from './saju';

/**
 * 통합 결과 생성 디스패처
 * generateResult(content, input, context) -> GenerateResultOutput
 */
export function generateResult(
  content: ContentEntry,
  input: ContentInput,
  dateStr?: string,
): GenerateResultOutput {
  const seed: SeedContext = createSeedContext(input, dateStr);

  switch (content.type) {
    case 'fortune':
      return generateFortune(input, seed);

    case 'saju':
      return generateSaju(input, seed);

    default:
      throw new Error(`Unknown content type: ${content.type}`);
  }
}
