/**
 * This File Belongs to the set of Enums for Corporate Invites 
 */

/**
 * CorpAccessTypeEnum
 * 
 * CorpAccessTypeEnum is used to define the type of access the user is requesting.
 */
export enum CorpAccessTypeEnum {
    // The user has admin access.
    ADMIN = 'ADMIN',

    // The user has recuriter access.
    RECRUITER = 'RECRUITER',
}

/**
 * CorpInviteStatusEnum
 * 
 * This enum is used to define the status of a corporate invite.
 */
export enum CorpInviteStatusEnum {

    // The invite is awaiting approval.
    AWAITING = 'AWAITING', 

    // The invite has been accepted.
    ACCEPTED = 'ACCEPTED', 

    // The invite has been expired.
    EXPIRED = 'EXPIRED',

    // The invite has been deleted.
    DELETED = 'DELETED',
}
