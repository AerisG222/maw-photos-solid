import { Component, For, createResource, createSignal } from 'solid-js';
import { usePhotoListContext } from '../../contexts/PhotoListContext';

import { getExifData } from '../../api/Photos';
import { getFormattedExif } from '../../models/utils/ExifUtils';

const ExifCard: Component = () => {
    const [currentTab, setCurrentTab] = createSignal("exif");
    const [state] = usePhotoListContext();
    const [exifResource] = createResource(() => state.activePhoto?.id, getExifData);

    const getTableData = dataType => {
        if(exifResource.loading) {
            return [];
        }

        return getFormattedExif(exifResource(), dataType);
    }

    return (
        <>
            <div class="tabs">
                <a class="tab tab-bordered" classList={{'tab-active': currentTab() === 'exif'}} onClick={() => setCurrentTab('exif')}>EXIF</a>
                <a class="tab tab-bordered" classList={{'tab-active': currentTab() === 'maker'}} onClick={() => setCurrentTab('maker')}>Maker</a>
                <a class="tab tab-bordered" classList={{'tab-active': currentTab() === 'composite'}} onClick={() => setCurrentTab('composite')}>Composite</a>
                <span class="grow tab-bordered" />
            </div>

            <table class="table table-xs table-zebra w-[100%]">
                <tbody>
                    <For each={getTableData(currentTab())}>{ item =>
                        <tr>
                            <td>{item.displayName}</td>
                            <td>{item.displayValue}</td>
                        </tr>
                    }</For>
                </tbody>
            </table>
        </>
    );
}

export default ExifCard;
