import styled from "styled-components";

export const DropdownWrapper = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: flex-start;
`;

export const StyledSelect = styled.select`
  background-color: transparent;
  font-weight: 600;
  height: 100%;
  margin-bottom: 1rem;
  max-width: 100%;
  padding: 2px;
  width: 100%;
`;

export const StyledOption = styled.option`
  color: ${(props) => (props.selected ? "lightgrey" : "black")};
`;