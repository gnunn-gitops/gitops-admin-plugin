import * as React from 'react';
import { K8sResourceCommon, ResourceLink, RowProps, Selector, TableColumn, TableData, VirtualizedTable, useK8sModel, useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk"
import { SortByDirection, sortable } from '@patternfly/react-table';
import { ImageInfo, ReplicaSetInfo, ReplicaSetStatus, getAnalysisRunSelector, getReplicaSetInfo } from 'src/rollout/utils/ReplicaSetInfo';
import { RolloutKind } from '@rollout-model/RolloutModel';
import { Label, LabelGroup, Tooltip } from '@patternfly/react-core';
import ArrowCircleUpIcon from '@patternfly/react-icons/dist/esm/icons/arrow-circle-up-icon';
import { RunningIcon } from '@patternfly/react-icons/dist/esm/icons/running-icon';
import { EyeIcon } from '@patternfly/react-icons/dist/esm/icons/eye-icon';
import { MigrationIcon } from '@patternfly/react-icons/dist/esm/icons/migration-icon';
import { CubeIcon } from '@patternfly/react-icons/dist/esm/icons/cube-icon';

import { AnalysisRunStatusFragment } from '../analysisrunstatus/AnalysisRunStatus';
import { RevisionsRowActions } from './RevisionsRowActions';
import { getResourceUrl, resourceAsArray } from '@gitops-utils/utils';
import { Link } from 'react-router-dom';

import './Revisions.scss';
import { AnalysisRunKind } from '@rollout-model/AnalysisRunModel';

interface RevisionsProps {
    rollout: RolloutKind
    replicaSets: K8sResourceCommon[]
}

export const Revisions: React.FC<RevisionsProps> = ({ rollout, replicaSets}) => {
    const [replicaSetInfo, setReplicaSetInfo] = React.useState<ReplicaSetInfo[]>([]);

    const selector:Selector = React.useMemo(() => getAnalysisRunSelector(resourceAsArray(replicaSets)),[replicaSets]);

    const [analysisRuns, arLoaded] = useK8sWatchResource({
        groupVersionKind: { group: 'argoproj.io', version: 'v1alpha1', kind: 'AnalysisRun' },
        isList: true,
        namespaced: true,
        namespace: rollout.metadata?.namespace,
        selector: selector
    });

    React.useEffect(() => {
        if (arLoaded) {
            getReplicaSetInfo(rollout, resourceAsArray(replicaSets), resourceAsArray(analysisRuns) as AnalysisRunKind[]).then((result) => {
                setReplicaSetInfo(result);
            });
        } else {
            setReplicaSetInfo([]);
        }
    }, [rollout, replicaSets, analysisRuns]);

    return (
        <>
        <VirtualizedTable
            data={replicaSetInfo}
            unfilteredData={replicaSetInfo}
            loaded={true}
            loadError={null}
            columns={useReplicaSetInfoColumns()}
            Row={replicaSetInfoListRow}
            rowData={{ rollout: rollout}}
        />
        </>
    )
}

const replicaSetInfoListRow: React.FC<RowProps<ReplicaSetInfo, {rollout: RolloutKind}>> = ({ obj, activeColumnIDs, rowData: {rollout} }) => {
    const [rsModel] = useK8sModel({group: "apps", version: "v1", kind: "ReplicaSet"});

    return (
        <>
            <TableData id="revision" activeColumnIDs={activeColumnIDs} className="gitops-admin-plugin__revision-column">
                {obj.revision}
            </TableData>
            <TableData id="name" activeColumnIDs={activeColumnIDs}>
                {obj.name ?
                    <ResourceLink name={obj.name} namespace={obj.namespace} kind='ReplicaSet'/>
                :
                  "None"
                }
            </TableData>
            <TableData id="analysisruns" activeColumnIDs={activeColumnIDs}>
                {getAnalysisRuns(obj)}
            </TableData>
            <TableData id="pods" activeColumnIDs={activeColumnIDs} className="gitops-admin-plugin__pods-column">
                {obj.pods ?
                    <Link to={getResourceUrl({model: rsModel, resource: obj.replicaSet}) + "/pods"}>
                      {obj.pods.readyReplicas ? obj.pods.readyReplicas + " of " + obj.pods.replicas: "-"}
                    </Link>
                :
                    "-"
                }
            </TableData>
            <TableData id="status" activeColumnIDs={activeColumnIDs}>
                {getStatusSection(obj.statuses)}
            </TableData>
            <TableData id="images" activeColumnIDs={activeColumnIDs}>
                {getImages(obj.images)}
            </TableData>
            <TableData
                id="actions"
                activeColumnIDs={activeColumnIDs}
                className="dropdown-kebab-pf pf-c-table__action"
            >
                <RevisionsRowActions rollout={rollout} rsInfo={obj} />
            </TableData>
        </>
    );
};

export const useReplicaSetInfoColumns = () => {

    const columns: TableColumn<ReplicaSetInfo>[] = React.useMemo(
        () => [
            {
                title: 'Revision',
                id: 'revision',
                transforms: [sortable],
                // Hack to get newer revisions to be shown first until VirtualizedTable gets option to specify default sort order
                sort: (data, direction) => data.sort((r1, r2) => direction==SortByDirection.asc? (r2.revision - r1.revision) : (r1.revision - r2.revision)),
                props: { className: 'gitops-admin-plugin__revision-column' }
            },
            {
                title: 'Name',
                id: 'name',
                transforms: [sortable],
                sort: 'name'
            },
            {
                title: 'Analysis Runs',
                id: 'analysisruns',
                transforms: []
            },
            {
                title: 'Pods',
                id: 'pods',
                transforms: [sortable],
                sort: (data, direction) => data.sort((r1, r2) => direction==SortByDirection.desc? (r2.pods.readyReplicas - r1.pods.readyReplicas) : (r1.pods.readyReplicas - r2.pods.readyReplicas)),
                props: { className: 'gitops-admin-plugin__pods-column' }
            },
            {
                title: 'Status',
                id: 'status',
                transforms: [sortable],
                sort: (data, direction) => data.sort((r1, r2) => direction==SortByDirection.desc? (r2.statuses.length - r1.statuses.length) : (r1.statuses.length - r2.statuses.length)),
            },
            {
                title: 'Images',
                id: 'images',
                transforms: []
            },
            {
              title: '',
              id: 'actions',
              props: { className: 'dropdown-kebab-pf pf-c-table__action' },
            }
        ],
        [],
    );

    return columns;
};

const getImages = (images: ImageInfo[]) => {
    return (
        <LabelGroup>
        {images.map(function(image, index){
            return <Tooltip content={image.image}><Label variant="outline" icon={<CubeIcon/>}>{image.name}</Label></Tooltip>;
          })}
        </LabelGroup>
    )
}

const getAnalysisRuns = (rsInfo: ReplicaSetInfo) => {

    return (
        <LabelGroup>
            {rsInfo.analysisRuns.map(function(ar, index){
                return <AnalysisRunStatusFragment replicaSetInfo={rsInfo} analysisRunInfo={ar} />
            })}
        </LabelGroup>
    )
}

const getStatusSection = (statuses: ReplicaSetStatus[]) => {
    return (
        <LabelGroup>
            {statuses.includes(ReplicaSetStatus.Stable) &&
                <Label variant="outline" color="blue" icon={<ArrowCircleUpIcon/>}>Stable</Label>
            }
            {statuses.includes(ReplicaSetStatus.Active) &&
                <Label variant="outline" color="blue" icon={<RunningIcon/>} >Active</Label>
            }
            {statuses.includes(ReplicaSetStatus.Preview) &&
                <Label variant="outline" icon={<EyeIcon/>}>Preview</Label>
            }
            {statuses.includes(ReplicaSetStatus.Canary) &&
                <Label variant="outline" color="gold" icon={<MigrationIcon/>}>Canary</Label>
            }
        </LabelGroup>
    )
}
