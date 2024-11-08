import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class SubErrorDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  messageKey: string;
}

export class ValidationErrorDto extends SubErrorDto {
  @ApiProperty()
  fieldName: string;
}

export class ErrorDto {
  @ApiProperty()
  correlationId?: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  path: string;

  @ApiProperty({ type: [SubErrorDto] })
  errors?: SubErrorDto[];

  @ApiProperty()
  detail?: string;
}

export class ErrorDtoBuilder {
  private response: ErrorDto;

  constructor(path: string) {
    this.response = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path,
      message: '',
    };
  }

  setStatus(status: number): this {
    this.response.statusCode = status;
    return this;
  }

  setMessage(message: string): this {
    this.response.message = message;
    return this;
  }

  addSubErrors(errors: SubErrorDto[]): this {
    this.response.errors = errors;
    return this;
  }

  setCorrelationId(id: string): this {
    this.response['correlationId'] = id;
    return this;
  }

  setDetail(detail: string): this {
    if (process.env.NODE_ENV === 'development') {
      this.response['detail'] = detail;
    }
    return this;
  }

  build(): ErrorDto {
    return this.response;
  }
}