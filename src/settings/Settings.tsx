import { ParentComponent } from "solid-js";

const Settings: ParentComponent = (props) => {
    return (
        <>
            { props.children }
        </>
    );
};

export default Settings;
