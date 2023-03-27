# OpenShift GitOps Dynamic Plugin

This plugin is a POC level OpenShift Console dynamic plugin to support OpenShift GitOps in the Administrator perspective. At this point it is very rough from a feature and UI perspective and thus absolutely not recommended in production environments.

At the moment it supports viewing Application objects including basic information, sources, deployment history and resources that it is managing. There is currently no interactivity with Argo CD (i.e. sync from the OCP console) but hope to add that in the future.

![alt text](https://raw.githubusercontent.com/gnunn-gitops/gitops-admin-plugin/main/docs/img/gitops-admin-plugin-list.png)

## Acknowledgements

Thanks to the following individuals:

* Pavel Kratochvíl whose [crontab](https://github.com/raspbeep/crontab-plugin/tree/initial-branch) example provides a great starting point for building plugins needed to support CRDs.
* Andrew Block for Kyverno policy plugin and getting me over the Typescript/react hump
* Keith Chong for his work on the Developers perspective GitOps plugin from which I borrowed a few things.

## Deployment on cluster


### Installing the Helm Chart
A [Helm](https://helm.sh) chart is available to deploy the plugin to an OpenShift environment.

To deploy the plugin on a cluster using a Helm chart:
```shell
helm upgrade -i gitops-admin-plugin charts/openshift-console-plugin -n gitops-admin-plugin --create-namespace --set plugin.image=quay.io/gnunn/gitops-admin-plugin:latest
```

`-i gitops-admin-plugin`: specifies installation of a release named `gitops-admin-plugin`

`-n gitops-admin-plugin --create-namespace`: creates a new namespace for the helm chart

`plugin.image`: Specifies the location of the image containing the plugin, to be deployed

Additional parameters can be specified if desired. Consult the chart [values](charts/openshift-console-plugin/values.yaml) file for the full set of supported parameters.

## Local development

### Option 1:
In one terminal window, run:

1. `yarn install`
2. `yarn run start`

In another terminal window, run:

1. `oc login`
2. `yarn run start-console` (requires [Docker](https://www.docker.com) or [podman](https://podman.io))

## Docker image

Before you can deploy your plugin on a cluster, you must build an image and
push it to an image registry.

1. Build the image:

   NOTE: If you have a Mac with Apple silicon, you will need to add the flag
   `--platform=linux/amd64` when building the image to target the correct platform
   to run in-cluster.

   ```sh
   docker build -f Dockerfile -t $NAME/gitops-plugin:latest . --no-cache
   ```

3. Push the image:

   ```sh
   docker push $NAME/gitops-plugin:latest
   ```
