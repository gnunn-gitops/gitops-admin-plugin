import { ArgoServer } from "@gitops-utils/gitops";
import { consoleFetchJSON } from "@openshift-console/dynamic-plugin-sdk";

// export type TokenExchange = {
//     access_token: string,
//     issued_token_type: string,
//     token_type: string,
//     expires_in: number
// }

export const getDexToken = async (server: ArgoServer):Promise<string> => {

    console.log("Getting Dex Token");

    var jsonBody = {
        'host': server.host,
        'protocol': server.protocol,
        'path': '/api/dex/token'
    }

    const response = await consoleFetchJSON('/api/proxy/plugin/gitops-admin-plugin/token-exchange/token', 'POST', {
        method: 'POST',
        headers: {
            'content-type': 'application/json;charset=UTF-8',
            'Accept': 'application/json'
        },
        body: JSON.stringify(jsonBody),
    });

    const {data, errors} = await response.json()
    if (response.ok) {
      const access_token = data?.access_token
        return access_token
    } else {
      // handle the graphql errors
      const error = new Error(errors?.map(e => e.message).join('\n') ?? 'unknown')
      return Promise.reject(error)
    }
}