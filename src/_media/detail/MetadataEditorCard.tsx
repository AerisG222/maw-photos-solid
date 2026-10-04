import { Component, createEffect, createSignal, Show } from "solid-js";

import { GpsOverride, isValidLatLng, parseGps } from "../../_models/utils/GpsUtils";
import { useMediaContext } from "../../_contexts/api/MediaContext";
import { Category } from "../../_models/Category";
import { Media } from "../../_models/Media";

interface Props {
    activeCategory: Category | undefined;
    activeMedia: Media | undefined;
    requestMoveNext: () => void;
}

const MetadataEditorCard: Component<Props> = props => {
    const { gpsQuery, setGpsOverrideMutation, clearGpsOverrideMutation } = useMediaContext(); // todo: add to service
    const [override, setOverride] = createSignal<GpsOverride>({ lat: undefined, lng: undefined });

    // eslint-disable-next-line solid/reactivity -- an accessor handed to a query factory, which reads it inside its own tracked options
    const gps = gpsQuery(() => props.activeMedia!.id);

    const updateOverrideInputsFromApi = () => {
        const ov = gps.data?.override;
        setOverride(
            ov
                ? { lat: ov.latitude?.toString(), lng: ov.longitude?.toString() }
                : { lat: undefined, lng: undefined }
        );
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

    const save = async (evt: Event) => {
        evt.preventDefault();

        if (props.activeMedia && isValidLatLng(override().lat) && isValidLatLng(override().lng)) {
            const req = {
                mediaId: props.activeMedia.id,
                latitude: parseFloat(override().lat!),
                longitude: parseFloat(override().lng!)
            };

            await setGpsOverrideMutation.mutateAsync(req);
        }
    };

    // back to the coordinate the file recorded, which is what is then shown
    const clearOverride = async (evt: Event) => {
        evt.preventDefault();

        if (props.activeMedia) {
            await clearGpsOverrideMutation.mutateAsync(props.activeMedia.id);

            setOverride({ lat: undefined, lng: undefined });
        }
    };

    const hasOverride = () => !!gps.data?.override;

    createEffect(() => {
        // update inputs when navigating between media
        if (props.activeMedia!.id) {
            updateOverrideInputsFromApi();
        }
    });

    const saveAndMoveNext = async (evt: Event) => {
        await save(evt);
        props.requestMoveNext();
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
        };
    };

    return (
        <Show when={gps.isSuccess}>
            <form>
                <div class="grid grid-cols-3 grid-rows-4 gap-2">
                    <div>
                        <label class="label">Latitude</label>
                    </div>
                    <div>
                        <input
                            type="text"
                            class="input input-sm"
                            placeholder="Recorded"
                            value={gps.data?.recorded?.latitude ?? ""}
                            disabled
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            class="input input-sm"
                            placeholder="Override"
                            classList={getValidationClass(override().lat!)}
                            onPaste={onPaste}
                            value={override().lat ?? ""}
                            onInput={evt =>
                                setOverride(prev => ({
                                    lat: evt.currentTarget.value,
                                    lng: prev.lng
                                }))
                            }
                        />
                    </div>

                    <div>
                        <label class="label">Longitude</label>
                    </div>
                    <div>
                        <input
                            type="text"
                            class="input input-sm"
                            placeholder="Recorded"
                            value={gps.data?.recorded?.longitude ?? ""}
                            disabled
                        />
                    </div>
                    <div>
                        <input
                            type="text"
                            class="input input-sm"
                            placeholder="Override"
                            classList={getValidationClass(override().lng!)}
                            onPaste={onPaste}
                            value={override().lng ?? ""}
                            onInput={evt =>
                                setOverride(prev => ({
                                    lat: prev.lat,
                                    lng: evt.currentTarget.value
                                }))
                            }
                        />
                    </div>

                    <div>
                        <button class="btn btn-sm btn-outline btn-error w-full" onClick={cancel}>
                            Cancel
                        </button>
                    </div>
                    <div>
                        <button
                            class="btn btn-sm btn-outline w-full"
                            onClick={save}
                            disabled={!isOverrideValid()}
                            classList={getButtonClass()}
                        >
                            Save
                        </button>
                    </div>
                    <div>
                        <button
                            class="btn btn-sm btn-outline w-full"
                            onClick={saveAndMoveNext}
                            disabled={!isOverrideValid()}
                            classList={getButtonClass()}
                        >
                            Save Move Next
                        </button>
                    </div>

                    {/* under the override column, as the thing it removes */}
                    <div class="col-start-3">
                        <button
                            class="btn btn-sm btn-outline btn-error w-full"
                            onClick={clearOverride}
                            disabled={!hasOverride() || clearGpsOverrideMutation.isPending}
                            classList={{ "btn-disabled": !hasOverride() }}
                        >
                            Clear Override
                        </button>
                    </div>
                </div>
            </form>
        </Show>
    );
};

export default MetadataEditorCard;
