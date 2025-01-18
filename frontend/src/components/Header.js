import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing(2)};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.h1`
  color: #fff;
  font-size: 1.5rem;
`;

const Nav = styled.nav`
  ul {
    display: flex;
    gap: ${({ theme }) => theme.spacing(2)};
  }

  a {
    color: #fff;
    font-weight: bold;
    transition: color 0.2s;

    &:hover {
      color: ${({ theme }) => theme.colors.secondary};
    }
  }
`;

const Header = () => (
  <HeaderContainer>
    <Logo>TransactiTrack</Logo>
    <Nav>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/transactions">Transactions</a></li>
        <li><a href="/categories">Categories</a></li>
      </ul>
    </Nav>
  </HeaderContainer>
);

export default Header;
