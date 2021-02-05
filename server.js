const express = require('express');
const next = require('next');

const port = 3000;
// ❤ : 1) NODE_ENV 환경 변수에 따라 개발 모드와 프로덕션 모드를 구분한다.
const dev = process.env.NODE_ENV !== 'production';
// ❤ : 2) 넥스트를 실행하기 위해 필요한 객체와 함수를 생성한다.
const app = next({ dev });
const handle = app.getRequestHandler();

const url = require('url');
// NOTE: #1) 서버사이드 렌더링 결과를 캐싱하기 위해 lru-cache 패키지를 이용
const lruCache = require('lru-cache');
// NOTE: #2) 최대 100개의 항목을 저장하고 각 항목은 60초 동안 저장한다.
const ssrCache = new lruCache({
  max: 100,
  maxAge: 1000 * 60,
});

// ❤ : 3) 넥스트의 준비과정이 끝나면 입력된 함수를 실행한다.
app.prepare().then(() => {
  const server = express();

  // ❤ : 4) express 웹 서버에서 처리할 url 패턴을 등록한다. /page/1 요청이 오면 /page1로 리다이렉트
  server.get('/page/:id', (req, res) => {
    res.redirect(`/page${req.params.id}`);
  });
  // NOTE: #3) /page1, /page2 요청에 대해 서버사이드 렌더링 결과를 캐싱함
  server.get(/^\/page[1-9]/, (req, res) => {
    return renderAndCache(req, res);
  });

  // ❤ : 5) 나머지 모든 요청은 handle 함수가 처리하도록 한다. 4가 없다면 넥스트 내장 서버와 같음
  server.get('*', (req, res) => {
    return handle(req, res);
  });

  // ❤ : 6) 사용자 요청 처리를 위해 대기한다.
  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});

// NOTE: #4) renderAndCache 함수에서 캐싱 기능 구현, async await 이용
async function renderAndCache(req, res) {
  const parsedUrl = url.parse(req.url, true);
  // NOTE: #5) 쿼리 파라미터가 포함된 경로를 키로 사용한다.
  const cacheKey = parsedUrl.path;
  // NOTE: #6) 캐시가 존재하면 캐시에 저장된 값을 사용
  if (ssrCache.has(cacheKey)) {
    console.log('캐시 사용');
    res.send(ssrCache.get(cacheKey));
    return;
  }
  try {
    const { query, pathname } = parsedUrl;
    // NOTE: #7) 캐시가 없으면 넥스트의 renderToHTML 메서드를 호출하고, await 키워드를 사용해 처리가 끝날 때까지 기다림
    const html = await app.renderToHTML(req, res, pathname, query);
    if (res.statusCode === 200) {
      // NOTE: #8) renderToHTML 함수가 정상적으로 처리되면 결과를 캐싱함
      ssrCache.set(cacheKey, html);
    }
    res.send(html);
  } catch (err) {
    app.renderError(err, req, res, pathname, query);
  }
}
