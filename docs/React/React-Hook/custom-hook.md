---
id: custom-hook
title: 自定义 Hook
sidebar_position: 9
---

### 1.是什么

React 中"逻辑复用"的核心方案，本质上自定义 Hook 是一个"内部使用其他 Hook 的普通函数"。

它可以抽离组件逻辑，而不是抽离 UI。

:::tip
**注意：** 必须要用 `use` 开头，React 要靠 `useXxx` 识别这是 Hook，这样 ESLint 才能校验，React 才知道 Hook 规则。
:::

### 2.使用方法

```jsx
function useWindowSize() {
  useEffect(() => {
    const handleResize = () => {
      console.log(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
}
```

```jsx
function App() {
  useWindowSize();
  return <div />;
}
```

### 3.高频使用场景

#### 请求接口

```jsx
function useRequest(api) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const res = await api();
      setData(res);
      setLoading(false);
    }
    fetchData();
  }, []);

  return { loading, data };
}
```

```jsx
function App() {
  const { loading, data } = useRequest(getUser);
}
```

#### localStorage

```jsx
function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    const cache = localStorage.getItem(key);
    return cache ? JSON.parse(cache) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
```

```jsx
const [theme, setTheme] = useLocalStorage("theme", "light");
```

### 4.其他需要知道的

#### Hook 的最大优势："组合能力"

```jsx
function useChat() {
  const user = useUser();
  const socket = useSocket();
  const storage = useLocalStorage();
}

// Hook 可以互相组合
```

#### Hook 的设计思想："把状态逻辑从 UI 中拆出来"

**组件** 负责 **UI**，**Hook** 负责 **逻辑**

#### 什么是真正好的 Hook

- **高聚合：** 只做一件事
- **可复用：** 多个组件能用
- **隐藏复杂性：** 外部 `const { data } = useRequest()` 很简单，内部可能很复杂

#### 自定义 Hook 和组件的区别

组件专注页面，Hook 专注逻辑。

```jsx
function useChat() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content) => {
    setLoading(true);
    const reply = await fetchAI(content);
    setMessages((prev) => [...prev, reply]);
    setLoading(false);
  };

  return { messages, loading, sendMessage };
}
```

```jsx
function ChatPage() {
  const { messages, loading, sendMessage } = useChat();

  return (
    <div>
      {messages.map((msg) => (
        <MessageItem key={msg.id} data={msg} />
      ))}
      <ChatInput onSend={sendMessage} />
      {loading && <Loading />}
    </div>
  );
}
```
