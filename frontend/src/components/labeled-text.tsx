import { Body1, Headline6 } from 'gobble-lib-react';
import styled from 'styled-components';

const VLTWrapper = styled.div`
    display: grid;
    grid-template-columns: 1fr;
    justify-items: center;
`;

type VerticalLabeledTextProps = {
    readonly label: string
    readonly text: string
}

export const VerticalLabeledText = ({ label, text }: VerticalLabeledTextProps) => (
    <VLTWrapper>
        <Headline6>{label}</Headline6>
        <Body1>{text}</Body1>
    </VLTWrapper>
);