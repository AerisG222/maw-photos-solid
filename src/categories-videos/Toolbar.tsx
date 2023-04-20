import { Component } from 'solid-js'
import ToolbarButton from '../components/toolbar/ToolbarButton';
import Divider from '../components/Divider';
import ToolbarLayout from '../components/toolbar/ToolbarLayout';

const Toolbar: Component = () => {
    const onMovePrevious = () => {
        console.log("previous");
    };

    const onMoveNext = () => {
        console.log("next");
    };

    const onToggleBreadcrumbs = () => {
        console.log("titles");
    };

    const onToggleVideoList = () => {
        console.log("toggle video list");
    };

    const onToggleMargins = () => {
        console.log("margins");
    };

    return (
        <ToolbarLayout>
            <ToolbarButton
                icon="i-ic-round-navigate-before"
                name="Previous Video"
                clickHandler={onMovePrevious}
            />

            <ToolbarButton
                icon="i-ic-round-navigate-next"
                name="Next Video"
                clickHandler={onMoveNext}
            />

            <Divider />

            <ToolbarButton
                icon="i-ic-outline-switch-video"
                name="Toggle Video Size"
                clickHandler={onMoveNext}
            />

            <Divider />

            <ToolbarButton
                icon="i-ic-round-title"
                name="Show / Hide Category Breadcrumbs"
                clickHandler={onToggleBreadcrumbs}
            />
            <ToolbarButton
                icon="i-ic-round-remove-red-eye"
                name="Show / Hide Photo List"
                clickHandler={onToggleVideoList}
            />
            <ToolbarButton
                icon="i-ic-round-format-indent-increase"
                name="Toggle Margins"
                clickHandler={onToggleMargins}
            />
        </ToolbarLayout>
    );
};

export default Toolbar;
