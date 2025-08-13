// 如下代码所示，使用 find 函数实现链式调用

const data = [
  { userId: 8, title: 'title1' },
  { userId: 11, title: 'other' },
  { userId: 15, title: null },
  { userId: 19, title: 'title2' },
];

/**
 * 查找数据并支持链式调用 where 和 orderBy
 * @param {Array<Object>} initialData
 * @returns {Finder}
 */
function find(initialData) {
  class Finder {
    constructor(data) {
      this._data = [...data];
    }

    /**
     * 根据条件过滤数据
     * @param {Object} conditions - 过滤条件，key为属性名，value为正则表达式
     * @returns {this}
     */
    where(conditions) {
      this._data = this._data.filter(item => {
        return Object.entries(conditions).every(([key, regex]) => {
          const value = item[key];
          // 确保值是字符串且匹配正则表达式
          return typeof value === 'string' && regex.test(value);
        });
      });
      return this;
    }

    /**
     * 根据指定 key 排序
     * @param {{key: string, direction: 'asc' | 'desc'}} options - 排序选项
     * @returns {this}
     */
    orderBy({ key, direction = 'asc' }) {
      this._data.sort((a, b) => {
        const valueA = a[key];
        const valueB = b[key];

        if (valueA === valueB) {
          return 0;
        }

        const order = direction === 'desc' ? -1 : 1;

        if (valueA > valueB) {
          return 1 * order;
        }
        if (valueA < valueB) {
          return -1 * order;
        }
        return 0;
      });
      return this;
    }

    // 使用 getter 访问最终的数据
    get value() {
      return this._data;
    }
  }

  return new Finder(initialData);
}


// 查找data中，符合where中条件的数据，并根据orderBy中的条件进行排序
const result = find(data).where({
  "title": /\d$/, // 这里意思是过滤出数组中，满足title字段中符合 /\d$/ 的项
}).orderBy({ key: 'userId', direction: 'desc' }); // 这里的意思是对数组中的项按照userId进行倒序排列

//=> 返回 [{ userId: 19, title: 'title2'}, { userId: 8, title: 'title1' }];
console.log(result.value);
