function getType(value) {
  if (value === null) return 'null';
  if (typeof value !== 'object') return typeof value;
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}
