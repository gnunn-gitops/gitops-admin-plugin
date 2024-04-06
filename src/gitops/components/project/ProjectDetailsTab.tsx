import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {
  Card,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  Grid,
  GridItem,
  List,
  ListItem,
  PageSection,
  PageSectionVariants,
  Popover,
  Title
} from '@patternfly/react-core';
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import { AppProjectModel } from '@gitops-models/AppProjectModel';
import DestinationsList from './DestinationsList';
import ResourceAllowDenyList from './ResourceAllowDenyList';
import { getObjectModifyPermissions } from '@gitops-utils/utils';
import StandardDetailsGroup from '@utils/components/StandardDetailsGroup/StandardDetailsGroup';
import { DetailsDescriptionGroup } from '@utils/components/DetailsDescriptionGroup/DetailsDescriptionGroup';

type ProjectDetailsTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: any;
};

function renderStringArray(items: string[]) {
  if (items) {
    return (
      <List isPlain className="pf-u-mt-sm">
        {items.map(el => <ListItem>{el}</ListItem>)}
      </List>
    )
  } else {
    return (
      <div className="pf-u-text-align-center pf-u-mt-sm">No Data</div>
    )
  }
}

const ProjectDetailsTab: React.FC<ProjectDetailsTabProps> = ({ obj }) => {
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

              <DetailsDescriptionGroup title={t('Description')} help={t('Description of Project.')}>
                {obj?.spec?.description}
              </DetailsDescriptionGroup>

            </DescriptionList>
          </GridItem>
        </Grid>
      </PageSection>
      <PageSection hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Source')}
        </Title>
            <DescriptionList columnModifier={{ lg: '2Col' }}>
              <Card isFlat component="div">
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Repositories')}</div>} bodyContent={<div>{t('Source repositories allowed in this project.')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Source repositories allowed in this project.')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  {renderStringArray(obj.spec.sourceRepos)}
                </DescriptionListDescription>
              </Card>
              <Card isFlat component="div">
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Namespaces')}</div>} bodyContent={<div>{t('Source namespaces allowed in this project.')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Source namespaces allowed in this project.')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  {renderStringArray(obj.spec.sourceNamespaces)}
                </DescriptionListDescription>
              </Card>
            </DescriptionList>
      </PageSection>

      <PageSection hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Destinations')}
        </Title>
        <Card isFlat component="div">
        <DestinationsList
          destinations={obj.spec.destinations}
        />
        </Card>
      </PageSection>

      <PageSection hasShadowTop={true} variant={PageSectionVariants.light} >
        <Title headingLevel="h2" className="co-section-heading">
          {t('Resource Allow/Deny Lists')}
        </Title>
        <DescriptionList columnModifier={{ lg: '2Col' }}>
          <Card isFlat component="div">
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>{t('Cluster Resource Allow List')}</div>} bodyContent={<div>{t('Cluster resources allowed in applications in this project.')}</div>}>
                <DescriptionListTermHelpTextButton>{t('Cluster Resource Allow List')}</DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              {obj.spec.clusterResourceWhitelist &&
                <ResourceAllowDenyList
                  list={obj.spec.clusterResourceWhitelist}
                />
              }
              {!obj.spec.clusterResourceWhitelist &&
                <div>The cluster resource allow list is empty</div>
              }
            </DescriptionListDescription>
          </Card>

          <Card isFlat component="div">
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>{t('Cluster Resource Deny List')}</div>} bodyContent={<div>{t('Cluster resources denied in applications in this project.')}</div>}>
                <DescriptionListTermHelpTextButton>{t('Cluster Resource Deny List')}</DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              {obj.spec.clusterResourceBlacklist &&
                <ResourceAllowDenyList
                  list={obj.spec.clusterResourceBlacklist}
                />
              }
              {!obj.spec.clusterResourceBlacklist &&
                <div>The cluster resource deny list is empty</div>
              }
            </DescriptionListDescription>
          </Card>

          <Card isFlat component="div">
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>{t('Namespace Resource Allow List')}</div>} bodyContent={<div>{t('Namespace resources allowed in applications in this project.')}</div>}>
                <DescriptionListTermHelpTextButton>{t('Namespace Resource Allow List')}</DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              {obj.spec.namespaceResourceWhitelist &&
                <ResourceAllowDenyList
                  list={obj.spec.namespaceResourceWhitelist}
                />
              }
              {!obj.spec.namespaceResourceWhitelist &&
                <div>The namespace resource allow list is empty</div>
              }
            </DescriptionListDescription>
          </Card>

          <Card isFlat component="div">
            <DescriptionListTermHelpText>
              <Popover headerContent={<div>{t('Namespace Resource Deny List')}</div>} bodyContent={<div>{t('Namespace resources denied in applications in this project.')}</div>}>
                <DescriptionListTermHelpTextButton>{t('Namespace Resource Deny List')}</DescriptionListTermHelpTextButton>
              </Popover>
            </DescriptionListTermHelpText>
            <DescriptionListDescription>
              {obj.spec.namespaceResourceBlacklist &&
                <ResourceAllowDenyList
                  list={obj.spec.namespaceResourceBlacklist}
                />
              }
              {!obj.spec.namespaceResourceBlacklist &&
                <div>The namespace resource deny list is empty</div>
              }
            </DescriptionListDescription>
          </Card>
        </DescriptionList>
      </PageSection>

    </div>
  );
};

export default ProjectDetailsTab;
