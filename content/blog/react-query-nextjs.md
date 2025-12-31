---
title: React Query 与 Next.js 实战总结
date: 2025-09-06
summary: 结合 React Query 在 Next.js 项目中的使用，深入解析 Request Waterfalls、并行数据获取与服务端渲染的原理与实用技巧。
---

在使用 React Query 进行数据管理时，理解两个关键概念是非常重要的：**Request Waterfalls** 和 **服务器渲染**。
## Request Waterfalls

**Request Waterfalls** 是指在网络请求中，由于请求之间的依赖关系，导致请求按顺序执行，从而形成的加载延迟现象。在 React 组件中，这种现象通常发生在多个数据请求需要依赖于彼此的结果时。以下是对 Request Waterfalls 的详细解释，以及为什么 React 组件会导致这种现象。

### 什么是 Request Waterfalls？

- **定义**：Request Waterfalls 是指当多个网络请求需要依次完成时，后续请求必须等待前一个请求的响应。这种情况会导致加载时间变长，因为每个请求都需要单独的往返时间（Roundtrip Time, RTT），从而形成一个“瀑布”效应。

### 为什么 React 组件会导致 Request Waterfalls？

1. **顺序依赖**：
    - 在某些情况下，一个组件的数据请求可能依赖于另一个组件的数据。例如，如果组件 A 的数据必须在组件 B 加载之前完成，那么组件 B 将不得不等待组件 A 的请求完成。这种依赖关系会导致顺序执行，从而形成 Request Waterfalls。
2. **串行数据获取**：
    - 使用 `useSuspenseQuery` 等钩子进行数据获取时，如果多个查询是串行执行的（即一个接一个），则每个查询都需要等待前一个查询完成。这种模式不仅增加了总的加载时间，还可能影响用户体验。
3. **缺乏并行处理**：
    - 如果开发者没有意识到可以并行处理多个请求，或者没有使用适当的工具（如 `useSuspenseQueries`）来同时发起多个请求，那么就会自然而然地陷入 Request Waterfalls 的陷阱。
4. **组件树结构**：
    - 在 React 中，组件的嵌套结构可能导致数据获取逻辑分散在多个组件中。如果每个子组件都在其内部发起请求，而这些请求又相互依赖，就会形成串行调用，进一步加剧 Request Waterfalls。

### 如何避免 Request Waterfalls？

- **并行数据获取**：
    - 使用并行数据获取策略，例如使用 `useSuspenseQueries` 来同时发起多个请求，从而减少总的加载时间和网络延迟。
- **优化组件结构**：
    - 重新设计组件，使得数据请求尽可能集中在父级组件中，以便能够一次性获取所有必要的数据，减少子组件之间的依赖关系。
- **利用缓存和去重**：
    - 使用缓存机制来避免重复的网络请求，确保相同的数据不会被多次请求，从而减少不必要的 Roundtrips。
- **状态管理工具（如 React Query）提供的预取功能**

```ts
const queryClient = new QueryClient(); 

// 预取数据 
queryClient.prefetchQuery(['user'], fetchUser); queryClient.prefetchQuery(['posts'], fetchPosts);
```

## 服务端渲染
服务器渲染的本质是在服务器端预先生成HTML内容，让用户能够更快地看到页面内容。这可以通过两种方式实现:
- 按需渲染(SSR): 在用户请求时即时生成
- 预先生成(SSG): 在构建时生成或使用缓存的内容

传统的客户端渲染需要三个步骤:
1. 获取空白HTML
2. 加载JavaScript
3. 执行数据查询

而服务器渲染可以将这个过程优化为两步:
1. 获取包含内容和初始数据的HTML
2. 加载JavaScript使页面可交互

实现这个优化需要三个关键步骤:
1. 预获取(Prefetch): 服务器端提前获取数据
2. 脱水(Dehydrate): 将数据序列化并嵌入HTML
3. 水合(Hydrate): 客户端将数据恢复到React Query缓存

## Prefetching and de/hydrating data  
首先，我们将创建一个 Server Component 来执行预取部分:
```ts
// app/posts/page.tsx
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query'
import Posts from './posts'

export default async function PostsPage() {
  const queryClient = new QueryClient()

  await queryClient.prefetchQuery({
    queryKey: ['posts'],
    queryFn: getPosts,
  })

  return (
    // Neat! Serialization is now as easy as passing props.
    // HydrationBoundary is a Client Component, so hydration will happen there.
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Posts />
    </HydrationBoundary>
  )
}
```

接下来，我们将看看 Client Component 是什么样的：
```tsx
// app/posts/posts.tsx
'use client'

export default function Posts() {
  // This useQuery could just as well happen in some deeper
  // child to <Posts>, data will be available immediately either way
  const { data } = useQuery({
    queryKey: ['posts'],
    queryFn: () => getPosts(),
  })

  // This query was not prefetched on the server and will not start
  // fetching until on the client, both patterns are fine to mix.
  const { data: commentsData } = useQuery({
    queryKey: ['posts-comments'],
    queryFn: getComments,
  })

  // ...
}
```

- **简化序列化**：通过将脱水状态作为 props 传递给 `HydrationBoundary`，使得序列化变得简单明了。
- **客户端组件的水合**：`HydrationBoundary` 是一个客户端组件，水合将在这里发生，使得客户端能够快速恢复状态。
- **避免不必要的请求**：如果忘记预取或移除预取逻辑，组件会在客户端发起请求，这可能导致性能下降。因此，确保在需要时进行适当的预取是很重要的。

