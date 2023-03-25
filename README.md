# OpenShift CronTab Dynamic Plugin

This project serves as a minimal template for an Openshift dynamic plugin. It shows basic operations with a Custom Resource Definition (CRD), in this case CronTab CRD, such as creating, editing and deleting.

It requires OpenShift 4.11.

The CronTab Dynamic Plugin creates new menu entry, routes, list page, details page and a
default YAML template for a CRD.

## Deployment on cluster


### Option 1: Installing the Helm Chart (WIP - does not work yet)
A [Helm](https://helm.sh) chart is available to deploy the plugin to an OpenShift environment.

To deploy the plugin on a cluster using a Helm chart:
```shell
helm upgrade -i crontab-plugin charts/crontab-plugin -n crontab-plugin-ns --create-namespace --set plugin.image=docker.io/raspbeep/crontab-plugin:latest
```

`-i crontab-plugin`: specifies installation of a release named `crontab-plugin`

`-n crontab-plugin-ns --create-namespace`: creates a new namespace for the helm chart

`plugin.image`: Specifies the location of the image containing the plugin, to be deployed

Additional parameters can be specified if desired. Consult the chart [values](charts/openshift-console-plugin/values.yaml) file for the full set of supported parameters.


### Option 2:
You can deploy the plugin to a cluster by applying `oc-manifest.yaml`.

```sh
oc apply -f oc-manifest.yaml
```

`oc-manifest.yaml` specifies all Kubernetes resources (and their desired state) necessary for the dynamic plugin. This includes: Namespace, CustomResourceDefinition, Deployment (with plugin image location), Configmap, Service and Console Plugin.

Once deployed, patch the [Console operator](https://github.com/openshift/console-operator)
config to enable the plugin.

```sh
oc patch consoles.operator.openshift.io cluster --patch '{ "spec": { "plugins": ["crontab-plugin"] } }' --type=merge
```


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
   docker build -f Dockerfile -t $NAME/crontab-plugin:latest . --no-cache
   ```

3. Push the image:

   ```sh
   docker push $NAME/crontab-plugin:latest
   ```