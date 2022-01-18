import { createGlobalStyle } from "styled-components";

export const lightTheme = {
  body: "#fff",
  color: "#000",
};

export const darkMode = {
  body: "#000",
  color: "#fff",
};

export const GlobalStyles = createGlobalStyle`

	body {

		background-color: ${(props) => props.theme.body};
        color: ${(props) => props.theme.color}
	}

    .title {
        color: ${(props) => props.theme.color}
    }

`;
