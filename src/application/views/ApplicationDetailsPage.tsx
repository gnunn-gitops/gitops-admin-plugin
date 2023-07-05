import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTermHelpText,
  DescriptionListTermHelpTextButton,
  Flex,
  FlexItem,
  Grid,
  GridItem,
  Label,
  PageSection,
  Popover,
  Title,
  ToggleGroup,
  ToggleGroupItem
} from '@patternfly/react-core';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import { k8sUpdate, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { ApplicationHistory, ApplicationKind, ApplicationModel } from '@application-model/ApplicationModel';
import HealthStatusFragment from './components/Statuses/HealthStatusFragment';
import SyncStatusFragment from './components/Statuses/SyncStatusFragment';
import RevisionFragment from './components/Revision/RevisionFragment';
import { ArgoServer, getArgoServer, getFriendlyClusterName } from '@gitops-utils/gitops';
import SourceListFragment from './components/Sources/SourcesFragment';

import { ApplicationSource } from '@application-model';
import HistoryListFragment from './components/History/HistoryFragment';
import ExternalLink from './components/ExternalLink/ExternalLink';
import { ConditionsPopover } from './components/Conditions/ConditionsPopover';
import { OperationStateFragment } from './components/Statuses/OperationStateFragment';
import { getObjectModifyPermissions } from '@gitops-utils/utils';
import StandardDetailsGroup, { Details } from '@shared/views/components/StandardDetailsGroup/StandardDetailsGroup';

type ApplicationDetailsPageProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: ApplicationKind;
};

const ApplicationDetailsPage: React.FC<ApplicationDetailsPageProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();
  const [model] = useK8sModel({ group: 'route.openshift.io', version: 'v1', kind: 'Route' });

  const [canPatch, canUpdate] = getObjectModifyPermissions(obj, ApplicationModel);

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

  const onChangeAutomated = (isSelected: boolean, event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent) => {
    const id = event.currentTarget.id;

    switch(id) {
      case "automated": {
        if (obj.spec.syncPolicy?.automated) {
          obj.spec.syncPolicy = {}
        } else {
          obj.spec.syncPolicy = {automated: {}};
        }
        break;
      }
      case "self-heal": {
        if (obj.spec.syncPolicy.automated.selfHeal) {
          obj.spec.syncPolicy.automated.selfHeal = false;
        } else {
          obj.spec.syncPolicy.automated = {...obj.spec.syncPolicy.automated, ...{selfHeal:true}}
        }
        break;
      }
      case "prune": {
        if (obj.spec.syncPolicy.automated.prune) {
          obj.spec.syncPolicy.automated.prune = false;
        } else {
          obj.spec.syncPolicy.automated = {...obj.spec.syncPolicy.automated, ...{prune:true}}
        }
        break;
      }
    }
    k8sUpdate({
      model: ApplicationModel,
      data: obj
    });
  };

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
                  <Flex>
                    <FlexItem>{obj?.metadata?.name}</FlexItem>
                    <FlexItem>
                      <ExternalLink href={argoServer.protocol + "://" + argoServer.host + "/applications/" + obj?.metadata?.namespace + "/" + obj?.metadata?.name}>
                        <img loading="lazy" src={require('../../images/argo.png')} alt="Argo CD" width="19px" height="24px" />
                      </ExternalLink>
                    </FlexItem>
                  </Flex>
                </DescriptionListDescription>
              </DescriptionListGroup>

              <StandardDetailsGroup
                obj={obj}
                model={ApplicationModel}
                canPatch={canPatch}
                exclude={[Details.Name]}
              />

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
                  <Popover headerContent={<div>{t('Current Sync Status')}</div>} bodyContent={<div>{t('Sync status represents the current synchronized state for the application.')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Current Sync Status')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  <Flex>
                    <FlexItem>
                      <SyncStatusFragment status={obj.status?.sync?.status || ''} />
                    </FlexItem>
                    <FlexItem>
                      <Label>
                        <RevisionFragment
                           revision={obj.status?.sync?.revision || ''}
                           repoURL={obj.spec.source.repoURL}
                           helm={obj.status?.sourceType == "helm"}
                           />
                      </Label>
                    </FlexItem>
                  </Flex>
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Last Sync Result')}</div>} bodyContent={<div>{t('The result of the last sync status.')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Last Sync Result')}</DescriptionListTermHelpTextButton>
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

              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Sync Policy')}</div>} bodyContent={<div>{t('Provides options to determine application syncrhonization behavior')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Sync Policy')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  <ToggleGroup isCompact areAllGroupsDisabled={!canUpdate}>
                    <ToggleGroupItem
                      text={t('Automated')}
                      buttonId="automated"
                      onChange={onChangeAutomated}
                      isSelected={obj?.spec?.syncPolicy?.automated?true:false}/>
                    <ToggleGroupItem
                      text={t('Self Heal')}
                      buttonId="self-heal"
                      onChange={onChangeAutomated}
                      isSelected={obj?.spec?.syncPolicy?.automated && obj?.spec?.syncPolicy?.automated.selfHeal}
                      isDisabled={obj?.spec?.syncPolicy?.automated?false:true}/>
                    <ToggleGroupItem
                      text={t('Prune')}
                      buttonId="prune"
                      onChange={onChangeAutomated}
                      isSelected={obj?.spec?.syncPolicy?.automated && obj?.spec?.syncPolicy?.automated.prune}
                      isDisabled={obj?.spec?.syncPolicy?.automated?false:true}/>
                  </ToggleGroup>
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
