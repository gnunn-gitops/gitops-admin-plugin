import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { useModal } from '@utils/components/ModalProvider/ModalProvider';
import { Action, K8sVerb, k8sUpdate, useAnnotationsModal, useLabelsModal } from '@openshift-console/dynamic-plugin-sdk';

import ResourceDeleteModal from '@utils/components/ResourceDeleteModal/ResourceDeleteModal';
import { ExternalSecretKind, ExternalSecretModel, externalSecretModelRef } from '@es-models/ExternalSecrets';

type UseESActionsProvider = (
  externalSecret: ExternalSecretKind,
) => [actions: Action[] /*, onOpen: () => void*/];
const t = (key: string) => key;

export const useESActionsProvider: UseESActionsProvider = (externalSecret) => {
  const { createModal } = useModal();
  const history = useHistory();

  const launchLabelsModal = useLabelsModal(externalSecret);
  const launchAnnotationsModal = useAnnotationsModal(externalSecret);

  const actions = React.useMemo(
    () => [
      {
        id: 'es-action-edit-labels',
        disabled: false,
        label: t('Edit labels'),
        accessReview: {
          group: ExternalSecretModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: ExternalSecretModel.plural,
          namespace: externalSecret?.metadata?.namespace
        },
        cta: () => {launchLabelsModal()}
      },
      {
        id: 'es-action-edit-annotations',
        disabled: false,
        label: t('Edit annotations'),
        accessReview: {
          group: ExternalSecretModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: ExternalSecretModel.plural,
          namespace: externalSecret?.metadata?.namespace
        },
        cta: () => {launchAnnotationsModal()}
      },
      {
        id: 'es-action-edit-crontab',
        disabled: false,
        label: t('Edit'),
        accessReview: {
          group: ExternalSecretModel.apiGroup,
          verb: 'update' as K8sVerb,
          resource: ExternalSecretModel.plural,
          namespace: externalSecret?.metadata?.namespace
        },
        cta: () =>
          history.push(
            `/k8s/ns/${externalSecret.metadata.namespace}/${externalSecretModelRef}/${externalSecret.metadata.name}/yaml`,
          ),
      },
      {
        id: 'es-action-delete',
        label: t('Delete'),
        accessReview: {
          group: ExternalSecretModel.apiGroup,
          verb: 'delete' as K8sVerb,
          resource: ExternalSecretModel.plural,
          namespace: externalSecret?.metadata?.namespace
        },
        cta: () =>
          createModal(({ isOpen, onClose }) => (
            <ResourceDeleteModal
              resource={externalSecret}
              isOpen={isOpen}
              onClose={onClose}
              shouldRedirect={true}
            />
          )),
      },
      {
        id: 'es-action-refresh',
        label: t('Refresh'),
        accessReview: {
            group: ExternalSecretModel.apiGroup,
            verb: 'update' as K8sVerb,
            resource: ExternalSecretModel.plural,
            namespace: externalSecret?.metadata?.namespace
        },
          cta: () => {
                if (!externalSecret.metadata.annotations) {
                    externalSecret.metadata.annotations = {};
                }
                externalSecret.metadata.annotations["force-sync"] = "" + Math.round(new Date().getTime() / 1000);
                k8sUpdate({
                    model: ExternalSecretModel,
                    data: externalSecret,
                });
          }
      },
    ],
    [/*t, */ externalSecret, createModal /*, dataSource*/, history],
  );

  return [actions];
};
