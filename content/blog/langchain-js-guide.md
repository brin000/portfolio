---
title: LangChain.js 指南与最佳实践
date: 2025-04-25
summary: 深入讲解 LangChain.js 的核心理念、LCEL 表达式语言、模块化设计和高效链式调用等特性，并辅以实用代码示例帮助开发者高效集成大语言模型。
---

LangChain 是一个强大的框架，旨在简化大语言模型（LLMs）的集成与应用开发。它提供了多种功能，包括：
1. **数据格式转换**：将非结构化文本格式化以适配 API。
2. **无状态问题解决**：通过长短期记忆支持改善对话的连续性。
3. **加速响应**：支持流式传输，实现快速反馈。
4. **知识更新**：创建 AI 代理联网搜索最新信息，保持知识时效性。
5. **模型串联**：允许将多个 LLM 串联使用，构建更复杂的应用。
6. **增强上下文获取**：利用检索增强生成（RAG）技术提升回答准确性。

## 什么是LCEL
LCEL（LangChain Expression Language） 是 langchain 无论是 python 还是 js 版本都在主推的新设计。
LCEL的核心设计目标是**支持将原型代码无缝投入生产，而无需对代码进行修改**。这意味着开发者在编写原型时所使用的代码可以直接适用于生产环境，具备生产级别的特性，如并行处理和流式输出等。
- 并行，只要是整个 chain 中有可以并行的步骤就会自动的并行，来减少使用时的延迟。
- 自动的重试和 fallback。大部分 chain 的组成部分都有自动的重试（比如因为网络原因的失败）和回退机制，来解决很多请求的出错问题。 而不需要我们去写代码 cover 这些问题。
- 对 chain 中间结果的访问，在旧的写法中很难访问中间的结果，而 LCEL 中可以方便的通过访问中间结果来进行调试和记录。
- LCEL 会自动支持 LangSimith 进行可视化和记录。这是 langchain 官方推出的记录工具，可以记录一条 chian 运行过程中的大部分信息，来方便调试 LLM 找到是哪些中间环节的导致了最终结果较差。这部分我们会在后续的章节中涉及到。
- 支持流式输出，使得数据可以实时处理。开发者可以获得更快的首次响应时间，提升用户体验。
	- LCEL 旨在优化 `time-to-first-token`，即从请求开始到第一个输出块出现之间的时间。


LCEL中的模块化设计基于统一的==Runnable==接口。这使得每个功能组件都可以作为标准化模块被调用和组合。
由于Chain也实现了相同接口，它既能作为独立单元运行，也能嵌入更大的处理流程中，从而实现灵活的模块组合和复杂流程构建。

### Chain Runnables
```ts
import { ChatOpenAI } from "@langchain/openai";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";


const model = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
});

const prompt = ChatPromptTemplate.fromTemplate("tell me a joke about {topic}");

const chain = prompt.pipe(model).pipe(new StringOutputParser());

await chain.invoke({ topic: "bears" });
```
prompt和model都是可运行的，且prompt的输出类型与model的输入类型相同，因此可以将它们链式连接，并像其他可运行对象一样调用这个序列。

### 批量调用
批量调用功能使得处理多个请求变得更加高效和便捷。通过使用 `batch` 方法，我们可以同时向聊天模型发送多个输入，并获取相应的输出。这种方式特别适合需要处理大量请求的场景，比如在聊天机器人中同时响应多个用户的提问。
```ts
await simpleChain.batch([
   [new HumanMessage("你能推荐一本好书吗？")],     
   [new HumanMessage("今天天气怎么样？")],
]);
```
这种批量处理不仅提高了效率，还使得开发者能够更灵活地管理和响应用户请求。

### 流式处理
流式处理是提升基于大型语言模型（LLM）应用响应速度的关键。

上面我们提到过，LangChain 的核心组件（如 LLMs、parsers、prompts、retrievers 和 agents）都实现了 **LangChain Runnable Interface**，而这个接口提供了两种流式内容处理的方法：
1. **`.stream()`**  
    默认实现，用于直接流式输出链的最终结果。
2. **`streamEvents()` 和 `streamLog()`**  
    更高级的实现，既可以流式输出链的中间步骤，也可以输出最终结果。
    
`.stream()` 侧重结果，`streamEvents()` 和 `streamLog()` 更注重全流程的细节追踪。

```ts
const stream = await model.stream("Hello! Tell me about yourself.");
const chunks = [];
for await (const chunk of stream) {
  chunks.push(chunk);
  console.log(`${chunk.content}|`);
}
```
输出如下：
```
|
Hello|
!|
 I'm|
 a|
 large|
 language|
 model|
 developed|
 by|
 ...
```
Message chunks可以使用`.concat()`方法简单地将它们相加，以获得最终响应。
```ts
let finalChunk = chunks[0];

for (const chunk of chunks.slice(1, 5)) {
  finalChunk = finalChunk.concat(chunk);
}

finalChunk;
```
## Prompt templates
### Partial With Functions
LangChain.js 中 `PromptTemplate` 的一个高级功能，允许你通过函数动态地为提示模板提供部分变量值。这种方式特别适合那些需要动态生成但又不希望每次手动传递的变量，比如当前日期、时间、用户上下文等。
```ts
import { PromptTemplate } from "langchain/prompts";

// 定义一个函数，返回当前日期
const getCurrentDate = () => {
  return new Date().toISOString();
};

// 创建 PromptTemplate
const prompt = new PromptTemplate({
  template: "Tell me a {adjective} joke about the day {date}",
  inputVariables: ["adjective", "date"],
});

// 使用 partial 方法，动态提供 date 变量
const partialPrompt = await prompt.partial({
  date: getCurrentDate, // 传递函数
});

// 格式化提示
const formattedPrompt = await partialPrompt.format({
  adjective: "funny",
});

console.log(formattedPrompt);
// 输出: Tell me a funny joke about the day 2023-07-13T00:54:59.287Z
```
这里将 `date` 变量绑定到 `getCurrentDate` 函数。每次调用 `format` 时，`getCurrentDate` 函数都会被执行，生成当前日期。

### few-shot prompt
```ts
import { PromptTemplate } from "@langchain/core/prompts";

const examplePrompt = PromptTemplate.fromTemplate(  
	"Question: {question}\n{answer}"
);
```
**（Few-Shot Learning）** 提示模板的工具。是一种通过提供少量示例（通常为 1-5 个）来指导模型生成期望输出的技术。

`FewShotPromptTemplate` 是一个用于构建少样本学习提示的工具。它的核心功能是将 **固定示例** 和 **任务描述** 结合起来，生成一个完整的提示。
```ts
const fewShotPrompt = new FewShotPromptTemplate({
  examples: [
    { input: "2 + 2", output: "4" },
    { input: "10 - 5", output: "5" },
  ],
  examplePrompt: new PromptTemplate({
    template: "Input: {input}\nOutput: {output}",
    inputVariables: ["input", "output"],
  }),
  prefix: "Solve the following math problems:",
  suffix: "Input: {userInput}\nOutput:",
  inputVariables: ["userInput"],
});
```

`Example Selector` 是一个用于 **动态选择示例** 的工具。它的核心功能是根据 **用户输入** 或 **其他条件**，从一组示例中动态选择最相关的示例。
```ts
import { SemanticSimilarityExampleSelector } from "langchain/example_selectors";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PromptTemplate } from "langchain/prompts";

// 示例库
const examples = [
  { input: "2 + 2", output: "4" },
  { input: "10 - 5", output: "5" },
  { input: "3 * 4", output: "12" },
  { input: "6 / 2", output: "3" },
];

// 创建 Example Selector
const exampleSelector = await SemanticSimilarityExampleSelector.fromExamples(
  examples,
  new OpenAIEmbeddings({ openAIApiKey: "your-openai-api-key" }),
  { k: 2 } // 选择最相似的 2 个示例
);

// 定义 FewShotPromptTemplate
const fewShotPrompt = new FewShotPromptTemplate({
  exampleSelector, // 使用 Example Selector
  examplePrompt: new PromptTemplate({
    template: "Input: {input}\nOutput: {output}",
    inputVariables: ["input", "output"],
  }),
  prefix: "Solve the following math problems:",
  suffix: "Input: {userInput}\nOutput:",
  inputVariables: ["userInput"],
});

// 生成提示
const prompt = await fewShotPrompt.format({
  userInput: "8 - 3", // 用户输入
});

console.log(prompt);
```
- **FewShotPromptTemplate**：适合固定示例的简单任务。
- **Example Selector**：适合动态选择示例的复杂任务。


## Output Parsers
### StringOutputParser
- **直接返回字符串**：将模型的输出作为原始字符串返回。
- **简单易用**：不需要定义复杂的 schema 或解析逻辑。
- **适用于简单任务**：如文本生成、问答、翻译等。
```ts
// 2. 定义提示模板
const prompt = PromptTemplate.fromTemplate(
  "Tell me a {adjective} joke about {topic}."
);

// 3. 创建 StringOutputParser 实例
const outputParser = new StringOutputParser();

// 4. 使用 LCEL 构建链
const chain = RunnableSequence.from([
  prompt, // 提示模板
  model,  // 模型
  outputParser, // 输出解析器
]);

// 5. 运行链
const result = await chain.invoke({
  adjective: "funny",
  topic: "programming",
});

console.log(result);
```