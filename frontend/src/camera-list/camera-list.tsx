import { ButtonRow, ContainedButton, Headline3 } from 'gobble-lib-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCameras } from '../hooks/use-camers';
import { CameraCard } from './camera-card';

const CameraListWrapper = styled.div`
    display: flex;
    gap: 8px;
    margin: 4px 16px;
`;

const TopBar = styled.div`
    display: grid;
    grid-template-columns: 1fr auto;
    justify-items: center;
    align-items: center;
    margin-bottom: 16px;
`;

export const CameraList = () => {
    const nav = useNavigate();
    const cameras = useCameras();

    return (
        <div>
            <TopBar>
                <Headline3>Cameras</Headline3>
                <ContainedButton onClick={() => nav('/cameras/0')}>
                    <i className='fa-solid fa-plus' />
                </ContainedButton>
            </TopBar>
            <CameraListWrapper>
                {
                    cameras.map(cam => <CameraCard key={cam.id} cam={cam} />)
                }
            </CameraListWrapper>
        </div>
    );
};