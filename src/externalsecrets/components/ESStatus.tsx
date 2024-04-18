import * as React from 'react';

import {
    GreenCheckCircleIcon,
    RedExclamationCircleIcon,
    YellowExclamationTriangleIcon
} from '@openshift-console/dynamic-plugin-sdk';

import { ExternalSecretKind } from '@es-models/ExternalSecrets';
import { ExternalSecretStatus, ExternalSecretStatusSeverity, getStatus } from '../utils/es-utils';

interface ESStatusProps {
    externalSecret: ExternalSecretKind
}

const ESStatus: React.FC<ESStatusProps> = ({ externalSecret:es }) => {

    let status: ExternalSecretStatus = getStatus(es);
    let targetIcon: React.ReactNode;
    if (status.severity == ExternalSecretStatusSeverity.ERROR) {
        targetIcon = <RedExclamationCircleIcon/>;
    } else if (status.severity == ExternalSecretStatusSeverity.WARNING) {
        targetIcon = <YellowExclamationTriangleIcon/>
    } else {
        targetIcon = <GreenCheckCircleIcon/>;
    }

    return (
        (
            <span>
                {targetIcon} {status.code}
            </span>
        )
    );
};

export default ESStatus;
