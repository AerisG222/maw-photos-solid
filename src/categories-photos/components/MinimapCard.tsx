import { Component, onMount } from 'solid-js';

const MinimapCard: Component = () => {
    let el: HTMLDivElement | undefined;
    let map: google.maps.Map;

    async function initMap(): Promise<void> {
        const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

        if(el) {
            map = new Map(el, {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 8,
            });
        }
    }

    onMount(() => {
        initMap();
    });

    return (
        <div class="h-[320px] w-[100%]" ref={el} />
    );
}

export default MinimapCard;
