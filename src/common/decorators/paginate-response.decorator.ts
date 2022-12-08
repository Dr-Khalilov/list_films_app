import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';
import { PaginationDto } from '../dtos/pagination.dto';

export const ApiPaginatedResponse = <TModel extends Type<unknown>>(
    model: TModel,
    // eslint-disable-next-line @typescript-eslint/ban-types
): Function =>
    applyDecorators(
        ApiExtraModels(PaginationDto),
        ApiOkResponse({
            description: 'Successfully received model list',
            schema: {
                allOf: [
                    { $ref: getSchemaPath(PaginationDto) },
                    {
                        properties: {
                            data: {
                                type: 'array',
                                items: { $ref: getSchemaPath(model) },
                            },
                        },
                    },
                ],
            },
        }),
    );
