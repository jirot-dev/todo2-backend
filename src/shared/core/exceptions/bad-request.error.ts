import { ErrorMessages, ErrorStatus } from '../constants/error.constant';
import { ApplicationError } from './application.error';


export class BadRequestError extends ApplicationError {
    constructor(subErrors?: ApplicationError[]) {
        super(
            ErrorMessages.BAD_REQUEST,
            undefined,
            ErrorStatus.BAD_REQUEST,
            subErrors
        );
    }
}