---
id: useRef
title: useRef
sidebar_position: 4
---

### 1.是什么

`useRef` 是 React 中一个能**存储值**的 Hook，是你在 React 函数组件中存"**稳定的值或 DOM 引用**"的秘密武器，不会因渲染而丢失，非常适合存 DOM、定时器、最新状态等"静态但重要"的信息。

:::tip
`useRef` 本质上是："**一个在组件多次渲染之间始终保持不变的对象**"。**`useRef` 不会因为组件重新渲染而改变。**（这是真正需要重视的）
:::

### 2.使用方法

`myRef.current` 就是你要用的"那个值"。它不会引起页面重新渲染（不像 `useState`）。

```jsx
const myRef = useRef(初始值);
```

### 3.高频应用场景

#### 3.1 获取 DOM

```jsx
import { useRef, useEffect } from "react";

function App() {
  const inputRef = useRef();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return <input ref={inputRef} />;
}
```

#### 3.2 保存定时器 ID

```jsx
function App() {
  const timerRef = useRef();

  const start = () => {
    timerRef.current = setInterval(() => {
      console.log("running");
    }, 1000);
  };

  const stop = () => {
    clearInterval(timerRef.current);
  };

  return (
    <>
      <button onClick={start}>start</button>
      <button onClick={stop}>stop</button>
    </>
  );
}
```

#### 3.3 保存上一次值

```jsx
import { useEffect, useRef } from "react";

function App() {
  const [count, setCount] = useState(0);
  const prevRef = useRef();

  useEffect(() => {
    prevRef.current = count;
  }, [count]);

  return (
    <div>
      <h2>当前：{count}</h2>
      <h2>上一次：{prevRef.current}</h2>
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  );
}
```

#### 3.4 避免重复 render（性能优化）

因为不需要每次移动都 render，所以使用 `useRef` 比 `useState` 性能更好。

```jsx
const mouseRef = useRef({ x: 0, y: 0 });

window.addEventListener("mousemove", (e) => {
  mouseRef.current = { x: e.clientX, y: e.clientY };
});
```

#### 3.5 结合 forwardRef，useImperativeHandle 实现父组件访问子组件内部 DOM 或方法

不推荐父组件调用子组件的方法，推荐子组件通过 props 控制。更需要关注的是父组件的 state。只有在极端情况下才使用：1. 输入框 focus。2. 滚动控制。3. 动画控制。4. 第三方库：echarts，video，canvas。5. 表单库：reset()，validate()，submit()。

```jsx
const MyInput = forwardRef((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current?.focus(),
  }));
  return <input ref={inputRef} />;
});

const Parent = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <MyInput ref={inputRef} />
      <button onClick={() => inputRef.current?.focus()}>聚焦输入框</button>
    </>
  );
};
```
