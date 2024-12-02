export interface IEntity {
    id: string;
    createdAt: Date;
    createdBy: string;
    createdById: string;
    updatedAt: Date;
    updatedBy: string;
    updatedById: string;
    updateToken: string;
    lockedAt?: Date;
    lockedBy?: string;
    lockedById?: string;
    lockedExpired?: Date;
}