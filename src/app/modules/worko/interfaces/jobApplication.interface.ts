interface StatusTrackerEntry {
    userType: string;
    newStatus: string;
    oldStatus: string;
    actionDate: string; // ISO date string
    userId: string;
  }
  
  interface ScoreDetail {
    heading: string;
    detail: string;
  }
  
  interface RejectionFeedback {
    heading: string;
    detail: string;
  }
  
  interface ApplicantCandidateExperience {
    department: string;
    companyName: string;
    designation: string;
  }
  
  interface ApplicantCandidateExperienceParsed {
    role: string;
    responsibilities: string[];
    achievements: string[];
    teamLeadership: string[];
  }
  
  interface ApplicantIndustryExperience {
    industryType: string;
    industryDomain: string;
    details: string[];
  }
  
  interface ApplicantEducation {
    degree: string;
    institution: string;
    certifications: {
      name: string;
      year: string;
      issuer: string;
    }[];
    year: string;
  }
  
  interface ApplicantProfessionalExperience {
    workExperience: string[];
    company: string;
    period: string;
    role: string;
  }
  
  interface ApplicantDetails {
    CTC: number;
    CV: string;
    ECTC: number;
    GSI1PK: string;
    GSI1SK: string;
    GSI2PK: string;
    GSI2SK: string;
    PK: string;
    YOE: number;
    about: string;
    acceptedTermsAndConditions: boolean;
    candidateExperience: ApplicantCandidateExperience;
    country: string;
    coverLetter: string;
    createdAt: string;
    cvExtract: string;
    cvExtractDate: string;
    cvExtractParsed: {
      personalDetails: {
        name: string;
        phone: string;
        email: string;
      };
      roleAndResponsibilities: ApplicantCandidateExperienceParsed[];
      industryExperience: ApplicantIndustryExperience[];
      education: ApplicantEducation[];
      professionalExperience: ApplicantProfessionalExperience[];
    };
    cvExtractParsedDate: string;
    email: string;
    emailList: {
      primary: string;
    };
    expiryDate: string;
    id: string;
    isCandidateFresher: boolean;
    isEmailVerified: boolean;
    isNumberVerified: boolean;
    isSubscribed: boolean;
    isWhatsappNotificationEnabled: boolean;
    lastAccessedDash: string;
    location: string;
    name: string;
    noticePeriod: number;
    number: string;
    profileImage: string;
    referralCount: number;
    updatedAt: string;
    userId: string;
    userType: string[];
    SK: string;
    profileImageAwsS3SignedUrl: string;
    cvAwsS3SignedUrl: string;
  }
  
  export interface JobApplication {
    companyId: string;
    companyName: string;
    status: string;
    jobId: string;
    createdAt: string;
    statusTracker: StatusTrackerEntry[];
    matchingScore: number;
    GSI1SK: string;
    GSI2SK: string;
    GSI2PK: string;
    GSI1PK: string;
    jobPortal: string;
    GSI3PK: string;
    updatedAt: string;
    SK: string;
    id: string;
    PK: string;
    emailFeedback: string;
    scoreDetails: string | ScoreDetail[];
    scoreFetchedDate: string;
    jdMatchErrorDesc: string;
    rejectionFeedbackBySystem: string | RejectionFeedback[];
    jdMatchErrorCode: number;
    displayToCorporate: boolean;
    GSI3SK: string;
    jobUrl: string;
    jobTitle: string;
    jdExtract: string;
    applicantDetails: ApplicantDetails;
  }
  