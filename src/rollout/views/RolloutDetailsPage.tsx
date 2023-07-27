import * as React from 'react';
import { RouteComponentProps } from 'react-router';
import {
  DescriptionList,
  Grid,
  GridItem,
  NumberInput,
  PageSection,
  Title
} from '@patternfly/react-core';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';
import { getObjectModifyPermissions, resourceAsArray } from '@gitops-utils/utils';
import StandardDetailsGroup from '@shared/views/components/StandardDetailsGroup/StandardDetailsGroup';
import { RolloutModel } from '@rollout-model/RolloutModel';
import BlueGreenServices from './components/services/BlueGreenServices';
import CanaryServices from './components/services/CanaryServices';
import { k8sUpdate, useK8sWatchResource } from '@openshift-console/dynamic-plugin-sdk';
import { Revisions } from './components/revisions/Revisions';
import { DetailsDescriptionGroup } from '@shared/views/components/DetailsDescriptionGroup/DetailsDescriptionGroup';
import { RolloutStatusFragment } from './components/rolloutstatus/RolloutStatus';
import { Conditions } from '@shared/views/components/Conditions/conditions';

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
    obj.spec.replicas = (obj.spec.replicas || 0) + 1;
    k8sUpdate({
      model: RolloutModel,
      data: obj
    });
  };

  const onReplicaMinus = () => {
    obj.spec.replicas = (obj.spec.replicas || 0) - 1;
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

              <DetailsDescriptionGroup title={t('Replicas')} help={t('The number of desired replicas for the rollout')}>
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
              </DetailsDescriptionGroup>

              <DetailsDescriptionGroup title={t('Status')} help={t('The current status of the rollout')}>
                <RolloutStatusFragment status={obj?.status?.phase} message={obj?.status?.message}/>
              </DetailsDescriptionGroup>

              <DetailsDescriptionGroup title={t('Strategy')} help={t('Whether the rollout is using a blue-green or canary strategy')}>
                {obj?.spec?.strategy?.blueGreen ? "Blue-Green" : "Canary"}
              </DetailsDescriptionGroup>

              {obj?.spec?.strategy?.blueGreen ?
                <BlueGreenServices rollout={obj} />
                :
                <CanaryServices rollout={obj} />
              }

            </DescriptionList>
          </GridItem>
        </Grid>
      </PageSection>
      <PageSection hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Revisions')}
        </Title>
        <Revisions rollout={obj} replicaSets={resourceAsArray(replicaSets)} />
      </PageSection>
      <PageSection hasShadowTop={true}>
        <Title headingLevel="h2" className="co-section-heading">
          {t('Conditions')}
        </Title>
          {obj.status?.conditions ?
            <Conditions conditions={obj.status.conditions}/>
          :
            <><span className='pf-u-text-align-center'>No Conditions</span></>
          }
      </PageSection>
    </div>
  );
};

export default RolloutDetailsPage;
