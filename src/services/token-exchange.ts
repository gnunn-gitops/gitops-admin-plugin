import { consoleFetchJSON } from "@openshift-console/dynamic-plugin-sdk";

export const getDexToken = async (consoleToken, namespace, serverURL: string) => {

    var jsonBody = {
        'grant-type': 'urn:ietf:params:oauth:grant-type:token-exchange',
        'audience': 'openshift',
        'subject_token': consoleToken,
        'subject_token_type': 'urn:ietf:params:oauth:token-type:access_token',
        'requested_token_type': 'urn:ietf:params:oauth:token-type:id_token',
        'scope': 'email groups',
        'resource': 'argo-cd'
    }

    var formBody = [];
    for (var property in jsonBody) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(jsonBody[property]);
      formBody.push(encodedKey + "=" + encodedValue);
    }

    consoleFetchJSON(serverURL + '/api/dex/token', 'POST', {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
        },
        body: formBody.join("&")
    });

}