import * as React from 'react';
import { useHistory } from 'react-router-dom';

import { useModal } from '@utils/components/ModalProvider/ModalProvider';
import { Action, K8sVerb, k8sUpdate, useAnnotationsModal, useLabelsModal } from '@openshift-console/dynamic-plugin-sdk';
import ResourceDeleteModal from '@utils/components/ResourceDeleteModal/ResourceDeleteModal';
import { CertificateKind, CertificateModel, certificateModelRef } from '@cert-models/Certificates';

type UseCertActionsProvider = (
  certificate: CertificateKind,
) => [actions: Action[] /*, onOpen: () => void*/];
const t = (key: string) => key;

export const useCertActionsProvider: UseCertActionsProvider = (certificate) => {
  const { createModal } = useModal();
  const history = useHistory();

  const launchLabelsModal = useLabelsModal(certificate);
  const launchAnnotationsModal = useAnnotationsModal(certificate);

  const actions = React.useMemo(
    () => [
      {
        id: 'cert-action-edit-labels',
        disabled: false,
        label: t('Edit labels'),
        accessReview: {
          group: CertificateModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: CertificateModel.plural,
          namespace: certificate?.metadata?.namespace
        },
        cta: () => {launchLabelsModal()}
      },
      {
        id: 'cert-action-edit-annotations',
        disabled: false,
        label: t('Edit annotations'),
        accessReview: {
          group: CertificateModel.apiGroup,
          verb: 'patch' as K8sVerb,
          resource: CertificateModel.plural,
          namespace: certificate?.metadata?.namespace
        },
        cta: () => {launchAnnotationsModal()}
      },
      {
        id: 'cert-action-edit-crontab',
        disabled: false,
        label: t('Edit'),
        accessReview: {
          group: CertificateModel.apiGroup,
          verb: 'update' as K8sVerb,
          resource: CertificateModel.plural,
          namespace: certificate?.metadata?.namespace
        },
        cta: () =>
          history.push(
            `/k8s/ns/${certificate.metadata.namespace}/${certificateModelRef}/${certificate.metadata.name}/yaml`,
          ),
      },
      {
        id: 'cert-action-delete',
        label: t('Delete'),
        accessReview: {
          group: CertificateModel.apiGroup,
          verb: 'delete' as K8sVerb,
          resource: CertificateModel.plural,
          namespace: certificate?.metadata?.namespace
        },
        cta: () =>
          createModal(({ isOpen, onClose }) => (
            <ResourceDeleteModal
              resource={certificate}
              isOpen={isOpen}
              onClose={onClose}
              shouldRedirect={true}
            />
          )),
      },
      {
        id: 'cert-action-refresh',
        label: t('Refresh'),
        accessReview: {
            group: CertificateModel.apiGroup,
            verb: 'update' as K8sVerb,
            resource: CertificateModel.plural,
            namespace: certificate?.metadata?.namespace
        },
          cta: () => {
                if (!certificate.metadata.annotations) {
                    certificate.metadata.annotations = {};
                }
                certificate.metadata.annotations["force-sync"] = "" + Math.round(new Date().getTime() / 1000);
                k8sUpdate({
                    model: CertificateModel,
                    data: certificate,
                });
          }
      },
    ],
    [/*t, */ certificate, createModal /*, dataSource*/, history],
  );

  return [actions];
};
