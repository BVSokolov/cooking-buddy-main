import styled from 'styled-components'

const StyledButton = styled.button`
  align-items: center;
  background-color: #fff;
  border-radius: 8px;
  border: 1px solid #02b06a;
  padding: 4px 8px;
  color: #000;

  :hover {
    background-color: #02b06a;
  }

  :click {
    border: 1px solid #027d4c;
    background-color: #027d4c;
    color: #fff;
  }
`

type ButtonProps = {
  onClick: (e: React.MouseEvent<HTMLElement>) => void
  children?: React.ReactNode | undefined
}

export const Button = ({onClick, children}: ButtonProps) => {
  return <StyledButton onClick={onClick}>{children}</StyledButton>
}
