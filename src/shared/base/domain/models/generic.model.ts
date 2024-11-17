import { IModel } from "./model";
import { BaseModel } from "./base.model";


export abstract class GenericModel<T extends IModel> extends BaseModel {
    constructor(properties?: Partial<T>) {
        super(properties);
    }

    public override merge(properties: Partial<T>): void {
        super.merge(properties);
    }
}