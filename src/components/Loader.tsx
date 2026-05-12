import styled, { keyframes } from "styled-components";

type LoaderProps = {
  label?: string;
};

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

const Wrap = styled.div`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  color: ${({ theme }) => theme.colors.textMuted};
  font-weight: 650;
`;

const Ring = styled.span`
  width: 30px;
  height: 30px;
  border: 3px solid ${({ theme }) => theme.colors.border};
  border-top-color: ${({ theme }) => theme.colors.text};
  border-radius: 50%;
  animation: ${spin} 800ms linear infinite;
`;

export function Loader({ label }: LoaderProps) {
  return (
    <Wrap role="status" aria-live="polite">
      <Ring aria-hidden="true" />
      {label ? <span>{label}</span> : null}
    </Wrap>
  );
}
