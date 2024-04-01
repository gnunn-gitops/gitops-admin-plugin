// Adapted from Argo CD UI code here:

import { ApplicationKind } from "@gitops-models/ApplicationModel";
import { PhaseStatus } from "src/gitops/utils/constants";
import * as React from "react";
import { PhaseErrorIcon, PhaseFailedIcon, PhaseRunningIcon, PhaseSucceededIcon, PhaseTerminatingIcon } from "@gitops-shared/Icons";
import { getAppOperationState, getOperationType } from "@gitops-utils/gitops";

interface OperationStateProps {
    app: ApplicationKind;
    quiet?: boolean;
}

// Adapted from Argo CD UI code here:
// https://github.com/argoproj/argo-cd/blob/master/ui/src/app/applications/components/utils.tsx
export const OperationState: React.FC<OperationStateProps> = ({ app, quiet }) => {

    const appOperationState = getAppOperationState(app);
    if (appOperationState === undefined) {
        return <React.Fragment />;
    }
    if (quiet && [PhaseStatus.RUNNING, PhaseStatus.FAILED, PhaseStatus.ERROR].indexOf(appOperationState.phase) === -1) {
        return <React.Fragment />;
    }

    let targetIcon: React.ReactNode;
    const phase = appOperationState == undefined ? PhaseStatus.RUNNING: appOperationState.phase;
    switch (phase) {
        case PhaseStatus.FAILED:
            targetIcon = <PhaseFailedIcon />;
            break;
        case PhaseStatus.ERROR:
            targetIcon = <PhaseErrorIcon />;
            break;
        case PhaseStatus.RUNNING:
            targetIcon = <PhaseRunningIcon />;
            break;
        case PhaseStatus.SUCCEEDED:
            targetIcon = <PhaseSucceededIcon />;
            break;
        case PhaseStatus.TERMINATING:
            targetIcon = <PhaseTerminatingIcon />;
            break;
        default:
            targetIcon = <PhaseSucceededIcon />;
    }

    return (
        <React.Fragment>
            {targetIcon} {getOperationStateTitle(app)}
        </React.Fragment>
    );
};

// Adapted from Argo CD UI code here:
// https://github.com/argoproj/argo-cd/blob/master/ui/src/app/applications/components/utils.tsx
const getOperationStateTitle = (app: ApplicationKind) => {
    if (!app.status && !app.status.operationState) {
        return 'Unknown';
    }

    const operationState = getAppOperationState(app);
    const operationType = getOperationType(app);
    switch (operationType) {
        case 'Delete':
            return 'Deleting';
        case 'Sync':
            if (operationState != undefined) {
                switch (operationState.phase) {
                    case PhaseStatus.RUNNING:
                        return 'Syncing';
                    case PhaseStatus.ERROR:
                        return 'Sync error';
                    case PhaseStatus.FAILED:
                        return 'Sync failed';
                    case PhaseStatus.SUCCEEDED:
                        return 'Sync OK';
                    case PhaseStatus.TERMINATING:
                        return 'Terminated';
                }
            }
    }
    return 'Unknown';
};
