import * as React from 'react';
import { ResourceLink, RowProps, TableColumn, TableData, VirtualizedTable, useK8sModel, useK8sWatchResource } from "@openshift-console/dynamic-plugin-sdk"
import { sortable } from '@patternfly/react-table';
import { ImageInfo, ReplicaSetInfo, ReplicaSetStatus, getReplicaSetInfo } from 'src/rollout/utils/ReplicaSetInfo';
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

interface RevisionsProps {
    rollout: RolloutKind
}

export const Revisions: React.FC<RevisionsProps> = ({ rollout}) => {

    const [replicaSetInfo, setReplicaSetInfo] = React.useState<ReplicaSetInfo[]>([]);

    const [replicaSets, loaded] = useK8sWatchResource({
        groupVersionKind: { group: 'apps', version: 'v1', kind: 'ReplicaSet' },
        isList: true,
        namespaced: true,
        namespace: rollout.metadata?.namespace,
        selector: rollout.spec.selector
      });


   React.useEffect(() => {
        if (loaded) {
            getReplicaSetInfo(rollout, resourceAsArray(replicaSets)).then((result) => {
                setReplicaSetInfo(result);
            });
        } else {
            setReplicaSetInfo([]);
        }
    }, [rollout, replicaSets]);

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
                sort: 'revision',
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
                transforms: [sortable],
                sort: 'analysisRuns',
            },
            {
                title: 'Pods',
                id: 'pods',
                transforms: [sortable],
                sort: 'pods',
                props: { className: 'gitops-admin-plugin__pods-column' }
            },
            {
                title: 'Status',
                id: 'status',
                transforms: [sortable],
                sort: 'status'
            },
            {
                title: 'Images',
                id: 'images',
                transforms: [sortable],
                sort: 'images'
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
