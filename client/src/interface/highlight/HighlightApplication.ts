import HighlightMetricModel from "@/interface/highlight/HighlightMetric";

/**
 * Highlight application interface
 */
export default interface HighlightApplication {
    _id: string;
    id: number;
    name: string;
    clientRef: string;
    metrics?: HighlightMetricModel[];
}
