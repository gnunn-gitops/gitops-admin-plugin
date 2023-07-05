import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {
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
import { AppProjectModel } from '@appproject-model/AppProjectModel';
import DestinationsListFragment from './components/Destinations/DestinationFragment';
import ResourceAllowDenyListFragment from './components/ResourceAllowDenyList/ResourceAllowDenyFragment';
import { getObjectModifyPermissions } from '@gitops-utils/utils';
import StandardDetailsGroup from '@shared/views/components/StandardDetailsGroup/StandardDetailsGroup';

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

  const [canPatch] = getObjectModifyPermissions(obj, AppProjectModel);

  return (
    <div>
      <PageSection>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Project details')}
        </Title>
        <Grid hasGutter={true} span={2} sm={3} md={6} lg={6} xl={6} xl2={6}>
          <GridItem>
            <DescriptionList>
              <StandardDetailsGroup
                obj={obj}
                model={AppProjectModel}
                canPatch={canPatch}
                exclude={[]}
              />
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
