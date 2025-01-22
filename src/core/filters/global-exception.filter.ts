import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
  UnprocessableEntityException,
  ValidationError,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorDto } from '@common/dto/error.dto';
import { MongooseError } from 'mongoose';
import { ErrorDetailDto } from '@common/dto/error-detail.dto';
import { STATUS_CODES } from 'http';
import { ERROR_RES } from '@core/constants/exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private debug: boolean = false;
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  constructor(private readonly configService: ConfigService) {
    this.debug = this.configService.getOrThrow('app.debug', { infer: true });
  }

  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let error: ErrorDto;

    if (exception instanceof UnprocessableEntityException) {
      error = this.handleUnprocessableEntityException(exception);
    } else if (exception instanceof HttpException) {
      error = this.handleHttpException(exception);
    } else if (exception instanceof MongooseError) {
      error = this.handleMongooseError(exception);
    } else {
      error = this.handleError(exception);
    }

    if (this.debug) {
      error.stack = exception.stack;
      error.trace = exception;

      this.logger.debug(error);
    }

    response.status(error.statusCode).json(error);
  }

  /**
   * Handles UnprocessableEntityException:
   * Check the request payload
   * Validate the input
   * @param exception UnprocessableEntityException
   * @returns ErrorDto
   */
  private handleUnprocessableEntityException(exception: UnprocessableEntityException): ErrorDto {
    const r = exception.getResponse() as { message: ValidationError[] };
    const statusCode = exception.getStatus();

    const errorRes: ErrorDto = {
      timestamp: new Date().toISOString(),
      status: false,
      statusCode,
      error: STATUS_CODES[statusCode],
      message: 'Validation failed',
      details: this.extractValidationErrorDetails(r.message) as ErrorDetailDto[],
    };

    return errorRes;
  }

  /**
   * Handles HttpException
   * @param exception HttpException
   * @returns ErrorDto
   */
  private handleHttpException(exception: HttpException): ErrorDto {
    const statusCode = exception.getStatus();

    return {
      timestamp: new Date().toISOString(),
      status: false,
      statusCode,
      error: STATUS_CODES[statusCode],
      message: ERROR_RES[exception.message] || exception.message,
      errorCode: exception.message,
    };
  }

  /**
   * Handles MongooseError
   * @param error MongooseError
   * @returns ErrorDto
   */
  private handleMongooseError(error: MongooseError): ErrorDto {
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorRes = {
      timestamp: new Date().toISOString(),
      status: false,
      statusCode,
      error: STATUS_CODES[statusCode],
      message: error.message,
    } as unknown as ErrorDto;

    this.logger.debug(error);
    return errorRes;
  }

  /**
   * Handles generic errors
   * @param error Error
   * @returns ErrorDto
   */
  private handleError(error: Error): ErrorDto {
    const statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    const errorRes = {
      timestamp: new Date().toISOString(),
      status: false,
      statusCode,
      error: STATUS_CODES[statusCode],
      message: error?.message || 'An unexpected error occurred',
    };

    return errorRes;
  }

  /**
   * Extracts error details from ValidationError[]
   * @param errors ValidationError[]
   * @returns ErrorDetailDto[]
   */
  private extractValidationErrorDetails(errors: ValidationError[]): ErrorDetailDto[] {
    const extractErrors = (error: ValidationError, parentProperty: string = ''): ErrorDetailDto[] => {
      const propertyPath = parentProperty ? `${parentProperty}.${error.property}` : error.property;

      const currentErrors: ErrorDetailDto[] = Object.entries(error.constraints || {}).map(([code, message]) => ({
        property: propertyPath,
        code,
        message,
      }));

      const childErrors: ErrorDetailDto[] =
        error.children?.flatMap((childError) => extractErrors(childError, propertyPath)) || [];

      return [...currentErrors, ...childErrors];
    };

    return errors.flatMap((error) => extractErrors(error));
  }
}
