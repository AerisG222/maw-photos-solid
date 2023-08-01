import { Component, createEffect, createResource, createSignal } from "solid-js";

import { useMediaListContext } from "../contexts/MediaListContext";
import { useMetadataEditServiceContext } from "../contexts/MetadataEditServiceContext";
import { GpsOverride, isValidLatLng, parseGps } from "../../_models/utils/GpsUtils";

const MetadataEditorCard: Component = () => {
    const [metadataEditorContext] = useMetadataEditServiceContext();
    const [fetchMetadataEditSignal, setFetchMetadataEditSignal] = createSignal({ media: undefined, service: undefined });
    const [sourceGps, setSourceGps] = createSignal<GpsOverride>({lat: undefined, lng: undefined});
    const [override, setOverride] = createSignal<GpsOverride>({lat: undefined, lng: undefined});
    const [mediaList, { moveNext }] = useMediaListContext();

    const fetchGpsData = () => {
        if(metadataEditorContext.service && mediaList.activeItem) {
            return metadataEditorContext.service.fetchGpsDetail(mediaList.activeItem.id);
        }
    };

    const [gpsDetail] = createResource(fetchMetadataEditSignal, fetchGpsData);

    createEffect(() => {
        const src = gpsDetail()?.source;

        setSourceGps(src ? { lat: src.latitude.toString(), lng: src.longitude.toString() } : { lat: undefined, lng: undefined } );

        updateOverrideInputsFromApi();
    });

    const updateOverrideInputsFromApi = () => {
        const ov = gpsDetail()?.override;

        setOverride(ov ? { lat: ov.latitude.toString(), lng: ov.longitude.toString() } : { lat: undefined, lng: undefined });
    };

    const onPaste = (evt: ClipboardEvent) => {
        const clipboardData = evt.clipboardData;
        const pastedText = clipboardData?.getData("text");

        if (pastedText) {
            const latLng = parseGps(pastedText);

            if (latLng) {
                evt.preventDefault();

                setOverride({
                    lat: latLng.latitude?.toString(),
                    lng: latLng.longitude?.toString()
                });
            }
        }
    };

    const cancel = (evt: Event) => {
        evt.preventDefault();

        updateOverrideInputsFromApi();
    };

    const save = (evt: Event) => {
        evt.preventDefault();

        if(metadataEditorContext.service &&
            mediaList.activeItem &&
            isValidLatLng(override().lat) &&
            isValidLatLng(override().lng)) {
            metadataEditorContext.service.setGpsCoordinateOverride(mediaList.activeItem.id, {
                latitude: parseFloat(override().lat),
                longitude: parseFloat(override().lng)
            });
        }
    };

    const saveAndMoveNext = (evt: Event) => {
        save(evt);
        moveNext();
    };

    const isOverrideValid = () => {
        return isValidLatLng(override().lat) && isValidLatLng(override().lng);
    };

    const getValidationClass = (val: string) => {
        const nullOrEmpty = val === undefined || val === "";

        return {
            "input-error": nullOrEmpty ? false : !isValidLatLng(val)
        };
    };

    const getButtonClass = () => {
        return {
            "btn-disabled": !isOverrideValid(),
            "btn-primary": isOverrideValid()
        }
    };

    createEffect(() => {
        setFetchMetadataEditSignal({
            media: mediaList.activeItem,
            service: metadataEditorContext.service
        });
    });

    return (
        <form>
            <div class="grid grid-cols-3 grid-rows-3 grid-gap-2">
                <div><label class="label">Latitude</label></div>
                <div><input type="text" class="input input-sm w-[100%]" placeholder="Source" value={sourceGps().lat ?? ""} disabled /></div>
                <div><input type="text" class="input input-sm w-[100%]" placeholder="Override" classList={getValidationClass(override().lat)} onPaste={onPaste} value={override().lat ?? ""} onInput={evt => setOverride(prev => ({ lat: evt.currentTarget.value, lng: prev.lng}))} /></div>

                <div><label class="label">Longitude</label></div>
                <div><input type="text" class="input input-sm w-[100%]" placeholder="Source" value={sourceGps().lng ?? ""} disabled /></div>
                <div><input type="text" class="input input-sm w-[100%]" placeholder="Override" classList={getValidationClass(override().lng)} onPaste={onPaste} value={override().lng ?? ""} onInput={evt => setOverride(prev => ({ lat: prev.lat, lng: evt.currentTarget.value }))} /></div>

                <div><button class="btn btn-sm btn-outline btn-error w-[100%]" onClick={cancel}>Cancel</button></div>
                <div><button class="btn btn-sm btn-outline w-[100%]" onClick={save} disabled={!isOverrideValid()} classList={getButtonClass()}>Save</button></div>
                <div><button class="btn btn-sm btn-outline w-[100%]" onClick={saveAndMoveNext} disabled={!isOverrideValid()} classList={getButtonClass()}>Save Move Next</button></div>
            </div>
        </form>
    );
};

export default MetadataEditorCard;
