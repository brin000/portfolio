export interface TOCItem {
  url: string;
  title: string;
  items?: TOCItem[];
}

export interface TableOfContents {
  items: TOCItem[];
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

/**
 * 从 HTML 字符串中提取标题，生成嵌套的目录结构
 */
export function extractTOC(html: string): TableOfContents {
  // 使用正则表达式匹配所有标题标签
  const headingRegex = /<h([1-6])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[1-6]>/gi;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const id = match[2];
    // 移除 HTML 标签，只保留文本
    const text = match[3].replace(/<[^>]*>/g, "").trim();

    if (id && text) {
      headings.push({
        id,
        text,
        level,
      });
    }
  }

  // 将扁平化的标题列表转换为嵌套的目录结构
  const items: TOCItem[] = [];
  const stack: { item: TOCItem; level: number }[] = [];

  for (const heading of headings) {
    const item: TOCItem = {
      url: `#${heading.id}`,
      title: heading.text,
    };

    // 找到合适的父级
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop();
    }

    if (stack.length === 0) {
      // 顶级项目
      items.push(item);
    } else {
      // 子项目
      const parent = stack[stack.length - 1].item;
      if (!parent.items) {
        parent.items = [];
      }
      parent.items.push(item);
    }

    stack.push({ item, level: heading.level });
  }

  return { items };
}

