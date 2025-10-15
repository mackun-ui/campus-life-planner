export const patterns = {
  title: /^\S(?:.*\S)?$/, // no leading/trailing spaces
  dueDate: /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/,
  duration: /^(0|[1-9]\d*)(\.\d{1,2})?$/,
  tag: /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/,
  duplicateWord: /\b(\w+)\s+\1\b/
};

export function validateField(name, value) {
  const re = patterns[name];
  if (!re) return true;
  return re.test(value);
}