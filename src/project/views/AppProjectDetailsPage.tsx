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
  List,
  ListItem,
  PageSection,
  Popover,
  Split,
  SplitItem,
  Title
} from '@patternfly/react-core';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import PencilAltIcon from '@patternfly/react-icons/dist/esm/icons/pencil-alt-icon';
import { k8sPatch, ResourceLink, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import MetadataLabels from './utils/MetadataLabels/MetadataLabels';
import { AppProjectModel } from '@appproject-model/AppProjectModel';
import { useModal } from '@gitops-utils/components/ModalProvider/ModalProvider';
import { LabelsModal } from '@shared/views/modals/LabelsModal/LabelsModal';
import DestinationsListFragment from './components/Destinations/DestinationFragment';
import ResourceAllowDenyListFragment from './components/ResourceAllowDenyList/ResourceAllowDenyFragment';
import { AnnotationsModal } from '@shared/views/modals/AnnotationsModal/AnnotationsModal';
import { getObjectModifyPermissions } from '@gitops-utils/utils';

type AppProjectDetailsPageProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: any;
};

function renderStringArray(items: string[]) {
  if (items) {
    return (
      <List isPlain isBordered>
        {items.map(el => <ListItem>{el}</ListItem>)}
      </List>
    )
  } else {
    return (
      <div className="pf-u-text-align-center">Not found</div>
    )
  }
}

const AppProjectDetailsPage: React.FC<AppProjectDetailsPageProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();
  const { createModal } = useModal();

  const [canPatch] = getObjectModifyPermissions(obj, AppProjectModel);

  const onEditLabels = () => {
    createModal(({ isOpen, onClose }) => (
      <LabelsModal
        obj={obj}
        isOpen={isOpen}
        onClose={onClose}
        onLabelsSubmit={(labels) =>
          k8sPatch({
            model: AppProjectModel,
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

  const onEditAnnotations = () => {
    createModal(({ isOpen, onClose }) => (
      <AnnotationsModal
        obj={obj}
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={(annotations) =>
          k8sPatch({
            model: AppProjectModel,
            resource: obj,
            data: [
              {
                op: 'replace',
                path: '/metadata/annotations',
                value: annotations,
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
          {t('Project details')}
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
                <DescriptionListDescription>{obj?.metadata?.name}</DescriptionListDescription>
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
                <Split>
                  <SplitItem isFilled>
                    <DescriptionListTermHelpText>
                      <Popover headerContent={<div>{t('Labels')}</div>} bodyContent={<div>{t('Map of string keys and values that can be used to organize and categorize (scope and select) objects.')}</div>}>
                        <DescriptionListTermHelpTextButton>
                          {t('Labels')}
                        </DescriptionListTermHelpTextButton>
                      </Popover>
                    </DescriptionListTermHelpText>
                  </SplitItem>
                  <SplitItem>
                    <Button variant="link" isInline icon={<PencilAltIcon />} iconPosition={'right'} isDisabled={!canPatch} onClick={onEditLabels}>{t(' Edit')}</Button>
                  </SplitItem>
                </Split>
                <DescriptionListDescription>
                  <MetadataLabels labels={obj?.metadata?.labels} />
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Annotations')}</div>} bodyContent={<div>{t('Annotations is an unstructured key value map stored with a resource that may be set by external tools to store and retrieve arbitrary metadata. They are not queryable and should be preserved when modifying objects.')}</div>}>
                    <DescriptionListTermHelpTextButton>
                      {t('Annotations')}
                    </DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  <div>
                    <Button variant="link" isInline icon={<PencilAltIcon />} iconPosition={'right'} isDisabled={!canPatch} onClick={onEditAnnotations}>{(obj.metadata?.annotations ? Object.keys(obj.metadata.annotations).length : 0) + t(' Annotations')}</Button>
                  </div>
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
                  <Popover headerContent={<div>{t('Description')}</div>} bodyContent={<div>{t('Description of Project.')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Description')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>{obj?.spec?.description}</DescriptionListDescription>
              </DescriptionListGroup>
            </DescriptionList>
          </GridItem>
        </Grid>
      </PageSection>
      <PageSection hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Source Repositories')}
        </Title>
        {renderStringArray(obj.spec.sourceRepos)}
      </PageSection>
      <PageSection hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Source Namespaces')}
        </Title>
        {renderStringArray(obj.spec.sourceNamespaces)}
      </PageSection>

      <PageSection hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Destinations')}
        </Title>
        <DestinationsListFragment
          destinations={obj.spec.destinations}
        />
      </PageSection>

      <PageSection hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Resource Allow/Deny Lists')}
        </Title>

        <DescriptionList>
          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>{t('Cluster Resource Allow List')}</div>} bodyContent={<div>{t('Cluster resources allowed in applications in this project.')}</div>}>
                <DescriptionListTermHelpTextButton>{t('Cluster Resource Allow List')}</DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              {obj.spec.clusterResourceWhitelist &&
                <ResourceAllowDenyListFragment
                  list={obj.spec.clusterResourceWhitelist}
                />
              }
              {!obj.spec.clusterResourceWhitelist &&
                <div>The cluster resource allow list is empty</div>
              }
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>{t('Cluster Resource Deny List')}</div>} bodyContent={<div>{t('Cluster resources denied in applications in this project.')}</div>}>
                <DescriptionListTermHelpTextButton>{t('Cluster Resource Deny List')}</DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              {obj.spec.clusterResourceBlacklist &&
                <ResourceAllowDenyListFragment
                  list={obj.spec.clusterResourceBlacklist}
                />
              }
              {!obj.spec.clusterResourceBlacklist &&
                <div>The cluster resource deny list is empty</div>
              }
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>{t('Namespace Resource Allow List')}</div>} bodyContent={<div>{t('Namespace resources allowed in applications in this project.')}</div>}>
                <DescriptionListTermHelpTextButton>{t('Namespace Resource Allow List')}</DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              {obj.spec.namespaceResourceWhitelist &&
                <ResourceAllowDenyListFragment
                  list={obj.spec.namespaceResourceWhitelist}
                />
              }
              {!obj.spec.namespaceResourceWhitelist &&
                <div>The namespace resource allow list is empty</div>
              }
            </DescriptionListDescription>
          </DescriptionListGroup>

          <DescriptionListGroup>
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>{t('Namespace Resource Deny List')}</div>} bodyContent={<div>{t('Namespace resources denied in applications in this project.')}</div>}>
                <DescriptionListTermHelpTextButton>{t('Namespace Resource Deny List')}</DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              {obj.spec.namespaceResourceBlacklist &&
                <ResourceAllowDenyListFragment
                  list={obj.spec.namespaceResourceBlacklist}
                />
              }
              {!obj.spec.namespaceResourceBlacklist &&
                <div>The namespace resource deny list is empty</div>
              }
            </DescriptionListDescription>
          </DescriptionListGroup>
        </DescriptionList>
      </PageSection>

    </div>
  );
};

export default AppProjectDetailsPage;
