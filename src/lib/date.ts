import { formatInTimeZone } from "date-fns-tz";

/**
 * 固定时区格式化日期，避免 Next.js SSR 时服务端/客户端时区不同导致水合不一致。
 * 参考：https://next-intl.dev/blog/date-formatting-nextjs
 *
 * @param date - 日期字符串、Date 或时间戳
 * @param formatStr - date-fns 格式字符串，如 "yyyy年MM月dd日"
 * @param timeZone - IANA 时区，默认 "UTC" 保证纯日期一致；中文站可用 "Asia/Shanghai"
 */
export function formatDateInTimeZone(
  date: string | Date | number,
  formatStr: string,
  timeZone: string = "UTC"
): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return formatInTimeZone(d, timeZone, formatStr);
}
