---
id: useCallback
title: useCallback
sidebar_position: 7
---

### 1.是什么

`useCallback` 用于缓存函数引用，避免函数在组件重新渲染时重复创建，通常用于配合 `React.memo` 或作为 `useEffect` 依赖进行性能优化。

`useCallback` 是 React 里"缓存函数"的 Hook，它的核心作用是保持函数引用稳定。避免函数重复创建。从而避免：子组件重复 render，effect 重复执行，性能浪费。

```jsx
// React 函数组件：每次 render 都会重新执行

function App() {
  const handleClick = () => {
    console.log("click");
  };

  return <button />;
}

// 每次 render：handleClick 都是新函数，即 oldFn !== newFn。因为函数是引用类型
```

### 2.高频应用场景

#### 2.1 解决函数作为 props，React.memo 失效的问题

```jsx
// 子组件
const Child = React.memo(({ onClick }) => {
  console.log("child render");
  return <button onClick={onClick}>child</button>;
});

// 父组件 - 问题写法
function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log("click");
  };

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <Child onClick={handleClick} />
    </div>
  );
}

// 问题：点击 +1 时，Child 仍然重新 render。
// 原因：handleClick 每次都是新函数，prevProps.onClick !== nextProps.onClick。
// 所以 React.memo 失效。
```

```jsx
// 使用 useCallback 解决
const Child = React.memo(({ onClick }) => {
  console.log("child render");
  return <button onClick={onClick}>child</button>;
});

function App() {
  const [count, setCount] = useState(0);

  const handleClick = useCallback(() => {
    console.log("click");
  }, []);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <Child onClick={handleClick} />
    </div>
  );
}

// 现在点击 +1 时，child 不会 render，因为 props 没变化
```

#### 2.2 配合 useEffect 依赖函数

```jsx
const handleClick = useCallback(() => {
  // ...
}, []);

useEffect(() => {
  // ...
}, [handleClick]);
```

#### 2.3 闭包问题

```jsx
// 错误：count 永远是初始值，因为闭包缓存了旧值
const handleClick = useCallback(() => {
  console.log(count);
}, []);

// 正确写法：
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);
```

### 3.需要注意的

- 很多人误解 `useCallback` 是"优化函数性能"。其实它不是优化函数执行，而是"缓存函数引用"
- `useCallback(fn, deps)` 约等于 `useMemo(() => fn, deps)`，即 `useCallback` 本质是 `useMemo` 的语法糖
