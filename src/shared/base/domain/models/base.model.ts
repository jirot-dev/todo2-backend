import { IModel } from "./model";

export abstract class BaseModel implements IModel {
    protected _id?: string;
    protected _createdAt?: Date;
    protected _createdBy?: string;
    protected _createdById?: string;
    protected _updatedAt?: Date;
    protected _updatedBy?: string;
    protected _updatedById?: string;

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
}