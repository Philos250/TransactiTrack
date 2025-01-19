import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  padding: ${({ theme }) => theme.spacing(2)};
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Logo = styled.h1`
  color: #fff;
  font-size: 2rem;
`;

const Nav = styled.nav`
  ul {
    display: flex;
    gap: ${({ theme }) => theme.spacing(2)};

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: center;
    }
  }

  a {
    color: #fff;
    font-size: 1rem;
    padding: ${({ theme }) => theme.spacing(0.5)} ${({ theme }) => theme.spacing(1)};
    border-radius: 4px;

    &:hover {
      background-color: ${({ theme }) => theme.colors.secondary};
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
