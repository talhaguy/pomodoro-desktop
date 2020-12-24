// adapted from https://styled-components.com/docs/api#typescript
import "styled-components";

declare module "styled-components" {
    export interface DefaultTheme {
        FONTS: {
            PRIMARY: string;
        };
        COLORS: {
            WHITE: string;
            DARK_BLUE: string;
            BLUE: string;
            BLACK: string;
            GREEN: string;
            ORANGE: string;
        };
        SPACING: {
            SECTION_INSIDE: string;
            SECTION_MARGIN: string;
        };
    }
}
