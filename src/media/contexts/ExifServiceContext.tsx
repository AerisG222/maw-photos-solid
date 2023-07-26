import { useContext } from 'solid-js';

import { buildServiceContext } from '../../_models/utils/ServiceContextUtil';
import { IExifService } from '../../_services/media/IExifService';

export const {
    ServiceContext: ExifServiceContext,
    ServiceProvider: ExifServiceProvider
} = buildServiceContext<IExifService>();

export const useExifServiceContext = () => useContext(ExifServiceContext);
