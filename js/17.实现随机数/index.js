/**
 * 仅使用这些方法
 * Math.random()
 * Math.floor Math.round Math.ceil
 */

/**
 * 实现随机数，范围为 [min, max)
 * @param {number} min - 范围下限（包含）
 * @param {number} max - 范围上限（不包含）
 * @returns {number}
 */
function random(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * 实现随机数，范围为 [min, max] 内的整数
 * @param {number} min - 范围下限（包含）
 * @param {number} max - 范围上限（包含）
 * @returns {number}
 */
function randomInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// --- 示例 ---
console.log('--- 随机浮点数 [2, 10) ---');
for (let i = 0; i < 5; i++) {
  console.log(random(2, 10));
}

console.log('\\n--- 随机整数 [5, 15] ---');
for (let i = 0; i < 10; i++) {
  console.log(randomInteger(5, 15));
}
