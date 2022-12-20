import {
    RegistrationFlow,
    UiNode,
    UiNodeAttributes,
    UiNodeInputAttributes,
    UpdateRegistrationFlowBody
} from "@ory/client"
import { UserAuthCard } from "@ory/elements"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import ory from "./config"

const sdk = ory.frontend;

export function isUiNodeInputAttributes(attrs: UiNodeAttributes): attrs is UiNodeInputAttributes {
    return attrs.node_type === 'input';
}

const getCsrfToken = (uiNodes: UiNode[]) => {
    for(let i = 0; i < uiNodes.length; i++){
        const node = uiNodes[i]
        if(isUiNodeInputAttributes(node.attributes)){
            if(node.attributes.name === "csrf_token"){

                return node.attributes.value;
            }
        }

    }
    return null;
}



export const Registration = () => {
    const [flow, setFlow] = useState<RegistrationFlow | null>(null)
    const [searchParams, setSearchParams] = useSearchParams()

    const navigate = useNavigate()

    // create a new registration flow
    const createFlow = useCallback(
        () =>
            sdk
                // we don't need to specify the return_to here since we are building an SPA. In server-side browser flows we would need to specify the return_to
                .createBrowserRegistrationFlow()
                .then(({ data: flow }) => {
                    setFlow(flow)
                })
                // something serious went wrong so we redirect to the registration page
                .catch((error) => {
                    console.error(error)
                    navigate("/signup", { replace: true })
                }),
        [],
    )

    // Get the flow based on the flowId in the URL (.e.g redirect to this page after flow initialized)
    const getFlow = useCallback(
        (flowId: string) =>
            sdk
                // the flow data contains the form fields, error messages and csrf token
                .getRegistrationFlow({ id: flowId })
                .then(({ data: flow }) => setFlow(flow))
                .catch((err) => {
                    console.error(err)
                    return err
                }),
        [],
    )

    const mockSubmit = () => {
        if(flow){
            const csrf_token = getCsrfToken(flow.ui.nodes)
            const body: UpdateRegistrationFlowBody = {
                csrf_token,
                traits: {
                    email: "someemail@email.com",
                    name: {
                        first: "asdfsadf??",
                        last: ""
                    }
                },
                method: "password"
            }
            console.log(body)

            sdk
                .updateRegistrationFlow({
                    flow: flow.id,
                    updateRegistrationFlowBody: body,
                }).then((response) => {
                    console.log(response.data)
                }).catch(error => {
                    console.log(error.response.data);
                })
        }
    }

    useEffect(() => {
        // we might redirect to this page after the flow is initialized, so we check for the flowId in the URL
        const flowId = searchParams.get("flow")
        // the flow already exists
        if (flowId) {
            getFlow(flowId).catch(createFlow) // if for some reason the flow has expired, we need to get a new one
            return
        }
        // we assume there was no flow, so we create a new one
        createFlow()
    }, [])

    console.log(flow)
    // the flow is not set yet, so we show a loading indicator
    return (<div>
        <h1>Registration</h1>
        <button onClick={mockSubmit}>Submit Mock Data</button>
    </div>)
}
