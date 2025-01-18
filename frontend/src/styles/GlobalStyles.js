import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Arial', sans-serif;
    background-color: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
  }

  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.link};
  }

  ul {
    list-style: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
  }
`;

export default GlobalStyles;