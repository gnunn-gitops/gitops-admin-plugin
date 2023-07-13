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
  NumberInput,
  PageSection,
  Popover,
  Title
} from '@patternfly/react-core';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import { getObjectModifyPermissions } from '@gitops-utils/utils';
import StandardDetailsGroup from '@shared/views/components/StandardDetailsGroup/StandardDetailsGroup';
import { RolloutModel } from '@rollout-model/RolloutModel';
import BlueGreenServices from './components/services/BlueGreenServices';
import CanaryServices from './components/services/CanaryServices';
import { k8sUpdate, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { Revisions } from './components/revisions/Revisions';

type RolloutDetailsPageProps = RouteComponentProps<{
  ns: string;
  name: string;
}> & {
  obj?: any;
};

const RolloutDetailsPage: React.FC<RolloutDetailsPageProps> = ({ obj }) => {
  const { t } = useGitOpsTranslation();

  const [canPatch, canUpdate] = getObjectModifyPermissions(obj, RolloutModel);

  const [replicaSets] = useK8sWatchResource({
    groupVersionKind: { group: 'apps', version: 'v1', kind: 'ReplicaSet' },
    isList: true,
    namespaced: true,
    namespace: obj.metadata?.namespace,
    selector: obj.spec.selector
  });

  const onReplicaChange = (event: React.FormEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    if (obj.spec.replicas == value) return;
    obj.spec.replicas = value;
    k8sUpdate({
      model: RolloutModel,
      data: obj
    });
  };

  const onReplicaPlus = () => {
    obj.spec.replicas =(obj.spec.replicas || 0) + 1;
    k8sUpdate({
      model: RolloutModel,
      data: obj
    });
  };

  const onReplicaMinus = () => {
    obj.spec.replicas =(obj.spec.replicas || 0) - 1;
    k8sUpdate({
      model: RolloutModel,
      data: obj
    });
  };

  return (
    <div>
      <PageSection>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Rollout details')}
        </Title>
        <Grid hasGutter={true} span={2} sm={3} md={6} lg={6} xl={6} xl2={6}>
          <GridItem>
            <DescriptionList>
              <StandardDetailsGroup
                obj={obj}
                model={RolloutModel}
                canPatch={canPatch}
                exclude={[]}
              />
            </DescriptionList>
          </GridItem>
          <GridItem>
            <DescriptionList>
            <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Replicas')}</div>} bodyContent={<div>{t('The number of desired replicas for the rollout')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Replicas')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>
                <NumberInput
                  value={obj.spec.replicas}
                  onChange={onReplicaChange}
                  onPlus={onReplicaPlus}
                  onMinus={onReplicaMinus}
                  inputName="replicas"
                  inputAriaLabel="replicas"
                  minusBtnAriaLabel="minus"
                  plusBtnAriaLabel="plus"
                  min={0}
                  isDisabled={!canUpdate}
                />
                </DescriptionListDescription>
              </DescriptionListGroup>

              <DescriptionListGroup>
                <DescriptionListTermHelpText>
                  <Popover headerContent={<div>{t('Strategy')}</div>} bodyContent={<div>{t('Whether the rollout is using a blue-green or canary strategy')}</div>}>
                    <DescriptionListTermHelpTextButton>{t('Strategy')}</DescriptionListTermHelpTextButton>
                  </Popover>
                </DescriptionListTermHelpText>
                <DescriptionListDescription>{obj?.spec?.strategy?.blueGreen ? "Blue-Green" : "Canary"}</DescriptionListDescription>
              </DescriptionListGroup>

              {obj?.spec?.strategy?.blueGreen ?
                <BlueGreenServices rollout={obj}/>
              :
                <CanaryServices rollout={obj}/>
              }

            </DescriptionList>
          </GridItem>
        </Grid>
      </PageSection>
      <PageSection hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Revisions')}
        </Title>
        <Revisions rollout={obj} replicaSets={replicaSets}/>
      </PageSection>

    </div>
  );
};

export default RolloutDetailsPage;
