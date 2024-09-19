import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { useModal } from '@utils/components/ModalProvider/ModalProvider';
import { Action, K8sVerb, k8sUpdate, useAnnotationsModal, useLabelsModal } from '@openshift-console/dynamic-plugin-sdk';
import ResourceDeleteModal from '@utils/components/ResourceDeleteModal/ResourceDeleteModal';
import { CertificateRequestKind, CertificateRequestModel, certificateRequestModelRef } from '@cr-models/CertificateRequests';

type UseCRActionsProvider = (
  certificateRequest: CertificateRequestKind,
) => [actions: Action[] /*, onOpen: () => void*/];
const t = (key: string) => key;

export const useCRActionsProvider: UseCRActionsProvider = (certificateRequest) => {
  const { createModal } = useModal();
  const history = useHistory();

  const launchLabelsModal = useLabelsModal(certificateRequest);
  const launchAnnotationsModal = useAnnotationsModal(certificateRequest);

  const actions = React.useMemo(
    () => [
      {
        id: 'cr-action-edit-labels',
        disabled: false,
        label: t('Edit labels'),
        accessReview: {
          group: CertificateRequestModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: CertificateRequestModel.plural,
          namespace: certificateRequest?.metadata?.namespace
        },
        cta: () => {launchLabelsModal()}
      },
      {
        id: 'cr-action-edit-annotations',
        disabled: false,
        label: t('Edit annotations'),
        accessReview: {
          group: CertificateRequestModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: CertificateRequestModel.plural,
          namespace: certificateRequest?.metadata?.namespace
        },
        cta: () => {launchAnnotationsModal()}
      },
      {
        id: 'cr-action-edit-crontab',
        disabled: false,
        label: t('Edit'),
        accessReview: {
          group: CertificateRequestModel.apiGroup,
          verb: 'update' as K8sVerb,
          resource: CertificateRequestModel.plural,
          namespace: certificateRequest?.metadata?.namespace
        },
        cta: () =>
          history.push(
            `/k8s/ns/${certificateRequest.metadata.namespace}/${certificateRequestModelRef}/${certificateRequest.metadata.name}/yaml`,
          ),
      },
      {
        id: 'cr-action-delete',
        label: t('Delete'),
        accessReview: {
          group: CertificateRequestModel.apiGroup,
          verb: 'delete' as K8sVerb,
          resource: CertificateRequestModel.plural,
          namespace: certificateRequest?.metadata?.namespace
        },
        cta: () =>
            createModal(({ isOpen, onClose }) => (
              <ResourceDeleteModal
                resource={certificateRequest}
                isOpen={isOpen}
                onClose={onClose}
                shouldRedirect={true}
              />
            )),
        },
      {
        id: 'cr-action-refresh',
        label: t('Refresh'),
        accessReview: {
            group: CertificateRequestModel.apiGroup,
            verb: 'update' as K8sVerb,
            resource: CertificateRequestModel.plural,
            namespace: certificateRequest?.metadata?.namespace
        },
          cta: () => {
                if (!certificateRequest.metadata.annotations) {
                    certificateRequest.metadata.annotations = {};
                }
                certificateRequest.metadata.annotations["force-sync"] = "" + Math.round(new Date().getTime() / 1000);
                k8sUpdate({
                    model: CertificateRequestModel,
                    data: certificateRequest,
                });
          }
      },
    ],
    [/*t, */ certificateRequest, history],
  );

  return [actions];
};
