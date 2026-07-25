import { Component, Show } from "solid-js";

interface Props {
    showVersion?: boolean;
}

const BrandHeader: Component<Props> = props => {
    return (
        <div class="font-brand text-6xl text-center mt-4 md:my-8">
            <img
                src="/icon.svg"
                width="156"
                height="156"
                classList={{
                    inline: true,
                    "brand-in": true,
                    "mb-2": !!props.showVersion,
                    "mb-4": !props.showVersion
                }}
            />

            <h2 class="text-primary brand-in" style={{ "animation-delay": "120ms" }}>
                <a href="https://www.mikeandwan.us">mikeandwan.us</a>
            </h2>

            <h2 class="text-secondary brand-in" style={{ "animation-delay": "220ms" }}>
                Photos
            </h2>

            <Show when={props.showVersion}>
                <h2
                    class="text-secondary mt-[-1rem] brand-in"
                    style={{ "animation-delay": "320ms" }}
                >
                    v{import.meta.env.VITE_APP_VERSION}
                </h2>
            </Show>
        </div>
    );
};

export default BrandHeader;
