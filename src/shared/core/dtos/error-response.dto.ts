import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class SubErrorResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  messageKey: string;
}

export class ValidationErrorResponseDto extends SubErrorResponseDto {
  @ApiProperty()
  fieldName: string;
}

export class ErrorResponseDto {
  @ApiProperty()
  correlationId?: string;

  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  timestamp: string;

  @ApiProperty()
  messageKey: string;

  @ApiProperty()
  message: string;

  @ApiProperty()
  path: string;

  @ApiProperty({ type: [SubErrorResponseDto] })
  errors?: SubErrorResponseDto[];

  @ApiProperty()
  detail?: string;
}

export class ErrorDtoBuilder {
  private response: ErrorResponseDto;

  constructor(path: string) {
    this.response = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path,
      messageKey: '',
      message: '',
    };
  }

  setStatusCode(statusCode: number): this {
    this.response.statusCode = statusCode;
    return this;
  }

  setMessageKey(messageKey: string): this {
    this.response.messageKey = messageKey;
    return this;
  }

  setMessage(message: string): this {
    this.response.message = message;
    return this;
  }

  addSubErrors(errors: SubErrorResponseDto[]): this {
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

  build(): ErrorResponseDto {
    return this.response;
  }
}