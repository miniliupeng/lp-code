/*
 * @lc app=leetcode.cn id=739 lang=javascript
 *
 * [739] 每日温度
 */

// @lc code=start
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
var dailyTemperatures = function(temperatures) {
    // 获取温度数组长度
    const n = temperatures.length;
    // 创建结果数组，初始值都为0
    const answer = new Array(n).fill(0);
    // 创建单调栈，用于存储温度的下标
    const stack = [];
    
    // 遍历温度数组
    for (let i = 0; i < n; i++) {
        // 当栈不为空且当前温度大于栈顶温度时
        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {
            // 获取栈顶温度的下标
            const prevIndex = stack.pop();
            // 计算天数差值，即等待多少天后温度会升高
            answer[prevIndex] = i - prevIndex;
        }
        // 将当前下标入栈
        stack.push(i);
    }
    
    // 返回结果数组
    return answer;
};
// @lc code=end

// 解题思路：
// 1. 使用单调递减栈，栈中存储温度数组的下标
// 2. 遍历温度数组，当发现当前温度大于栈顶元素对应的温度时，说明找到了栈顶元素的"下一个更高温度"
// 3. 计算两者的下标差值，表示需要等待的天数
// 4. 将当前下标入栈，继续遍历

// 算法复杂度：
// - 时间复杂度：O(n)，其中n是温度数组的长度。虽然有嵌套循环，但每个元素最多入栈出栈各一次。
// - 空间复杂度：O(n)，需要栈来存储下标。

// 该算法的优点是只需要遍历数组一次，而不需要对每个元素都向后查找，大大提高了效率。



// 示例 `temperatures = [73,74,75,71,69,72,76,73]` 来讲解代码的执行过程：

// 1. 初始化：
//    - answer = [0,0,0,0,0,0,0,0]
//    - stack = []

// 2. i=0, temperatures[0]=73
//    - stack为空，没有元素可比较
//    - 将下标0入栈，stack = [0]

// 3. i=1, temperatures[1]=74
//    - 74 > 73，弹出栈顶元素0
//    - answer[0] = 1-0 = 1（等待1天后温度升高）
//    - 将下标1入栈，stack = [1]

// 4. i=2, temperatures[2]=75
//    - 75 > 74，弹出栈顶元素1
//    - answer[1] = 2-1 = 1（等待1天后温度升高）
//    - 将下标2入栈，stack = [2]

// 5. i=3, temperatures[3]=71
//    - 71 < 75，不满足条件
//    - 将下标3入栈，stack = [2,3]

// 6. i=4, temperatures[4]=69
//    - 69 < 71，不满足条件
//    - 将下标4入栈，stack = [2,3,4]

// 7. i=5, temperatures[5]=72
//    - 72 > 69，弹出栈顶元素4
//    - answer[4] = 5-4 = 1（等待1天后温度升高）
//    - 72 > 71，弹出栈顶元素3
//    - answer[3] = 5-3 = 2（等待2天后温度升高）
//    - 72 < 75，不满足条件
//    - 将下标5入栈，stack = [2,5]

// 8. i=6, temperatures[6]=76
//    - 76 > 72，弹出栈顶元素5
//    - answer[5] = 6-5 = 1（等待1天后温度升高）
//    - 76 > 75，弹出栈顶元素2
//    - answer[2] = 6-2 = 4（等待4天后温度升高）
//    - 将下标6入栈，stack = [6]

// 9. i=7, temperatures[7]=73
//    - 73 < 76，不满足条件
//    - 将下标7入栈，stack = [6,7]

// 10. 遍历结束，stack = [6,7]，这些下标对应的天数后没有更高温度，answer中对应值保持为0

// 最终结果：answer = [1,1,4,2,1,1,0,0]

// - answer[0] = 1：第0天温度是73，等待1天后温度升高到74
// - answer[1] = 1：第1天温度是74，等待1天后温度升高到75
// - answer[2] = 4：第2天温度是75，等待4天后温度升高到76
// - answer[3] = 2：第3天温度是71，等待2天后温度升高到72
// - answer[4] = 1：第4天温度是69，等待1天后温度升高到72
// - answer[5] = 1：第5天温度是72，等待1天后温度升高到76
// - answer[6] = 0：第6天温度是76，之后没有更高的温度
// - answer[7] = 0：第7天温度是73，之后没有更高的温度