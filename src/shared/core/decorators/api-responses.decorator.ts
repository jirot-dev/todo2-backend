import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from '../dtos/error-response.dto';

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
    { status: 400, type: ErrorResponseDto },
    { status: 500, type: ErrorResponseDto },
  ];

  const additionalErrors = errorStatus.map(status => ({
    status,
    type: ErrorResponseDto
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
