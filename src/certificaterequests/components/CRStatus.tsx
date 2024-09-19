import * as React from 'react';

import {
    GreenCheckCircleIcon,
    RedExclamationCircleIcon
} from '@openshift-console/dynamic-plugin-sdk';

import { CertificateRequestKind } from '@cr-models/CertificateRequests';
import { CertificateRequestStatus, getStatus } from '../utils/cr-utils';

interface CRStatusProps {
    certificateRequest: CertificateRequestKind
}

const CRStatus: React.FC<CRStatusProps> = ({ certificateRequest:cr }) => {

    let status: CertificateRequestStatus = getStatus(cr);
    let targetIcon: React.ReactNode = status.ready ? <GreenCheckCircleIcon/> : <RedExclamationCircleIcon/>;

    return (
        (
            <span>
                {targetIcon} {status.reason}
            </span>
        )
    );
};

export default CRStatus;
