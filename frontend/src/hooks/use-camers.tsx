import { useEffect, useState } from 'react';
import { GetCameras } from '../../wailsjs/go/main/App';
import { CameraData } from '../camera-list/camera-data';

export const useCameras = () => {
    const [cameras, setCameras] = useState<readonly CameraData[]>([]);

    useEffect(() => {
        GetCameras().then(setCameras);
    }, []);

    return cameras;
};