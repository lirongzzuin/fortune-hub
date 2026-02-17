import { DeepResultInput, DeepResultOutput } from './types';

/**
 * LLM 확장 인터페이스 (향후 구현 예정)
 *
 * 설계 메모:
 * ─────────
 * 1. 이 함수는 추후 LLM API(Claude, GPT 등)를 호출하여
 *    더 깊은 개인화 결과를 생성하는 데 사용된다.
 *
 * 2. 호출 조건:
 *    - 유료 결제 사용자 또는 리워드 광고 시청 완료 사용자만 접근 가능
 *    - 무료 사용자에게는 기본 시드 기반 결과만 노출
 *
 * 3. 구현 시 고려사항:
 *    - API 비용 제어: 1일 1인 1회 제한 권장
 *    - 캐싱: 동일 입력+동일 날짜는 캐시 반환
 *    - 에러 처리: LLM 실패 시 기본 결과로 폴백
 *    - 프롬프트 설계: 과장/의학/투자 표현 금지 규칙을 시스템 프롬프트에 포함
 *
 * 4. 수익 모델:
 *    - 리워드 광고 1회 시청 → 1회 딥 결과 열람
 *    - 월 구독 → 무제한 딥 결과
 */
export async function generateDeepResult(
  _input: DeepResultInput
): Promise<DeepResultOutput> {
  throw new Error(
    'Not implemented: generateDeepResult는 향후 유료/리워드 기능으로 제공될 예정입니다.'
  );
}
