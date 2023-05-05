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
  Title
} from '@patternfly/react-core';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';
import { k8sPatch, ResourceLink, Timestamp } from '@openshift-console/dynamic-plugin-sdk';
import MetadataLabels from './utils/MetadataLabels/MetadataLabels';
import { AppProjectModel } from '@appproject-model/AppProjectModel';
import { useModal } from '@gitops-utils/components/ModalProvider/ModalProvider';
import { LabelsModal } from '@shared/views/modals/LabelsModal/LabelsModal';
import DestinationsListFragment from './components/Destinations/DestinationFragment';

type AppProjectDetailsPageProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: any;
};

const AppProjectDetailsPage: React.FC<AppProjectDetailsPageProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();
  const { createModal } = useModal();

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
          {obj.spec.sourceRepos &&
            <List isPlain isBordered>
              {obj.spec.sourceRepos.map(el=> <ListItem>{el}</ListItem>)}
           </List>
        }
      </PageSection>
      <PageSection hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Source Namespaces')}
        </Title>
          {obj.spec.sourceNamespaces &&
            <List isPlain isBordered>
              {obj.spec.sourceNamespaces.map(el=> <ListItem>{el}</ListItem>)}
            </List>
          }
      </PageSection>

      <PageSection hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Destinations')}
        </Title>
          <DestinationsListFragment
            destinations={obj.spec.destinations}
          />
      </PageSection>
    </div>
  );
};

export default AppProjectDetailsPage;
