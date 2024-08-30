import { Hono } from 'hono'
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { sign, verify } from 'hono/jwt'


const app = new Hono<{
  Bindings: {
    DATABASE_URL: string, //declating the type of env variable
    JWT_SECRET: string, //declaring the type of JWT secret
  }
}>();
//applying the middleware from blue teaming side
app.use('/api/v1/blog/*', async (c, next) => {
  //get the header
  //verify the header
  //if the header is correct, we can proceed
  //if not then we return the user 403
  const header = c.req.header('Authorization') || ""; //looking for authorization header

  const response = verify(header, c.env.JWT_SECRET)
  await next();
})

app.post('/api/v1/signup', async (c) => { //c stands for context
  const prisma = new PrismaClient({
    //@ts-ignore : to ignore the next line
    datasourceUrl: c.env.DATABASE_URL, //here we are using the env variable
}).$extends(withAccelerate())

const body = await c.req.json(); //getting the request body
 
try {

  const user = await prisma.user.create({
    data:{
      email: body.email,
      password: body.password,
    }
  })

  const token = await sign({id: user.id}, c.env.JWT_SECRET); //signing s JWT
  
    return c.json({
      jwt: token
    })

} catch(e){
  c.status(403); //setting it as 403
  return c.json({ error: "error while signing up" }); //passing the 403 with error
}
})


app.post('/api/v1/signin', async (c) => {
	const prisma = new PrismaClient({
		datasourceUrl: c.env.DATABASE_URL	,
	}).$extends(withAccelerate());

	const body = await c.req.json();
	const user = await prisma.user.findUnique({
		where: {
			email: body.email,
      password: body.password
		}
	});

	if (!user) {
		c.status(403);
		return c.json({ error: "user not found" });
	}

	const token = await sign({ id: user.id }, c.env.JWT_SECRET);
	return c.json({ jwt: token });
})



app.post('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})
app.post('/api/v1/blog/bulk', (c) => {
  return c.text('Hello Hono!')
})

app.put('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

app.get('/api/v1/blog', (c) => {
  return c.text('Hello Hono!')
})

export default app
