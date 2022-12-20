import { Body1, Card, CardContent, CardHeader, Elevation, Headline6, SpaceBetween } from 'gobble-lib-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
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
const CardContentWrapper = styled(CardContent)`
    display: grid;
    grid-template-columns: 1fr;
`;

const InfoLine = styled.div`
    display: grid;
    grid-template-columns: auto auto;
    gap: 8px;
    align-items: center;
    width: fit-content;
    margin: auto;
`;

type CameraCardProps = {
    readonly cam: CameraData
}

export const CameraCard = ({ cam }: CameraCardProps) => {
    const nav = useNavigate();
    return (
        <CustomCard onClick={() => nav(`/cameras/${cam.id}`)} running={cam.running}>
            <CardHeader>
                <i className='fa-solid fa-camera' />
            </CardHeader>
            <CardContentWrapper>
                <Headline6>{cam.name}</Headline6>
                <SpaceBetween>
                    <Body1>Source:</Body1>
                    <Body1>{SourceType[cam.sourceType]}</Body1>
                    <Body1>Address:</Body1>
                    <Body1>{cam.ip}:{cam.port}</Body1>
                    <Body1>Output:</Body1>
                    <Body1>{OutputType[cam.outputType]}</Body1>
                    <Body1>File Name:</Body1>
                    <Body1>{cam.fileName}</Body1>
                </SpaceBetween>
            </CardContentWrapper>
        </CustomCard >
    );
};