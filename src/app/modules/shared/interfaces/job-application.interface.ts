
export interface JobApplicationsResponse {
    data: JobApplication[];
    pagination: Pagination;
}

export interface JobApplication {
    jobTitle?: string
    jobUrl: string;
    companyId: string;
    companyName: string;
    status: string;
    createdAt: string;
    jobId: string;
    scoreDetails: string;
    GSI1SK: string;
    matchingScore: number;
    GSI2SK: string;
    GSI2PK: string;
    GSI1PK: string;
    jobPortal: string;
    jdExtracted: string;
    scoreFetchedDate: string;
    updatedAt: string;
    SK: string;
    jdMatchErrorDesc: string;
    PK: string;
    id: string;
    rejectionFeedbackBySystem: string;
    jdMatchErrorCode: number;
}

export interface Pagination {
    count: number;
    pageSize: number;
    sortOrder: string;
    timesQueried: number;
    queriedCount: number;
}
