import { Outlet } from "@solidjs/router";
import { Component } from "solid-js";

import { MediaListProvider } from "./contexts/MediaListContext";
import { SlideshowProvider } from "./contexts/SlideshowContext";
import { VisualEffectsProvider } from "./contexts/VisualEffectsContext";
import { CategoryTeaserServiceProvider } from "./contexts/CategoryTeaserServiceContext";
import { CommentServiceProvider } from "./contexts/CommentServiceContext";
import { ExifServiceProvider } from "./contexts/ExifServiceContext";
import { MetadataEditServiceProvider } from "./contexts/MetadataEditServiceContext";
import { RatingServiceProvider } from "./contexts/RatingServiceContext";

import AuthGuard from "../components/auth/AuthGuard";
import MediaLoader from "./MediaLoader";
import ActiveMediaMonitor from "./ActiveMediaMonitor";
import ActiveCategoryMonitor from "./ActiveCategoryMonitor";

const MediaRoot: Component = () => {
    return (
        <AuthGuard>
            <MediaListProvider>
                <ExifServiceProvider>
                <RatingServiceProvider>
                <CommentServiceProvider>
                <MetadataEditServiceProvider>
                <CategoryTeaserServiceProvider>
                    <ActiveCategoryMonitor>
                    <ActiveMediaMonitor>
                    <MediaLoader>
                        <SlideshowProvider>
                        <VisualEffectsProvider>
                            <Outlet />
                        </VisualEffectsProvider>
                        </SlideshowProvider>
                    </MediaLoader>
                    </ActiveMediaMonitor>
                    </ActiveCategoryMonitor>
                </CategoryTeaserServiceProvider>
                </MetadataEditServiceProvider>
                </CommentServiceProvider>
                </RatingServiceProvider>
                </ExifServiceProvider>
            </MediaListProvider>
        </AuthGuard>
    );
}

export default MediaRoot;
