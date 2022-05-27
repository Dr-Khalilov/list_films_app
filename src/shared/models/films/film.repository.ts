import { EntityRepository, Repository } from 'typeorm';
import { FilmEntity } from './film.entity';

@EntityRepository(FilmEntity)
export class FilmRepository extends Repository<FilmEntity> {}
