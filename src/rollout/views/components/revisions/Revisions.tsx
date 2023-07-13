import * as React from 'react';
import { K8sResourceCommon, ResourceLink, RowProps, TableColumn, TableData, VirtualizedTable } from "@openshift-console/dynamic-plugin-sdk"
import { sortable } from '@patternfly/react-table';
import { ImageInfo, ReplicaSetInfo, ReplicaSetStatus, getReplicaSetInfo } from 'src/rollout/utils/ReplicaSetInfo';
import { RolloutKind } from '@rollout-model/RolloutModel';
import { DescriptionList, DescriptionListGroup, DescriptionListTerm, DescriptionListDescription, Label, LabelGroup } from '@patternfly/react-core';
import ArrowCircleUpIcon from '@patternfly/react-icons/dist/esm/icons/arrow-circle-up-icon';
import { RunningIcon } from '@patternfly/react-icons/dist/esm/icons/running-icon';
import { EyeIcon } from '@patternfly/react-icons/dist/esm/icons/eye-icon';
import { MigrationIcon } from '@patternfly/react-icons/dist/esm/icons/migration-icon';

import './Revision.scss';

interface RevisionsProps {
    rollout: RolloutKind,
    replicaSets: K8sResourceCommon | K8sResourceCommon[]
}

export const Revisions: React.FC<RevisionsProps> = ({ rollout, replicaSets }) => {

    const replicaSetInfo:ReplicaSetInfo[] = React.useMemo(() => getReplicaSetInfo(rollout, Array.isArray(replicaSets)?replicaSets:[replicaSets]), [replicaSets]).sort((a,b) => b.revision - a.revision);

    return (
        <VirtualizedTable
            data={replicaSetInfo}
            unfilteredData={replicaSetInfo}
            loaded={true}
            loadError={null}
            columns={useReplicaSetInfoColumns()}
            Row={replicaSetInfoListRow}
        />
    )
}

const replicaSetInfoListRow: React.FC<RowProps<ReplicaSetInfo>> = ({ obj, activeColumnIDs }) => {

    return (
        <>
            <TableData id="revision" activeColumnIDs={activeColumnIDs} className="gitops-admin-plugin__revision-column">
                {obj.revision}
            </TableData>
            <TableData id="name" activeColumnIDs={activeColumnIDs}>
                <ResourceLink name={obj.name} namespace={obj.namespace} kind='ReplicaSet'/>
            </TableData>
            <TableData id="images" activeColumnIDs={activeColumnIDs}>
                {getImages(obj.images)}
            </TableData>
            <TableData id="pods" activeColumnIDs={activeColumnIDs} className="gitops-admin-plugin__pods-column">
                {obj.pods.readyReplicas ? obj.pods.readyReplicas + " of " + obj.pods.replicas: "-"}
            </TableData>
            <TableData id="status" activeColumnIDs={activeColumnIDs}>
                {getStatusSection(obj.statuses)}
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
                sort: 'name',
            },
            {
                title: 'Images',
                id: 'images',
                transforms: [sortable],
                sort: 'images',
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
                sort: 'status',
            }
        ],
        [],
    );

    return columns;
};

const getImages = (images: ImageInfo[]) => {
    return (
        <DescriptionList isCompact isHorizontal>
        {images.map(function(image, index){
            return <DescriptionListGroup><DescriptionListTerm>{image.name}</DescriptionListTerm><DescriptionListDescription>{image.image}</DescriptionListDescription></DescriptionListGroup>;
          })}
        </DescriptionList>
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
