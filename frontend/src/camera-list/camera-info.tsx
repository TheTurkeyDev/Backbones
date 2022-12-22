import { Card, CardContent, ContainedButton, Headline3, Input, InputsWrapper, Option, OutlinedButton, Select } from 'gobble-lib-react';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { BackButton } from '../components/back-button';
import { useCamera } from '../hooks/use-camera';
import { OutputType } from './output-type';
import { SourceType } from './source-type';

const BBWrapper = styled.div`
    display: grid;
    grid-template-columns: auto 1fr auto auto auto;
    gap: 8px;
    margin: 8px 16px;
    align-items: center;
    justify-items: center;
`;

const CenteredCard = styled(Card)`
    margin-inline: auto;
    width: fit-content;
    padding: 32px 0;
`;

export const CameraInfo = () => {
    const nav = useNavigate();
    const { id } = useParams();
    const { camera, setCamera, saveCamera, resetCamera, unsavedChanges, startCamera, stopCamera } = useCamera(id ?? '');

    const toggleVideo = () => {
        if (camera)
            camera.running ? stopCamera() : startCamera();
    };

    const save = () => {
        saveCamera(camera).then(() => nav('/'));
    };

    return (
        <div>
            <BBWrapper>
                <BackButton to={'/'} />
                <Headline3>{camera.name}</Headline3>
                <OutlinedButton onClick={toggleVideo}>{camera.running ? 'Stop' : 'Start'}</OutlinedButton>
                <OutlinedButton disabled={!unsavedChanges} onClick={resetCamera}>Reset</OutlinedButton>
                <ContainedButton disabled={!unsavedChanges} onClick={save}>Save</ContainedButton>
            </BBWrapper>
            <CenteredCard>
                <CardContent>
                    {
                        camera ?
                            <InputsWrapper>
                                {
                                    camera.sourceType === SourceType.RTMP ? <Input label='RTMP Url' readOnly={true} value={`rtmp://${camera.ip}:${camera.port}/live/${camera.id}`} /> : <></>
                                }
                                <Input label='Name' value={camera.name} onChange={e => setCamera(c => ({ ...c, name: e.target.value }))} />
                                <Select label='Source Type' value={camera.sourceType} onChange={e => setCamera(c => ({ ...c, sourceType: parseInt(e.target.value) }))}>
                                    <Option key={SourceType.TCP} value={SourceType.TCP}>TCP</Option>
                                    <Option key={SourceType.RTMP} value={SourceType.RTMP}>RTMP</Option>
                                </Select>
                                <Select label='Output Type' value={camera.outputType} onChange={e => setCamera(c => ({ ...c, outputType: parseInt(e.target.value) }))}>
                                    <Option key={OutputType.None} value={OutputType.None}>None</Option>
                                    <Option key={OutputType.File} value={OutputType.File}>File</Option>
                                    <Option key={OutputType.Stream} value={OutputType.Stream}>Stream</Option>
                                    <Option key={OutputType.Both} value={OutputType.Both}>Both</Option>
                                </Select>
                                <Input label='IP' value={camera.ip} onChange={e => setCamera(c => ({ ...c, ip: e.target.value }))} />
                                <Input label='Port' type='number' value={camera.port} onChange={e => setCamera(c => ({ ...c, port: parseInt(e.target.value) }))} />
                                <Input label='Dest Port' type='number' value={camera.destPort} onChange={e => setCamera(c => ({ ...c, destPort: parseInt(e.target.value) }))} />
                                <Input label='File Name' value={camera.fileName} onChange={e => setCamera(c => ({ ...c, fileName: e.target.value }))} />
                            </InputsWrapper>
                            :
                            <></>
                    }
                </CardContent>
            </CenteredCard>
        </div>
    );
};