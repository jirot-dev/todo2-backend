export class ApplicationError extends Error {
  constructor(
    protected readonly messageKey: string,
    protected readonly messageArgs?: Record<string, any>,
    protected readonly status?: number,
    protected readonly subErrors: ApplicationError[] = []
  ) {
    super(messageKey);
    this.name = this.constructor.name;
  }

  getMessageKey(): string {
    return this.messageKey;
  }

  getMessageArgs(): Record<string, any> | undefined {
    return this.messageArgs;
  }

  getStatus(): number | undefined {
    return this.status;
  }

  getSubErrors(): ApplicationError[] {
    return this.subErrors;
  }

  hasSubErrors(): boolean {
    return this.subErrors.length > 0;
  }

  appendSubError(error: ApplicationError): this {
    this.subErrors.push(error);
    return this;
  }

  appendSubErrors(errors: ApplicationError[]): this {
    this.subErrors.push(...errors);
    return this;
  }
}