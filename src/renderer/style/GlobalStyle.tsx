import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    html {
        font-size: 62.5%;
        font-family: ${(props) => props.theme.FONTS.PRIMARY};
        color: ${(props) => props.theme.COLORS.WHITE};
    }

    body {
        margin: 0;
        background-color: ${(props) => props.theme.COLORS.BLUE};
    }
`;
