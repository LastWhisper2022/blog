---
id: useState
title: useState
sidebar_position: 1
---

### 1.是什么
在组件内部中用来保存数据状态的工具，可以理解成“一个可以存数据的盒子”，当修改这个数据时，页面会重新渲染。

**使用场景：** 当你想让页面随数据变化而更新时，就用它。（计数器，表单输入值，控制元素的显示/隐藏，切换按钮状态等）

**它的运行模式：**

```markdown
# 组件：
一个演员

# 每次渲染：
演员重新上台表演

# useState
后台储物柜

# 演员每次上台，都能从储物柜里：
拿到上一次的数据

# 当
setState

# react会：
通知演员重新上台表演

# 这就是react的运行模式

```

### 2.使用方法
```jsx
const [count,setCount] = useState(0)

# count：当前的值（状态）
# setCount：修改这个值的方法
# 0：初始值

举例：点击按钮时，show 状态会在 true/false 之间切换，页面也会跟着更新。

const [show, setShow] = useState(false);

return (
  <div>
    <button onClick={() => setShow(!show)}>切换显示</button>
    {show && <p>你好，React！</p>}
  </div>
);

```

### 3.高频运用场景
#### 3.1 初始值通过函数获取
当**初始值**是从缓存，本地存储等读取到的，或者是经过复杂计算得到时，可以使用**函数式初始值**，这个初始值通过一个函数来“延迟”执行，只在组件第一次渲染时运行一次。

```jsx
function App() {
  const [count, setCount] = useState(() => {
    console.log("只执行一次");

    return localStorage.getItem("count");
  });

  return <div>{count}</div>;
}
```

#### 3.2 函数式更新
```jsx
setCount(prev => prev+1)
```

不直接给 React 一个新值，而是给 React 一个“怎么算出新值的方法”。让React把“当前最新的状态”给我，我基于它算出一个新状态。

```jsx
#什么时候必须用它？
#加减：
setCount(prev => prev + 1)

#toggle：
setOpen(prev => !prev)

#数组追加：
setList(prev => [...prev, item])

#对象更新：
setUser(prev => ({
  ...prev,
  age: prev.age + 1
}))

#什么时候不用？  
#如果你直接覆盖：因为不依赖旧值。
setCount(100)
setTheme("dark")  
```

:::color1
为什么 `setCount(prev => prev + 1)` 比 `setCount(count + 1)` 更安全？因为它总是基于 React 提供的最新状态更新，避免闭包和批量更新导致的旧值问题。只要新值依赖旧值，就用 `prev => ...`

:::


