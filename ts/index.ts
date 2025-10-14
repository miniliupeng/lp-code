// 内置工具类型

// Partial
// Required
// Readonly
// Record
// Pick
// Omit
// Exclude
// Extract
// Parameters
// ReturnType
// Awaited

// typeof

// extends
// infer
// keyof
// in
// &
// |
// ?

// 模板字符串类型
// 实现字面量类型的拼接
// 自动分发: 当一个模板字符串类型中的插槽传入了联合类型时，这个模板字符串类型会自动被扩展为使用所有联合类型的组合

type Func = (...args: any[]) => any;

type FunctionReturnType<T extends Func> = T extends (...args: any[]) => infer R ? R : never;

type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};
