---
id: React-memo
title: React.memo
sidebar_position: 6
---

### 1.是什么

`React.memo` 是 React 提供的高阶组件，用于缓存函数组件。当 props 没有变化时，跳过组件重新渲染，从而优化性能。

:::tip
React 默认行为：**React 中父组件重新 render，子组件默认也会重新 render。即使 props 根本没变化。**
:::

因此：如果你不想每次 props 没有变化时，子组件还跟着重新渲染。**`React.memo` 可以解决。**

:::tip
`React.memo` 解决什么问题：**它可以"缓存组件结果"只有 props 变化时才重新 render。**
:::

### 2.使用方法

```jsx
import React from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <Child />
    </div>
  );
}

const Child = React.memo(() => {
  console.log("Child render");
  return <div>child</div>;
});

// 现在再点击按钮，父组件 render 但 Child 不会 render，因为 props 没有变化
```

### 3.需要注意的

- `React.memo` 本质你可以理解成"PureComponent 的函数版"。它内部会浅比较（shallow compare）props
- 什么叫浅比较：在 `oldProps === newProps` 中 `React.memo` 会逐个比较 `Object.is(prev, next)`
- 只要 props 变化，子组件还是会渲染。当 props 是基本类型时没问题，但是当 props 为对象时要特别注意：每次 render 都会创建新对象，即：`{} !== {}`，所以 memo 会失效。props 为函数也是一样的
- 所以需要 `useCallback` 配合 memo 来保持 props 稳定

### 4.useCallback 配合 React.memo

#### 4.1 错误写法

```jsx
function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    console.log("click");
  };

  return <Child onClick={handleClick} />;
}
```

#### 4.2 正确写法

```jsx
const handleClick = useCallback(() => {
  console.log("click");
}, []);
```

#### 4.3 完整的正确搭配

```jsx
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
```

### 5.React.memo 的本质

很多人误解认为"memo 阻止组件 render"，其实不是，真正的目的是**"跳过函数重新执行"**，即复用上一次 render 结果。

#### 5.1 什么时候适合 React.memo

**纯展示组件：** Card、ListItem、Avatar、MessageItem

**render 开销大：** 大列表、图表、markdown、AI 消息渲染

**高频父组件更新：** 例如聊天输入框，输入时**父组件疯狂 render**，但**消息列表不该重复 render**

#### 不适合什么

- 小组件比如：`const Button = memo(...)`，比较 props 成本比 render 还高
- 不要全局用，memo 本身也有成本，因为 React 要比较 props
