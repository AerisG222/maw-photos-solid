import { ParentComponent, children } from 'solid-js'
import { MarginIdType, allMargins } from '../../models/Margin';
import { equalsIgnoreCase } from '../../models/Utils';

interface Props {
    title: string;
    margin: MarginIdType;
}

const MainContent: ParentComponent<Props> = (props) => {
    const c = children(() => props.children);

    const marginClass = () => allMargins
        .filter(x => equalsIgnoreCase(x.id, props.margin))
        .map(x => x.klass)[0];

    return (
        <div class="overflow-y-auto pl-2 pr-2 pb-8">
            <div classList={marginClass()}>
                <h1 class="head1">{props.title}</h1>
                {c()}
            </div>
        </div>
    );
};

export default MainContent;
