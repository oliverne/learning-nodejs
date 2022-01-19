import 'reflect-metadata'; // Decorator 를 사용하는 라이브러리에서 필요할 경우
import process from 'node:process';
import Koa from 'koa';
import { UserService } from './services/user-service';

const app = new Koa();

app.use(async (ctx) => {
  const userService = new UserService(''); // 에러!!! 소스맵 설정과 디버그 모드로 에러 해결하기
  const user = await userService.verifyUser();
  ctx.body = user;
});

const port = process.env.PORT ?? 8080;

app.listen(port, () => {
  console.log(`Server started at port ${port}`);
});
