---
id: useContext
title: useContext
sidebar_position: 5
---

### 1.是什么

`useContext` 是 React 里"跨组件传递数据"的方案，它解决的问题是：不想一层一层传 props。

```jsx
// 为什么存在？
// React 默认数据流：父 -> 子

<App>
  <Layout>
    <Header>
      <User />
    </Header>
  </Layout>
</App>

// 如果 App 有 user 数据，想给 User 组件，通常要一层层 props 传递。
// 可中间的 Layout 和 Header 组件可能不需要 user 数据，还需要传。所以需要 useContext
```

### 2.使用方法

**创建 Context：**

```jsx
import { createContext } from "react";

const UserContext = createContext();
```

**提供数据：**

```jsx
function App() {
  const user = { name: "Tom" };

  return (
    <UserContext.Provider value={user}>
      <Layout />
    </UserContext.Provider>
  );
}
```

**消费数据：**

```jsx
import { useContext } from "react";

function User() {
  const user = useContext(UserContext);
  return <h1>{user.name}</h1>;
}
```

### 3.高频应用场景

#### 3.1 主题切换

```jsx
const ThemeContext = createContext();
```

```jsx
function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}
```

```jsx
function Button() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      当前主题：{theme}
    </button>
  );
}
```

:::tip
其他使用场景：主题（深色模式，国际化）、用户信息（当前登录用户）、权限（是否管理员）、表单（Form 组件共享状态）
:::

### 4.不适合的场景

Context 性能不好，因为 Context 更新会导致所有消费者重新 render。

例如：`value={{theme, user, count}}`，如果 count 变化，即使组件只用了 theme，也会 render。

所以不适合**高频更新的大状态**，例如：大列表，聊天消息流，高频动画状态。否则 render 很多。
