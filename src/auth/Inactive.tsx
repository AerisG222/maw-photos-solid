import { Component } from "solid-js";

import BrandHeader from "./components/BrandHeader";

const Inactive: Component = () => {
    return (
        <>
            <div class="text-center">
                <BrandHeader />

                <p class="mb-8 max-w-130 mx-auto">
                    Thank you for logging into photos.mikeandwan.us!
                </p>

                <p class="mb-8 max-w-130 mx-auto text-info">
                    At this time your account has been created but has not been assigned any
                    permissions. An administrator will review this shortly and get back to you once
                    your account is all set.
                </p>

                <p class="my-16 max-w-130 italic mx-auto">
                    If you think the admin fell asleep, please{" "}
                    <a
                        class="text-secondary"
                        target="_blank"
                        href="mailto:webmaster@mikeandwan.us?subject=photos.mikeandwan.us account activation"
                    >
                        send a note
                    </a>{" "}
                    to wake them up!
                </p>
            </div>
        </>
    );
};

export default Inactive;
