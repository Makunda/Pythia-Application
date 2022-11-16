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

    timestamp ?: number;
};