import { ResourceLink } from '@openshift-console/dynamic-plugin-sdk';
import { DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm, Flex, FlexItem, Label, Popover } from '@patternfly/react-core';
import { Measurement } from '@rollout-model/AnalysisRunModel';
import { AnalysisRunStatusFailureIcon, AnalysisRunStatusPendingIcon, AnalysisRunStatusRunningIcon, AnalysisRunStatusSuccessfulIcon, AnalysisRunStatusUnknownIcon, MeasurementFailedIcon, MeasurementSuccessfulIcon } from '@shared/views/icons/icons';
import * as React from 'react';
import { AnalysisRunInfo, ReplicaSetInfo } from 'src/rollout/utils/ReplicaSetInfo';
import { AnalysisRunStatus } from "src/rollout/utils/rollout-utils";
import { InfoCircleIcon} from '@patternfly/react-icons';

import './AnalysisRunStatus.scss';

interface AnalysisRunStatusProps {
    replicaSetInfo: ReplicaSetInfo,
    analysisRunInfo: AnalysisRunInfo
}

export const AnalysisRunStatusFragment: React.FC<AnalysisRunStatusProps> = ({ analysisRunInfo, replicaSetInfo }) => {

    //const url = getResourceUrl({ model: AnalysisRunModel, name: analysisRunInfo.name, activeNamespace: replicaSetInfo.namespace });
    let color: any;
    let icon: React.ReactNode;
    switch (analysisRunInfo.status) {
        case AnalysisRunStatus.Successful: {
            icon = <AnalysisRunStatusSuccessfulIcon />
            color = "green";
            break;
        }
        case AnalysisRunStatus.Failed, AnalysisRunStatus.Error: {
            icon = <AnalysisRunStatusFailureIcon />;
            color = "red";
            break;
        }
        case AnalysisRunStatus.Inconclusive: {
            icon = <AnalysisRunStatusFailureIcon />;
            color = "orange";
            break;
        }
        case AnalysisRunStatus.Running: {
            icon = <AnalysisRunStatusRunningIcon />;
            color = "blue";
            break;
        }
        case AnalysisRunStatus.Pending: {
            icon = <AnalysisRunStatusPendingIcon />;
            color = "blue";
            break;
        }
        default:
            icon = <AnalysisRunStatusUnknownIcon />;
            color = "grey";
    }
    return (
        <Popover
            headerContent={<ResourceLink groupVersionKind={{ version: "v1alpha1", group: "argoproj.io", kind: "AnalysisRun" }} name={analysisRunInfo.name} namespace={replicaSetInfo.namespace} />}
            bodyContent={<Metrics arInfo={analysisRunInfo}/>}
            minWidth={"25.25rem"}
        >
            <Label variant="outline" href="javascript:void(0);" icon={icon} color={color}>{analysisRunInfo.shortName}</Label>
        </Popover>
    )
}

type MetricsProps = {
    arInfo: AnalysisRunInfo;
}

const Metrics: React.FC<MetricsProps> = ({ arInfo }) => {

    if (!arInfo.analysisRun) {
        return (<div>No AnalysisRun Found</div>)
    }
    return (
        <DescriptionList>
        {arInfo.analysisRun?.status?.metricResults?.map(function (mr, index) {
        return (
            <DescriptionListGroup>
                <DescriptionListTerm><span style={{ display:'inline-flex', alignItems: 'center' }}>{mr.name}  <InfoCircleIcon style={{paddingLeft: '4px'}} size='sm'/></span></DescriptionListTerm>
                <DescriptionListDescription>
                    <Flex>
                        {mr.measurements?.map(function (m, index) {
                            return (
                                <FlexItem>
                                    <Measurement measurement={m}/>
                                </FlexItem>
                            )
                        })}
                    </Flex>
                </DescriptionListDescription>
            </DescriptionListGroup>
            )
        })}
        </DescriptionList>
    );
}

type MeasurementProps = {
    measurement: Measurement;
}

const Measurement: React.FC<MeasurementProps> = ({ measurement }) => {

    let icon;
    switch (measurement.phase) {
        case AnalysisRunStatus.Successful: {
            icon = <MeasurementSuccessfulIcon/>
            break;
        }
        case AnalysisRunStatus.Failed, AnalysisRunStatus.Error: {
            icon = <MeasurementFailedIcon/>
            break;
        }
        case AnalysisRunStatus.Running: {
            icon = <AnalysisRunStatusRunningIcon/>
            break;
        }
        case AnalysisRunStatus.Pending: {
            icon = <AnalysisRunStatusPendingIcon/>
            break;
        }
        default: {
            icon = <AnalysisRunStatusUnknownIcon/>
        }
    }

    return (
        icon
    )
}
