import * as React from 'react';

import {
    GreenCheckCircleIcon,
    RedExclamationCircleIcon
} from '@openshift-console/dynamic-plugin-sdk';

import { CertificateKind } from '@cert-models/Certificates';
import { CertificateStatus, getStatus } from '../utils/cert-utils';

interface CertStatusProps {
    certificate: CertificateKind
}

const CertStatus: React.FC<CertStatusProps> = ({ certificate:cert }) => {

    let status: CertificateStatus = getStatus(cert);
    let targetIcon: React.ReactNode = status.ready ? <GreenCheckCircleIcon/> : <RedExclamationCircleIcon/>;

    return (
        (
            <span>
                {targetIcon} {status.reason}
            </span>
        )
    );
};

export default CertStatus;
