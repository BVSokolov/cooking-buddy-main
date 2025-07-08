import styled from "styled-components";

type StyledTextProps = {
  fontSize?: string;
  fontWeight?: string;
};
const StyledText = styled.div<StyledTextProps>`
  display: flex;
  font-size: ${({ fontSize }) => fontSize || "14px"};
  font-weight: ${({ fontWeight }) => fontWeight || "400"};
`;
export const Text = ({
  text,
  fontSize,
  fontWeight,
}: {
  text: string;
  fontSize?: string;
  fontWeight?: string;
}) => (
  <StyledText fontSize={fontSize} fontWeight={fontWeight}>
    {text}
  </StyledText>
);
