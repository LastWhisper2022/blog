---
id: useMemo
title: useMemo
sidebar_position: 8
---

### 1.是什么

React 中"缓存计算结果"的 Hook，只有依赖变化时才重新计算。它的作用是"避免重复执行昂贵计算"，常用于性能优化以及保持对象引用稳定。

本质上：`useCallback` 缓存**函数引用**，`useMemo` 缓存**函数执行结果**。

### 2.使用方法

```jsx
// useMemo(fn, deps)
// 执行 fn，缓存返回值

function App() {
  const [count, setCount] = useState(0);

  const total = useMemo(() => {
    return heavyCalc();
  }, []);

  return <div>{total}</div>;
}
```

### 3.高频应用场景

#### 列表过滤

```jsx
// 如果 list 很大，每次 render 都会重新 filter，使用 useMemo 优化

const filteredList = useMemo(() => {
  return list.filter((item) => item.name.includes(keyword));
}, [list, keyword]);

// 此时，只有 list 变化、keyword 变化才重新计算
```

#### 对象稳定

```jsx
// 每次 render 都是新对象，即 {} !== {}
// 会导致 React.memo 失效，useEffect 重复执行

const user = useMemo(() => {
  return { name: "Tom" };
}, []);

// 现在 user 引用稳定
```

#### 避免 effect 重复执行

```jsx
// options 每次都是新对象，所以 effect 每次执行

// 正确用法：
const options = useMemo(() => ({ page: 1 }), []);

useEffect(() => {
  // ...
}, [options]);
```

### 4.真正适合的场景

**大计算：** filter、sort、markdown 解析、AI 消息处理、diff 计算

**稳定对象引用：** props 对象、options 配置、context value
