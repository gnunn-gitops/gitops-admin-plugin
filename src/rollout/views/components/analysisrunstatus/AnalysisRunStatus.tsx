import { getResourceUrl } from '@gitops-utils/utils';
import { Label } from '@patternfly/react-core';
import { AnalysisRunModel } from '@rollout-model/AnalysisRunModel';
import { AnalysisRunStatusFailureIcon, AnalysisRunStatusSuccessfulIcon, AnalysisRunStatusUnknownIcon} from '@shared/views/icons/icons';
import * as React from 'react';
import { AnalysisRunInfo, ReplicaSetInfo } from 'src/rollout/utils/ReplicaSetInfo';
import { AnalysisRunStatus } from "src/rollout/utils/rollout-utils";

interface AnalysisRunStatusProps {
    replicaSetInfo: ReplicaSetInfo,
    analysisRunInfo: AnalysisRunInfo
}

export const AnalysisRunStatusFragment: React.FC<AnalysisRunStatusProps> = ({ analysisRunInfo, replicaSetInfo }) => {

    const url = getResourceUrl({ model: AnalysisRunModel, name: analysisRunInfo.name, activeNamespace: replicaSetInfo.namespace });
    let color: any;
    let icon: React.ReactNode;
    switch (analysisRunInfo.status) {
        case AnalysisRunStatus.Successful: {
            icon = <AnalysisRunStatusSuccessfulIcon/>
            color = "green";
            break;
        }
        case AnalysisRunStatus.Failed, AnalysisRunStatus.Error: {
            icon = <AnalysisRunStatusFailureIcon/>;
            color = "red";
            break;
        }
        case AnalysisRunStatus.Inconclusive: {
            icon = <AnalysisRunStatusFailureIcon/>;
            color = "orange";
            break;
        }
        default:
            icon = <AnalysisRunStatusUnknownIcon/>;
            color = "grey";
    }
    return (
        <Label variant="outline" href={url} icon={icon} color={color}>{analysisRunInfo.shortName}</Label>
    )
}