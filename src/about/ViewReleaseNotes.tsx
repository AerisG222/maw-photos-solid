import { Component } from "solid-js";

const ViewApplication: Component = () => {
    return (
        <>
            <h1 class="head1">Release Notes</h1>

            <h1 class="head2">Angular Version</h1>
            <h3 class="head3"><span class="version">v2.0.7</span> : <span class="date">2023-01-08</span></h3>
            <p>Upgrade to Angular 15</p>

            <ul class="list-inside list-disc">
                <li>Upgrade to Angular 15</li>
                <li>Upgrade libraries to latest versions</li>
                <li>Styling updates based on changes to Angular Material</li>
            </ul>

            <h3 class="head3"><span class="version">v2.0.6</span> : <span class="date">2022-08-27</span></h3>
            <p>Upgrade Dependencies</p>

            <ul class="list-inside list-disc">
                <li>Upgrade to Angular 14</li>
                <li>Upgrade libraries to latest versions</li>
            </ul>

            <h3 class="head3"><span class="version">v2.0.5</span> : <span class="date">2022-05-26</span></h3>
            <p>Upgrade Dependencies</p>

            <ul class="list-inside list-disc">
                <li>Upgrade depedencies and address some lint issues</li>
                <li>Fix issue with the initial category year selection</li>
            </ul>

            <h3 class="head3"><span class="version">v2.0.4</span> : <span class="date">2021-11-29</span></h3>
            <p>Upgrade Dependencies</p>

            <ul class="list-inside list-disc">
                <li>Upgrade to Angular 13</li>
                <li>Upgrade libraries to latest versions</li>
            </ul>

            <h3 class="head3"><span class="version">v2.0.3</span> : <span class="date">2021-10-09</span></h3>
            <p>Minor Update</p>

            <ul class="list-inside list-disc">
                <li>Update dependencies</li>
            </ul>

            <h3 class="head3"><span class="version">v2.0.2</span> : <span class="date">2021-19-06</span></h3>
            <p>Minor Update</p>

            <ul class="list-inside list-disc">
                <li>Update dependencies</li>
                <li>Change detail view hotkey to avoid clash with one of the rotate hotkeys</li>
                <li>
                    Change to backend to only retain print images for 1 year (because I am cheap to buy another server / upgrade storage).
                    I do retain these offline, so if you are looking for an older photo - just email me the browser URLs for the photos you'd like.
                    Sorry for any inconvenience!
                </li>
            </ul>

            <h3 class="head3"><span class="version">v2.0.1</span> : <span class="date">2021-05-24</span></h3>
            <p>Minor Update</p>

            <ul class="list-inside list-disc">
                <li>Update all dependencies, now using Angular 12</li>
            </ul>

            <h3 class="head3"><span class="version">v2.0.0</span> : <span class="date">2021-03-14</span></h3>
            <p>Major Refactor</p>

            <ul class="list-inside list-disc">
                <li>Improve navigation by exposing URLs throughout site, allowing for easily sharing links with others</li>
                <li>Default to the grid view as most people just browse the images, and offer static navigation to the other views</li>
                <li>Support more view types in the Random section</li>
                <li>Correctly redirect to destination after login</li>
                <li>Expanded settings and improved settings UI</li>
                <li>Optimize what is contained in the initial bundle to improve loading performance</li>
                <li>Update all dependencies to latest versions</li>
                <li>Lots of code refactoring and improvements</li>
                <li>Adopted Prettier for more consistent code formatting</li>
            </ul>

            <h3 class="head3"><span class="version">v1.7.5</span> : <span class="date">2020-09-11</span></h3>
            <p>Update Dependencies</p>

            <ul class="list-inside list-disc">
                <li>
                    Update dependencies for Angular and ngx-charts, improving bundle sizes
                </li>
            </ul>

            <h3 class="head3"><span class="version">v1.7.4</span> : <span class="date">2020-09-08</span></h3>
            <p>Bug Fixing</p>

            <ul class="list-inside list-disc">
                <li>Fix display issue in Chrome</li>
            </ul>

            <h3 class="head3"><span class="version">v1.7.3</span> : <span class="date">2020-08-16</span></h3>
            <p>Improve Image Quality</p>

            <ul class="list-inside list-disc">
                <li>Use higher res photos on larger displays</li>
            </ul>

            <h3 class="head3"><span class="version">v1.7.2</span> : <span class="date">2020-08-14</span></h3>
            <p>Minor improvements</p>

            <ul class="list-inside list-disc">
                <li>Correct issues with the map view</li>
                <li>Upgrade dependencies to the latest version</li>
            </ul>

            <h3 class="head3"><span class="version">v1.7.1</span> : <span class="date">2020-07-08</span></h3>
            <p>Minor improvement to grid view</p>

            <ul class="list-inside list-disc">
                <li>
                    After exiting the zoomed in image, scroll the user back to where they
                    were in the list
                </li>
            </ul>

            <h3 class="head3"><span class="version">v1.7.0</span> : <span class="date">2020-07-07</span></h3>
            <p>Photo Grid View</p>

            <ul class="list-inside list-disc">
                <li>Add a new Grid View for photos which is more optimized for mobile</li>
            </ul>

            <h3 class="head3"><span class="version">v1.6.0</span> : <span class="date">2020-07-05</span></h3>
            <p>New Features</p>

            <ul class="list-inside list-disc">
                <li>Special bonus release - two in one day!</li>
                <li>
                    Try to leverage WebShare API to allow Android Chrome to have a nice
                    sharing experience
                </li>
                <li>
                    Improve behavior when downloading category zip or different resolution
                    images
                </li>
            </ul>

            <h3 class="head3"><span class="version">v1.5.1</span> : <span class="date">2020-07-05</span></h3>
            <p>Minor Fixes</p>

            <ul class="list-inside list-disc">
                <li>Fix default slider value for Missing Gps Data admin control</li>
                <li>Hide irrelevant buttons on random view - map + bulk edit mode</li>
                <li>Correct animation name for bulk edit view</li>
                <li>
                    Handle case when overriding gps for videos sometimes would throw an
                    error for an undefined variable
                </li>
                <li>Properly integrate NGRX router store</li>
                <li>Avoid a potential race with the Google Maps script</li>
            </ul>

            <h3 class="head3"><span class="version">v1.5.0</span> : <span class="date">2020-07-04</span></h3>
            <p>Code Cleanup</p>

            <ul class="list-inside list-disc">
                <li>Upgrade to Angular 10</li>
                <li>
                    Optimize theming to remove duplication in generated CSS for decreased
                    download size
                </li>
                <li>Enable strict mode and address numerous code quality issues.</li>
            </ul>

            <h3 class="head3"><span class="version">v1.4.3</span> : <span class="date">2020-06-21</span></h3>
            <p>New Admin functionality</p>

            <ul class="list-inside list-disc">
                <li>
                    Add capability for an admin to limit categories to those without GPS
                    data. This highlights categories that still have pending edits.
                </li>
            </ul>

            <h3 class="head3"><span class="version">v1.4.2</span> : <span class="date">2020-04-19</span></h3>
            <p>Minor fix - part II</p>

            <ul class="list-inside list-disc">
                <li>Fix teaser image in category and search list views</li>
            </ul>

            <h3 class="head3"><span class="version">v1.4.1</span> : <span class="date">2020-04-19</span></h3>
            <p>Minor fix</p>

            <ul class="list-inside list-disc">
                <li>Correct category sort order so newest items appear first</li>
            </ul>

            <h3 class="head3"><span class="version">v1.4.0</span> : <span class="date">2020-04-19</span></h3>
            <p>Code Refactoring</p>

            <ul class="list-inside list-disc">
                <li>
                    Restructure codebase to improve initial load, separate concerns, and
                    improve maintainability
                </li>
                <li>
                    Replaced and improved authentication functionality and session
                    management
                </li>
                <li>Optimized code, especially on the main category screen</li>
                <li>Introduce shared layouts</li>
                <li>Updated libraries</li>
            </ul>

            <h3 class="head3"><span class="version">v1.3.1</span> : <span class="date">2020-03-29</span></h3>
            <p>Minor improvements</p>

            <ul class="list-inside list-disc">
                <li>Add ability to flip images horizontally and vertically</li>
                <li>
                    Avoid unexpected behavior when bulk editing and photos with GPS data are
                    hidden
                </li>
            </ul>

            <h3 class="head3"><span class="version">v1.3.0</span> : <span class="date">2020-03-27</span></h3>
            <p>Numerous backend updates</p>

            <ul class="list-inside list-disc">
                <li>You can now swipe through photos on mobile!</li>
                <li>Numerous code improvements to improve maintainability</li>
                <li>Upgrade core libraries</li>
            </ul>

            <h3 class="head3"><span class="version">v1.2.0</span> : <span class="date">2020-03-11</span></h3>
            <p>Additional admin tooling</p>

            <ul class="list-inside list-disc">
                <li>
                    Add new screen for admins to bulk assign GPS data to multiple photos at
                    once
                </li>
                <li>Update Angular to the latest version</li>
            </ul>

            <h3 class="head3"><span class="version">v1.1.1</span> : <span class="date">2020-02-29</span></h3>
            <p>Minor Update</p>

            <ul class="list-inside list-disc">
                <li>
                    Add new button to make overriding GPS a bit more efficient for the admin
                </li>
                <li>Update Angular to the latest version</li>
            </ul>

            <h3 class="head3"><span class="version">v1.1.0</span> : <span class="date">2020-02-23</span></h3>
            <p>New admin functions and fixes</p>

            <ul class="list-inside list-disc">
                <li>
                    New functions for admins to specify GPS overrides, and easily change the
                    category teaser images
                </li>
                <li>Worked around concatMap issue so calls after the first work</li>
                <li>Update dependencies to latest versions</li>
            </ul>

            <h3 class="head3"><span class="version">v1.0.0</span> : <span class="date">2020-02-09</span></h3>
            <p>Exciting updates to improve functionality and performance</p>

            <ul class="list-inside list-disc">
                <li>New feature to allow searching for photos and videos</li>
                <li>
                    Improve UI, particularly around how the toolbar is presented more
                    consistently and without overlapping other elements
                </li>
                <li>
                    Leverage CSS grid for simplified and more performant layout behavior
                </li>
                <li>Remove use of flex-layout for improved performance and reduced size</li>
                <li>
                    Photos/Videos enriched with additional metadata by reverse-geocoding GPS
                    data
                </li>
                <li>Upgrade to Angular 9 with Ivy for improved performance</li>
                <li>Upgrade core libraries for improved functionality and performance</li>
                <li>
                    Switch to the Angular Components Google Maps component, and fix some
                    navigation issues in the old implementation
                </li>
                <li>Remove some of the ugly themes to reduce overall payload size</li>
                <li>Additional code refactoring and improvements across the app</li>
            </ul>

            <h3 class="head3"><span class="version">v0.5.3</span> : <span class="date">2019-08-31</span></h3>
            <p>Fix image sizing issue on Chrome</p>

            <ul class="list-inside list-disc">
                <li>
                    The image in chrome had been breaking out of the viewport, this forces
                    it back into place.
                </li>
            </ul>

            <h3 class="head3"><span class="version">v0.5.2</span> : <span class="date">2019-07-27</span></h3>
            <p>Additional improvements to the auth process</p>

            <ul class="list-inside list-disc">
                <li>
                    Hopefully this is the last fix for auth that does not use the popup
                    approach
                </li>
            </ul>

            <h3 class="head3"><span class="version">v0.5.1</span> : <span class="date">2019-07-21</span></h3>
            <p>Fix auth issues (sorry Mahgo!), and minor updates</p>

            <ul class="list-inside list-disc">
                <li>Correct auth handling in callback html files</li>
                <li>Upgrade libraries</li>
            </ul>

            <h3 class="head3"><span class="version">v0.5.0</span> : <span class="date">2019-07-06</span></h3>
            <p>Improved auth experience and upgrade Angular</p>

            <ul class="list-inside list-disc">
                <li>
                    First attempt to login via popup to avoid reloading app for
                    authentication
                </li>
                <li>
                    Leverage library (ng-oidc-client) to simplify authentication code and
                    integrate with Ngrx
                </li>
                <li>Upgrade to Angular 8</li>
            </ul>

            <h3 class="head3"><span class="version">v0.4.0</span> : <span class="date">2019-04-07</span></h3>
            <p>
                Another attempt at cleaning up some of the clutter on the category listing
                page
            </p>

            <ul class="list-inside list-disc">
                <li>Introduce a new list view for categories</li>
                <li>
                    Label the current filter icons so it is clear they are not interactive
                </li>
                <li>Prefer radio buttons in the settings page for small lists</li>
            </ul>

            <h3 class="head3"><span class="version">v0.3.3</span> : <span class="date">2019-04-02</span></h3>
            <p>Minor Improvements:</p>

            <ul class="list-inside list-disc">
                <li>
                    Make sure categories wrap titles to avoid different item counts per row
                </li>
                <li>Improve help page by linking back to main site</li>
            </ul>

            <h3 class="head3"><span class="version">v0.3.2</span> : <span class="date">2019-04-01</span></h3>
            <p>More tweaking:</p>

            <ul class="list-inside list-disc">
                <li>
                    Photo list scrolling should only scroll the photo list and not the whole
                    page, which was particularly problematic in mobile
                </li>
                <li>
                    Try another approach at filtering by year on the category listing page
                </li>
            </ul>

            <h3 class="head3"><span class="version">v0.3.1</span> : <span class="date">2019-03-30</span></h3>
            <p>More mobile improvements:</p>

            <ul class="list-inside list-disc">
                <li>Improve toolbar display / function in mobile</li>
                <li>Fix info panel buttons on mobile view</li>
            </ul>

            <h3 class="head3"><span class="version">v0.3.0</span> : <span class="date">2019-03-29</span></h3>
            <p>
                Implement a mobile friendly layout and try to reduce clutter on the main
                category listing page. A handful of bug fixes and some more polish:
            </p>

            <ul class="list-inside list-disc">
                <li>Add options to de-clutter the main category listing page</li>
                <li>Add mobile friendly layout</li>
                <li>Add ability to select map types</li>
                <li>Re-introduce the download category button for photos</li>
                <li>Fix random view to show first photo</li>
                <li>Fix CORS settings to fix histograms</li>
            </ul>

            <h3 class="head3"><span class="version">v0.2.0</span> : <span class="date">2019-03-16</span></h3>
            <p>
                Bug fixing, polishing and a few minor features in preparation for beta
                testing:
            </p>

            <ul class="list-inside list-disc">
                <li>Improve auth handling and deep linking</li>
                <li>
                    Map view now restricts next and previous to only photos that appear on
                    the map
                </li>
                <li>Increase statistic chart sizing</li>
                <li>Improve photo scaling on Firefox</li>
                <li>Scroll photo and video lists so current item is always visible</li>
                <li>Fix issue with histogram</li>
                <li>Fix issue with showing photo size stats</li>
                <li>Update photo/video lists so active/hovered items stand out more</li>
                <li>A number of other fixes and code improvements</li>
            </ul>

            <h3 class="head3"><span class="version">v0.1.0</span> : <span class="date">2019-03-14</span></h3>
            <p>Initial Release</p>

            <ul class="list-inside list-disc">
                <li>Total rewrite (again) of the Photos application</li>
                <li>Integrates videos and statistics into single application</li>
                <li>
                    Rating, commenting, and viewing map location for videos is now possible
                </li>
                <li>Improved interface and implementation</li>
            </ul>

            <p />
        </>
    );
};

export default ViewApplication;
