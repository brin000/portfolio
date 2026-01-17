---
title: HTTP 缓存机制全面解析
date: 2026-01-27
summary: HTTP 缓存是 Web 性能优化的关键机制，它让客户端和中间层（如 CDN、代理）复用已获取的资源，减少重复网络请求、降低服务器压力、提升用户体验。其行为主要由 HTTP 标头（特别是 Cache-Control）来控制。
---

HTTP 缓存是 Web 性能优化的关键机制，它让客户端和中间层（如 CDN、代理）复用已获取的资源，减少重复网络请求、降低服务器压力、提升用户体验。其行为主要由 HTTP 标头（特别是 Cache-Control）来控制。

## 一、什么是 HTTP 缓存？

HTTP 缓存存储先前响应的副本，在后续相同请求时直接返回，无需再次从源服务器下载全部内容。缓存可分为：

- **私有缓存（Private Cache）**：通常是浏览器自身的本地缓存（如 Chrome 的 Disk Cache 和 Memory Cache），只对单一用户有效。存储位置包括内存缓存（快速但易失）和磁盘缓存（持久但较慢）。
- **共享缓存（Shared Cache）**：位于用户与服务器之间，如 CDN、反向代理、网关缓存等，可服务多个用户。典型的例子包括 Cloudflare、AWS CloudFront 等。

正确配置缓存能显著提升加载速度并降低服务器负载。根据 HTTP Archive 的数据，合理使用缓存可以减少 60-80% 的重复请求。

## 二、缓存新鲜度判断机制

缓存收到请求时会判断已有响应是否仍然 **fresh**（新鲜）。新鲜响应可以直接返回，无需验证服务器内容。

### 新鲜度计算规则

新鲜度判断遵循以下优先级：

1. **Cache-Control: max-age=N**（优先级最高）
   - 表示响应从创建或验证后 N 秒内是新鲜的
   - 计算方式：`freshness_lifetime = max-age`
   - 示例：`Cache-Control: max-age=3600` 表示 1 小时内新鲜

2. **Expires + Date**
   - 如果没有 `max-age`，则用 `Expires` 指定的绝对时间判断
   - 计算方式：`freshness_lifetime = Expires - Date`
   - 注意：如果服务器时钟与客户端不同步，可能导致问题

3. **启发式规则（Heuristic Expiration）**
   - 当响应仅含 `Last-Modified` 时，缓存可能推测过期时间
   - 常见规则：`freshness_lifetime = (Date - Last-Modified) * 0.1`（10% 规则）
   - 例如：如果资源 10 天前修改，可能缓存 1 天

4. **s-maxage**（仅用于共享缓存）
   - 优先级高于 `max-age`，但只影响共享缓存
   - 私有缓存仍使用 `max-age`

### 实际判断流程

```typescript
function isFresh(cachedResponse: CachedResponse, requestTime: Date): boolean {
  const age = calculateAge(cachedResponse, requestTime);
  const freshnessLifetime = getFreshnessLifetime(cachedResponse);
  return age < freshnessLifetime;
}

function calculateAge(cachedResponse: CachedResponse, requestTime: Date): number {
  // Age = (current_time - response_time) + age_value
  const responseTime = cachedResponse.date;
  const apparentAge = Math.max(0, requestTime.getTime() - responseTime.getTime());
  const ageValue = parseInt(cachedResponse.headers['age'] || '0', 10);
  return Math.floor((apparentAge + ageValue * 1000) / 1000);
}
```

## 三、条件请求与缓存验证

即使响应过期（stale），缓存也不会马上丢弃它。HTTP 允许使用 **条件请求（Conditional Requests）** 与服务器验证内容是否变化。

### ETag：实体标签

ETag 是服务器为资源生成的唯一标识符，通常基于内容哈希或版本号。

**强验证（Strong Validation）**
```
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
If-None-Match: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```
- 字节级精确匹配，任何变化都会导致 ETag 改变
- 适用于需要精确一致性的场景

**弱验证（Weak Validation）**
```
ETag: W/"0815"
If-None-Match: W/"0815"
```
- 语义等价即可（如仅注释、空白字符变化）
- 使用场景较少，主要用于优化

### Last-Modified：最后修改时间

```
Last-Modified: Wed, 21 Oct 2015 07:28:00 GMT
If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT
```

**验证流程：**

```typescript
// 客户端发送条件请求
const headers: HeadersInit = {};
if (cachedETag) {
  headers['If-None-Match'] = cachedETag;
}
if (cachedLastModified) {
  headers['If-Modified-Since'] = cachedLastModified;
}

// 服务器响应
// 情况 1: 内容未变化
// Status: 304 Not Modified
// (无响应体，使用缓存)

// 情况 2: 内容已变化
// Status: 200 OK
// ETag: "new-etag-value"
// Last-Modified: "new-date"
// (返回新内容)
```

### 验证优先级

1. 如果请求包含 `If-None-Match`，服务器必须使用 ETag 验证
2. 如果只有 `If-Modified-Since`，使用 Last-Modified 验证
3. 如果两者都有，ETag 优先

## 四、Cache-Control 指令详解

### 核心指令表

| 指令 | 含义 | 作用对象 | 示例 |
|------|------|----------|------|
| `max-age=N` | 设置新鲜期（秒） | 所有缓存 | `max-age=3600` |
| `s-maxage=N` | 共享缓存新鲜期 | 共享缓存 | `s-maxage=86400` |
| `no-cache` | 在重用前必须验证 | 所有缓存 | `no-cache` |
| `no-store` | 不存储响应 | 所有缓存 | `no-store` |
| `private` | 仅本地缓存，不共享 | 私有缓存 | `private, max-age=3600` |
| `public` | 允许共享缓存存储 | 共享缓存 | `public, max-age=3600` |
| `must-revalidate` | 过期后必须验证 | 所有缓存 | `must-revalidate` |
| `immutable` | 内容永不变更 | 所有缓存 | `immutable, max-age=31536000` |
| `stale-while-revalidate` | 允许返回过期内容同时后台更新 | 所有缓存 | `stale-while-revalidate=60` |
| `stale-if-error` | 出错时允许返回过期内容 | 所有缓存 | `stale-if-error=86400` |

### 重要指令详解

**no-cache vs no-store**

```http
# no-cache: 可以存储，但每次使用前必须验证
Cache-Control: no-cache
# 等价于
Cache-Control: max-age=0, must-revalidate

# no-store: 完全禁止存储（包括内存和磁盘）
Cache-Control: no-store
```

**private vs public**

```http
# private: 仅浏览器可以缓存，CDN/代理不能缓存
Cache-Control: private, max-age=3600
# 适用于：用户个人信息、登录状态等

# public: 允许所有缓存层存储
Cache-Control: public, max-age=3600
# 适用于：静态资源、公开内容
```

**must-revalidate**

```http
Cache-Control: max-age=3600, must-revalidate
```
- 过期后必须向服务器验证，不能使用过期缓存
- 与 `stale-while-revalidate` 的区别：后者允许在验证期间返回过期内容

**immutable**

```http
Cache-Control: public, max-age=31536000, immutable
```
- 告诉浏览器内容永不变更，无需验证
- 适用于：带版本号的静态资源（如 `app-v1.2.3.js`）

**stale-while-revalidate**

```http
Cache-Control: max-age=3600, stale-while-revalidate=86400
```
- 在 3600 秒内直接返回缓存
- 3600-86400 秒内：返回过期缓存，同时后台验证更新
- 适用于：可以容忍短暂过期的内容

## 五、Vary 响应头与缓存键

默认情况下，缓存键（Cache Key）由以下因素组成：
- 请求方法（GET、POST 等）
- 请求 URL
- 查询参数

但有时同一 URL 会根据请求头返回不同内容，这时需要使用 `Vary` 头。

### Vary 的使用场景

```http
# 根据语言返回不同内容
Vary: Accept-Language
Cache-Control: public, max-age=3600

# 根据编码返回不同内容
Vary: Accept-Encoding
Cache-Control: public, max-age=3600

# 多个请求头
Vary: Accept-Language, Accept-Encoding, User-Agent
```

### 缓存键计算

```typescript
function getCacheKey(request: Request, varyHeaders: string[]): string {
  const baseKey = `${request.method}:${request.url}`;
  const varyValues = varyHeaders
    .map(header => request.headers.get(header.toLowerCase()))
    .filter(Boolean)
    .join('|');
  return varyValues ? `${baseKey}:${varyValues}` : baseKey;
}

// 示例
// Request 1: Accept-Language: en
// Cache Key: GET:/api/data:en

// Request 2: Accept-Language: zh
// Cache Key: GET:/api/data:zh
// (会生成不同的缓存条目)
```

### 常见陷阱

⚠️ **过度使用 Vary 会导致缓存效率降低**

```http
# 不推荐：User-Agent 变化频繁，几乎无法命中缓存
Vary: User-Agent

# 推荐：使用内容协商的标准化头部
Vary: Accept-Language, Accept-Encoding
```

## 六、浏览器刷新行为详解

现代浏览器的刷新行为比想象中复杂：

### 三种刷新方式

1. **正常导航（Normal Navigation）**
   - 行为：遵循缓存策略，新鲜内容直接使用
   - 触发：点击链接、输入 URL、前进/后退

2. **软刷新（Reload / F5）**
   - 行为：
     - 对于主文档：发送 `Cache-Control: max-age=0` 请求，强制验证
     - 对于子资源：遵循原有缓存策略，但会添加验证头
   - 触发：F5、Cmd+R、点击刷新按钮

3. **硬刷新（Force Reload / Ctrl+F5）**
   - 行为：完全绕过缓存，所有资源重新获取
   - 请求头：`Cache-Control: no-cache, Pragma: no-cache`
   - 触发：Ctrl+F5、Cmd+Shift+R、DevTools 中勾选 "Disable cache"

### 实际行为示例

```typescript
// 正常导航
fetch('/api/data'); 
// → 如果缓存新鲜，直接返回（Status: 200 from cache）

// 软刷新（主文档）
fetch('/', { 
  headers: { 'Cache-Control': 'max-age=0' } 
});
// → 发送 If-None-Match 验证，可能返回 304

// 硬刷新
fetch('/', { 
  headers: { 
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache'
  } 
});
// → 强制重新获取，返回 200
```

## 七、实际配置示例

### Next.js 配置

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=60, stale-while-revalidate=300',
          },
        ],
      },
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
};
```

### Nginx 配置

```nginx
# 静态资源：长期缓存
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, max-age=31536000, immutable";
    access_log off;
}

# HTML 文件：短期缓存 + 验证
location ~* \.html$ {
    expires 1h;
    add_header Cache-Control "public, max-age=3600, must-revalidate";
    etag on;
}

# API 接口：不缓存或短期缓存
location /api/ {
    add_header Cache-Control "no-cache, no-store, must-revalidate";
    add_header Pragma "no-cache";
    add_header Expires "0";
}
```

### Express.js 配置

```typescript
import express from 'express';
import { setHeader } from './middleware/cache';

const app = express();

// 静态资源
app.use('/static', express.static('public', {
  maxAge: '1y',
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'public, max-age=3600, must-revalidate');
    } else {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }
  }
}));

// API 路由
app.get('/api/data', (req, res) => {
  res.set({
    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
    'ETag': generateETag(data),
    'Vary': 'Accept-Encoding'
  });
  res.json(data);
});
```

### CDN 配置（Cloudflare）

```javascript
// Cloudflare Workers 示例
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const response = await fetch(request);
  
  const url = new URL(request.url);
  
  // 静态资源
  if (url.pathname.match(/\.(js|css|png|jpg)$/)) {
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Cache-Control', 'public, max-age=31536000, immutable');
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders
    });
  }
  
  // HTML 页面
  if (url.pathname.endsWith('.html')) {
    const newHeaders = new Headers(response.headers);
    newHeaders.set('Cache-Control', 'public, max-age=3600, must-revalidate');
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders
    });
  }
  
  return response;
}
```

## 八、浏览器 DevTools 调试技巧

### Chrome DevTools Network 面板

1. **查看缓存状态**
   - `(from disk cache)`: 从磁盘缓存读取
   - `(from memory cache)`: 从内存缓存读取
   - `304`: 条件请求验证成功，使用缓存
   - `200`: 重新获取或首次获取

2. **禁用缓存**
   - 勾选 "Disable cache"（仅在 DevTools 打开时生效）
   - 模拟硬刷新行为

3. **查看请求/响应头**
   - 检查 `Cache-Control`、`ETag`、`Last-Modified` 等
   - 查看 `Age` 头了解缓存年龄

### 使用 curl 测试

```bash
# 首次请求
curl -I https://example.com/api/data

# 条件请求（使用 ETag）
curl -I -H "If-None-Match: \"abc123\"" https://example.com/api/data

# 条件请求（使用 Last-Modified）
curl -I -H "If-Modified-Since: Wed, 21 Oct 2015 07:28:00 GMT" \
  https://example.com/api/data

# 强制重新获取
curl -I -H "Cache-Control: no-cache" https://example.com/api/data
```

## 九、常见问题与陷阱

### 1. 缓存污染（Cache Poisoning）

**问题**：恶意请求可能污染共享缓存

```http
# 攻击者发送
GET /api/user HTTP/1.1
Host: example.com
Vary: User-Agent
User-Agent: <script>alert('xss')</script>

# 如果服务器未正确验证，可能缓存恶意内容
```

**解决方案**：
- 严格验证 `Vary` 头中的值
- 使用白名单限制允许的请求头值
- 对用户输入进行严格过滤

### 2. 缓存键冲突

**问题**：不同内容使用相同缓存键

```typescript
// ❌ 错误：API 返回不同内容但 URL 相同
GET /api/data?userId=1  // 返回用户 1 的数据
GET /api/data?userId=2  // 返回用户 2 的数据
// 如果未使用 Vary，可能返回错误缓存

// ✅ 正确：包含区分参数
GET /api/data?userId=1
// 或使用 Vary: Cookie
```

### 3. 长缓存导致更新延迟

**问题**：设置了很长的 `max-age`，更新后用户看不到新内容

```http
# ❌ 问题配置
Cache-Control: public, max-age=31536000

# ✅ 解决方案 1: 使用版本号
/app-v1.2.3.js → Cache-Control: public, max-age=31536000, immutable
/app-v1.2.4.js → 新 URL，自动获取新版本

# ✅ 解决方案 2: 使用内容哈希
/app.abc123.js → 内容变化时哈希变化，URL 自动变化
```

### 4. 私有内容被共享缓存

**问题**：用户个人信息被 CDN 缓存

```http
# ❌ 危险配置
GET /api/user/profile
Cache-Control: public, max-age=3600
# 用户 A 的个人信息可能被用户 B 获取

# ✅ 正确配置
Cache-Control: private, max-age=3600
# 或
Cache-Control: no-store
```

## 十、性能优化最佳实践

### 1. 分层缓存策略

```typescript
// 策略：不同资源类型使用不同缓存策略
const cacheStrategies = {
  // 静态资源：长期缓存 + immutable
  static: 'public, max-age=31536000, immutable',
  
  // HTML：短期缓存 + 验证
  html: 'public, max-age=3600, must-revalidate',
  
  // API 数据：短期缓存 + 后台更新
  api: 'public, s-maxage=60, stale-while-revalidate=300',
  
  // 用户数据：私有缓存
  userData: 'private, max-age=300',
  
  // 敏感数据：不缓存
  sensitive: 'no-store, no-cache, must-revalidate'
};
```

### 2. 使用 Service Worker 增强缓存

```typescript
// service-worker.js
self.addEventListener('fetch', event => {
  if (event.request.url.includes('/api/')) {
    // 网络优先，失败时使用缓存
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open('api-cache').then(cache => {
            cache.put(event.request, clone);
          });
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // 缓存优先，失败时使用网络
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  }
});
```

### 3. 预加载关键资源

```html
<!-- 使用 rel="preload" 提前加载 -->
<link rel="preload" href="/critical.css" as="style">
<link rel="preload" href="/app.js" as="script">

<!-- 使用 rel="prefetch" 预取可能需要的资源 -->
<link rel="prefetch" href="/next-page.html">
```

### 4. 监控缓存命中率

```typescript
// 在 Service Worker 或中间件中监控
function trackCacheHit(request: Request, fromCache: boolean) {
  if (fromCache) {
    // 记录缓存命中
    analytics.track('cache_hit', {
      url: request.url,
      type: 'memory' // 或 'disk'
    });
  } else {
    // 记录缓存未命中
    analytics.track('cache_miss', {
      url: request.url
    });
  }
}
```

## 十一、总结

HTTP 缓存是 Web 性能优化的基石，通过合理配置缓存策略可以有效提高响应速度、降低网络负载。关键要点：

1. **理解缓存层级**：私有缓存 vs 共享缓存，各自的使用场景
2. **掌握新鲜度机制**：max-age、Expires、启发式规则的优先级
3. **善用条件请求**：ETag 和 Last-Modified 的验证机制
4. **合理使用指令**：根据资源类型选择适当的 Cache-Control 指令
5. **注意 Vary 头**：避免缓存键冲突，但不要过度使用
6. **分层缓存策略**：不同资源使用不同的缓存策略
7. **监控和调试**：使用 DevTools 和工具监控缓存效果

通过系统性地应用这些知识，可以构建高性能、用户友好的 Web 应用。
