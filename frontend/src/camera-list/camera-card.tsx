import { Body1, Card, CardContent, CardHeader, Elevation, Headline6, Headline4 } from 'gobble-lib-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { VerticalLabeledText } from '../components/labeled-text';
import { CameraData } from './camera-data';
import { OutputType } from './output-type';
import { SourceType } from './source-type';

type CustomCardProps = {
    readonly running: boolean
}
const CustomCard = styled(Card) <CustomCardProps>`
    border: ${({ running }) => running ? '1px solid yellow' : ''};
    &:hover{    
        cursor: pointer;
        box-shadow: ${Elevation.high};
        opacity: 90%;
    }
`;

const CardHeaderWrapper = styled(CardHeader)`
    display: grid;
    grid-template-columns: 50px minmax(max-content, 1fr) minmax(auto, 50px);
    gap: 8px;
    align-items: center;
    justify-items: center;
`;

const CardContentWrapper = styled(CardContent)`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    align-items: center;
`;

const Icon = styled.i`
    font-size: 32px;
`;

type CameraCardProps = {
    readonly cam: CameraData
}

export const CameraCard = ({ cam }: CameraCardProps) => {
    const nav = useNavigate();
    return (
        <CustomCard onClick={() => nav(`/cameras/${cam.id}`)} running={cam.running}>
            <CardHeaderWrapper>
                <Icon className='fa-solid fa-camera' />
                <Headline4>{cam.name}</Headline4>
            </CardHeaderWrapper>
            <CardContentWrapper>
                <VerticalLabeledText label='Source' text={SourceType[cam.sourceType]} />
                <VerticalLabeledText label='Address' text={`${cam.ip}:${cam.port}`} />
                <VerticalLabeledText label='Output' text={OutputType[cam.outputType]} />
                <VerticalLabeledText label='File Name' text={cam.fileName} />
            </CardContentWrapper>
        </CustomCard >
    );
};