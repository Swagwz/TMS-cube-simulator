const placeholders = ["x", "y"] as const;

export default function formatTemplate(
  template: string,
  value: { x: number; y?: number },
) {
  let rst = template;

  for (let ph of placeholders) {
    rst = rst.replace(`{${ph}}`, (value[ph] || "").toString());
  }

  return rst;
}
