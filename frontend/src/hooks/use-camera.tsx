import { useEffect, useState } from 'react';
import { GetCamera, SaveCamera, StartCamera, StopCamera } from '../../wailsjs/go/main/App';
import { CameraData } from '../camera-list/camera-data';

export const useCamera = (id: string) => {
    const [camera, setCamera] = useState<CameraData>();

    useEffect(() => {
        GetCamera(id).then(setCamera);
    }, [id]);

    const saveCamera = async (data: CameraData) => {
        await SaveCamera(data).then(setCamera);
    };

    const startCamera = async () => {
        if (!camera)
            return Promise.resolve(false);
        return StartCamera(id).then(started => {
            if (started)
                setCamera({ ...camera, running: true });
            return started;
        });
    };
    const stopCamera = async () => {
        if (!camera)
            return Promise.resolve(false);
        return StopCamera(id).then(stopped => {
            if (stopped)
                setCamera({ ...camera, running: false });
            return stopped;
        });
    };

    return { camera, saveCamera, startCamera, stopCamera };
};