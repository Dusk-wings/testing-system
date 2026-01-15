import { env } from "./config/env";
import { server } from "./index";

server.listen(env.port, () => {
    console.log(`Server running at http://localhost:${env.port}`);
})