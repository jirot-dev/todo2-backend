import { BaseError } from './base.error';


export class NotFoundError extends BaseError {
  constructor(
    resource?: string,
    id?: string | number
  ) {
    super(
      'errors.item.notFound',
      { resource, id }
    );
  }
}