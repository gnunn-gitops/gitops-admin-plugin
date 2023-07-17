import * as React from 'react';
import { RolloutStatusDegradedIcon, RolloutStatusHealthyIcon, RolloutStatusPausedIcon, RolloutStatusProgressingIcon, RolloutStatusUnknownIcon } from '@shared/views/icons/icons';
import { RolloutStatus } from 'src/rollout/utils/rollout-utils';

interface RolloutStatusProps {
    status: RolloutStatus;
}

export const RolloutStatusFragment: React.FC<RolloutStatusProps> = ({ status }) => {

    let icon: React.ReactNode;
    switch (status) {
        case RolloutStatus.Progressing: {
            icon = <RolloutStatusProgressingIcon/>
            break;
        }
        case RolloutStatus.Degraded: {
            icon = <RolloutStatusDegradedIcon/>;
            break;
        }
        case RolloutStatus.Paused: {
            icon = <RolloutStatusPausedIcon/>;
            break;
        }
        case RolloutStatus.Healthy: {
            icon = <RolloutStatusHealthyIcon/>;
            break
        }
        default:
            icon = <RolloutStatusUnknownIcon/>;
    }
    return (
        <span>
            {icon} {status}
        </span>
    )
}