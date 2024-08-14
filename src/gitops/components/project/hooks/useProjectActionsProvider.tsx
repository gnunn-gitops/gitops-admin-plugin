import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useModal } from '@utils/components/ModalProvider/ModalProvider';
import ResourceDeleteModal from '@utils/components/ResourceDeleteModal/ResourceDeleteModal';
import { AppProjectKind, AppProjectModel, appProjectModelRef } from '@gitops-models/AppProjectModel';
import { Action, K8sVerb, useAnnotationsModal, useLabelsModal } from '@openshift-console/dynamic-plugin-sdk';

type UseProjectActionsProvider = (
  appProject: AppProjectKind,
) => [actions: Action[] /*, onOpen: () => void*/];
const t = (key: string) => key;

export const useProjectActionsProvider: UseProjectActionsProvider = (appProject) => {
  const history = useHistory();
  const { createModal } = useModal();

  const launchLabelsModal = useLabelsModal(appProject);
  const launchAnnotationsModal = useAnnotationsModal(appProject);

  const actions = React.useMemo(
    () => [
      {
        id: 'dataimportcron-action-edit-labels',
        disabled: false,
        label: t('Edit labels'),
        accessReview: {
          group: AppProjectModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: AppProjectModel.plural,
          namespace: appProject?.metadata?.namespace
        },
        cta: () => {launchLabelsModal()}
      },
      {
        id: 'crontab-action-edit-annotations',
        disabled: false,
        label: t('Edit annotations'),
        accessReview: {
          group: AppProjectModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: AppProjectModel.plural,
          namespace: appProject?.metadata?.namespace
        },
        cta: () => {launchAnnotationsModal()}
      },
      {
        id: 'crontab-action-edit-crontab',
        disabled: false,
        label: t('Edit'),
        accessReview: {
          group: AppProjectModel.apiGroup,
          verb: 'update' as K8sVerb,
          resource: AppProjectModel.plural,
          namespace: appProject?.metadata?.namespace
        },
        cta: () =>
          history.push(
            `/k8s/ns/${appProject.metadata.namespace}/${appProjectModelRef}/${appProject.metadata.name}/yaml`,
          ),
      },
      {
        id: 'crontab-action-delete',
        label: t('Delete'),
        accessReview: {
          group: AppProjectModel.apiGroup,
          verb: 'delete' as K8sVerb,
          resource: AppProjectModel.plural,
          namespace: appProject?.metadata?.namespace
        },
        cta: () =>
            createModal(({ isOpen, onClose }) => (
              <ResourceDeleteModal
                resource={appProject}
                isOpen={isOpen}
                onClose={onClose}
                shouldRedirect={true}
              />
            )),
        },
    ],
    [/*t, */ appProject, history],
  );

  return [actions];
};
