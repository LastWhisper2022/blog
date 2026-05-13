---
id: useEffect
title: useEffect & useLayoutEffect
sidebar_position: 3
---

### 1.是什么

React 组件通过 render → 生成 UI，但很多事情不能在 render 阶段做，例如：请求接口，操作 DOM，添加事件，开启定时器，订阅 websocket，localStorage，埋点。（这些都属于"副作用"）`useEffect()` 就是"处理副作用的"Hook。

:::tip
React 执行流程：

1. render 组件
2. 生成 Virtual DOM
3. 更新真实 DOM
4. 执行 useLayoutEffect
5. 浏览器完成绘制
6. 执行 useEffect

注意：`useEffect` 是在浏览器完成绘制之后执行，`useLayoutEffect` 和 `useEffect` 写法完全一样，执行时机有区别，前者是同步执行，后者是异步执行。前者适用于：浏览器完成绘制前测量 DOM 宽高，防止布局闪动，图表初始化，虚拟列表。
:::

### 2.使用方法

```jsx
useEffect(() => {
  // ✅ 这里写你想做的操作（副作用）
  return () => {
    // ❌ 清理操作（组件卸载或依赖变化前）
  };
}, [依赖项]);
```

| 写法 | 意义 |
| --- | --- |
| `[]` | 只在**第一次加载**时执行一次（如：初始化请求） |
| `[value]` | 每次 `value` 发生变化时执行 |
| 没写依赖 | 每次组件**渲染（更新）时**都会执行（不常用） |

### 3.useEffect 高频应用场景

#### 页面加载时发送请求

```jsx
useEffect(() => {
  fetchData();
}, []); // 空数组表示只执行一次
```

#### 根据某个值的变化做响应操作

```jsx
useEffect(() => {
  console.log('count变了');
}, [count]); // 每次 count 改变都会执行
```

#### 组件卸载时清除定时器、取消事件监听、终止网络请求等

```jsx
useEffect(() => {
  const timer = setInterval(() => {
    console.log('运行中...');
  }, 1000);

  return () => {
    clearInterval(timer); // 组件卸载或依赖变化时清除
  };
}, []);
```

#### 用户输入时防抖/节流

停下来一段时间再发请求，而不是每次都发。

```jsx
const [keyword, setKeyword] = useState('');

useEffect(() => {
  const timer = setTimeout(() => {
    if (keyword) {
      fetch(`/api/search?q=${keyword}`);
    }
  }, 500); // 500ms 防抖

  return () => clearTimeout(timer); // 输入时先清除前一个
}, [keyword]);
```

#### 依赖多条件组合（避免重复触发）

```jsx
useEffect(() => {
  if (ready && userId) {
    fetchUserData(userId);
  }
}, [ready, userId]);
```

#### 嵌套异步函数（useEffect 不能直接 async）

```jsx
useEffect(() => {
  (async () => {
    const res = await fetch('/api/data');
    const data = await res.json();
    console.log(data);
  })();
}, []);
```

### 4.useLayoutEffect 高频应用场景

#### 聊天窗口自动滚到底部

需要立即滚到底部。

```jsx
import { useRef, useLayoutEffect } from "react";

function Chat({ messages }) {
  const listRef = useRef();

  useLayoutEffect(() => {
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages]);

  return (
    <div
      ref={listRef}
      style={{
        height: 300,
        overflowY: "auto",
        border: "1px solid #ccc"
      }}
    >
      {messages.map((msg, index) => (
        <div key={index}>{msg}</div>
      ))}
    </div>
  );
}
```

#### Tooltip 定位

鼠标悬浮按钮，弹出提示框。

:::tip
为什么不用 `useEffect`？使用 `useEffect` 会先渲染 `top=0`，用户会看到 tooltip 先闪到顶部，再跳到正确位置。而 `useLayoutEffect` 会在浏览器绘制前完成定位。
:::

```jsx
import { useRef, useState, useLayoutEffect } from "react";

function Tooltip() {
  const btnRef = useRef();
  const [top, setTop] = useState(0);

  useLayoutEffect(() => {
    const rect = btnRef.current.getBoundingClientRect();
    setTop(rect.bottom + 10);
  }, []);

  return (
    <div>
      <button ref={btnRef}>hover me</button>
      <div style={{ position: "absolute", top }}>tooltip</div>
    </div>
  );
}
```

#### 动态测量元素高度

在 AI 聊天，长列表，瀑布流中特别常见。只有 DOM 生成后，才能知道。

```jsx
import { useRef, useState, useLayoutEffect } from "react";

function Card() {
  const ref = useRef();
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    const h = ref.current.offsetHeight;
    setHeight(h);
  }, []);

  return (
    <div>
      <div ref={ref}>很长很长的内容...</div>
      <p>高度：{height}</p>
    </div>
  );
}
```

#### Echarts 初始化

Echarts 初始化依赖容器尺寸，如果 DOM 还没布局完成，可能宽高为 0，图表异常。

```jsx
import { useRef, useLayoutEffect } from "react";
import * as echarts from "echarts";

function Chart() {
  const chartRef = useRef();

  useLayoutEffect(() => {
    const chart = echarts.init(chartRef.current);
    chart.setOption({
      xAxis: { data: ["A", "B", "C"] },
      yAxis: {},
      series: [{ type: "bar", data: [10, 20, 30] }]
    });
  }, []);

  return <div ref={chartRef} style={{ width: 400, height: 300 }} />;
}
```

#### 防止首屏闪烁

深色模式切换，先白色再黑色，用户会看到白屏闪一下。

```jsx
useLayoutEffect(() => {
  document.body.classList.add("dark");
}, []);
```

:::tip
本质上符合 `useLayoutEffect` 的使用场景都是"需要同步操作 DOM"。例如：获取尺寸，获取位置，修改布局，修正滚动，初始化动画。
:::
