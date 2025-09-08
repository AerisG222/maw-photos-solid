import { Component } from "solid-js";

const BrandHeader: Component = () => {
    return (
        <div class="font-brand text-6xl text-center mt-4 md:my-8">
            <img src="/icon.svg" width="156" height="156" class="inline mb-4" />

            <h2 class="text-primary">
                <a href="https://www.mikeandwan.us">mikeandwan.us</a>
            </h2>
            <h2 class="text-secondary">Photos</h2>
        </div>
    );
};

export default BrandHeader;
