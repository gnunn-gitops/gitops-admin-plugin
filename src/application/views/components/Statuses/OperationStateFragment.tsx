// Adapted from Argo CD UI code here:

import { ApplicationKind, OperationState } from "@application-model";
import { PhaseStatus } from "@gitops-utils/constants";
import React from "react";
import { PhaseErrorIcon, PhaseFailedIcon, PhaseRunningIcon, PhaseSucceededIcon, PhaseTerminatingIcon } from "../../../../shared/views/icons/icons";

interface OperationStateProps {
    app: ApplicationKind;
    quiet?: boolean;
}

// Adapted from Argo CD UI code here:
// https://github.com/argoproj/argo-cd/blob/master/ui/src/app/applications/components/utils.tsx
export const OperationStateFragment: React.FC<OperationStateProps> = ({ app, quiet }) => {

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

// https://github.com/argoproj/argo-cd/blob/master/ui/src/app/applications/components/utils.tsx
export const getAppOperationState = (app: ApplicationKind): OperationState => {
    if (!app.status || !app.status.operationState) return undefined;

    if (app.metadata.deletionTimestamp) {
        return {
            phase: PhaseStatus.RUNNING,
            startedAt: app.metadata.deletionTimestamp
        } as OperationState;
    } else {
        return app.status.operationState;
    }
}

// Adapted from Argo CD UI code here:
// https://github.com/argoproj/argo-cd/blob/master/ui/src/app/applications/components/utils.tsx
export function getOperationType(application: ApplicationKind) {
    const operation = application.status?.operationState?.operation;
    if (application.metadata.deletionTimestamp && !operation) {
        return 'Delete';
    }
    if (operation && operation.sync) {
        return 'Sync';
    }
    return 'Unknown';
}

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