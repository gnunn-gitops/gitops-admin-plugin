import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { Action, K8sVerb, useAnnotationsModal, useLabelsModal, useDeleteModal } from '@openshift-console/dynamic-plugin-sdk';

import { ApplicationSetKind, ApplicationSetModel, applicationSetModelRef } from '@gitops-models/ApplicationSetModel';

type UseAppSetActionsProvider = (
  appSet: ApplicationSetKind,
) => [actions: Action[] /*, onOpen: () => void*/];
const t = (key: string) => key;

export const useAppSetActionsProvider: UseAppSetActionsProvider = (appSet) => {
  const history = useHistory();

  const launchLabelsModal = useLabelsModal(appSet);
  const launchAnnotationsModal = useAnnotationsModal(appSet);
  const launchDeleteModal = useDeleteModal(appSet);

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
        cta: () => {launchDeleteModal()}
      },
    ],
    [/*t, */ appSet, history],
  );

  return [actions];
};
