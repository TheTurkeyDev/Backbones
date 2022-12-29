import { useEffect, useState } from 'react';
import { GetCamera, SaveCamera, StartCamera, StopCamera } from '../../wailsjs/go/main/App';
import { CameraData } from '../camera-list/camera-data';
import { OutputType } from '../camera-list/output-type';
import { SourceType } from '../camera-list/source-type';
import { CameraStateChangeData } from '../events/camera-state-change-data';
import { randomUID } from '../util/id';

const defaultCamera: CameraData = {
    id: randomUID(),
    sourceType: SourceType.TCP,
    outputType: OutputType.Both,
    name: 'New Camera',
    ip: '',
    port: 0,
    destPort: 0,
    fileName: 'archive',
    running: false
};

export const useCamera = (id: string) => {
    const [camera, setCamera] = useState<CameraData>(defaultCamera);
    const [originalCamera, setOriginalCamera] = useState<CameraData>(defaultCamera);
    const [unsavedChanges, setUnsavedChanges] = useState(false);

    useEffect(() => {
        window.runtime.EventsOn('onCameraStop', (cameraId: string) => {
            if (cameraId === id) {
                setCamera({
                    ...camera,
                    running: false
                });
            }
        });

        GetCamera(id).then(data => {
            setCamera(data);
            setOriginalCamera(data);
        });

        return () => {
            window.runtime.EventsOff('onCameraStop');
        };
    }, [id]);

    const resetCamera = () => {
        setCamera(originalCamera);
        setUnsavedChanges(false);
    };

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

    const updateCamera = (cam: ((prevState: CameraData) => CameraData)): void => {
        setUnsavedChanges(true);
        setCamera(cam);
    };

    return { camera, setCamera: updateCamera, resetCamera, unsavedChanges, saveCamera, startCamera, stopCamera };
};