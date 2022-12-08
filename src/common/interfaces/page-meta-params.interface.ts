import { PageOptionsDto } from '../dtos/page-options.dto';

export interface IPageMetaParams {
    readonly pageOptionsDto: PageOptionsDto;
    readonly itemCount: number;
}
