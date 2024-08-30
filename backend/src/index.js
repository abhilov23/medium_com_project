import { Hono } from 'hono';
import { PrismaClient } from '@prisma/client/edge';
import { withAccelerate } from '@prisma/extension-accelerate';
import { sign } from 'hono/jwt';
const app = new Hono();
app.post('/api/v1/signup', async (c) => {
    const prisma = new PrismaClient({
        //@ts-ignore : to ignore the next line
        datasourceUrl: c.env.DATABASE_URL, //here we are using the env variable
    }).$extends(withAccelerate());
    const body = await c.req.json(); //getting the request body
    try {
        const user = await prisma.user.create({
            data: {
                email: body.email,
                password: body.password,
            }
        });
        const token = await sign({ id: user.id }, c.env.JWT_SECRET); //signing s JWT
        return c.json({
            jwt: token
        });
    }
    catch (e) {
        return c.status(403);
    }
});
app.post('/api/v1/signin', (c) => {
    return c.text('Hello Hono!');
});
app.post('/api/v1/blog', (c) => {
    return c.text('Hello Hono!');
});
app.post('/api/v1/blog/bulk', (c) => {
    return c.text('Hello Hono!');
});
app.put('/api/v1/blog', (c) => {
    return c.text('Hello Hono!');
});
app.get('/api/v1/blog', (c) => {
    return c.text('Hello Hono!');
});
export default app;
