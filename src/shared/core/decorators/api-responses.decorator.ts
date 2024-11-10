import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorDto } from '../dtos/error.dto';

interface ApiResponsesOptions {
  type: any;
  successStatus?: number;
  isArray?: boolean;
  errorStatus?: number[]
}

export function ApiResponses(options: ApiResponsesOptions) {
  const {
    type,
    successStatus = 200,
    isArray = false,
    errorStatus = []
  } = options;

  const baseErrors = [
    { status: 400, type: ErrorDto },
    { status: 500, type: ErrorDto },
  ];

  const additionalErrors = errorStatus.map(status => ({
    status,
    type: ErrorDto
  }));

  return applyDecorators(
    ApiResponse({
      status: successStatus,
      type: type,
      isArray
    }),
    ...baseErrors.map(error => ApiResponse(error)),
    ...additionalErrors.map(error => ApiResponse(error))
  );
}
