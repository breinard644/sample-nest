import { registerAs } from "@nestjs/config";

export default registerAs('cronConfig',()=>({
    cronPort : process.env.QUEUE_PORT,
    queueHost : process.env.QUEUE_HOST
}))