import { Headline5 } from 'gobble-lib-react';
import { useNavigate } from 'react-router-dom';
import { ClickIcon } from './clickable-icon';


type BackButtonProps = {
    readonly to: string
}
export const BackButton = ({ to }: BackButtonProps) => {
    const nav = useNavigate();

    return (
        <Headline5>
            <ClickIcon className='fa-solid fa-left-long' onClick={() => nav(to)} />
        </Headline5>
    );
};