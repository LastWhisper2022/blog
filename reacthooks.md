### 是什么
React 组件通过render -> 生成UI，但很多事情不能在render阶段做，例如：请求接口，操作DOM，添加事件，开启定时器，订阅 websocket，localStorage，埋点。（这些都属于“副作用”）useEffect()就是“处理副作用的”Hook。

:::color1
react执行流程：

1. render组件
2. 生成Virtual DOM
3. 更新真实DOM
4. 执行useLayoutEffect
5. 浏览器完成绘制
6. 执行useEffect

注意：useEffect 是在浏览器完成绘制之后执行，useLayoutEffect和useEffect写法完全一样，执行时机有区别，前者是同步执行，后者是异步执行。前者适用于：浏览器完成绘制前测量dom宽高，防止布局闪动，图表初始化，虚拟列表。

:::

### 使用方法
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


### useEffect 高频应用场景
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

#### 用户输入时不要每次都发请求，而是“停下来一段时间再发”  (防抖/节流)
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

### useLayoutEffect 高频应用场景
#### 聊天窗口自动滚到底部
需要立即滚到底部

```jsx
import {
  useRef,
  useLayoutEffect
} from "react";

function Chat({ messages }) {

  const listRef = useRef();

  useLayoutEffect(() => {

    listRef.current.scrollTop =
      listRef.current.scrollHeight;

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
        <div key={index}>
          {msg}
        </div>
      ))}
    </div>
  );
}
```

#### Tooltip 定位
鼠标悬浮按钮，弹出提示框

:::color1
为什么不用 useEffect ？使用 useEffect 会先渲染 top=0，用户会看到tooltip 先闪到顶部，再跳到正确位置。而useLayoutEffect会在浏览器绘制前完成定位。

:::

```jsx
import {
  useRef,
  useState,
  useLayoutEffect
} from "react";

function Tooltip() {

  const btnRef = useRef();

  const [top, setTop] = useState(0);

  useLayoutEffect(() => {

    const rect =
      btnRef.current.getBoundingClientRect();

    setTop(rect.bottom + 10);

  }, []);

  return (
    <div>

      <button ref={btnRef}>
        hover me
      </button>

      <div
        style={{
          position: "absolute",
          top
        }}
      >
        tooltip
      </div>

    </div>
  );
}
```

#### 动态测量元素高度
在AI聊天，长列表，瀑布流中特别常见。只有DOM生成后，才能知道。

```jsx
import {
  useRef,
  useState,
  useLayoutEffect
} from "react";

function Card() {

  const ref = useRef();

  const [height, setHeight] =
    useState(0);

  useLayoutEffect(() => {

    const h =
      ref.current.offsetHeight;

    setHeight(h);

  }, []);

  return (
    <div>

      <div ref={ref}>
        很长很长的内容...
      </div>

      <p>
        高度：{height}
      </p>

    </div>
  );
}
```

#### Echarts 初始化
Echarts 初始化依赖容器尺寸，如果DOM还没布局完成，可能宽高为0，图表异常。

```jsx
import {
  useRef,
  useLayoutEffect
} from "react";

import * as echarts from "echarts";

function Chart() {

  const chartRef = useRef();

  useLayoutEffect(() => {

    const chart =
      echarts.init(chartRef.current);

    chart.setOption({
      xAxis: {
        data: ["A", "B", "C"]
      },
      yAxis: {},
      series: [
        {
          type: "bar",
          data: [10, 20, 30]
        }
      ]
    });

  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        width: 400,
        height: 300
      }}
    />
  );
}
```

#### 防止首屏闪烁
深色模式切换，先白色再黑色，用户会看到白屏闪一下。

```jsx
useLayoutEffect(() => {

  document.body.classList.add("dark");

}, []);
```



:::color1
本质上符合 useLayoutEffect 的使用场景都是 “需要同步操作DOM”。例如：获取尺寸，获取位置，修改布局，修正滚动，初始化动画

:::


### 是什么
`useRef`  是 React 中一个能**存储值**的 Hook，是你在 React 函数组件中存“**稳定的值或 DOM 引用**”的秘密武器，不会因渲染而丢失，非常适合存 DOM、定时器、最新状态等“静态但重要”的信息。

:::color1
useRef 本质上是：“**一个在组件多次渲染之间始终保持不变的对象**”。**useRef 不会因为组件重新渲染而改变。**（这是真正需要重视的）

:::

### 使用方法
`myRef.current` 就是你要用的“那个值” 

它不会引起页面重新渲染（不像 useState）

```jsx
const myRef = useRef(初始值);
```

### 高频应用场景
#### 获取 DOM
```jsx
import {
  useRef,
  useEffect
} from "react";

function App() {

  const inputRef = useRef();

  useEffect(() => {

    inputRef.current.focus();

  }, []);

  return (
    <input ref={inputRef} />
  );
}
```

#### 保存定时器ID
```jsx
function App() {

  const timerRef = useRef();

  const start = () => {

    timerRef.current =
      setInterval(() => {
        console.log("running");
      }, 1000);
  };

  const stop = () => {
    clearInterval(timerRef.current);
  };

  return (
    <>
      <button onClick={start}>
        start
      </button>

      <button onClick={stop}>
        stop
      </button>
    </>
  );
}
```

#### 保存上一次值
```jsx
import {
  useEffect,
  useRef
} from "react";

function App() {

  const [count, setCount] = useState(0);

  const prevRef = useRef();

  useEffect(() => {

    prevRef.current = count;

  }, [count]);

  return (
    <div>

      <h2>
        当前：{count}
      </h2>

      <h2>
        上一次：{prevRef.current}
      </h2>

      <button
        onClick={() =>
          setCount(count + 1)
        }
      >
        +1
      </button>

    </div>
  );
}
```

#### 避免重复render（性能优化）
因为不需要每次移动都render，所以使用 useRef 比 useState 性能更好

```jsx
const mouseRef = useRef({
  x: 0,
  y: 0
});

window.addEventListener(
  "mousemove",
  e => {

    mouseRef.current = {
      x: e.clientX,
      y: e.clientY
    };

  }
);
```

#### 结合 forwardRef，useImperativeHandle 实现父组件访问子组件内部 DOM 或方法
不推荐父组件调用子组件的方法，推荐子组件通过props控制。更需要关注的是夫组件的state。只有在极端情况下才使用：1. 输入框focus。2. 滚动控制。3. 动画控制。 4. 第三方库：echarts，video，canvas。5.表单库：reset()，validate()，submit()。

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
### 是什么
`useContext` 是 React 里：“跨组件传递数据”的方案，他解决的问题是：不想一层一层传 props。 

```jsx
#为什么存在？
React 默认数据流：父 -> 子

<App>
  <Layout>
    <Header>
      <User />
    </Header>
  </Layout>
</App>

#如果App有user数据，想给User组件，通常要一层层props传递。可中间的Layout和Header组件
#可能不需要user数据，还需要传。所以需要useContext

```

### 使用方法
```jsx
import { createContext } from "react";

const UserContext = createContext();
```

```jsx
function App() {

  const user = {
    name: "Tom"
  };

  return (
    <UserContext.Provider value={user} >
      <Layout />
    </UserContext.Provider>
  );
}
```

```jsx
import { useContext } from "react";

function User() {
  
  const user = useContext(UserContext);
  
  return (
    <h1>{user.name}</h1>
  );
}
```

### 高频应用场景
#### 主题切换
```jsx
const ThemeContext = createContext();
```

```jsx
function App() {

  const [theme, setTheme] =
    useState("light");

  return (

    <ThemeContext.Provider
      value={{
        theme,
        setTheme
      }}
    >

      <Page />

    </ThemeContext.Provider>
  );
}
```

```jsx
function Button() {

  const {
    theme,
    setTheme
  } = useContext(ThemeContext);

  return (

    <button
      onClick={() =>
        setTheme(
          theme === "light"
            ? "dark"
            : "light"
        )
      }
    >
      当前主题：{theme}
    </button>
  );
}
```

:::color1
其他使用场景：

+ 主题（深色模式，国际化）
+ 用户信息（当前登录用户）
+ 权限（是否管理员）
+ 表单（Form组件共享状态）

:::

### 不适合的场景
Context 性能不好，因为 Context 更新会导致所有消费者重新render。

例如：`value={{theme,user,count}}`，如果 count 变化，即使组件只用了theme，也会 render。

所以不适合**高频更新的大状态。**

例如：大列表，聊天消息流，高频动画状态。否则 render很多。

### 是什么
React.memo 是 React 提供的高阶组件，用于缓存函数组件。当 props 没有变化时，跳过组件重新渲染，从而优化性能。

:::color1
React默认行为：

**React中父组件重新render，子组件默认也会重新render。即使props根本没变化。**

:::

因此：如果你不想每次props没有变化时，子组件还跟着重新渲染。**React.memo **可以解决。

:::color1
React.memo 解决什么问题：

**它可以“缓存组件结果”只有props变化时才重新 render。**

:::

### 使用方法
```jsx
import React from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <button onClick={() => setCount(count + 1)} >
        +1
      </button>
      <Child />
    </div>
  );
}

const Child = React.memo(() => {

  console.log("Child render");

  return <div>child</div>;
});

##  现在再点击按钮
##	父组件render 但 Child不会render 因为 props 没有变化
```

### 需要注意的
+ React.memo 本质你可以理解成“PureComponent 的函数版”。它内部会浅比较（shallow compare）props
+ 什么叫浅比较：在`oldProps===newProps`中 React.memo 会逐个比较`Object.is(prev, next)`
+ 只要props变化，子组件还是会渲染。当 props 是基本类型时没问题，但是当 props 为对象时要特别注意：每次render 都会创建新对象，即：`{} !== {}`，所以 memo 会失效。props为函数也是一样的。
+ 所以需要 useCallback 配合 memo 来保持 props 稳定。

### useCallback 配合 React.memo 
#### 错误写法
```jsx
function App() {

  const [count, setCount] =
    useState(0);

  const handleClick = () => {
    console.log("click");
  };

  return (
    <Child onClick={handleClick} />
  );
}
```

#### 正确写法
```jsx
const handleClick = useCallback(() => {
  console.log("click");
}, []);
```

#### 完整的正确搭配
```jsx
const Child = React.memo(
  ({ onClick }) => {

    console.log("child render");

    return (
      <button onClick={onClick}>
        child
      </button>
    );
  }
);

function App() {

  const [count, setCount] =
    useState(0);

  const handleClick =
    useCallback(() => {
      console.log("click");
    }, []);

  return (
    <div>

      <button
        onClick={() =>
          setCount(count + 1)
        }
      >
        +1
      </button>

      <Child onClick={handleClick} />

    </div>
  );
}
```

### React.memo的本质
很多人误解认为 “memo阻止组件render” 其实不是，真正的目的是**“跳过函数重新执行”**，即复用上一次render结果。

#### 什么时候适合React.memo
##### 纯展示组件
+ Card
+ ListItem 
+ Avatar
+ MessageItem

##### render 开销大
+ 大列表
+ 图表
+ markdown
+ AI 消息渲染

##### 高频父组件更新
例如：聊天输入框，输入时**父组件疯狂render**，但**消息列表不该重复render**

#### 不适合什么
+ 小组件比如：`constButton=memo(...)`，比较props成本比render还高。
+ 不要全局用，memo 本身也有成本，因为react要比较props。


### 是什么
useCallback 用于缓存函数引用，避免函数在组件重新渲染时重复创建，通常用于配合 React.memo 或作为 useEffect 依赖进行性能优化。

`useCallback` 是 React 里“缓存函数”的 Hook，它的核心作用是保持函数引用稳定。避免函数重复创建。从而避免：子组件重复 render，effect 重复执行，性能浪费。

```jsx
React 函数组件：每次 render 都会重新执行

例如：
function App() {

  const handleClick = () => {
    console.log("click");
  };

  return <button />;
}
每次render：handleClick都是新函数，即 oldFn !== newFn。因为函数是引用类型

```

### 高频应用场景
#### 解决函数作为props，React.memo失效的问题
```jsx
子组件
const Child = React.memo(
  ({ onClick }) => {

    console.log("child render");

    return (
      <button onClick={onClick}>
        child
      </button>
    );
  }
);
父组件
function App() {

  const [count, setCount] =
    useState(0);

  const handleClick = () => {
    console.log("click");
  };

  return (
    <div>

      <button
        onClick={() =>
          setCount(count + 1)
        }
      >
        +1
      </button>

      <Child onClick={handleClick} />

    </div>
  );
}

问题：点击 +1 时，Child 仍然重新 render。
原因：handleClick每次都是新函数，prevProps.onClick !== nextProps.onClick。
所以React.memo 失效。
useCallback解决了什么：它将函数缓存了起来，后续render会直接复用旧函数，于是
oldFn===newFn

```

```jsx
const Child = React.memo(
  ({ onClick }) => {

    console.log("child render");

    return (
      <button onClick={onClick}>
        child
      </button>
    );
  }
);

function App() {

  const [count, setCount] =
    useState(0);

  const handleClick =
    useCallback(() => {
      console.log("click");
    }, []);

  return (
    <div>

      <button
        onClick={() =>
          setCount(count + 1)
        }
      >
        +1
      </button>

      <Child onClick={handleClick} />

    </div>
  );
}

现在点击 +1 时，child不会render 因为 props没变化
```

#### 配合React.memo
#### effect 依赖函数
```jsx
const handleClick =
  useCallback(() => {

  }, []);

useEffect(() => {

}, [handleClick]);

```

#### 闭包问题
```jsx
const handleClick =
  useCallback(() => {

    console.log(count);

  }, []);

count 永远是初始值，因为闭包缓存了旧值

正确写法：
const handleClick =
  useCallback(() => {

    console.log(count);

  }, [count]);

```

### 需要注意的
+ 很多人误解useCallback 是“优化函数性能”。其实它不是优化函数执行，而是“缓存函数引用”。
+ `useCallback(fn, deps)`约等于`useMemo(() => fn, deps)`，即 useCallback 本质是 useMemo 的语法糖


### 是什么
react 中“缓存计算结果”的Hook，只有依赖变化时才重新计算。它的作用是“避免重复执行昂贵计算”，常用于性能优化以及保持对象引用稳定。

本质上：useCallback 缓存**函数引用**，useMemo 缓存**函数执行结果。**

### 使用方法
```jsx
useMemo(fn, deps)
执行 fn
缓存返回值


function App() {

  const [count, setCount] = useState(0);

  const total = useMemo(() => {
    return heavyCalc();
  }, []);
  
  return (
    <div>{total}</div>
  );
}

```

### 高频应用场景
#### 列表过滤
```jsx
const filteredList =
  list.filter(item =>
    item.name.includes(keyword)
  );


如果list很大，每次render 都会重新filter
使用useMemo 优化

const filteredList = useMemo(() => {

  return list.filter(item =>
    item.name.includes(keyword)
  );

}, [list, keyword]);

此时，只有list变化，keyword变化才重新计算
```

#### 对象稳定
```jsx
const user = {
  name: "Tom"
};

每次render都是新对象，即 {} !== {}
会导致 React.memo失效，useEffect重复执行

const user = useMemo(() => {

  return {
    name: "Tom"
  };

}, []);

现在user引用稳定

```

#### 避免 effect 重复执行
```jsx
const options = {
  page: 1
};

useEffect(() => {

}, [options]);

options 每次都是新对象，所以 effect每次执行

正确用法：
const options = useMemo(() => ({
  page: 1
}), []);
```

#### 真正适合的场景
##### 大计算
+ filter，sort，markdown解析，AI消息处理，diff计算

##### 稳定对象引用
+ props对象，options配置，context value

### 是什么
react中“逻辑复用”的核心方案，本质上自定义hook是一个“内部使用其他 Hook 的普通函数”。

它可以抽离组件逻辑，而不是抽离UI。

:::color1
**注意：**必须要用use开头，react要靠usexxx识别这是hook，这样eslint才能校验，react才知道hook规则。

:::

### 使用方法
```jsx
function useWindowSize() {

  useEffect(() => {

    const handleResize = () => {
      console.log(window.innerWidth);
    };

    window.addEventListener(
      "resize",
      handleResize
    );

    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );

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

### 高频使用场景
#### 请求接口
```jsx
function useRequest(api) {

  const [loading, setLoading] =
    useState(false);

  const [data, setData] =
    useState(null);

  useEffect(() => {

    async function fetchData() {

      setLoading(true);

      const res = await api();

      setData(res);

      setLoading(false);
    }

    fetchData();

  }, []);

  return {
    loading,
    data
  };
}
```

```jsx
function App() {

  const {
    loading,
    data
  } = useRequest(getUser);

}
```

#### localStorage
```jsx
function useLocalStorage(
  key,
  defaultValue
) {

  const [value, setValue] =
    useState(() => {

      const cache =
        localStorage.getItem(key);

      return cache
        ? JSON.parse(cache)
        : defaultValue;
    });

  useEffect(() => {

    localStorage.setItem(
      key,
      JSON.stringify(value)
    );

  }, [key, value]);

  return [value, setValue];
}
```

```jsx
const [theme, setTheme] =
  useLocalStorage(
    "theme",
    "light"
  );
```

### 其他需要知道的
#### hook的最大优势：“组合能力”
```jsx
function useChat() {

  const user = useUser();

  const socket = useSocket();

  const storage = useLocalStorage();

}
hook可以互相组合
```

#### hook的设计思想：“把状态逻辑从UI中拆出来”
**组件** 负责 **UI**，**Hook** 负责 **逻辑**

#### 什么是真正好的hook
+ 高聚合：只做一件事。
+ 可复用：多个组件能用。
+ 隐藏复杂性：
    - 外部：`const { data } =useRequest()`很简单
    - 内部可能很复杂

#### 自定义hook和组件的区别
组件专注页面，hook专注逻辑

```jsx
function useChat() {

  const [messages, setMessages] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const sendMessage =
    async content => {

      setLoading(true);

      const reply =
        await fetchAI(content);

      setMessages(prev => [
        ...prev,
        reply
      ]);

      setLoading(false);
    };

  return {
    messages,
    loading,
    sendMessage
  };
}
```

```jsx
function ChatPage() {

  const {
    messages,
    loading,
    sendMessage
  } = useChat();

  return (

    <div>

      {
        messages.map(msg => (
          <MessageItem
            key={msg.id}
            data={msg}
          />
        ))
      }

      <ChatInput
        onSend={sendMessage}
      />

      {
        loading && <Loading />
      }

    </div>
  );
}
```
