import * as React from 'react';

import {
    GreenCheckCircleIcon,
    RedExclamationCircleIcon,
    YellowExclamationTriangleIcon
} from '@openshift-console/dynamic-plugin-sdk';

import { SyncUnknownIcon } from '@utils/components/Icons/Icons';
import { ExternalSecretKind } from '@es-models/ExternalSecrets';
import { ConditionReason } from '../utils/es-utils';

interface ESStatusProps {
    externalSecret: ExternalSecretKind
}

const ESStatus: React.FC<ESStatusProps> = ({ externalSecret:es }) => {

    let targetIcon: React.ReactNode = <SyncUnknownIcon />;
    let status: string = "Unknown"
    if (es.status?.conditions) {
        es.status.conditions.forEach((condition) => {
            console.log(condition.reason)
            switch (condition.reason) {
                case ConditionReason.ConditionReasonSecretSynced:
                    if (condition.status == "True") {
                        targetIcon = <GreenCheckCircleIcon/>;
                        status = "Synced"
                    } else {
                        targetIcon = <RedExclamationCircleIcon/>;
                        status = "Not Synced"
                    }
                    break;
                case (ConditionReason.ConditionReasonSecretSyncedError):
                    targetIcon = <RedExclamationCircleIcon/>
                    status = "Sync Error"
                    break;
                case (ConditionReason.ConditionReasonSecretDeleted):
                    targetIcon = <YellowExclamationTriangleIcon/>
                    status = "Secret Deleted"
                    break;
                case (ConditionReason.ReasonInvalidStoreRef):
                    targetIcon = <RedExclamationCircleIcon/>
                    status = "Invalid Secret Store"
                    break;
                case (ConditionReason.ReasonUpdateFailed):
                    targetIcon = <RedExclamationCircleIcon/>
                    status = "Update Failed"
                    break;
                case (ConditionReason.ReasonUpdated):
                    targetIcon = <GreenCheckCircleIcon/>
                    status = "Synched"
                case (ConditionReason.ReasonProviderClientConfig):
                    targetIcon = <RedExclamationCircleIcon/>
                    status = "Invalid Provider Config"
                    break;
            }
        })
    }

    return (
        (
            <span>
                {(status ? targetIcon : "")} {status}
            </span>
        )
    );
};

export default ESStatus;
