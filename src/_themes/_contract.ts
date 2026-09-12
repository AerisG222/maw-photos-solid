/*
   What a theme owes the application.

   Both themes are free to look however they like, but neither is free to leave a
   token to daisyUI's derivation while the other states it - that is how the two
   drifted apart in the first place. `theme.test.ts` reads the two stylesheets
   and holds them to this list.
*/

// every theme must declare each of these explicitly
export const requiredColorTokens = [
    "--color-base-100",
    "--color-base-200",
    "--color-base-300",
    "--color-base-content",
    "--color-primary",
    "--color-primary-content",
    "--color-secondary",
    "--color-secondary-content",
    "--color-accent",
    "--color-neutral"
] as const;

// non-colour tokens the components depend on
export const requiredScalarTokens = [
    "--radius-field",
    "--radius-box",
    "--radius-selector",
    "--border"
] as const;

export interface ContrastPair {
    readonly foreground: string;
    readonly background: string;
    readonly min: number;
    // where this combination actually appears, so a failure names a screen
    readonly where: string;
}

/*
   WCAG 2.1 AA: 4.5:1 for body text. Every pair below carries text at a size the
   large-text exemption does not reach - `head3` is 13px bold, which is well
   under the 18.66px bold the exemption starts at - so they are all held to 4.5.
*/
export const contrastPairs: ContrastPair[] = [
    {
        foreground: "--color-base-content",
        background: "--color-base-100",
        min: 4.5,
        where: "body text on the page"
    },
    {
        foreground: "--color-base-content",
        background: "--color-base-200",
        min: 4.5,
        where: "text on toolbars and sidebars"
    },
    {
        foreground: "--color-base-content",
        background: "--color-base-300",
        min: 4.5,
        where: "text on info cards and dropdowns"
    },
    {
        foreground: "--color-primary",
        background: "--color-base-100",
        min: 4.5,
        where: "headings and links on the page"
    },
    {
        foreground: "--color-primary",
        background: "--color-base-200",
        min: 4.5,
        where: "toolbar links"
    },
    {
        foreground: "--color-primary-content",
        background: "--color-primary",
        min: 4.5,
        where: "the active toolbar link, and any primary button"
    },
    {
        foreground: "--color-secondary",
        background: "--color-base-100",
        min: 4.5,
        where: "head3, stat labels"
    },
    {
        foreground: "--color-secondary",
        background: "--color-base-200",
        min: 4.5,
        where: "toolbar and sidebar buttons at rest"
    },
    {
        foreground: "--color-secondary",
        background: "--color-base-300",
        min: 4.5,
        where: "InfoCard headings"
    },
    {
        foreground: "--color-secondary-content",
        background: "--color-secondary",
        min: 4.5,
        where: "a toolbar or sidebar button under the pointer"
    }
];
