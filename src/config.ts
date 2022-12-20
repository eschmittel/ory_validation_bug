import { Configuration, FrontendApi } from '@ory/client';

const config = new Configuration({
    basePath: "http://localhost:4000",
    baseOptions: {
        withCredentials: true,
        timeout: 30000
    }
});

const ory = {
    frontend: new FrontendApi(config)
};

export default ory;
