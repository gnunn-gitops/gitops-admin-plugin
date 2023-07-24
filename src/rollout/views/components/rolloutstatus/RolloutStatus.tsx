import * as React from 'react';
import { RolloutStatusDegradedIcon, RolloutStatusHealthyIcon, RolloutStatusPausedIcon, RolloutStatusProgressingIcon, RolloutStatusUnknownIcon } from '@shared/views/icons/icons';
import { RolloutStatus } from 'src/rollout/utils/rollout-utils';
import { InfoCircleIcon} from '@patternfly/react-icons';
import { Tooltip } from '@patternfly/react-core';

interface RolloutStatusProps {
    status: RolloutStatus;
    message?: string
}

export const RolloutStatusFragment: React.FC<RolloutStatusProps> = ({ status, message }) => {

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
            icon = <RolloutStatusUnknownIcon />;
    }
    return (
        <span style={{ display:'inline-flex', alignItems: 'center' }}>
             {icon} <span style={{paddingLeft: '4px'}}>{status}</span> {status == RolloutStatus.Degraded && message &&
            <Tooltip
                content={message}
            >
                <InfoCircleIcon style={{paddingLeft: '4px'}} size='sm'/>
            </Tooltip>
            }
        </span>
    )
}