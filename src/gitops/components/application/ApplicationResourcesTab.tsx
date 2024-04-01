import * as React from 'react';

import { ApplicationKind, ApplicationResourceStatus } from '@gitops-models/ApplicationModel';
import { K8sGroupVersionKind, ResourceLink, RowProps, TableColumn, TableData, VirtualizedTable, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { RouteComponentProps } from 'react-router';
import { sortable } from '@patternfly/react-table';
import SyncStatus from './Statuses/SyncStatus';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import HealthStatus from './Statuses/HealthStatus';
import { HealthStatus as HS } from '@gitops-utils/constants';
import ResourceRowActions from './ResourceRowActions';
import { ArgoServer, getArgoServer } from '@gitops-utils/gitops';
//import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';

type ApplicationResourcesTabProps = RouteComponentProps<{
    ns: string;
    name: string;
}> & {
    obj?: ApplicationKind;
};

const ApplicationResourcesTab: React.FC<ApplicationResourcesTabProps> = ({ obj }) => {

    //const { t } = useGitOpsTranslation();

    const [model] = useK8sModel({ group: 'route.openshift.io', version: 'v1', kind: 'Route' });

    const [argoServer, setArgoServer] = React.useState<ArgoServer>({host: "", protocol: ""})

    React.useEffect(() => {
      (async () => {
        getArgoServer(model, obj)
          .then((argoServer) => {
            console.log("Argo Server: " + argoServer);
            setArgoServer(argoServer);
          })
          .catch((err) => {
            console.error('Error:', err);
          });
      })();
    }, [])


    var resources: ApplicationResourceStatus[];
    if (obj?.status?.resources) {
        resources = obj?.status?.resources;
    } else {
        resources = [];
    }

    return (
        <div>
            <PageSection variant={PageSectionVariants.light}>
                <VirtualizedTable
                    data={resources}
                    unfilteredData={resources}
                    loaded={true}
                    loadError={null}
                    columns={useResourceColumns()}
                    Row={resourceListRow}
                    rowData={{ application: obj, argoBaseURL: argoServer.protocol + "://" + argoServer.host + "/applications/" + obj?.metadata?.namespace + "/" + obj?.metadata?.name}}
                />
            </PageSection>
        </div>
    )
}

const resourceListRow: React.FC<RowProps<
                                  ApplicationResourceStatus,
                                  {
                                    application: ApplicationKind,
                                    argoBaseURL: string
                                  }
                                  >
                                > = ({ obj, activeColumnIDs, rowData: {application, argoBaseURL} }) => {

    const gvk: K8sGroupVersionKind = {
        version: obj.version,
        group: obj.group,
        kind: obj.kind
    }

    return (
        <>
            <TableData id="name" activeColumnIDs={activeColumnIDs} >
                <ResourceLink
                    groupVersionKind={gvk}
                    name={obj.name}
                    namespace={obj.namespace}
                />
            </TableData>
            <TableData id="namespace" activeColumnIDs={activeColumnIDs}>
                {obj.namespace}
            </TableData>
            <TableData id="syncWave" activeColumnIDs={activeColumnIDs}>
                {obj.syncWave}
            </TableData>
            <TableData id="status" activeColumnIDs={activeColumnIDs}>
                {(obj.health?.status && obj.health.status != HS.HEALTHY) &&
                    <HealthStatus
                        status={obj.health.status}
                        message={obj.health.message}
                    />
                }
                <SyncStatus
                    status={obj.status}
                />
            </TableData>
            <TableData
                id="actions"
                activeColumnIDs={activeColumnIDs}
                className="dropdown-kebab-pf pf-c-table__action"
            >
                <ResourceRowActions resource={obj} argoBaseURL={argoBaseURL} application={application} />
            </TableData>
        </>
    );
};

export const useResourceColumns = () => {

    const columns: TableColumn<ApplicationResourceStatus>[] = React.useMemo(
        () => [
            {
                title: 'Name',
                id: 'name',
                transforms: [sortable],
                sort: `name`
            },
            {
                title: 'Namespace',
                id: 'namespace',
                transforms: [sortable],
                sort: `namespace`
            },
            {
                title: 'Sync Order',
                id: 'syncWave',
                transforms: [sortable],
                sort: 'syncWave'
            },
            {
                title: 'Status',
                id: 'status',
                transforms: [sortable],
                sort: 'status'
            },
            {
              title: '',
              id: 'actions',
              props: { className: 'dropdown-kebab-pf pf-c-table__action' }
            }
        ],
        [],
    );

    return columns;
};

export default ApplicationResourcesTab;
