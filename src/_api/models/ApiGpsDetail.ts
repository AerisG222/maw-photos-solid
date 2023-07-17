import { ApiGpsCoordinate } from './ApiGpsCoordinate';

export type ApiGpsDetail = {
    source: ApiGpsCoordinate;
    override: ApiGpsCoordinate;
};
