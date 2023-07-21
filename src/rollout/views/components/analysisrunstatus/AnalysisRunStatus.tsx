import { ResourceLink, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import { DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTerm, Flex, FlexItem, Label, Popover, Tooltip } from '@patternfly/react-core';
import { AnalysisRunKind, Measurement, Metric, MetricResult } from '@rollout-model/AnalysisRunModel';
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
        <>
        <DescriptionList isHorizontal isCompact className='gitops_admin_plugin__tight_description_list'>
            <DescriptionListGroup>
                <DescriptionListTerm>Started At:</DescriptionListTerm>
                <DescriptionListDescription><Timestamp simple timestamp={arInfo.startedAt}/></DescriptionListDescription>
            </DescriptionListGroup>
            <DescriptionListGroup>
                <DescriptionListTerm>Status:</DescriptionListTerm>
                <DescriptionListDescription>{arInfo.status}</DescriptionListDescription>
            </DescriptionListGroup>
        </DescriptionList>
        <br/>

        <DescriptionList isCompact>
        {arInfo.analysisRun?.status?.metricResults?.map(function (mr, index) {
        return (
            <DescriptionListGroup>
                <DescriptionListTerm>
                    <span style={{ display:'inline-flex', alignItems: 'center' }}>
                        {mr.name}
                        <Tooltip
                            content={getMetricTooltip(arInfo, mr)}
                        >
                            <InfoCircleIcon style={{paddingLeft: '4px'}} size='sm'/>
                        </Tooltip>
                    </span>
                </DescriptionListTerm>
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
        </>
    );
}

function getMetric(ar: AnalysisRunKind, name: string): Metric {
    var result:Metric = undefined;
    ar.spec.metrics?.forEach((metric) => {
        if (metric.name == name) {
            result = metric;
        }
    });
    return result;
}

function getMetricTooltip(arInfo: AnalysisRunInfo, mr: MetricResult) {
    const metric: Metric = getMetric(arInfo.analysisRun, mr.name);
    return (
        <table style={{borderSpacing: "8px 4px", borderCollapse: "separate"}}>
            <tr><th>Metric Name: </th><td>{mr.name}</td></tr>
            <tr><th>Provider: </th><td>{Object.keys(metric.provider)[0]}</td></tr>
            <tr><th>Status: </th><td>{mr.phase}</td></tr>
            {metric && metric.successCondition &&
                <tr><th>SuccessCondition: </th><td>{metric.successCondition}</td></tr>
            }
            {metric && metric.count &&
                <tr><th>Count: </th><td>{metric.count}</td></tr>
            }
        </table>
    )
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
        <Tooltip  content={getMeasurementTooltip(measurement)}>
            {icon}
        </Tooltip>
    )
}

function getMeasurementTooltip(measurement: Measurement) {
    return (
        <table style={{borderSpacing: "8px 4px", borderCollapse: "separate"}}>
            <tr><th>Status: </th><td>{measurement.phase}</td></tr>
            {measurement.message &&
                <tr><th>Message: </th><td>{measurement.message}</td></tr>
            }
            {measurement.metadata && measurement.metadata["job-name"] &&
                <tr><th style={{whiteSpace:"nowrap"}}>Job Name: </th><td>{measurement.metadata["job-name"]}</td></tr>
            }
            <tr><th style={{whiteSpace:"nowrap"}}>Started At: </th><td><Timestamp simple timestamp={measurement.startedAt}/></td></tr>
            <tr><th style={{whiteSpace:"nowrap"}}>Finished At: </th><td><Timestamp simple timestamp={measurement.startedAt}/></td></tr>
            {measurement.value &&
                <tr><th>Value: </th><td><pre>{JSON.stringify(JSON.parse(measurement.value),null,2)}</pre></td></tr>
            }
        </table>
    )
}
