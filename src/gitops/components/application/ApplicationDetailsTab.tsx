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
  PageSectionVariants,
  Popover,
  Title,
  ToggleGroup,
  ToggleGroupItem
} from '@patternfly/react-core';
import { useGitOpsTranslation } from '@utils/hooks/useGitOpsTranslation';
import { ResourceLink, k8sUpdate, useK8sModel } from '@openshift-console/dynamic-plugin-sdk';
import { ApplicationKind, ApplicationModel,ApplicationSource } from '@gitops-models/ApplicationModel';
import HealthStatus from './Statuses/HealthStatus';
import SyncStatus from './Statuses/SyncStatus';
import Revision from './Revision/Revision';
import { ArgoServer, getArgoServer, getFriendlyClusterName } from '@gitops-utils/gitops';
import SourceList from './Sources/Sources';

import ExternalLink from '@gitops-shared/ExternalLink';
import { ConditionsPopover } from './Conditions/ConditionsPopover';
import { OperationState } from './Statuses/OperationState';
import { getObjectModifyPermissions } from '@gitops-utils/utils';
import StandardDetailsGroup, { Details } from '@utils/components/StandardDetailsGroup/StandardDetailsGroup';
import { DetailsDescriptionGroup } from '@utils/components/DetailsDescriptionGroup/DetailsDescriptionGroup';

type ApplicationDetailsTabProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: ApplicationKind;
};

const ApplicationDetailsTab: React.FC<ApplicationDetailsTabProps> = ({ obj }) => {
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

  const onChangeAutomated = (event: React.MouseEvent<any> | React.KeyboardEvent | MouseEvent, selected: boolean) => {
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
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Application details')}
        </Title>
        <Grid hasGutter={true} span={2} sm={3} md={6} lg={6} xl={6} xl2={6}>
          <GridItem>
            <DescriptionList className="pf-c-description-list">
              <DescriptionListGroup className="pf-c-description-list__group">
                <DescriptionListTermHelpText className="pf-c-description-list__term">
                  <Popover headerContent={<div>{t('Name')}</div>} bodyContent={<div>{t('Name must be unique within a namespace.')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Name')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                  <Flex>
                    <FlexItem>{obj?.metadata?.name}</FlexItem>
                    <FlexItem>
                      <ExternalLink href={argoServer.protocol + "://" + argoServer.host + "/applications/" + obj?.metadata?.namespace + "/" + obj?.metadata?.name}>
                        <img loading="lazy" src={require('@images/argo.png')} alt="Argo CD" width="19px" height="24px" />
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
            <DescriptionList className="pf-c-description-list">

              <DetailsDescriptionGroup title={t('Health Status')} help={t('Health status represents the overall health of the application.')}>
                <HealthStatus
                      status={obj.status?.health?.status || ''}
                    />
              </DetailsDescriptionGroup>

              <DetailsDescriptionGroup title={t('Current Sync Status')} help={t('Sync status represents the current synchronized state for the application.')}>
                <Flex>
                      <FlexItem>
                        <SyncStatus status={obj.status?.sync?.status || ''} />
                      </FlexItem>
                      <FlexItem>
                        <Label>
                          <Revision
                            revision={obj.status?.sync?.revision || ''}
                            repoURL={obj.spec.source.repoURL}
                            helm={obj.status?.sourceType == "helm"}
                            />
                        </Label>
                      </FlexItem>
                    </Flex>
              </DetailsDescriptionGroup>

              <DetailsDescriptionGroup title={t('Last Sync Result')} help={t('The result of the last sync status.')}>
                <Flex>
                    {obj?.status?.operationState &&
                        <FlexItem>
                           <OperationState app={obj}/>
                        </FlexItem>
                    }
                    {obj?.status?.conditions &&
                      <FlexItem>
                        <ConditionsPopover
                          conditions={obj.status?.conditions}
                        />
                      </FlexItem>
                    }
                  </Flex>
              </DetailsDescriptionGroup>

              <DetailsDescriptionGroup title={t('Target Revision')} help={t('The specified revision for the Application.')}>
                {obj?.spec?.source?.targetRevision?obj?.spec?.source?.targetRevision:"HEAD"}
              </DetailsDescriptionGroup>

              <DetailsDescriptionGroup title={t('Project')} help={t('The Argo CD Project that this application belongs to.')}>
                  {/* TODO - Update to handle App in Any Namespace when controller namespace is in status */}
                  <ResourceLink groupVersionKind={{ group: 'argoproj.io', version: 'v1alpha1', kind: 'AppProject' }} name={obj?.spec?.project}/>
              </DetailsDescriptionGroup>

              <DetailsDescriptionGroup title={t('Destination')} help={t('The cluster and namespace where the application is targeted')}>
                {getFriendlyClusterName(obj?.spec?.destination.server)}/{obj?.spec?.destination.namespace}
              </DetailsDescriptionGroup>

              <DetailsDescriptionGroup title={t('Sync Policy')} help={t('Provides options to determine application synchronization behavior')}>
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
              </DetailsDescriptionGroup>

            </DescriptionList>
          </GridItem>
        </Grid>
      </PageSection>
      <PageSection hasShadowTop={true} variant={PageSectionVariants.light}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Sources')}
        </Title>
        <SourceList
          sources={sources}
        />
      </PageSection>
    </div>
  );
};

export default ApplicationDetailsTab;
