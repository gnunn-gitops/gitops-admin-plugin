import * as React from 'react';
import { Trans } from 'react-i18next';

import { AppProjectKind } from '@appproject-model';
import { useGitOpsTranslation } from '@gitops-utils/hooks/useGitOpsTranslation';

type ConfirmActionMessageProps = {
  obj: AppProjectKind;
  action?: string;
};

const ConfirmActionMessage: React.FC<ConfirmActionMessageProps> = ({ obj, action = 'delete' }) => {
  const { t } = useGitOpsTranslation();
  const objNamespace = obj?.metadata?.namespace;

  return (
    <Trans t={t}>
      Are you sure you want to {action} <strong>{obj?.metadata?.name}</strong>
      {objNamespace && (
        <>
          {' '}
          in namespace <strong>{objNamespace}</strong>
        </>
      )}
      ?
    </Trans>
  );
};

export default ConfirmActionMessage;