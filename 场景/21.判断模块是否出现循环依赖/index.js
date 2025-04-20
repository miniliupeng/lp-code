// 判断模块是否出现循环依赖

// 示例用法
const modules = [
  { name: 'A', dependencies: ['B', 'C'] },
  { name: 'B', dependencies: ['D'] },
  { name: 'C', dependencies: ['B'] },
  { name: 'D', dependencies: ['A'] }
];

console.log(hasCircularDependency(modules)); // 输出：true

function hasCircularDependency(modules) {
  // 构建图的邻接表
  const graph = {};
  modules.forEach((module) => {
    graph[module.name] = module.dependencies;
  });

  // 用于记录当前路径中访问过的模块
  const visiting = new Set();

  // 深度优先搜索
  function dfs(node) {
    if (visiting.has(node)) return true; // 如果当前模块已经在访问路径中，说明存在循环依赖
    if (!graph[node]) return false; // 如果没有依赖，直接返回

    visiting.add(node); // 将当前模块加入访问路径
    for (const neighbor of graph[node]) {
      if (dfs(neighbor)) return true; // 递归检查依赖模块
    }
    visiting.delete(node); // 回溯：移除当前模块
    return false;
  }

  // 遍历所有模块
  for (const module of modules) {
    if (dfs(module.name)) return true; // 如果从某个模块开始发现循环依赖，直接返回
  }
  return false; // 如果所有模块都遍历完成，没有发现循环依赖
}
