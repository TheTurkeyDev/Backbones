import { useEffect, useState } from 'react';
import { GetCameras } from '../../wailsjs/go/main/App';
import { CameraData } from '../camera-list/camera-data';

export const useCameras = () => {
    const [cameras, setCameras] = useState<readonly CameraData[]>([]);

    useEffect(() => {
        GetCameras().then(setCameras);
    }, []);

    useEffect(() => {
        window.runtime.EventsOn('onCameraStop', (cameraId: string) => {
            const cam = cameras.findIndex(c => c.id === cameraId);
            if (cam === -1)
                return;

            setCameras([
                ...cameras.slice(0, cam),
                {
                    ...cameras[cam],
                    running: false
                },
                ...cameras.slice(cam + 1),
            ]);
        });

        return () => {
            window.runtime.EventsOff('onCameraStop');
        };
    }, [cameras]);

    return cameras;
};