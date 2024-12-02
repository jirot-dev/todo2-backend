import { UpdateValidationMode } from "../enums/update-validation-mode.enum";
import { IModel } from "./model";

export abstract class BaseModel implements IModel {
    protected _id?: string;
    protected _createdAt?: Date;
    protected _createdBy?: string;
    protected _createdById?: string;
    protected _updatedAt?: Date;
    protected _updatedBy?: string;
    protected _updatedById?: string;
    protected _updateToken?: string;
    protected _lockedAt?: Date;
    protected _lockedBy?: string;
    protected _lockedById?: string;
    protected _lockedExpired?: Date;
    protected _updateTokenPrevious?: string;
    protected _lockedTimeout: number = 30 * 60; // 30 minutes default
    protected _updateValidationMode: UpdateValidationMode = UpdateValidationMode.No;

    public get id(): string | undefined {
        return this._id;
    }

    public get createdAt(): Date | undefined {
        return this._createdAt;
    }

    public get createdBy(): string | undefined {
        return this._createdBy;
    }

    public get createdById(): string | undefined {
        return this._createdById;
    }

    public get updatedAt(): Date | undefined {
        return this._updatedAt;
    }

    public get updatedBy(): string | undefined {
        return this._updatedBy;
    }

    public get updatedById(): string | undefined {
        return this._updatedById;
    }

    
    public get updateToken(): string | undefined {
        return this._updateToken;
    }

    public get lockedAt(): Date | undefined {
        return this._lockedAt;
    }

    public get lockedBy(): string | undefined {
        return this._lockedBy;
    }

    public get lockedById(): string | undefined {
        return this._lockedById;
    }

    public get lockedExpired(): Date | undefined {
        return this._lockedExpired;
    }

    public get updateTokenPrevious(): string | undefined {
        return this._updateTokenPrevious;
    }

    public get lockedTimeout(): number {
        return this._lockedTimeout;
    }

    public get updateValidationMode(): UpdateValidationMode {
        return this._updateValidationMode;
    }

    protected set id(value: string | undefined) {
        this._id = value;
    }

    protected set createdAt(value: Date | undefined) {
        this._createdAt = value;
    }

    protected set createdBy(value: string | undefined) {
        this._createdBy = value;
    }

    protected set createdById(value: string | undefined) {
        this._createdById = value;
    }

    protected set updatedAt(value: Date | undefined) {
        this._updatedAt = value;
    }

    protected set updatedBy(value: string | undefined) {
        this._updatedBy = value;
    }

    protected set updatedById(value: string | undefined) {
        this._updatedById = value;
    }

    protected set updateToken(value: string | undefined) {
        this._updateToken = value;
    }

    protected set lockedAt(value: Date | undefined) {
        this._lockedAt = value;
    }

    protected set lockedBy(value: string | undefined) {
        this._lockedBy = value;
    }

    protected set lockedById(value: string | undefined) {
        this._lockedById = value;
    }

    protected set lockedExpired(value: Date | undefined) {
        this._lockedExpired = value;
    }

    protected set updateTokenPrevious(value: string | undefined) {
        this._updateTokenPrevious = value;
    }

    protected set lockedTimeout(value: number) {
        this._lockedTimeout = value;
    }

    protected set updateValidationMode(value: UpdateValidationMode) {
        this._updateValidationMode = value;
    }

    constructor(properties?: Partial<IModel>) {
        if (properties) {
            this.merge(properties);
        }
    }

    public merge(properties: Partial<IModel>): void {
        const updateableKeys = (Object.keys(properties) as Array<keyof IModel>)
            .filter((key): key is keyof IModel => key in this);

        updateableKeys.forEach((key) => {
            const value = properties[key];
            if (value !== undefined) {
                (this as any)[key] = value;
            }
        });
    }

    public toJson(): Record<string, any> {
        const propertyMap = new Map(Object.entries(this));
        const json: Record<string, any> = {};

        for (const [key, value] of propertyMap) {
            const publicKey = key.replace('_', '');
            json[publicKey] = value;
        }

        return json;
    }

    public lock(now: Date): void {
        this.lockedAt = now;
        this.lockedExpired = new Date(now.getTime() + (this._lockedTimeout * 10000));
    }

    public release(): void {
        this.lockedAt = undefined;
        this.lockedBy = undefined;
        this.lockedById = undefined;
        this.lockedExpired = undefined;
    }

}