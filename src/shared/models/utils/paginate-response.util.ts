import { PaginateResponse } from './paginate-response.dto';

export const paginateResponse = (
    [result, total],
    page: number,
    limit: number,
): PaginateResponse => {
    const lastPage: number = Math.ceil(total / limit);
    const nextPage: number = page + 1 > lastPage ? null : page + 1;
    const prevPage: number = page - 1 < 1 ? null : page - 1;
    return {
        statusCode: 'success',
        data: [...result],
        count: total,
        currentPage: page,
        nextPage,
        prevPage,
        lastPage,
    };
};
