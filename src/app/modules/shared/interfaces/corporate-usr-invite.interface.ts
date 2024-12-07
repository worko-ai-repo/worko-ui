import { CorpAccessTypeEnum, CorpInviteStatusEnum } from "../enums/corporate-usr-invt.enum";

/**
 * This is a set of interface used for Corporate Invites
 */


/**
 * CorporateUserInviteCreateApiDto
 * 
 * This DTO is used to validate and structure the data received from the client (API request).
 * 
 * @see {CorpAccessTypeEnum}  - The type of access the user is requesting.
 */
export interface CorporateUserInviteCreateApiDto {
    accessType: CorpAccessTypeEnum; // The type of access the user is requesting ENUM: [ADMIN , RECRUITER].
    companyId: string;
    email: string; // User Email to send the invite
    name: string; // Need full name of the user
}

/**
 * CorporateUserInviteCreateDto
 * 
 * This is the DTO used to create a new access request for the company. Specially used by the frontend team.
 * 
 * @extends CorporateUserInviteCreateApiDto
 * 
 * @see {CorpInviteStatusEnum}  - The status of the corporate invite.
 */
export interface CorporateUserInviteCreateDto extends CorporateUserInviteCreateApiDto {
    id:string;
    companyName: string;
    expiresAt: Date; // The expiration date of the invite.
    status: CorpInviteStatusEnum; // The status of the corporate invite. Enum [AWAITING, ACCEPTED]
    templateType: string; // @Todo Enum Add Enum here
    mailLogId: string;
    createdBy: string;
    renewInvite: boolean;
    corporateUserType: string;
} 

/**
 * CorporateUserInviteUpdateApiDto
 *
 * This is the DTO comes in the requestBody used to update the access request for the company.
 */
export interface CorporateUserInviteUpdateApiDto {
    status?: CorpInviteStatusEnum; // The status of the corporate invite. Enum [AWAITING, ACCEPTED, EXPIRED]
    renewInvite?: boolean; // The status of the corporate invite. Enum [AWAITING, ACCEPTED, EXPIRED]
}
/** 
 * CorporateUserInviteUpdateDto 
 * 
 * @extends CorporateUserInviteUpdateApiDto
 * 
 * This is the DTO used to update the access request for the company. Specially used by the frontend team.
*/
export interface CorporateUserInviteUpdateDto extends CorporateUserInviteUpdateApiDto {
    email: string;
    companyId: string;
}

/**
 * CorporateUserInviteLisitngFilterOptionsDTO
 * 
 * The DTO that will be used to keep the request query params for the Corporate Invite Listing.
 * 
 * @extends RecordListingFilterRequestDTO - The base DTO for the record listing filter requests.
 * 
 * @see {CorpAccessTypeEnum}  - The type of access the user is requesting.
 * @see {CorpInviteStatusEnum}  - The status of the corporate invite.
 */
/* export interface CorporateUserInviteLisitngFilterOptionsDTO extends RecordListingFilterRequestDTO {
    accessType?: CorpAccessTypeEnum;
    companyId?: string;
    companyName?: string;
    email?: string;
    mailLogId?: string;
    name?: string;
    status?: CorpInviteStatusEnum;
} */

/**
 * CorporateUserInviteLisitngFilterOptions
 * 
 * This is the DTO used by the frontend team to filter the corporate invites.
 * 
 * @extends RecordListingFilterOptions - The base DTO for the record listing filter used by frontend team.
 * 
 * @see {CorpAccessTypeEnum}  - The type of access the user is requesting.
 * @see {CorpInviteStatusEnum}  - The status of the corporate invite.
 */
/* export interface CorporateUserInviteLisitngFilterOptions extends RecordListingFilterOptions {
    accessType?: CorpAccessTypeEnum;
    companyId?: string;
    companyName?: string;
    email?: string;
    mailLogId?: string;
    name?: string;
    status?: CorpInviteStatusEnum;
} */
