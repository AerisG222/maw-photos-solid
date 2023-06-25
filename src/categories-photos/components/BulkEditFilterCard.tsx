import { Component } from 'solid-js';

import Checkbox from '../../settings/components/Checkbox';

const BulkEditFilterCard: Component = () => {
    return (
        <div class="mx-4">
            <div>
                <Checkbox
                    name="hideGps"
                    title="Hide Photos with GPS Data"
                    isSelected={false}
                    onChange={() => console.log('x')}
                />
            </div>

            <div class="mt-4">
                <button class="btn btn-sm mr-2">Select All</button>
                <button class="btn btn-sm">Deselect All</button>
            </div>
        </div>
    );
}

export default BulkEditFilterCard;
