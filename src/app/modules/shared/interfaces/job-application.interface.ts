
export interface JobApplicationsResponse {
    data: JobApplication[];
    pagination: Pagination;
}

export interface JobApplication {
    jobUrl: string;
    companyId: string;
    companyName: string;
    status: string;
    createdAt: string;
    jobId: string;
    scoreDetails: string;
    statusTracker: {
        userType: string;
        newStatus: string;
        oldStatus: string;
        actionDate: string;
        userId: string;
    }[];
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
    jobTitle: string;
    rejectionFeedbackBySystem: string;
    jdMatchErrorCode: number;
    rejectedByUserId?: {
        reason: string;
        userComment: string;
        userId: string;
        actionDate: string;
    };

    followUpRequest?: {
        actionDate: string;
    }[];

    // Optional properties for the timeline
    timelineSteps?: string[]; // Steps in the timeline
    currentStepIndex?: number; // Current step index in the timeline
}


export interface Pagination {
    count: number;
    pageSize: number;
    sortOrder: string;
    timesQueried: number;
    queriedCount: number;
}
