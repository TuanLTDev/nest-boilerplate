import { applyDecorators, type Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, type ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';
import { OffsetPageDto } from '@common/dto/offset-pagination/dto/page.dto';

export const ApiPaginatedResponse = <T extends Type<any>>(options: {
  type: T;
  description?: string;
  paginationType?: 'offset' | 'cursor';
}): MethodDecorator => {
  return applyDecorators(
    ApiExtraModels(options.paginationType === 'offset' ? OffsetPageDto : OffsetPageDto, options.type),
    ApiOkResponse({
      description: options.description || `Paginated list of ${options.type.name}`,
      schema: {
        title: `PaginatedResponseOf${options.type.name}`,
        allOf: [
          {
            $ref: getSchemaPath(options.paginationType === 'offset' ? OffsetPageDto : OffsetPageDto),
          },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(options.type) },
              },
            },
          },
        ],
      },
    } as ApiResponseOptions | undefined),
  );
};
