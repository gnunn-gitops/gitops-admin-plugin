import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { useModal } from '@utils/components/ModalProvider/ModalProvider';
import { Action, K8sVerb, useAnnotationsModal, useLabelsModal } from '@openshift-console/dynamic-plugin-sdk';

import ResourceDeleteModal from '@utils/components/ResourceDeleteModal/ResourceDeleteModal';
import { RolloutKind, RolloutModel, rolloutModelRef } from 'src/rollout/models/RolloutModel';
import { abortRollout, promoteRollout, restartRollout, retryRollout } from '@rollout-services/Rollout';
import { RolloutStatus, isDeploying } from 'src/rollout/utils/rollout-utils';

type UseRolloutActionsProvider = (
  rollout: RolloutKind,
) => [actions: Action[] /*, onOpen: () => void*/];
const t = (key: string) => key;

export const useRolloutActionsProvider: UseRolloutActionsProvider = (rollout) => {
  const { createModal } = useModal();
  const history = useHistory();

  const launchLabelsModal = useLabelsModal(rollout);
  const launchAnnotationsModal = useAnnotationsModal(rollout);

  const actions = React.useMemo(
    () => [
      {
        id: 'gitops-action-promote',
        disabled: !isDeploying(rollout),
        label: t('Promote'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace
        },
        cta: () =>
          // TODO - Show toast alert if it fails but this is proving more challenging then I thought
          promoteRollout(rollout, false)
      },
      {
        id: 'gitops-action-promote-full',
        disabled: !isDeploying(rollout),
        label: t('Full Promote'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace
        },
        cta: () =>
          // TODO - Show toast alert if it fails but this is proving more challenging then I thought
          promoteRollout(rollout, true)
      },
      {
        id: 'gitops-action-abort',
        disabled: !isDeploying(rollout),
        label: t('Abort'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace
        },
        cta: () =>
          // TODO - Show toast alert if it fails but this is proving more challenging then I thought
          abortRollout(rollout)
      },
      {
        id: 'gitops-action-retry',
        disabled: rollout?.status?.phase !== RolloutStatus.Degraded,
        label: t('Retry'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace
        },
        cta: () =>
          // TODO - Show toast alert if it fails but this is proving more challenging then I thought
          retryRollout(rollout)
      },
      {
        id: 'gitops-action-restart',
        disabled: false,
        label: t('Restart'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace
        },
        cta: () =>
          // TODO - Show toast alert if it fails but this is proving more challenging then I thought
          restartRollout(rollout)
      },
      {
        id: 'rollout-action-edit-labels',
        disabled: false,
        label: t('Edit labels'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace
        },
        cta: () => {launchLabelsModal()}
      },
      {
        id: 'rollout-action-edit-annotations',
        disabled: false,
        label: t('Edit annotations'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace
        },
        cta: () => {launchAnnotationsModal}
      },
      {
        id: 'rollout-action-edit-crontab',
        disabled: false,
        label: t('Edit'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'update' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace
        },
        cta: () =>
          history.push(
            `/k8s/ns/${rollout.metadata.namespace}/${rolloutModelRef}/${rollout.metadata.name}/yaml`,
          ),
      },
      {
        id: 'rollout-action-delete',
        label: t('Delete'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'delete' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace
        },
        cta: () =>
          createModal(({ isOpen, onClose }) => (
            <ResourceDeleteModal
              resource={rollout}
              isOpen={isOpen}
              onClose={onClose}
              pushHistory={true}
            />
          )),
      },
    ],
    [/*t, */ rollout, createModal /*, dataSource*/, history],
  );

  return [actions];
};
