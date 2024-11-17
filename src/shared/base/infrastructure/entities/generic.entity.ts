import { BaseEntity } from "./base.entity";
import { IEntity } from "./entity";

export abstract class GenericEntity<T extends IEntity> extends BaseEntity {}
