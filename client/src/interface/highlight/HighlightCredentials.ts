import HighlightApplication from "@/interface/highlight/HighlightApplication";

export interface HighlightCredentials {
    _id?: string;
    url: string;
    domainId: number;
    username: string;
    password?: string;

    companyName?: string;
    officialName?: string;
    partnerName?: string;

    applicationsNumber?: number;
    componentNumber?: number;
    loc?: number;

    createdOn?: Date;
    lastModified?: Date;

    applications?: HighlightApplication[];
    lastAnalysis?: Date;
    isAnalysisGoingOn?: boolean;

    timestamp ?: number;
}