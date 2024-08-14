import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { useModal } from '@utils/components/ModalProvider/ModalProvider';
import ResourceDeleteModal from '@utils/components/ResourceDeleteModal/ResourceDeleteModal';

import { Action, K8sVerb, useAnnotationsModal, useLabelsModal } from '@openshift-console/dynamic-plugin-sdk';

import { ApplicationSetKind, ApplicationSetModel, applicationSetModelRef } from '@gitops-models/ApplicationSetModel';

type UseAppSetActionsProvider = (
  appSet: ApplicationSetKind,
) => [actions: Action[] /*, onOpen: () => void*/];
const t = (key: string) => key;

export const useAppSetActionsProvider: UseAppSetActionsProvider = (appSet) => {
  const history = useHistory();
  const { createModal } = useModal();

  const launchLabelsModal = useLabelsModal(appSet);
  const launchAnnotationsModal = useAnnotationsModal(appSet);

  const actions = React.useMemo(
    () => [
      {
        id: 'dataimportcron-action-edit-labels',
        disabled: false,
        label: t('Edit labels'),
        accessReview: {
          group: ApplicationSetModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: ApplicationSetModel.plural,
          namespace: appSet?.metadata?.namespace
        },
        cta: () => {launchLabelsModal()}
      },
      {
        id: 'crontab-action-edit-annotations',
        disabled: false,
        label: t('Edit annotations'),
        accessReview: {
          group: ApplicationSetModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: ApplicationSetModel.plural,
          namespace: appSet?.metadata?.namespace
        },
        cta: () => {launchAnnotationsModal()}
      },
      {
        id: 'crontab-action-edit-crontab',
        disabled: false,
        label: t('Edit'),
        accessReview: {
          group: ApplicationSetModel.apiGroup,
          verb: 'update' as K8sVerb,
          resource: ApplicationSetModel.plural,
          namespace: appSet?.metadata?.namespace
        },
        cta: () =>
          history.push(
            `/k8s/ns/${appSet.metadata.namespace}/${applicationSetModelRef}/${appSet.metadata.name}/yaml`,
          ),
      },
      {
        id: 'crontab-action-delete',
        label: t('Delete'),
        accessReview: {
          group: ApplicationSetModel.apiGroup,
          verb: 'delete' as K8sVerb,
          resource: ApplicationSetModel.plural,
          namespace: appSet?.metadata?.namespace
        },
        cta: () =>
            createModal(({ isOpen, onClose }) => (
              <ResourceDeleteModal
                resource={appSet}
                isOpen={isOpen}
                onClose={onClose}
                shouldRedirect={true}
              />
            )),
        },
    ],
    [/*t, */ appSet, history],
  );

  return [actions];
};
