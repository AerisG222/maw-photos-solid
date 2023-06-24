import { Component } from 'solid-js';

const BulkEditGpsCard: Component = () => {
    return (
        <div class="mx-4">
            <div>
                <input type="text" class="input input-sm w-300px" placeholder="Source" value={""} />
            </div>

            <div class="mt-2">
                <input type="text" class="input input-sm w-300px" placeholder="Source" value={""} />
            </div>

            <div class="mt-2">
                <button class="btn btn-sm">Save</button>
                <button class="btn btn-sm">Cancel</button>
            </div>
        </div>
    );
}

export default BulkEditGpsCard;
