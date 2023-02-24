import { ParentComponent, children } from 'solid-js'

const ContentLayout: ParentComponent = (props) => {
    const c = children(() => props.children);

    return (
        <div
            class="grid
                    grid-rows-[auto] grid-cols-[100vw]
                    md:grid-rows-[100vh] md:grid-cols-[auto]"
        >
            {c()}
        </div>
    );
};

export default ContentLayout;
