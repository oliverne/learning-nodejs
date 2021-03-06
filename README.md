---
marp: true
---

# NodeJS 개발 시작하기

- 2022년에 TypeScript로 NodeJS 개발 시작하기
- 일부러 윈도우 환경 기준으로 설명하지만, 맥/리눅스에도 같은 방법 적용 가능
- 주로 Visual Studio Code 기준으로 설명하지만 다른 에디터도 동일하게 설정 가능
- 파워셀에서 CLI로 진행

---

## 설치

[Scoop 설치](https://scoop.sh/) : 윈도우용 CLI 인스톨러(선택사항)

```sh
scoop install which touch sudo

# 선택
scoop install curl git-with-openssh
```

---

### NVM For Windows

> 맥/리눅스용 NVM과 다른 물건

```
scoop install nvm
```

또는 인스톨러를 다운로드하여 설치

```sh
nvm ls available
nvm install 16.13.2
nvm ls
sudo nvm use 16.13.2
node --version
```

---

### NPM 패키지 관리자 업데이트

NodeJS 설치후 최초 한번 실행

```sh
npm install --global npm
# 또는 npm i -g npm

npm --version
```

---

### Yarn 설치

```
scoop install yarn

# 또는 (주의! NodeJS 설치 버전마다 따로 설치 필요)
npm i -g yarn
yarn --version
```

> 혹시라도 Yarn 2를 설치하면 안됨

---

### NPM vs. Yarn

- 기존 프로젝트
  - `package-lock.json` 존재 : NPM 사용
  - `yarn.lock` 존재 : Yarn 사용
    - 또는 `yarn.lock`, `node_modules` 지우고 NPM 사용 : `npm install`
- 신규 프로젝트
  - NPM 사용

---

### NPM 글로벌 패키지

주로 CLI 툴 설치할 때 사용

#### 글로벌 패키지 설치 리스트

```
npm ls -g
```

npm 구버전은 `npm ls -g --depth=0`

#### 글로벌 패키지 버전 업데이트 체크

```sh
npm i -g npm-check-updates # ncu 실행 파일이 설치됨
ncu -g
```

---

## 프로젝트 세팅

```
mkdir awesome-api-server
cd awesome-api-server
npm init -y
git init
touch .gitignore
mkdir src
mkdir dist
```

.gitignore 파일 편집

```
node_modules
dist
```

> [NodeJS용 .gitignore](https://github.com/github/gitignore/blob/main/Node.gitignore) 참고

---

### package.json 편집

```json
{
  // ...
  "description": "Sample Project",
  "author": "The Nameless One <nobody@example.com>",
  "license": "UNLICENSED",
  "private": true,
  "engines": {
    "node": ">=16"
  }
  // ...
}
```

---

### devDependencies 설치

```sh
npm install --save-dev --save-exact typescript

# 또는 npm i -D --save-exact typescript
```

> 주의!!!!!!!!!
> 버전 고정을 안하고 설치했으면 package.json에서 버전 앞의 캐럿(^)을 꼭 삭제!

---

### 항상 버전 고정하여 패키지 설치하기 (필수!)

기본 설정을 바꿉시다.

```
npm config set save-exact true
```

---

### dependencies 설치

Koa 웹프레임웍 설치

```
npm i koa
```

---

### devDependencies 와 dependencies의 차이

1. 기본적으로 `node_modules`에 같이 설치되고 사용하는데 차이 없음
2. 배포할 때 차이남. 특히 컨테이너로 배포할 때
3. NPM 사이트에 배포할 때 차이남
4. 자세한 설명은 생략

---

### 현재 설치된 패키지의 버전 업데이트 체크

```
ncu
```

> 개발 중간중간 버전 업데이트를 따라갑시다.

---

### TypeScript 설정

```
npx tsc --init
```

> `npx`는 현재 경로의 `node_modules/.bin/`에 설치된 실행파일을 찾아 실행하고, 없으면 캐시 폴더에 해당 툴을 설치하여 실행

---

#### tsconfig.json 설정

JS 프로젝트라도, 기존 프로젝트에도 꼭 만듭시다!

```json
{
  "compilerOptions": {
    // ...
    "target": "es2018", // NodeJS 16
    "module": "commonjs",
    "moduleResolution": "node", // 중요!
    "baseUrl": "./",
    "resolveJsonModule": true,
    "outDir": "./dist", // 빌드 경로
    "strict": true // 기존 JS 프로젝트라면 false로
    // ...
  },
  "include": ["src/**/*"]
}
```

---

### Prettier 코드 포멧터 설정

> [VSCode Prettier 확장 설치](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

```sh
npm i -D prettier
touch .prettierrc # 설정파일
```

---

### XO Linter 설치

> [VSCode XO 확장 설치](https://marketplace.visualstudio.com/items?itemName=bryan-chen.linter-xo-2)

- ESLint 의 wrapper
- Prettier 처럼 자기 주장이 강함 : 설정이 거의 없음
- 코딩 컨벤션과 잠재적인 나쁜 습관들을 지적
- 기존 소스에 ESLint를 사용했으면 ESLint 사용
- 기존 소스에 TSLint를 사용했으면 XO 또는 ESLint로 교체
- ESLint와 XO가 둘 다 동작한다면 하나만 사용. (VSCode Workspace 설정으로 가능)

---

```
npm i -D xo
```

Linting 동작 확인 후 package.json의 xo 항목 추가

```json
  "xo": {
    "space": true, // 탭 대신 스페이스
    "prettier": true // prettier 설정 사용
  }
```

---

### src/index.ts 편집

koa의 타입이 없다... 타입 정의 파일(Type Declaration)을 설치

```
npm i -D @types/koa
```

기왕이면 NodeJS의 타입도 설치해주자!

```sh
npm i -D @types/node@16 # NodeJS 16 사용할 경우
```

---

- 패키지에 타입 정의 파일(\*.d.ts)이 없는 모듈은 별도의 Type Declaration 패키지 설치
- @types/패키지명 설치
- @koa/cors 같은 패키지명은 @types/koa\_\_cors 규칙으로 설치
- 타입을 내장한 패키지 : 좋은 모듈
- 최신 버전의 @types/패키지가 있는 모듈 : 인기 있는 모듈
- 타입이 없는 모듈 : 조심

대충 Koa로 Hello, world 작성 후 띄워보고...

---

### package.json의 scripts 항목 편집

```
npm i -D cross-env rimraf
```

- 환경변수 설정, 폴더 삭제 툴 추가

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=production node dist/index.js", // 환경변수 세팅하고 빌드 결과물 실행
    "build": "rimraf dist/* && tsc --noEmitOnError", // dist 폴더 지우고 빌드
    "check": "prettier -c src/**/* && xo && tsc --noEmit", // 코드 스타일 체크 & 린팅 & 타입 체킹
    "fmt": "prettier --write src/**/*" // 코드 스타일 강제로 통일
  }
}
```

---

- `tsc --noEmitOnError` : 타입 체킹에 실패하면 빌드하지 않음.
- 사실 타입이 틀려도, 런타임에 제대로 실행 될 수 있음... 자신있으면 옵션 생략 가능
- scripts 안의 명령어는 항상 `node_modules/.bin/`에 설치된 툴을 먼저 실행해보고 없으면 시스템 환경 변수의 path를 따라감

```
npm run fmt
npm run check
npm run build
npm run start
curl localhost:8080
```

> tsconfig.json의 target 설정 변경해보기 : ES2016 또는 ES2018 -> async/await가 변하는 거

---

#### 타입 체킹, 포매팅, 린팅

- [Husky](https://www.npmjs.com/package/husky)를 이용 GIT Hook 으로 `npm run check`를 실행하거나,
- IDE에서 다해주는데... 과하다 싶으면,
- CI 상에서 푸시된 소스를 체크하는 용도로

---

### 매번 빌드하기 피곤

```
npm i -D ts-node ts-node-dev
```

package.json의 scripts 항목 편집

```json
  "scripts": {
    // ...
    "dev": "ts-node-dev --rs src/index.ts"
    // ...
  }
```

개발 서버 띄우기

```
npm run dev
```

- 소스 편집 후 저장 -> 자동으로 서버 다시 시작
- 터미널에 `rs` 입력 -> 서버 다시 시작

---

### UserService 대충 생성

services/user-service.ts 작성

XO(ESLint)에서 import 룰 linting 에러 날 거임

`eslint import/extensions` 검색

package.json 수정

```json
"xo": {
  // ...
  "rules": {
    "import/extensions": ["error", "never"]
  }
}
```

- 이런 식으로 과도한 룰은 override 가능
- XO는 내부적으로 ESLint 를 사용하므로 ESLint 문서 참고

---

#### CommonJS(CJS) -> ES Module(ESM) 전환 과정

긴 이야기 짧게 정리하기

- Node 14 이상에서 NodeJS도 ESM을 Native로 지원
- require/module.exports 와 import/export 의 차이 알아두기
- package.json 의 type: "module"의 의미
- 파일 확장자 cjs, mjs 의 차이
- ESM을 사용할 때 항상 확장자를 붙이고, TS 파일도 JS 확장자로 사용하는 이유
- ESM을 사용할 때 항상 상대 경로 또는 URL이 포함된 절대 경로만 사용하는 이유
- ESM만 지원하는 패키지, CJS만 지원하는 패키지, 둘다 지원하는 패키지
- 과도기! 혼란!

긴 이야기 짧게 정리하기 실패!

---

### 빌드 결과물에 소스맵 설정

에러 일부러 내보기 -> 빌드해서 실행

tsconfig.json 편집 : `"sourceMap": true`

소스맵은 생성되나 `npm start`로 빌드한 앱을 실행해보면 소스맵이 매핑이 안됨...

package.json 의 scripts 항목 편집

```
"start": "cross-env NODE_ENV=production node --enable-source-maps dist/index.js",
```

빌드한 소스에 소스맵 제대로 적용되었나 확인

```sh
npm run build
npm start
curl localhost:8080 # 에러난 곳의 콜스택 확인
```

> NodeJS 12 미만일 경우 `source-map-support` 패키지 사용

---

### 에러를 잡기 위해 디버깅 모드로 실행

package.json의 scripts 항목 수정

```
"debug": "node -r ts-node/register --inspect-brk --enable-source-maps src/index.ts"
```

```
npm run debug
```

---

크롬 또는 VSCode에 Attach : `launch.json` 설정 필요

Attach는 터미널에서 `npm run debug` 실행 후 에디터에서 붙으면 됨

VSCode에서 Launch : `launch.json` 설정 필요

```json
{
  "type": "pwa-node",
  "request": "launch",
  "name": "Debug",
  "skipFiles": ["<node_internals>/**"],
  "program": "${workspaceFolder}\\src\\index.ts",
  "args": ["-r", "ts-node/register", "--inspect", "--enable-source-maps"]
}
```

> --inspect 와 --inspect-brk 의 차이?

브레이크 포인트를 이용하여 에러 고치기

---

### tslib 설정

빌드한 소스의 각 파일마다 매번 inline으로 들어가는 TypeScript Helper 함수들을 공통 모듈로 분리

```sh
npm i tslib # 런타임용
```

tsconfig.json 편집 : `"importHelpers": true,`

```
npm run build
```

빌드한 소스에서 뭐가 달라졌나 확인

---

### TypeScript Decorator 사용 설정

`TypeORM`처럼 Decorator Pattern을 지원하는 라이브러리를 사용할 때 필요

tsconfig.json 수정 : TSC가 컴파일할 때 Reflection에 필요한 메타 데이터를 남김

```
"experimentalDecorators": true,
"emitDecoratorMetadata": true,
```

Reflect에 필요한 helper 라이브러리 설정

```sh
npm i reflect-metadata # 런타임 디펜던시
```

src/index.ts 편집. 최상단에 추가.

```js
import 'reflect-metadata';
```

이후 `TypeORM` 같은 라이브러리 사용 가능

---

# 끝! 이제 서비스를 개발할 시간입니다!

1. `git clone [소스저장소]`
2. `cd [소스폴더]`
3. `npm install`
4. `npm run dev`

---

## 빠른 시작 : package.json의 scripts

- 빌드 : `npm run build`
- 빌드한 앱 실행 : `npm start`
- 개발 서버 시작 : `npm run dev`
- 디버거 시작 : `npm run debug`
- 코드 스타일, 린팅, 타입 에러 체크(주로 CI 상에서 실행) : `npm run check`
- 코드 스타일 맞춰서 파일 덮어 씌우기 : `npm run fmt`
