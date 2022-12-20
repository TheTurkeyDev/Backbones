import { Route, Routes } from 'react-router-dom';
import { CameraInfo } from './camera-list/camera-info';
import { CameraList } from './camera-list/camera-list';

export const Routing = () => (
    <Routes>
        <Route path='/' element={<CameraList />} />
        <Route path='/cameras/:id' element={<CameraInfo />} />
    </Routes>
);