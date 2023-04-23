import { Component } from 'solid-js';
import Divider from '../../components/layout/Divider';

const Sidebar: Component = () => {
    return (
        <div>
            <button class="block text-center text-6 i-ic-chevron-right" />

            <Divider />

            <button class="block text-center text-6 i-ic-round-star" />
            <button class="block text-center text-6 i-ic-round-comment" />
            <button class="block text-center text-6 i-ic-round-tune" />
            <button class="block text-center text-6 i-ic-round-photo-filter" />
            <button class="block text-center text-6 i-ic-round-color-lens" />
            <button class="block text-center text-6 i-ic-round-map" />
            <button class="block text-center text-6 i-ic-round-edit" />
            <button class="block text-center text-6 i-ic-round-image-search" />
        </div>
    );
};

export default Sidebar;
