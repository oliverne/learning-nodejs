# NodeJS 개발 시작하기

## 설치

[Scoop 설치](https://scoop.sh/) : 윈도우용 CLI 인스톨러(선택사항)

```powershell
scoop install which touch sudo

# 선택
scoop install curl git-with-openssh
```

### NVM For Windows

> 맥/리눅스용 NVM과 다른 물건

```
scoop install nvm
```

또는 인스톨러를 다운로드하여 설치

```powershell
nvm ls available
nvm install 16.13.2
nvm ls
sudo nvm use 16.13.2
node --version
```

### NPM 패키지 관리자 업데이트

NodeJS 설치후 최초 한번 실행

```powershell
npm install --global npm
# 또는 npm i -g npm

npm --version
```

### Yarn 설치

```
scoop install yarn

# 또는 (주의! NodeJS 설치 버전마다 따로 설치 필요)
npm i -g yarn
yarn --version
```

> 혹시라도 Yarn 2를 설치하면 안됨

### NPM vs. Yarn

- 기존 프로젝트
  - package-lock.json 존재 : NPM 사용
  - yarn.lock 존재 : Yarn 사용
    - 또는 yarn.lock, node_modules 지우고 NPM 사용 : `npm install`
- 신규 프로젝트
  - NPM 사용

### NPM 글로벌 패키지

주로 CLI 툴 설치할 때 사용

#### 글로벌 패키지 설치 리스트

```
npm ls -g
```

구버전은 `npm ls -g --depth=0`

#### 글로벌 패키지 버전 업데이트 체크

```powershell
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

### package.json 편집

```json
{
...
	"description": "Sample!",
  "author": "The Nameless One <nobody@neowiz.com>",
  "license": "UNLICENSED",
  "private": true,
  "engines": {
    "node": ">=16"
  }
...
}
```

### devDependencies 설치

```powershell
npm install --save-dev --save-exact typescript

# 또는 npm i -D --save-exact typescript
```

> 버전 고정을 안하고 설치했으면 package.json에서 버전 앞의 캐럿(^)을 꼭 삭제!

### 항상 버전 고정하여 패키지 설치하기 (필수!)

기본 설정을 바꿉시다.

```
npm config set save-exact true
```

### dependencies 설치

Koa 웹프레임웍 설치

```
npm i koa
```

### devDependencies 와 dependencies의 차이

1. 기본적으로 node_modules 에 같이 설치되고 사용하는데 차이 없음
2. 배포할 때 차이남. 특히 컨테이너로 배포할 때
3. NPM 사이트에 배포할 때 차이남

### 현재 설치된 패키지의 버전 업데이트 체크

```
ncu
```

> 개발 중간중간 버전 업데이트를 따라갑시다.

### TypeScript 설정

```
npx tsc --init
```

> npx는 현재 node_modules에 설치된 실행파일을 찾아 실행하고, 없으면 캐시 폴더에 해당 툴을 설치하여 실행

#### tsconfig.json 설정

JS 프로젝트라도, 기존 프로젝트라도 꼭 만듭시다!

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
  "include": ["src"]
}
```

### prettier 설정

> VSCode Prettier 확장 설치

```powershell
npm i -D prettier
touch .prettierrc # 설정파일
```

### XO linter 설치

> VSCode XO 확장 설치

- ESLint 의 wrapper
- prettier 처럼 자기 주장이 강함 : 설정이 거의 없음
- 코딩 컨벤션과 잠재적인 나쁜 습관들을 지적
- 기존 소스에 eslint를 사용했으면 eslint 사용
- 기존 소스에 tslint를 사용했으면 xo 또는 eslint로 교체
- eslint와 xo는 둘다 동작한다면 하나만 사용. (VSCode Workspace 설정으로 가능)

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

### src/index.ts 편집

koa의 타입이 없다...

```
npm i -D @types/koa
```

> 패키지에 타입 정의 파일(\*.d.ts)이 없는 모듈은 별도의 Type Declaration 패키지 설치

대충 Koa로 Hello, world 작성 후

### package.json의 script 항목 편집

```
npm i -D cross-env rimraf
```

```json
{
  "scripts": {
    "start": "cross-env NODE_ENV=production node dist/index.js",
    "build": "rimraf dist/* && tsc",
    "check": "xo && tsc --noEmit",
    "fmt": "prettier --write src/**/*"
  }
}
```

```
npm run fmt
npm run check
npm run build
npm run start
curl localhost:8080
```

> tsconfig.json의 target 설정 변경해보기

#### 타입 체킹, 포매팅, 린팅

> [Husky](https://www.npmjs.com/package/husky)를 이용
>
> GIT Hook 에 npm run fmt, npm run check 를 실행하거나
>
> IDE에서 다해주는데... 과하다 싶으면,
>
> CI 상에서 푸시된 소스를 체크하는 용도로

### 매번 빌드하기 피곤

```
npm i -D ts-node ts-node-dev
```

package.json script 항목 편집

```json
{
  "scripts": {
    // ...
    "dev": "ts-node-dev --rs src/index.ts"
    // ...
  }
}
```

개발 서버 띄우기

```
npm run dev
```

- 소스 편집 후 저장 -> 서버 다시 시작
- 터미널에 `rs` 입력 -> 서버 다시 시작

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

> 이런 식으로 과도한 룰은 override 가능
>
> XO는 내부적으로 ESLint 를 사용하므로 ESLint 문서 참고

#### CommonJS -> ES Module 로의 전환 과정

긴 이야기 짧게 정리하기

- Node 14 이상
- require/module.exports 와 import/export 의 차이
- package.json 의 type: "module"
- 파일 확장자 cjs, mjs 의 차이
- ESM을 사용할 때 TS 파일을 JS 확장자로 사용하는 이유
- ESM만 지원하는 패키지, CJS만 지원하는 패키지, 둘다 지원하는 패키지
- 과도기! 혼란!

### 빌드 결과물에 소스맵 설정

에러 일부러 내보기 -> 빌드해서 실행

tsconfig.json 편집 : `"sourceMap": true`

```powershell
npm i source-map-support # 런타임 디펜던시
```

package.json 의 script 항목 편집

```
    "start": "cross-env NODE_ENV=production node -r source-map-support/register dist/index.js",
```

빌드한 소스로 소스맵 제대로 적용되었나 확인

```powershell
npm run build
npm start
curl localhost:8080 # 에러난 곳의 콜스택 확인
```

UserService 제대로 고치고 확인

### tslib 설정

빌드한 소스 파일마다 매번 require/import 되는 TS Helper 함수들 분리

```powershell
npm i tslib # 런타임용
```

tsconfig.json 편집 : `"importHelpers": true,`

```
npm run build
```

빌드한 소스 확인
