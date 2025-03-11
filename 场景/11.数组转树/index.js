// 方法一：递归

// /**
//  * 递归查找，获取children
//  */
// const getChildren = (data, result, pid) => {
//   for (const item of data) {
//     if (item.pid === pid) {
//       const newItem = { ...item, children: [] };
//       result.push(newItem);
//       getChildren(data, newItem.children, item.id);
//     }
//   }
// };

// /**
//  * 转换方法
//  */
// const arrayToTree = (data, pid) => {
//   const result = [];
//   getChildren(data, result, pid);
//   return result;
// };

// 方法二：map + 对象的引用
// function arrayToTree(arr) {
//   const map = new Map();
//   let root = null;
//   for (const item of arr) {
//     map.set(item.id, item);
//   }
//   for (const item of arr) {
//     if (item.pid === 0) {
//       root = item;
//     } else {
//       const parent = map.get(item.pid);
//       if (parent) {
//         parent.children = parent.children || [];
//         parent.children.push(item);
//       }
//     }
//   }
//   return root;
// }

// 方法三：map + 对象的引用  一次遍历即做Map存储,又找对应关系

function arrayToTree(arr) {
  const map = new Map();
  let root = null;

  for (const item of arr) {
    let node = null;
    if (map.has(item.id)) {
      node = map.get(item.id);
    } else {
      node = { ...item, children: [] };
      map.set(item.id, node);
    }

    if (item.pid === 0) {
      root = node;
    } else {
      const parent = map.get(item.pid);
      if (parent) {
        // 父节点存在，直接添加到父节点的children
        parent.children.push(node);
      } else {
        // 父节点还不存在，创建一个临时父节点
        map.set(item.pid, { children: [node] });
      }
    }
  }

  return root;
}

const arr = [
  { id: 1, name: '部门1', pid: 0 },
  { id: 2, name: '部门2', pid: 1 },
  { id: 3, name: '部门3', pid: 1 },
  { id: 4, name: '部门4', pid: 3 },
  { id: 5, name: '部门5', pid: 4 }
];

const tree = arrayToTree(arr);
console.log(tree);
