import process from 'node:process';
import Koa from 'koa';
import { UserService } from './services/user-service';

const app = new Koa();

app.use(async (ctx) => {
  const userService = new UserService('');
  const user = await userService.verifyUser();
  ctx.body = user;
});

const port = process.env.PORT ?? 8080;

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
