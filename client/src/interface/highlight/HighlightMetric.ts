/**
 * Model for the Highlight metrics
 */
export default interface HighlightMetricModel {
    snapshotLabel: string;
    snapshotDate: number;
    softwareAgility: number;
    softwareElegance: number;
    softwareResiliency: number;
    softwareHealth: number;
    openSourceSafety: number;
    openSourceLicense: number;
    openSourceObsolescence: number;
    openSourceCVE: number;
    backFiredFP: number;
    technicalDebt: number;
    maintenanceRecordedFTE: number;
    maintenanceRecommendedFTE: number;
    cloudReady: number;
    cloudReadyScan: number;
    boosters: number;
    blockers: number;
    roadblocks: number;
    cloudEffort: number;
    totalLinesOfCode: number;
    totalFiles: number;

}
