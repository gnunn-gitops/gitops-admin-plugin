import * as React from 'react';

import { ApplicationKind, ApplicationResourceStatus } from '@application-model';
import { K8sGroupVersionKind, ResourceLink, RowProps, TableColumn, TableData, Timestamp, VirtualizedTable, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { RouteComponentProps } from 'react-router';
import { sortable } from '@patternfly/react-table';
import SyncStatusFragment from './components/Statuses/SyncStatusFragment';
import { DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTermHelpText, DescriptionListTermHelpTextButton, Flex, FlexItem, Grid, GridItem, PageSection, Popover, Title } from '@patternfly/react-core';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import { ArgoServer, getArgoServer, getDuration } from '@gitops-utils/gitops';
import ResourceRowActions from './ResourceRowActions';
import { OperationStateFragment } from './components/Statuses/OperationStateFragment';
import { ConditionsPopover } from './components/Conditions/ConditionsPopover';

type ApplicationSyncStatusPageProps = RouteComponentProps<{
    ns: string;
    name: string;
}> & {
    obj?: ApplicationKind;
};

const ApplicationSyncStatusPage: React.FC<ApplicationSyncStatusPageProps> = ({ obj }) => {

    const { t } = useGitOpsTranslation();

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
    if (obj?.status?.operationState?.syncResult?.resources) {
        resources = obj.status.operationState.syncResult.resources;
    } else {
        resources = [];
    }

    return (
        <div>
            <PageSection>
                <Grid hasGutter={true} span={2} sm={3} md={6} lg={6} xl={6} xl2={6}>
                    <GridItem>

                        <DescriptionList>
                            <DescriptionListGroup>
                                <DescriptionListTermHelpText>
                                    <Popover headerContent={<div>{t('Operation')}</div>} bodyContent={<div>{t('The operation that was performed.')}</div>}>
                                        <DescriptionListTermHelpTextButton>{t('Operation')}</DescriptionListTermHelpTextButton>
                                    </Popover>
                                </DescriptionListTermHelpText>
                                <DescriptionListDescription>
                                    <Flex>
                                        {obj?.status?.operationState &&
                                            <FlexItem>
                                            <OperationStateFragment app={obj}/>
                                            </FlexItem>
                                        }
                                        {obj?.status?.conditions &&
                                        <FlexItem>
                                            <ConditionsPopover
                                            conditions={obj.status.conditions}
                                            />
                                        </FlexItem>
                                        }
                                    </Flex>
                                </DescriptionListDescription>
                            </DescriptionListGroup>

                            <DescriptionListGroup>
                                <DescriptionListTermHelpText>
                                    <Popover headerContent={<div>{t('Phase')}</div>} bodyContent={<div>{t('The operation phase.')}</div>}>
                                        <DescriptionListTermHelpTextButton>{t('Phase')}</DescriptionListTermHelpTextButton>
                                    </Popover>
                                </DescriptionListTermHelpText>
                                <DescriptionListDescription>
                                    {obj.status?.operationState?.phase}
                                </DescriptionListDescription>
                            </DescriptionListGroup>

                            <DescriptionListGroup>
                                <DescriptionListTermHelpText>
                                    <Popover headerContent={<div>{t('Message')}</div>} bodyContent={<div>{t('The message from the operation.')}</div>}>
                                        <DescriptionListTermHelpTextButton>{t('Message')}</DescriptionListTermHelpTextButton>
                                    </Popover>
                                </DescriptionListTermHelpText>
                                <DescriptionListDescription>
                                    {obj.status?.operationState?.message || obj.status?.operationState?.message}
                                </DescriptionListDescription>
                            </DescriptionListGroup>

                            <DescriptionListGroup>
                                <DescriptionListTermHelpText>
                                    <Popover headerContent={<div>{t('Initiated By')}</div>} bodyContent={<div>{t('Who initiated the operation.')}</div>}>
                                        <DescriptionListTermHelpTextButton>{t('Intiated By')}</DescriptionListTermHelpTextButton>
                                    </Popover>
                                </DescriptionListTermHelpText>
                                <DescriptionListDescription>
                                    {obj.status?.operationState?.operation?.initiatedBy?.automated ? t('automated sync policy') : obj.status?.operationState?.operation?.initiatedBy?.automated}
                                </DescriptionListDescription>
                            </DescriptionListGroup>

                        </DescriptionList>

                    </GridItem>
                    <GridItem>
                        <DescriptionList>
                            <DescriptionListGroup>
                                <DescriptionListTermHelpText>
                                    <Popover headerContent={<div>{t('Started At')}</div>} bodyContent={<div>{t('When the operation was started.')}</div>}>
                                        <DescriptionListTermHelpTextButton>{t('Started At')}</DescriptionListTermHelpTextButton>
                                    </Popover>
                                </DescriptionListTermHelpText>
                                <DescriptionListDescription>
                                    <Timestamp timestamp={obj.status?.operationState?.startedAt} />
                                </DescriptionListDescription>
                            </DescriptionListGroup>

                            <DescriptionListGroup>
                                <DescriptionListTermHelpText>
                                    <Popover headerContent={<div>{t('Duration')}</div>} bodyContent={<div>{t('How long the operation took to complete.')}</div>}>
                                        <DescriptionListTermHelpTextButton>{t('Duration')}</DescriptionListTermHelpTextButton>
                                    </Popover>
                                </DescriptionListTermHelpText>
                                <DescriptionListDescription>
                                    {obj.status?.operationState?.finishedAt &&
                                        <span>
                                            {getDuration(obj.status.operationState.startedAt, obj.status.operationState.finishedAt) / 1000} seconds
                                        </span>
                                    }
                                </DescriptionListDescription>
                            </DescriptionListGroup>

                            <DescriptionListGroup>
                                <DescriptionListTermHelpText>
                                    <Popover headerContent={<div>{t('Finished At')}</div>} bodyContent={<div>{t('When the operation was finished.')}</div>}>
                                        <DescriptionListTermHelpTextButton>{t('Finished At')}</DescriptionListTermHelpTextButton>
                                    </Popover>
                                </DescriptionListTermHelpText>
                                <DescriptionListDescription>
                                    <Timestamp timestamp={obj.status?.operationState?.finishedAt} />
                                </DescriptionListDescription>
                            </DescriptionListGroup>

                        </DescriptionList>
                    </GridItem>
                </Grid>
            </PageSection>
            <PageSection>
                <Title headingLevel="h2" className="co-section-heading">
                    {t('Resources Last Synced')}
                </Title>
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
            <TableData id="status" activeColumnIDs={activeColumnIDs}>
                <SyncStatusFragment
                    status={obj.status}
                />
            </TableData>
            <TableData id="hook" activeColumnIDs={activeColumnIDs}>
                {obj.hookType}
            </TableData>
            <TableData id="message" activeColumnIDs={activeColumnIDs}>
                {obj.message}
            </TableData>
            <TableData
                id="actions"
                activeColumnIDs={activeColumnIDs}
                className="dropdown-kebab-pf pf-c-table__action"
            >
                <ResourceRowActions resource={obj} application={application} argoBaseURL={argoBaseURL} />
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
                title: 'Status',
                id: 'status',
                transforms: [sortable],
                sort: 'status'
            },
            {
                title: 'Hook',
                id: 'hook',
                transforms: [sortable],
                sort: 'hookType'
            },
            {
                title: 'Message',
                id: 'message',
                transforms: [sortable],
                sort: 'message'
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

export default ApplicationSyncStatusPage;
