# Introduction

This project provides an OpenShift Console [plugin](https://docs.openshift.com/container-platform/4.13/web_console/dynamic-plugin/overview-dynamic-plugin.html)
to manage OpenShift GitOps (aka Argo CD and Rollouts) as well as External Secrets.

This plugin is not intended as a 1:1 replacement for the Argo CD UI, rather it enables users to accomplish ~70 percent of their tasks in the OpenShift
console with ability to easily "punch-out" to the Argo CD UI if more features are required. This plugin follows the OpenShift Console's philosophy
in that it interacts with resources via the Kubernetes API, it does not use Argo CD RBAC. Please review the [Philosophy](https://github.com/gnunn-gitops/gitops-admin-plugin?tab=readme-ov-file#philosophy)
section for more details.

**Note**: This plugin is community supported and is not part of the OpenShift GitOps product nor is it supported by Red Hat. I assume
no responsibility for anything that goes wrong so caveat emptor.

# Features

Here are some features of the plugin:

<table>
    <tr>
      <th >Feature</th>
      <th >Description&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</th>
      <th >Screenshots</th>
    </tr>
    <tr>
      <td valign="top">Dashboard - Inventory</td>
      <td valign="top">
        <ul>
            <li>Adds Applications and ApplicationSets to Inventory Dashboard</li>
        </ul>
      </td>
      <td>
        <a target="_blank" href="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/dashboard-inventory.png">
          <img src="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/dashboard-inventory.png"/>
        </a>
      </td>
    </tr>
    <tr>
      <td valign="top">Application</td>
      <td valign="top">
        <ul>
            <li>Filter on sync and health statuses</li>
            <li>View synced resources</li>
            <li>View last synced status</li>
            <li>Modify sync properties (automated,self-heal, prune)</li>
            <li>Common actions: Sync, Refresh (Soft and Hard), Terminate</li>
            <li>Punch out to Argo CD UI for app as well as specific resource</li>
        </ul>
      </td>
      <td >
        <a target="_blank" href="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/apps-list.png">
          <img src="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/apps-list.png"/>
        </a>
        <a target="_blank" href="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/apps-details.png">
            <img src="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/apps-details.png">
        </a>
      </td>
    </tr>
    <tr>
      <td valign="top">ApplicationSet</td>
      <td valign="top">
        <ul>
            <li>Filter on status</li>
            <li>View generators</li>
            <li>View list of Applications for AppSet</li>
        </ul>
      </td>
      <td >
        <a target="_blank" href="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/appset-list.png">
          <img src="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/appset-list.png"/>
        </a>
        <a target="_blank" href="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/appset-details.png">
            <img src="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/appset-details.png">
        </a>
      </td>
    </tr>
    <tr>
      <td valign="top">AppProject</td>
      <td valign="top">
        <ul>
            <li>View list of Applications for project (if in same namespace)</li>
            <li>View resource allow/deny lists</li>
            <li>View defined roles</li>
            <li>View sync windows</li>
        </ul>
      </td>
      <td >
        <a target="_blank" href="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/projects-list.png">
          <img src="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/appset-list.png"/>
        </a>
        <a target="_blank" href="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/projects-details.png">
            <img src="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/appset-details.png">
        </a>
      </td>
    </tr>
    <tr>
      <td valign="top">Rollouts</td>
      <td valign="top">
        <ul>
            <li>Filter on status of Rollout</li>
            <li>Actions: Promote, Full Promote, Retry, Restart, Abort</li>
            <li>View Revisions</li>
            <li>View AnalysisRuns</li>
        </ul>
      </td>
      <td >
        <a target="_blank" href="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/rollouts-list.png">
          <img src="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/appset-list.png"/>
        </a>
        <a target="_blank" href="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/rollouts-details.png">
            <img src="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/appset-details.png">
        </a>
        <a target="_blank" href="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/rollouts-revisions.png">
            <img src="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/rollouts-revisions.png">
        </a>
      </td>
    </tr>
    <tr>
      <td valign="top">ExternalSecrets</td>
      <td valign="top">
        <ul>
            <li>Support ExternalSecret Kind</li>
            <li>Filter on ExternalSecret status</li>
            <li>Refresh ExternalSecret</li>
        </ul>
      </td>
      <td >
        <a target="_blank" href="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/externalsecrets-list.png">
          <img src="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/appset-list.png"/>
        </a>
        <a target="_blank" href="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/externalsecrets-details.png">
            <img src="https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/appset-details.png">
        </a>
      </td>
    </tr>
</table>

# Philosophy

As mentioned previously, this plugin is not intended as a general replacement for the Argo CD UI since it operates under a different
philosophy. Specifically the OpenShift Console is a Kubernetes resource driven view of the cluster and this plugin adheres to that philosophy.

If the user has Kubernetes RBAC permissions to view Application objects then it will appear in this plugin. If the user has permissions
 to update and patch the Application objects then they will be able to sync and refresh the application. Argo RBAC is not used at all
 in the plugin.

As a result this plugin is not particularly suitable for users working with Argo CD in multi-tenant deployments. This is because in a
multi-tenant scenario Argo RBAC must be used to enforce separation between tenants and tenants cannot be allowed direct access to the
namespace where Argo CD and the Applications are deployed. Otherwise the user will be able to view secrets they should not have access to, potentially modify Application objects to bypass Argo CD RBAC, etc.

This plugin does work well with [Applications in Any Namespace](https://argo-cd.readthedocs.io/en/stable/operator-manual/app-any-namespace) which
is my preferred way to handle multi-tenancy and works fine with this plugin.

Outside of Applications in Any Namespace, at this time the plugin is best suited for cluster and Argo CD administrators who will typically have elevated permissions.

# Limitations

There are some limitations in this current implementation:

- Limited testing across the wide swath of Argo CD features, for example Helm apps have only been lightly tested.
- Limited error handling, if something does not work as expected check the browser console logs
- No general editing capabilities beyond editing the yaml
- Limited useability testing but suggestions for UI improvements definitely welcome!

# Prerequisites

The following prerequisites are required to use this plugin:

* OpenShift 4.15+
* OpenShift GitOps 1.8+ or Argo CD 2.6+ (tested with OpenShift GitOps 1.9/Argo CD 2.7)

## Versioning

OpenShift 4.15 made many incompatible changes in the plugin API, notably it supports React 5 and Patternfly 5. I have opted
to upgrade the plugin to the newer versions and as a result the `4.15` branch and image tag should be used to install the
plugin on 4.15. The main branch covers `4.15`, the `4.14` version is not recommended as no further work is being
for that version.

| OpenShift Version  | Branch      | Image Tag        |
| ------------- | -------------      | -------------- |
| 4.14 (not supported)  | 4.14-0.0.21  | 4.14 |
| 4.15  | main  | 4.15, latest |
| 4.16  | 4.16  | 4.16 |

## Deployment on cluster

The plugin can be installed from the manifests included in the `/manifests` folder using kustomize, make sure
to use the correct branch for the desired version.

### With Plugin Patch Job

```bash
oc apply -k https://github.com/gnunn-gitops/gitops-admin-plugin/manifests/overlays/install
```

Note the `install` overlay includes a job with the elevated permissions needed to patch `consoles.operator.openshift.io` to
include this specific plugin. This enables deployment via Argo CD since everything is automated.

After running this command it may take a few minutes for the plugin to appear, check `oc get co` to see the
status of the console operator.

### Declartive

If you define  `consoles.operator.openshift.io` through code, add ```gitops-admin-plugin``` to the yaml, then run the below:

```bash
oc apply -k https://github.com/gnunn-gitops/gitops-admin-plugin/manifests/overlays/install-gitops
```


## Local development

### Option 1:
In one terminal window, run:

1. `yarn install`
2. `yarn run start`

In another terminal window, run:

1. `oc login`
2. `yarn run start-console` (requires [Docker](https://www.docker.com) or [podman](https://podman.io))

You will then be able to access the console with the plugin at `http://localhost:9000` in a browser.

## Container image

You can build the plugin as a container image using podman (or docker if you prefer) with the following command:

```
podman build . -t <your-image-name>
```

The image used by the manifests is hosted at [quay.io/gnunn/gitops-admin-plugin](quay.io/gnunn/gitops-admin-plugin).

## Acknowledgements

Thanks to the following individuals:

* Pavel Kratochvíl whose [crontab](https://github.com/raspbeep/crontab-plugin/tree/initial-branch) example provides a great starting point for building plugins needed to support CRDs.
* Andrew Block for Kyverno policy plugin and getting me over the Typescript/react hump
* Keith Chong for his work on the Developers perspective GitOps plugin from which I borrowed a few things.
- Thanks to the OpenShift Virtualization folks, their [kubevirt-plugin](https://github.com/kubevirt-ui/kubevirt-plugin) repository is an invaluable reference.
* Argo CD UI where I leveraged it for A/B testing plus re-used some of the existing code there instead of re-inventing the wheel. All rights remain with original authors, code I specifically use:
  - code for determining Operation State
  - code for calculating URLs for git repos and paths


Note some ActionDropDown stuff taken from kubevirt console plugin [here](https://github.com/kubevirt-ui/kubevirt-plugin/blob/main/src/utils/components/ActionsDropdown/ActionsDropdown.tsx).
