import { UpdateValidationMode } from "../enums/update-validation-mode.enum";

export interface IModel {
    id?: string;
    createdAt?: Date;
    createdBy?: string;
    createdById?: string;
    updatedAt?: Date;
    updatedBy?: string;
    updatedById?: string;
    updateToken: string;
    lockedAt?: Date;
    lockedBy?: string;
    lockedById?: string;
    lockedExpired?: Date;
    updateTokenPrevious ?: string;
    lockedTimeout?: number;
    updateValidationMode?: UpdateValidationMode;
    toJson(): Record<string, any>;
    lock(Date): void;
    release(): void;
}