import { Component } from "solid-js";

const ViewApplication: Component = () => {
    return (
        <>
            <h1 class="head1">Android</h1>

            <p>
                If you have an Android device, consider installing the MaW Photos app for a native
                and streamlined experience on your device! Click the icon below to go to the app in
                Google Play:
            </p>

            <p class="text-center my-6">
                <a
                    target="_blank"
                    href="https://play.google.com/store/apps/details?id=us.mikeandwan.pictures"
                >
                    <img
                        src="/icon.svg"
                        class="inline w-[72px] h-[72px] saturate-50 hover:saturate-100"
                    />
                </a>
            </p>
        </>
    );
};

export default ViewApplication;
