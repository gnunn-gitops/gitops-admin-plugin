import * as React from 'react';

import { ApplicationKind, ApplicationResourceStatus } from '@application-model';
import { K8sGroupVersionKind, ResourceLink, RowProps, TableColumn, TableData, Timestamp, VirtualizedTable } from '@openshift-console/dynamic-plugin-sdk';
import { RouteComponentProps } from 'react-router';
import { sortable } from '@patternfly/react-table';
import SyncStatusFragment from './components/Statuses/SyncStatusFragment';
import { DescriptionList, DescriptionListDescription, DescriptionListGroup, DescriptionListTermHelpText, DescriptionListTermHelpTextButton, Grid, GridItem, PageSection, Popover } from '@patternfly/react-core';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import { getDuration } from '@gitops-utils/gitops';

type ApplicationSyncStatusPageProps = RouteComponentProps<{
    ns: string;
    name: string;
}> & {
    obj?: ApplicationKind;
};

const ApplicationSyncStatusPage: React.FC<ApplicationSyncStatusPageProps> = ({ obj }) => {

    const { t } = useGitOpsTranslation();

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
                                    {obj.status?.operationState?.operation?.sync &&
                                        <span>Sync</span>
                                    }
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

                <VirtualizedTable
                    data={resources}
                    unfilteredData={resources}
                    loaded={true}
                    loadError={null}
                    columns={useResourceColumns()}
                    Row={applicationListRow}
                />
            </PageSection>
        </div>
    )
}

const applicationListRow: React.FC<RowProps<ApplicationResourceStatus>> = ({ obj, activeColumnIDs }) => {

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
            }
        ],
        [],
    );

    return columns;
};

export default ApplicationSyncStatusPage;
