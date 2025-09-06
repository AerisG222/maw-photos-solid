import { Component, createSignal } from "solid-js";

import { GpsOverride, isValidLatLng, parseGps } from "../../_models/utils/GpsUtils";
import { GpsCoordinate } from "../../_models/GpsCoordinate";

interface Props {
    onSave: (gps: GpsCoordinate) => void;
}

const BulkEditGpsCard: Component<Props> = props => {
    const [override, setOverride] = createSignal<GpsOverride>({ lat: undefined, lng: undefined });

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
            "btn-disabled": !isOverrideValid()
        };
    };

    const cancel = (evt: Event) => {
        evt.preventDefault();

        setOverride({ lat: undefined, lng: undefined });
    };

    const save = (evt: Event) => {
        evt.preventDefault();

        props.onSave({
            latitude: parseFloat(override().lat),
            longitude: parseFloat(override().lng)
        });
    };

    return (
        <div class="mx-4">
            <div>
                <input
                    type="text"
                    class="input input-sm w-300px"
                    placeholder="Latitude"
                    classList={getValidationClass(override().lat)}
                    onPaste={onPaste}
                    value={override().lat ?? ""}
                    onInput={evt =>
                        setOverride(prev => ({ lat: evt.currentTarget.value, lng: prev.lng }))
                    }
                />
            </div>

            <div class="mt-2">
                <input
                    type="text"
                    class="input input-sm w-300px"
                    placeholder="Longitude"
                    classList={getValidationClass(override().lng)}
                    onPaste={onPaste}
                    value={override().lng ?? ""}
                    onInput={evt =>
                        setOverride(prev => ({ lat: prev.lat, lng: evt.currentTarget.value }))
                    }
                />
            </div>

            <div class="mt-4">
                <button
                    class="btn btn-sm mr-2"
                    classList={getButtonClass()}
                    disabled={!isOverrideValid()}
                    onClick={save}
                >
                    Save
                </button>
                <button class="btn btn-sm" onClick={cancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default BulkEditGpsCard;
