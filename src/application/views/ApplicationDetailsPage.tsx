import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {
  Button,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  Grid,
  GridItem,
  PageSection,
  Popover,
  Title
} from '@patternfly/react-core';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { k8sPatch, ResourceLink, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import MetadataLabels from './utils/MetadataLabels/MetadataLabels';
import { ApplicationHistory, ApplicationModel } from '@application-model/ApplicationModel';
import { useModal } from '@gitops-utils/components/ModalProvider/ModalProvider';
import { LabelsModal } from './modals/LabelsModal/LabelsModal';
import HealthStatusFragment from './components/Statuses/HealthStatusFragment';
import SyncStatusFragment from './components/Statuses/SyncStatusFragment';
import RevisionFragment from './components/Revision/RevisionFragment';
import { getArgoServerURL, getFriendlyClusterName } from '@gitops-utils/gitops';
import SourceListFragment from './components/Sources/SourcesFragment';

import { ApplicationSource } from '@application-model';
import HistoryListFragment from './components/History/HistoryFragment';
import ExternalLink from './components/ExternalLink/ExternalLink';

type ApplicationDetailsPageProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: any;
};

const ApplicationDetailsPage: React.FC<ApplicationDetailsPageProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();
  const { createModal } = useModal();

  const [argoServerURL, setArgoServerURL] = React.useState('');

  React.useEffect(() => {
    (async () => {
      getArgoServerURL(obj.metadata.namespace)
        .then((url) => {
          console.log("Argo URL " + url);
          setArgoServerURL(url);
        })
        .catch((err) => {
          console.error('Error:', err);
        });
    })();
  }, [])

  var sources: ApplicationSource[];
  if (obj?.spec?.source) {
    sources = [obj?.spec?.source];
  } else if (obj?.spec?.sources) {
    sources = obj.spec.sources;
  } else {
    //Should never fall here since there always has to be a source or sources
    sources = [];
  }

  var history: ApplicationHistory[];
  if (obj?.status?.history) {
    history = obj?.status?.history;
  } else {
    history = [];
  }

  const onEditLabels = () => {
    createModal(({ isOpen, onClose }) => (
      <LabelsModal
        obj={obj}
        isOpen={isOpen}
        onClose={onClose}
        onLabelsSubmit={(labels) =>
          k8sPatch({
            model: ApplicationModel,
            resource: obj,
            data: [
              {
                op: 'replace',
                path: '/metadata/labels',
                value: labels,
              },
            ],
          })
        }
      />
    ))
  }
  return (
    <div>
      <PageSection>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Application details')}
        </Title>
        <Grid hasGutter={true} span={2} sm={3} md={6} lg={6} xl={6} xl2={6}>
          <GridItem>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Name')}</div>} bodyContent={<div>{t('Name must be unique within a namespace.')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Name')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  {obj?.metadata?.name}
                  <ExternalLink href={argoServerURL}>
                    <img loading="lazy" src={require('../../images/argo.png')} alt="Argo CD" width="19px" height="24px" />
                  </ExternalLink>
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Namespace')}</div>} bodyContent={<div>{t('Namespace defines the space within which each name must be unique.')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Namespace')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  <ResourceLink kind="Namespace" name={obj?.metadata?.namespace} />
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Labels')}</div>} bodyContent={<div>{t('Map of string keys and values that can be used to organize and categorize (scope and select) objects.')}</div>}>
                    <DescriptionListTermHelpTextButton>
                      {t('Labels')}
                    </DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  <div>
                    <Button variant="link" isInline icon={<PlusCircleIcon />} onClick={onEditLabels}>{t(' Edit')}</Button>
                  </div>
                  <MetadataLabels labels={obj?.metadata?.labels} />
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Created at')}</div>} bodyContent={<div>{t('Time is a wrapper around time. Time which supports correct marshaling to YAML and JSON.')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Created at')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  {<Timestamp timestamp={obj?.metadata?.creationTimestamp} />}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </GridItem>


          <GridItem>
            <DescriptionList>
              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Health Status')}</div>} bodyContent={<div>{t('Health status represents the overall health of the application.')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Health Status')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  <HealthStatusFragment
                    status={obj.status?.health?.status || ''}
                  />
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Sync Status')}</div>} bodyContent={<div>{t('Sync status represents the overall syncrhonized state for the application.')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Sync Status')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  <SyncStatusFragment
                    status={obj.status?.sync?.status || ''}
                  />
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Revision')}</div>} bodyContent={<div>{t('Current git revision for the appliation.')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Revision')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  <RevisionFragment
                    revision={obj.status?.sync?.revision || ''}
                    repoURL={obj.spec.source.repoURL}
                  />
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Project')}</div>} bodyContent={<div>{t('The Argo CD Project that this application belongs to.')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Project')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  {obj?.spec?.project}
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Destination')}</div>} bodyContent={<div>{t('The cluster and namespace where the application is targeted')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Destination')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  {getFriendlyClusterName(obj?.spec?.destination.server)}/{obj?.spec?.destination.namespace}
                </DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </GridItem>
        </Grid>
      </PageSection>
      <PageSection hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Sources')}
        </Title>
        <SourceListFragment
          sources={sources}
        />
      </PageSection>
      <PageSection hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('History')}
        </Title>
        <HistoryListFragment
          history={history}
        />
      </PageSection>
    </div>
  );
};

export default ApplicationDetailsPage;
