import * as React from 'react';

import {
    GreenCheckCircleIcon,
    RedExclamationCircleIcon
} from '@openshift-console/dynamic-plugin-sdk';

import { ExternalSecretKind } from '@es-models/ExternalSecrets';
import { ExternalSecretStatus, getStatus } from '../utils/es-utils';

interface ESStatusProps {
    externalSecret: ExternalSecretKind
}

const ESStatus: React.FC<ESStatusProps> = ({ externalSecret:es }) => {

    let status: ExternalSecretStatus = getStatus(es);
    let targetIcon: React.ReactNode = status.ready ? <GreenCheckCircleIcon/> : <RedExclamationCircleIcon/>;

    return (
        (
            <span>
                {targetIcon} {status.reason}
            </span>
        )
    );
};

export default ESStatus;
