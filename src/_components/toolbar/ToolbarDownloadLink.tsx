import { Component } from "solid-js";

import Icon from "../icon/Icon";

import { useAppSettingsContext } from "../../_contexts/settings/AppSettingsContext";
import { useCategoriesContext } from "../../_contexts/api/CategoriesContext";

interface Props {
    name: string;
    tooltip: string;
    iconClass: string;
    url: string;
    textClassList?: Record<string, boolean>;
    downloadFileName?: string;
}

const ToolbarDownloadLink: Component<Props> = props => {
    const [state] = useAppSettingsContext();
    const { downloadFile } = useCategoriesContext();

    const nameClass = () => ({
        "ml-2": true,
        "text-sm": true,
        "font-bold": true,
        "align-middle": true,
        hidden: true,
        "md:inline": state.isToolbarCollapsed
    });

    const handleDownload = () => {
        downloadFile(props.url, props.downloadFileName ?? "download").catch(error => {
            console.error("Download failed:", error);
        });
    };

    const buttonClass = () => ({
        "flex": true,
        "py-2": true,
        "px-3": true,
        "cursor-pointer": true,
        "hover:bg-secondary": true,
        "hover:text-secondary-content": true,
        "disabled:bg-transparent!": true,
        "disabled:color-base-content/20": true,
        ...(props.textClassList!)
    });

    return (
        <button
            title={props.tooltip}
            onClick={handleDownload}
            classList={buttonClass()}
        >
            <Icon classes={props.iconClass} />
            <span classList={nameClass()}>{props.name}</span>
        </button>
    );
};

export default ToolbarDownloadLink;

export const getFilenameFromUrl = (url: string, suffix?: string) => {
    try {
        const urlObj = new URL(url);
        const path = urlObj.pathname;
        const filename = path.substring(path.lastIndexOf('/') + 1) || "download";

        return getFilenameWithSuffix(filename, suffix);
    } catch {
        return suffix
            ? `download-${suffix}`
            : "download";
    }
};

const getFilenameWithSuffix = (filename: string, suffix?: string) => {
    const extIndex = filename.lastIndexOf(".");

    return extIndex === -1
        ? filename
        : `${filename.substring(0, extIndex)}-${suffix}${filename.substring(extIndex)}`;
};
