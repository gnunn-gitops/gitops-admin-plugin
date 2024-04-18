import { ConsolePluginBuildMetadata } from '@openshift-console/dynamic-plugin-sdk-webpack';

const metadata: ConsolePluginBuildMetadata = {
  dependencies: {
    '@console/pluginAPI': '*',
  },
  name: "gitops-admin-plugin",
  displayName: 'OpenShift GitOps Plugin',
  version: "0.2.0",
  description: "Administrator Perspective Console Plugin for OpenShift GitOps",
  exposedModules: {
    ApplicationList: "./gitops/components/application/ApplicationListTab.tsx",
    ApplicationDetails: "./gitops/components/application/ApplicationNavPage.tsx",
    yamlApplicationTemplates: "src/gitops/components/application/templates/index.ts",
    useApplicationActionsProvider: "./gitops/components/application/hooks/useApplicationActionsProvider.tsx",

    ProjectList: "./gitops/components/project/ProjectListTab.tsx",
    AppProjectDetails: "./gitops/components/project/ProjectNavPage.tsx",
    yamlAppProjectTemplates: "./gitops/components/project/templates/index.ts",
    useProjectActionsProvider: "./gitops/components/project/hooks/useProjectActionsProvider.tsx",

    ApplicationSetList: "./gitops/components/appset/AppSetListTab.tsx",
    ApplicationSetDetails: "./gitops/components/appset/AppSetNavPage.tsx",

    RolloutList: "./rollout/components/RolloutListTab.tsx",
    RolloutDetails: "./rollout/components/RolloutNavPage.tsx",
    useRolloutActionsProvider: "./rollout/components/hooks/useRolloutActionsProvider.tsx",
    yamlRolloutTemplates: "src/rollout/templates/index.ts",

    modalProvider: "./utils/components/ModalProvider/ModalProvider.tsx",

    dashboardUtils: "./gitops/components/dashboards/dashboardUtils.ts",
    ApplicationInventory: "./gitops/components/dashboards/Applications.tsx",
    ApplicationSetInventory: "./gitops/components/dashboards/ApplicationSets.tsx",

    ExternalSecretList: "./externalsecrets/components/ESListTab.tsx",
    useESActionsProvider: "./externalsecrets/components/hooks/useESActionsProvider.tsx",
  }
};

export default metadata;
