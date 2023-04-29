import { ParentComponent } from 'solid-js';

const InfoCard: ParentComponent = (props) => {
    const c = () => props.children;

    return (
        <div class="rounded m-1 p-2 border-1 border-secondary-content:10%">
            {c()}
        </div>
    )
}

export default InfoCard;
