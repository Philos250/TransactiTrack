import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${({ theme }) => theme.colors.secondary};
  padding: ${({ theme }) => theme.spacing(3)};
  text-align: center;
  font-size: 0.9rem;
`;

const Footer = () => (
  <FooterContainer>
    <p>&copy; {new Date().getFullYear()} TransactiTrack. All Rights Reserved.</p>
  </FooterContainer>
);

export default Footer;
