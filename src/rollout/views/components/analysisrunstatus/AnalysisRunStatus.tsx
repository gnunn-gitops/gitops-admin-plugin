import { Label } from '@patternfly/react-core';
import { AnalysisRunStatusFailureIcon, AnalysisRunStatusSuccessfulIcon, AnalysisRunStatusUnknownIcon} from '@shared/views/icons/icons';
import * as React from 'react';
import { AnalysisRunInfo, ReplicaSetInfo } from 'src/rollout/utils/ReplicaSetInfo';
import { AnalysisRunStatus } from "src/rollout/utils/rollout-utils";

interface AnalysisRunStatusProps {
    replicaSetInfo: ReplicaSetInfo,
    analysisRunInfo: AnalysisRunInfo
}

export const AnalysisRunStatusFragment: React.FC<AnalysisRunStatusProps> = ({ analysisRunInfo, replicaSetInfo }) => {

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
        <Label variant="outline" icon={icon} color={color}>{analysisRunInfo.shortName}</Label>
    )
}