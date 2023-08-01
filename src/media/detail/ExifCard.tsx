import { Component, For, createEffect, createResource, createSignal } from "solid-js";

import { useMediaListContext } from "../contexts/MediaListContext";
import { getFormattedExif } from "../../_models/utils/ExifUtils";
import { useExifServiceContext } from "../contexts/ExifServiceContext";

const ExifCard: Component = () => {
    const [fetchExifSignal, setFetchExifSignal] = createSignal({ media: undefined, service: undefined });
    const [currentTab, setCurrentTab] = createSignal("exif");
    const [exifContext] = useExifServiceContext();
    const [mediaList] = useMediaListContext();

    const getExifData = () => {
        if(exifContext.service && mediaList.activeItem) {
            return exifContext.service.fetchExif(mediaList.activeItem.id);
        }
    };

    const [exifResource] = createResource(fetchExifSignal, getExifData);

    const getTableData = dataType => {
        if(exifResource.loading || !exifResource()) {
            return [];
        }

        return getFormattedExif(exifResource(), dataType);
    };

    createEffect(() => {
        setFetchExifSignal({
            media: mediaList.activeItem,
            service: exifContext.service
        });
    });

    return (
        <>
            <div class="tabs">
                <a class="tab tab-bordered" classList={{"tab-active": currentTab() === "exif"}} onClick={() => setCurrentTab("exif")}>EXIF</a>
                <a class="tab tab-bordered" classList={{"tab-active": currentTab() === "maker"}} onClick={() => setCurrentTab("maker")}>Maker</a>
                <a class="tab tab-bordered" classList={{"tab-active": currentTab() === "composite"}} onClick={() => setCurrentTab("composite")}>Composite</a>
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
};

export default ExifCard;
