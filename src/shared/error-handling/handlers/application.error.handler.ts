import { ErrorMessages, ErrorStatus } from "../constants/error.constant";
import { ApplicationError } from "../exceptions/application.error";
import { AbstractErrorHandler } from "./abstract.error.handler";

export class ApplicationErrorHandler extends AbstractErrorHandler<ApplicationError> {
    constructor() {
      super(ApplicationError, ErrorStatus.BAD_REQUEST, ErrorMessages.INTERNAL);
    }
  }