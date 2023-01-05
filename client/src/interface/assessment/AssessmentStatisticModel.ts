/**
 * Assessment statistics model
 */
export default interface AssessmentStatisticModel {
  totalElements: number,
  compatibleElements: number,
  partialCompatibilityElements: number,
  unaddressedElements: number,
  incompatibleElements: number,
  technology: string;
  platform: string;
  architecture: string;
  target: string;
}
