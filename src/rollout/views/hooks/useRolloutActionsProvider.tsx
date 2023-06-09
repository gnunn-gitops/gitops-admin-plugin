import React from 'react';
import { useHistory } from 'react-router-dom';

import { useModal } from '@gitops-utils/components/ModalProvider/ModalProvider';
import { Action, K8sVerb, k8sPatch } from '@openshift-console/dynamic-plugin-sdk';

import { AnnotationsModal } from '@shared/views/modals/AnnotationsModal/AnnotationsModal';
import { LabelsModal } from '@shared/views/modals/LabelsModal/LabelsModal';
import ResourceDeleteModal from '@shared/views/modals/ResourceDeleteModal/ResourceDeleteModal';
import { RolloutKind, RolloutModel, rolloutModelRef } from 'src/rollout/models/RolloutModel';

type UseRolloutActionsProvider = (
  rollout: RolloutKind,
) => [actions: Action[] /*, onOpen: () => void*/];
const t = (key: string) => key;

export const useRolloutActionsProvider: UseRolloutActionsProvider = (rollout) => {
  const { createModal } = useModal();
  const history = useHistory();

  const actions = React.useMemo(
    () => [
      {
        id: 'dataimportcron-action-edit-labels',
        disabled: false,
        label: t('Edit labels'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace
        },
        cta: () =>
          createModal(({ isOpen, onClose }) => (
            <LabelsModal
              obj={rollout}
              isOpen={isOpen}
              onClose={onClose}
              onLabelsSubmit={(labels) =>
                k8sPatch({
                  model: RolloutModel,
                  resource: rollout,
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
          )),
      },
      {
        id: 'crontab-action-edit-annotations',
        disabled: false,
        label: t('Edit annotations'),
        accessReview: {
          group: RolloutModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: RolloutModel.plural,
          namespace: rollout?.metadata?.namespace
        },
        cta: () =>
          createModal(({ isOpen, onClose }) => (
            <AnnotationsModal
              obj={rollout}
              isOpen={isOpen}
              onClose={onClose}
              onSubmit={(updatedAnnotations) =>
                k8sPatch({
                  model: RolloutModel,
                  resource: rollout,
                  data: [
                    {
                      op: 'replace',
                      path: '/metadata/annotations',
                      value: updatedAnnotations,
                    },
                  ],
                })
              }
            />
          )),
      },
      {
        id: 'crontab-action-edit-crontab',
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
        id: 'crontab-action-delete',
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
        //   ,accessReview: asAccessReview(DataImportCronModel, cronTab, 'delete'),
      },
    ],
    [/*t, */ rollout, createModal /*, dataSource*/, history],
  );

  return [actions];
};
