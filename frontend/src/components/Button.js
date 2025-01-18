import styled from 'styled-components';

const Button = styled.button`
  padding: ${({ theme }) => theme.spacing(1)} ${({ theme }) => theme.spacing(2)};
  background-color: ${({ theme }) => theme.colors.primary};
  color: #fff;
  border-radius: 4px;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.colors.text};
  }
`;

export default Button;
