---
id: useReducer
title: useReducer
sidebar_position: 2
---

### 1.是什么
更高级版的 useState ，它主要解决：**状态逻辑越来越复杂，多个状态之间互相关联，更新逻辑难维护** 的问题。

```jsx
#起初
const [count, setCount] = useState(0);

#项目复杂后
const [name, setName] = useState("");
const [age, setAge] = useState(18);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);
const [list, setList] = useState([]);

#此时的问题：状态越来越散，状态修改逻辑到处都是
  
setLoading(true);
fetchData()
  .then(res => {
    setList(res);
    setLoading(false);
  })
  .catch(err => {
    setError(err);
    setLoading(false);
  });  

#逻辑开始混乱
#此时若你想进行”集中管理状态更新“，你就需要用到它
```

### 2.使用方法
```jsx
#解释
function reducer(state, action)
state 当前状态
action 要执行的动作

const [count, dispatch] = useReducer(reducer, 0);
#dispatch({ type: "increment" }) 要发送一个动作
#react内部流程
  1.dispatch
  2.调用 reducer(state,action)
  3.得到 newState
  4.组件重新渲染

#写法
import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return state + 1;

    case "decrement":
      return state - 1;

    default:
      return state;
  }
}

function App() {
  const [count, dispatch] = useReducer(reducer, 0);

  return (
    <>
      <h1>{count}</h1>

      <button onClick={() => dispatch({ type: "increment" })}>
        +1
      </button>

      <button onClick={() => dispatch({ type: "decrement" })}>
        -1
      </button>
    </>
  );
}  



```

### 3.高频应用场景
#### 请求状态管理（loading / data / error）
如请求用户列表页面需要管理loading，error，data。所有状态更新逻辑都集中在reducer，代码结构清晰。

**使用useState：**

```jsx
function UserList() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/users");
      const result = await res.json();

      setData(result);
    } catch (err) {
      setError("请求失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchUsers}>
        获取用户
      </button>

      {loading && <p>加载中...</p>}

      {error && <p>{error}</p>}

      {data.map(user => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}
    </div>
  );
}
```

**使用useReducer：**

```jsx
#第一步：定义初始状态
const initialState = {
  loading: false,
  data: [],
  error: null
};

#第二步：定义 reducer
function reducer(state, action) {
  switch (action.type) {

    case "FETCH_START":
      return {
        ...state,
        loading: true,
        error: null
      };

    case "FETCH_SUCCESS":
      return {
        loading: false,
        data: action.payload,
        error: null
      };

    case "FETCH_ERROR":
      return {
        loading: false,
        data: [],
        error: action.payload
      };

    default:
      return state;
  }
}

#第三步：使用 useReducer
import { useReducer } from "react";
function UserList() {
  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  const fetchUsers = async () => {

    dispatch({
      type: "FETCH_START"
    });

    try {
      const res = await fetch("/api/users");
      const result = await res.json();

      dispatch({
        type: "FETCH_SUCCESS",
        payload: result
      });

    } catch (err) {

      dispatch({
        type: "FETCH_ERROR",
        payload: "请求失败"
      });
    }
  };

  return (
    <div>
      <button onClick={fetchUsers}>
        获取用户
      </button>

      {state.loading && <p>加载中...</p>}

      {state.error && <p>{state.error}</p>}

      {state.data.map(user => (
        <div key={user.id}>
          {user.name}
        </div>
      ))}
    </div>
  );
}
```



#### 购物车（添加/删除商品，增加/减少数量，清空购物车）
```jsx
#购物车数据
const initialState = {
  cart: []
};

#reducer
function reducer(state, action) {

  switch (action.type) {

    case "ADD_ITEM":

      const exist = state.cart.find(
        item => item.id === action.payload.id
      );

      // 已存在 -> 数量+1
      if (exist) {

        return {
          cart: state.cart.map(item =>
            item.id === action.payload.id
              ? {
                  ...item,
                  count: item.count + 1
                }
              : item
          )
        };
      }

      // 不存在 -> 新增
      return {
        cart: [
          ...state.cart,
          {
            ...action.payload,
            count: 1
          }
        ]
      };

    case "REMOVE_ITEM":

      return {
        cart: state.cart.filter(
          item => item.id !== action.payload
        )
      };

    case "INCREMENT":

      return {
        cart: state.cart.map(item =>
          item.id === action.payload
            ? {
                ...item,
                count: item.count + 1
              }
            : item
        )
      };

    case "DECREMENT":

      return {
        cart: state.cart.map(item =>
          item.id === action.payload
            ? {
                ...item,
                count: item.count - 1
              }
            : item
        )
      };

    case "CLEAR_CART":

      return {
        cart: []
      };

    default:
      return state;
  }
}
#组件使用
import { useReducer } from "react";

function Cart() {

  const [state, dispatch] = useReducer(
    reducer,
    initialState
  );

  const product = {
    id: 1,
    name: "iPhone"
  };

  return (
    <div>

      <button
        onClick={() =>
          dispatch({
            type: "ADD_ITEM",
            payload: product
          })
        }
      >
        添加商品
      </button>

      {state.cart.map(item => (
        <div key={item.id}>

          <h3>
            {item.name}
          </h3>

          <p>
            数量：{item.count}
          </p>

          <button
            onClick={() =>
              dispatch({
                type: "INCREMENT",
                payload: item.id
              })
            }
          >
            +
          </button>

          <button
            onClick={() =>
              dispatch({
                type: "DECREMENT",
                payload: item.id
              })
            }
          >
            -
          </button>

          <button
            onClick={() =>
              dispatch({
                type: "REMOVE_ITEM",
                payload: item.id
              })
            }
          >
            删除
          </button>

        </div>
      ))}

      <button
        onClick={() =>
          dispatch({
            type: "CLEAR_CART"
          })
        }
      >
        清空购物车
      </button>

    </div>
  );
}
```
