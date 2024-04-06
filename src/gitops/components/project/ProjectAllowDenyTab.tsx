import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {
  Card,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  List,
  ListItem,
  PageSection,
  PageSectionVariants,
  Popover,
  Title
} from '@patternfly/react-core';
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import { AppProjectKind } from '@gitops-models/AppProjectModel';
import DestinationsList from './DestinationsList';
import ResourceAllowDenyList from './ResourceAllowDenyList';

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

type ProjectAllowDenyTabProps = RouteComponentProps<{
    ns: string;
    name: string;
  }> & {
    obj?: AppProjectKind;
  };

const ProjectAllowDenyTab: React.FC<ProjectAllowDenyTabProps> = ({ obj }) => {
    const { t } = useGitOpsTranslation();

    const pageSectionStyle = PageSectionVariants.default;

    return (
        <>
        <PageSection variant={pageSectionStyle} hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Source')}
        </Title>
            <DescriptionList columnModifier={{ lg: '2Col' }}>
              {/* <Card isFlat isCompact>
                <Title headingLevel="h3">
                    {t('Source')}
                </Title>
              </Card> */}
              <Card isFlat isCompact>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Repositories')}</div>} bodyContent={<div>{t('Source repositories allowed in this project.')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Source repositories allowed in this project.')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  {renderStringArray(obj.spec.sourceRepos)}
                </DescriptionListDescription>
              </Card>
              <Card isFlat isCompact>
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

      <PageSection variant={pageSectionStyle} hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Destinations')}
        </Title>
        <Card isFlat isCompact>
        <DestinationsList
          destinations={obj.spec.destinations}
        />
        </Card>
      </PageSection>

      <PageSection hasShadowTop={true} variant={pageSectionStyle} >
        <Title headingLevel="h2" className="co-section-heading">
          {t('Resource Allow/Deny Lists')}
        </Title>
        <DescriptionList columnModifier={{ lg: '2Col' }}>
          <Card isFlat isCompact>
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

          <Card isFlat isCompact>
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

          <Card isFlat isCompact>
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

          <Card isFlat isCompact>
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
      </>
    )
}

export default ProjectAllowDenyTab;
