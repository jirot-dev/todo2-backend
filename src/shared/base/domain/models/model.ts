export interface IModel {
    id?: string;
    createdAt?: Date;
    createdBy?: string;
    createdById?: string;
    updatedAt?: Date;
    updatedBy?: string;
    updatedById?: string;
    toJson(): Record<string, any>;
}