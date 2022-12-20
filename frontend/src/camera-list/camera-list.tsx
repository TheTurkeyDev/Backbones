import { ButtonRow, ContainedButton, OutlinedButton } from 'gobble-lib-react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useCameras } from '../hooks/use-camers';
import { CameraCard } from './camera-card';

const CameraListWrapper = styled.div`
    display: flex;
    gap: 8px;
    margin: 4px 16px;
`;

export const CameraList = () => {
    const nav = useNavigate();
    const cameras = useCameras();

    return (
        <div>
            <h2>Cameras</h2>
            <ButtonRow>
                <ContainedButton onClick={() => nav('/cameras/0')}>
                    <i className='fa-solid fa-plus' />
                </ContainedButton>
            </ButtonRow>
            <CameraListWrapper>
                {
                    cameras.map(cam => <CameraCard key={cam.id} cam={cam} />)
                }
            </CameraListWrapper>
        </div>
    );
};