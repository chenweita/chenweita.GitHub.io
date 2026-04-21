<!--
 * @Author: chenweita 1320673491@qq.com
 * @Date: 2026-02-09 10:45:29
 * @LastEditors: chenweita 1320673491@qq.com
 * @LastEditTime: 2026-02-19 09:45:15
 * @FilePath: /chenweita.GitHub.io/_posts/ReactProject/2022-02-09-reactHooks.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
1. useLatest 
    1. 该实现通过 useRef 创建一个引用对象，并在每次组件更新时将新值赋给 ref.current。
    2. 返回的 ref 对象可以用于获取最新值，常用于回调函数或定时器中需要访问最新状态的场景。

function useLatest<T>(value: T) {
    const ref = useRef(value);
    ref.current = value;
    return ref;
}


2. useTitle
    1. 该函数用于在React应用中动态修改页面标题。
    2. 使用useRef保存初始标题，以便在组件卸载时恢复。
    3. 通过useEffect在组件挂载时设置新标题，并在卸载时根据配置恢复原标题。
    注意点：使用document.title需判断浏览器环境

function useTitle(title: string, options: Options) {
    const titleRef = useRef(isBrowser ? title : '');
    useEffect(() => {
        document.title = title
    })
    useEffect(() => {
        if (options.restoreOnunmount) {
            document.title = titleRef.current
        }
    })
}

3. useUnmount
    该代码实现了一个 React 自定义 Hook useUnmount，用于在组件卸载时执行传入的函数。它通过 useLatest 保持对函数的最新引用，并在 useEffect 的清理函数中调用该函数。此 Hook 常用于清理副作用，如取消请求或清除定时器。
    1. 先判断是否是函数
    2. 用useLatest储存最新的值
    3. 最后在useEffect的回调函数中执行

function useUnmount(fn: () => void) {
    if (ifFunction(fn)) {
        console.error('should be function')
    }
    const ref = useLatest(fn);
    useEffect(() => () => {
        ref.current()
    })
}

4. useToggle
    • 实现了一个React自定义Hook useToggle，用于管理布尔值或任意类型的切换状态
    • 支持传入默认值和反转值，当未提供反转值时自动计算默认值的反值
    • 返回当前状态值和一组操作函数组成的元组，便于在组件中进行状态管理
    • 使用useMemo优化操作函数的性能，避免不必要的重新渲染
    • 泛型设计使得Hook可以适用于各种数据类型的状态切换场景

    如果没有传入反转值，则reverseValueOrigin反转值为!defaultValue
    setLeft为defaultValue，setRight为reverseValueOrigin
    toggle如果当前值为defaultValue，则设置为反转值，否则为defaultValue

    返回state,action

    function useToggle<T, U>(defaultValue: T, reverseValue: U) {
    const reverseValueOrigin = reverseValue === undefined ? !defaultValue : reverseValue;
    const [state, setState] = useState(defaultValue);

    const actions = useMemo(() => {
        const toggle = () => setState((s) => s === defaultValue ? reverseValueOrigin : defaultValue)
        const set = (value) => setState(value);
        const setLeft = () => setState(defaultValue);
        const setRight = () => setState(reverseValueOrigin)

        return {
        toggle,
        set,
        setLeft,
        setRight
        }
    }, [])

    return [state, actions]
    }

5. useSetState
    • 实现了一个React自定义Hook useSetState，用于简化对象状态的更新操作
    • 支持传入初始状态对象或返回状态对象的函数作为初始化参数
    • 提供了智能的状态合并功能，只更新对象中发生变化的部分属性
    • 内置了对函数式更新的支持，允许基于先前状态计算新状态
    • 使用useCallback优化性能，确保setMergeState函数实例稳定
    • 类型安全设计，通过泛型约束保证状态对象的类型一致性

    主要是对对象类型的进行state的合并赋值，基于原先的状态计算新状态

    function useSetState<S extends Record<string, any>>(
        initialState: S | (() => S)
        ) {
        const [state, setState] = useState<S>(initialState);
        const setMergeState = useCallback((patch) => {
            setState((prevState) => {
            const newState = isFunction(patch) ? patch(prevState) : patch;
            return newState ? {...prevState, ...newState} : prevState
            })
        }, [])
        return [state, setMergeState]
    }

6. useSafeState
    用法与 `React.useState` 完全一样，但是在组件卸载后异步回调内的 `setState` 不再执行，避免因组件卸载后更新状态而导致的内存泄漏。

    import { useUnmountedRef } from 'encodeHooks';
    import { useState, useCallback } from 'react';
    function useSafeState<S>(initialState: S | (() => S)) {
    const [state, setState] = useState(initialState);
    const unMountRef = useUnmountedRef();
    const setCurrentState = useCallback((currentState) => {
        if (unMountRef.current) return;
        setState(currentState)
    }, [])
    return [state, setCurrentState]
    }

7. useUnmountedRef

    判断当前组件是否卸载

    import { useRef, useEffect } from 'react';

    function useUnmountedRef() {
    const unmountedRef = useRef(false);
    useEffect(() => {
        unmountedRef.current = false;
        return () => {
        unmountedRef.current = true
        }
    }, [])
    }

8. useMount

    useEffect中执行函数

    function useMount(fn: () => void) {
        if (!isFunction(fn)) {
            console.error('should be function')
        }

        useEffect(() => {
            fn?.()
        }, [])
    }

9. useMemoizedFn

    核心原因：解决 React DevTools 中的 Bug
    从历史附件信息中的 Issue #728 描述可知，这个特定的实现方式是为了解决一个在 ‌React DevTools‌ 中出现的、非常奇怪的 Bug。

    ‌Bug 现象：‌

    在普通模式下，点击按钮，计数器正常增加。
    当打开 React DevTools 并选中计数器所在的组件后，再点击按钮，计数器不再增加。
    ‌问题根源：‌
    问题的核心在于 ‌React DevTools 在特定情况下会干扰或改变组件的渲染行为‌。当使用 fnRef.current = fn 这种直接赋值的方式时，在某些由 DevTools 触发的渲染周期中，fnRef.current 的更新时机可能变得不可靠，导致它指向了一个旧的函数引用。当事件触发时，执行的是旧函数，其内部闭包捕获的也是旧的 setCount 或 count 值，因此状态更新失效。

    为什么 useMemo(() => fn, [fn]) 能解决问题？
    虽然如附件中讨论所言，useMemo(() => fn, [fn]) 在每次依赖 fn 变化时都会同步执行其工厂函数 () => fn，看起来和直接赋值 fnRef.current = fn 效果一样，但它‌在 React 的渲染机制中扮演了不同的角色‌。

    ‌确保在正确的渲染阶段更新‌：useMemo 是 React 的一个 ‌Hook‌，它的执行被纳入 React 的渲染流程。React 会保证在组件渲染的“提交阶段”之前，所有 useMemo 的依赖检查和值计算都已经完成。这意味着，即使 React DevTools 的介入导致了额外的、非典型的渲染周期，useMemo 也能确保 fnRef.current 在这个流程中被正确地、确定性地更新到最新的 fn。

    ‌绕过潜在的 Ref 赋值时机问题‌：直接对 ref.current 进行赋值是一个副作用操作，它发生在 React 的渲染函数体内部，其时机可能受到 React 内部调度（尤其是在未来并发模式下）或外部工具（如 DevTools）干扰。而将赋值操作包裹在 useMemo 中，相当于将这个副作用“注册”给了 React 的 Hook 系统来管理，React 会负责在合适的时机应用这个更新，从而保证了可靠性。

    为什么不直接用 useCallback？
    ‌目的不同‌：useCallback(fn, deps) 的目的是‌返回一个记忆化的函数引用‌。它缓存的是 fn 这个函数本身。而 useMemoizedFn 的目标是‌返回一个永远稳定的函数引用‌，这个函数内部调用的是最新的 fn。它需要的是一个‌可变的容器‌（ref）来存放最新的 fn，而不是一个缓存不变的 fn。useCallback 的返回值不适合直接用作一个可变的 ref.current 值。

    ‌无法解决核心问题‌：即使我们尝试 fnRef.current = useCallback(fn, [fn])，这仍然是将 useCallback 的返回值（一个函数）赋值给 ref.current。这个赋值操作的时机问题依然存在，可能无法解决 DevTools 引发的那个特定 Bug。useMemo 在这里的作用更接近于一个“确保副作用在正确时机执行的调度器”，而不仅仅是缓存一个值。

    type noop = (this: any, ...args: any[]) => any;

    type PickFunction<T extends noop> = (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
    ) => ReturnType<T>;

    function useMemoizedFn<T extends noop>(fn: T) {
    if (isDev) {
        if (!isFunction(fn)) {
        console.error(`useMemoizedFn expected parameter is a function, got ${typeof fn}`);
        }
    }

    const fnRef = useRef<T>(fn);

    // why not write `fnRef.current = fn`?
    // https://github.com/alibaba/hooks/issues/728
    fnRef.current = useMemo(() => fn, [fn]);

    const memoizedFn = useRef<PickFunction<T>>();
    if (!memoizedFn.current) {
        memoizedFn.current = function (this, ...args) {
        return fnRef.current.apply(this, args);
        };
    }

    return memoizedFn.current as T;
    }


9. useDebounceFn
    1. poly-fill中使用debounce

        wait //等待时间
        leading: true,  // 立即执行
        trailing: false // 延迟结束后不执行
        maxWait: 1000 //带最大等待时间的防抖

        // 手动调用
        debouncedFunction.run(); // 立即执行
        debouncedFunction.cancel(); // 取消执行
        debouncedFunction.flush(); // 立即执行并清除定时器
    
    2. 具体思路，代码
    传入两个参数，一个是执行函数，一个是options，options包括上述四个参数，
    用useLatest处理fn，useMemo处理debounced，传入三个参数，包括fn，wait，options，最终返回三个函数，cancel，flush，debounced

        import { useMemo } from 'react';
        import { useLatest, useUnmount } from "encodeHooks";
        import { isFunction } from "encodeHooks/lib/utils";
        import { debounce } from 'encodeHooks/lib/utils/lodash-polyfill';

        type noop = (...args: any[]) => any;
        interface DebounceOptions {
        wait: number,
        leading: boolean,
        trailing: boolean,
        maxWait: number
        }
        function useDebounceFn<T extends noop>(fn: T, options?: DebounceOptions) {
        if (!isFunction(fn)) {
            console.error()
        }

        const fnRef = useLatest(fn);

        const wait = options?.wait ?? 1000;

        const debounced = useMemo(() => {
            debounce(
            (...args: Parameters<T>): ReturnType<T> => {
                return fnRef.current(...args)
            },
            wait,
            options,
            )
        })

        useUnmount(() => {
            debounced.cancel()
        })

        return {
            flush: debounced.flush,
            cancel: debounced.cancel,
            run: debounced,
        }
        }

        export default useDebounceFn;

10. useDebounce

    value 是你想要进行防抖处理的那个数据源，比如用户输入的文本、窗口尺寸等，而 debounced 则是这个值经过防抖延迟后最终更新的状态值。

    function useDebounce<T>(value: T, options?: DebounceOptions) {
        const [debounced, setDebounced] = useState(value);

        const { run } = useDebounceFn(() => {
            setDebounced(value)
        }, options)

        useEffect(() => {
            run()
        }, [value])
        
        return debounced;
    }

11. useThrottle 和 useThrottleFn 同上

12. usePrevious 获取上一次保存的数据的值
import { useRef } from 'react';

export type ShouldUpdateFn<T> = (a?: T | undefined, b?: T) => boolean;

const defaultShouldUpdate = <T>(a?: T, b?: T) => !Object.is(a, b)
function usePrevious<T>(
  state: T,
  shouldUpdate: ShouldUpdateFn<T> = defaultShouldUpdate,
) {
  const prevRef = useRef();
  const curRef = useRef();

  if (shouldUpdate(state, curRef.current)) {
    prevRef.current = curRef.current;
    curRef.current = state;
  }

  return prevRef.current
}

export default usePrevious;

13. useGetState

    在useState的基础上，增加一个getState的方法，通过ref储存最新的值，然后返回一个useCallback包裹的函数返回ref的值

    import { useState, useRef, useCallback } from 'react';

    function useGetState<T> (initialState: T) {
    const [state, setState] = useState(initialState);
    const stateRef = useRef(state);

    stateRef.current = state;

    const getState = useCallback(() => stateRef.current, [])

    return [state, setState, getState]
    }

    export default useGetState;


14. useResetState

        在 React 中使用 useCallback 和 useMemoizedFn 在功能上确实有区别，主要体现在以下几个方面：

        依赖管理的复杂性
        ‌useCallback‌ 需要手动指定依赖数组，如果依赖数组不正确可能导致闭包陷阱：

        javascript
        
        const handleClick = useCallback(() => {
        console.log(count);
        }, [count]); // 必须正确指定依赖
        ‌useMemoizedFn‌ 不需要手动指定依赖数组，自动处理函数引用：

        javascript
        
        const handleClick = useMemoizedFn(() => {
        console.log(count); // 自动捕获当前值
        });
        性能优化效果
        两者都能避免不必要的函数重新创建，从而防止子组件不必要的重渲染。但 useMemoizedFn 通过内部机制确保函数引用的稳定性，避免了依赖管理的复杂性。

        实际使用场景
        在实际应用中，两者效果相似，但 useMemoizedFn 更加简化了依赖管理的复杂性。

        选择建议
        如果需要精确控制依赖关系，可以使用 useCallback
        如果希望简化依赖管理，避免闭包陷阱，useMemoizedFn 是更好的选择
        总的来说，useMemoizedFn 可以看作是 useCallback 的一种更简化、更安全的替代方案。


        function useResetState(initialState) {
            const [state, setState] = useState(initialState);

            const resetState = useMemoizedFn(() => {
                setState(initialState)
            })

            return [state, setState, resetState]
        }

        export default useResetState;


15. useRafState

    使用requestAnimationFrame做状态的更新，与浏览器渲染同步的状态管理

    核心特性
    1. ‌基于 requestAnimationFrame‌: 状态更新会在浏览器下次重绘之前执行，确保动画流畅性
    2. ‌防抖动机制‌: 通过 useRef 存储 RAF ID 并在每次更新前取消之前的请求，避免状态竞争
    3. ‌内存安全‌: 组件卸载时自动清理未执行的动画帧回调
    ‌类型安全‌: 使用  泛型支持各种状态类型
    工作流程
    1. 调用 setRafState 时先取消之前的 RAF 回调
    2. 注册新的 RAF 回调，在下一帧执行实际的 setState
    3. 组件卸载时清理 RAF 回调防止内存泄漏


        import { useUnmount } from 'encodeHooks';
        import { useState, useRef, useCallback } from 'react';
        function useRafState<S>(initialState: S | (() => S)) {
        const ref = useRef(0)
        const [state, setState] = useState(initialState);

        const setRafState = useCallback((value: S | ((prev:S) => S)) => {
            cancelAnimationFrame(ref.current);

            ref.current = requestAnimationFrame(() => {
            setState(value)
            })
        }, []);

        useUnmount(() => {
            cancelAnimationFrame(ref.current);
        })

        return [state, setRafState] as const;
        }

        export default useRafState;


16. useBoolean

    基于useToggle的基础上返回toggle, set方法，用useMemo包裹action的对象

        export interface Actions {
            setTrue: () => void,
            setFalse: () => void,
            set: (value: boolean) => void,
            toggle: () => void
        }


        function useBoolean(defaultValue: boolean) {
        const [state, {toggle, set}] = useToggle(!!defaultValue);

        

        const action: Actions = useMemo(() => {
            const setTrue = () => set(true);
            const setFalse = () => set(false);
            return {
                set: (v) => set(!!v),
                setTrue,
                setFalse,
                toggle
            }
        })

        return [state, action]
        }
        export default useBoolean;


17. createUpdateEffect


    核心逻辑
    1. ‌参数接收‌：接受一个基础的 Effect Hook（如 useEffect 或 useLayoutEffect）作为参数

    ‌2. 挂载状态跟踪‌：使用 useRef(false) 创建 isMounted 标志，用于标识组件是否已挂载

    3. ‌卸载处理‌：第一个 hook(() => { ... }, []) 用于处理组件卸载时的清理工作，将 isMounted 设置为 false

    4. ‌更新执行‌：第二个 hook(() => { ... }, deps) 在依赖项变化时执行核心逻辑：

    如果组件未挂载（首次渲染），设置标志位并返回
    如果组件已挂载（后续更新），则执行传入的 effect 函数

    这是一个‌高阶函数‌，分两层：

    第一层：接收 hook 参数（如 useEffect）
    第二层：返回一个新函数，接收 effect 和 deps 参数

    import { useEffect, useLayoutEffect, useRef } from 'react';
    type EffectHookType = typeof useEffect | typeof useLayoutEffect;
    const createUpdateEffect: (hook: EffectHookType) => EffectHookType =
    (hook) => (effect, deps) => {
    const isMounted = useRef(false);

    hook(() => {
        return () => {
        isMounted.current = false;
        }
    }, [])

    hook(() => {
        if (!isMounted.current) {
        isMounted.current = true;
        } else {
        return effect()
        }
    }, [deps])
    }

    export default createUpdateEffect;


18. createStorageState

import { useState } from 'react';
import { isFunction, isUndef } from "encodeHooks/lib/utils";
import { useMemoizedFn, useUpdateEffect } from 'encodeHooks';

export type SetState<S> = S | ((prevState: S) => S)

export interface Options<T> {
  defaultValue: T | (() => T),
  serializer: (value: T) => string,
  deserialzer: (value: string) => T,
  onError: (error: unknown) => void
}

export function createStorageState(getStorage: () => Storage | undefined) {
  function useStorageState<T>(key: string, options: Options<T> = {}) {
    let storage: Storage | undefined;
    const {
      onError = (e) => {
        console.log(e)
      }
    } = options;

    try {
      storage = getStorage();
    } catch (err) {
      onError(err)
    }

    const serializer = (value: T) => {
      if (options.serializer) {
        return options.serializer(value)
      }
      return JSON.stringify(value)
    }

    const deserialzer = (value: string): T  => {
      if (options.deserialzer) {
        return options.deserialzer(value)
      }
      return JSON.parse(value)
    }

    function getStoredValue() {
      try {
        const raw = storage?.getItem(key)
        if (raw) return deserialzer(raw)
      } catch (e) {
        onError(e)
      }
      if (isFunction(options.defaultValue)) {
        options.defaultValue()
      }
      return options.defaultValue;
    }

    const [state, setState] = useState(getStoredValue);

    useUpdateEffect(() => {
      setState(getStoredValue())
    }, [key])

    const updateState = (value: SetState<T>) => {
      const currentState = isFunction(value) ? value(state) : value;
      setState(currentState);

      if (isUndef(currentState)) {
        storage?.removeItem(key)
      } else {
        try {
          storage?.setItem(key, serializer(currentState))
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [state, useMemoizedFn(updateState)] as const;
  }

  return useStorageState;
}


19. createUpdateEffect
import { useEffect, useLayoutEffect, useRef } from 'react';
type EffectHookType = typeof useEffect | typeof useLayoutEffect;
const createUpdateEffect: (hook: EffectHookType) => EffectHookType =
(hook) => (effect, deps) => {
  const isMounted = useRef(false);

  hook(() => {
    return () => {
      isMounted.current = false;
    }
  }, [])

  hook(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      return effect()
    }
  }, [deps])
}

export default createUpdateEffect;


20. useCookieState
import Cookies from 'js-cookie';
import { useState } from 'react';
import useMemoizedFn from '../useMemoizedFn';
import { isFunction, isString } from '../utils';

export type State = string | undefined;

export interface Options extends Cookies.CookieAttributes {
  defaultValue?: State | (() => State);
}

function useCookieState(cookieKey: string, options: Options = {}) {
  const [state, setState] = useState<State>(() => {
    const cookieValue = Cookies.get(cookieKey);

    if (isString(cookieValue)) return cookieValue;

    if (isFunction(options.defaultValue)) {
      return options.defaultValue();
    }

    return options.defaultValue;
  });

  const updateState = useMemoizedFn(
    (
      newValue: State | ((prevState: State) => State),
      newOptions: Cookies.CookieAttributes = {},
    ) => {
      const { defaultValue, ...restOptions } = { ...options, ...newOptions };
      const value = isFunction(newValue) ? newValue(state) : newValue;

      setState(value);

      if (value === undefined) {
        Cookies.remove(cookieKey);
      } else {
        Cookies.set(cookieKey, value, restOptions);
      }
    },
  );

  return [state, updateState] as const;
}

export default useCookieState;



21. useSet
import { useMemoizedFn } from 'encodeHooks';
import { useState } from 'react';

function useSet<K>(initialValue: Iterable<K>) {
  const getInitValue = () => new Set(initialValue);
  const [set, setSet] = useState<Set<K>>(getInitValue);

  const add = (key: K) => {
    if (set.has(key)) {
      return;
    }
    setSet((prevSet) => {
      const tmp = new Set(prevSet);
      tmp.add(key);
      return tmp
    })
  }

  const remove = (key: K) => {
    if (!set.has(key)) {
      return;
    }
    setSet((prevSet) => {
      const tmp = new Set(prevSet);
      tmp.delete(key);
      return tmp
    })
  }

  const reset = () => new Set(getInitValue());

  return [
    set,
    {
      add: useMemoizedFn(add),
      remove: useMemoizedFn(remove),
      reset: useMemoizedFn(reset),
    }
  ] as const
}

export default useSet;


22. useMap
import { useState } from 'react';
import useMemoizedFn from '../useMemoizedFn';

function useMap<K, T>(initialValue?: Iterable<readonly [K, T]>) {
  const getInitValue = () => new Map(initialValue);
  const [map, setMap] = useState<Map<K, T>>(getInitValue);

  const set = (key: K, entry: T) => {
    setMap((prev) => {
      const temp = new Map(prev);
      temp.set(key, entry);
      return temp;
    });
  };

  const setAll = (newMap: Iterable<readonly [K, T]>) => {
    setMap(new Map(newMap));
  };

  const remove = (key: K) => {
    setMap((prev) => {
      const temp = new Map(prev);
      temp.delete(key);
      return temp;
    });
  };

  const reset = () => setMap(getInitValue());

  const get = (key: K) => map.get(key);

  return [
    map,
    {
      set: useMemoizedFn(set),
      setAll: useMemoizedFn(setAll),
      remove: useMemoizedFn(remove),
      reset: useMemoizedFn(reset),
      get: useMemoizedFn(get),
    },
  ] as const;
}

export default useMap;

23. createEffectWithTarget

        const useEffectWithTarget = (
            effect: EffectCallback,
            deps: DependencyList,
            target: BasicTarget<any> | BasicTarget<any>[],
        ) => {
        ‌三个参数含义‌：

        effect：副作用函数，当依赖项变化时执行
        deps：依赖项数组，用于控制副作用执行时机
        target：目标元素，可以是单个目标或目标数组

        1. 状态初始化

            const hasInitRef = useRef(false);
            const lastElementRef = useRef<(Element | null)[]>([]);
            const lastDepsRef = useRef<DependencyList>([]);
            const unLoadRef = useRef<any>();
            hasInitRef：标记是否已初始化
            lastElementRef：存储上一次的目标元素数组
            lastDepsRef：存储上一次的依赖项数组
            unLoadRef：存储上一次副作用的清理函数

        2. 核心 useEffect 执行

            useEffectType(() => {
            const targets = Array.isArray(target) ? target : [target];
            const els = targets.map((item) => getTargetElement(item));
            ‌目标元素处理‌：

            将单个目标转换为数组统一处理
            使用 getTargetElement 获取实际 DOM 元素

        3. 初始化执行

            if (!hasInitRef.current) {
            hasInitRef.current = true;
            lastElementRef.current = els;
            lastDepsRef.current = deps;
            unLoadRef.current = effect();
            return;
            }

        ‌首次执行逻辑‌：

        标记已初始化
        保存当前元素和依赖项
        执行副作用函数并保存清理函数
        4. 依赖项对比和更新


        if (
            els.length !== lastElementRef.current.length ||
            !depsAreSame(els, lastElementRef.current) ||
            !depsAreSame(deps, lastDepsRef.current)
        ) {
            unLoadRef.current?.();
            lastElementRef.current = els;
            lastDepsRef.current = deps;
            unLoadRef.current = effect();
        }
        ‌更新条件判断‌：

        目标元素数量发生变化
        目标元素引用发生变化
        依赖项发生变化
        
        5. 清理机制

        useUnmount(() => {
            unLoadRef.current?.();
            // for react-refresh
            hasInitRef.current = false;
        });

        ‌组件卸载清理‌：

        执行最后一次副作用的清理函数
        重置初始化标记，支持 react-refresh
        执行流程总结
        ‌初始化阶段‌：首次渲染时执行副作用函数
        ‌更新阶段‌：当目标元素或依赖项发生变化时重新执行
        ‌清理阶段‌：组件卸载时执行清理函数并重置状态
        这个实现确保了副作用的执行能够响应目标元素的变化，提供了比标准 useEffect 更精确的控制能力。


        import { useUnmount } from 'encodeHooks';
        import depsAreSame from 'encodeHooks/lib/utils/depsAreSame';
        import { getTargetElement } from 'encodeHooks/lib/utils/domTarget';
        import { useEffect, useLayoutEffect, EffectCallback, typeDependencyList, typeMutableRefObject, useRef } from 'react';

        type TargetValue<T> = T | undefined | null;
        type TargetType = HTMLElement | Element | Window | Document;

        export type BasicTarget<T extends TargetType = Element> =
        | (() => TargetValue<T>)
        | TargetValue<T>
        | typeMutableRefObject<TargetValue<T>>;

        const createEffectWithTarget = (useEffectType: typeof useEffect | useLayoutEffect) => {
        const useEffectWithTarget = (
            effect: EffectCallback,
            deps: typeDependencyList,
            target: BasicTarget<any> | BasicTarget<any>[],
        ) => {
            const hasInitRef = useRef(false);

            const lastElementRef = useRef<(Element | null)[]>([]);
            const lastDepsRef = useRef<typeDependencyList[]>([]);

            const unLoadRef = useRef<any>();

            useEffectType(() => {
            const targets = Array.isArray(target) ? target : [target];
            const els = targets.map((item) => getTargetElement(item));

            if (!hasInitRef.current) {
                hasInitRef.current = true;
                lastElementRef.current = els;
                lastDepsRef.current = deps;

                unLoadRef.current = effect();
                return;
            }

            if (
                els.length !== lastElementRef.current.length ||
                !depsAreSame(els, lastElementRef.current) ||
                !depsAreSame(deps, lastDepsRef.current)
            ) {
                unLoadRef.current?.();
                lastElementRef.current = els;
                lastDepsRef.current = deps;
                unLoadRef.current = effect()
            }
            })

            useUnmount(() => {
            unLoadRef.current?.();
            hasInitRef.current = false;
            })

        }
        return useEffectWithTarget
        }

        export default createEffectWithTarget;




24. useEventListener
remove的时候传capture是为了能够精准匹配，确保了事件监听器的精确匹配和管理，避免了意外移除其他监听器的问题。如果在 addEventListener 和 removeEventListener 中使用不同的选项参数，可能会导致监听器无法正确移除，造成内存泄漏或意外行为。

import { useLatest } from "encodeHooks";
import { BasicTarget } from "./createEffectWithTarget";
import useEffectWithTarget from "encodeHooks/lib/utils/useEffectWithTarget";
import { getTargetElement } from "encodeHooks/lib/utils/domTarget";

type noop = (...p: any) => void;

export type Target = BasicTarget<HTMLElement | Element | Window | Document>
type Options<T extends Target = Target> = {
  target?: T;
  capture?: boolean;
  once?: boolean;
  passive?: boolean
}
function useEventListener(eventName: string, handler: noop, options: Options = {}) {
  const handlerRef = useLatest(handler);

  useEffectWithTarget(
    () => {
      let targetElement = getTargetElement(options.target, window);
      if (!targetElement?.addEventListener) {
        return
      }

      const eventListener = (event: Event) => {
        return  handlerRef.current(event)
      }

      targetElement.addEventListener(eventName, eventListener, {
        capture: options.capture,
        once: options.once,
        passive: options.passive,
      })

      return () => {
        targetElement.removeEventListener(eventName, eventListener, {
          capture: options.capture
        })
      }
    },
    [eventName, options.passive, options.once, options.capture],
    options.target
  )
}

export default useEventListener;


25. useDocumentVisibility
    主要是用到useEventListener作为监听，传入eventName，handler，以及options中的target

        import { useState } from 'react';
        import { useEventListener } from "encodeHooks";
        import isBrowser from "encodeHooks/lib/utils/isBrowser";

        type VisibilityState = 'visible' | 'hidden' | 'prerender' | undefined;

        const getVisibility = () => {
        if (!isBrowser) return 'visible';
        return document.visibilityState
        }


        function useDocumentVisibility(): VisibilityState {
        const [documentVisibility, setDocumentVisibility] = useState(() => getVisibility())
        useEventListener(
            'visibilitychange',
            () => {
            return setDocumentVisibility(getVisibility())
            },
            {
            target: () => document,
            }
        )
        return documentVisibility;
        }

        export default useDocumentVisibility;


26. useEventTarget

        import { useCallback, useState } from 'react';
        import useLatest from '../useLatest';
        import { isFunction } from '../utils';

        interface EventTarget<U> {
        target: {
            value: U;
        };
        }

        export interface Options<T, U> {
        initialValue?: T;
        transformer?: (value: U) => T;
        }

        function useEventTarget<T, U = T>(options?: Options<T, U>) {
        const { initialValue, transformer } = options || {};
        const [value, setValue] = useState(initialValue);

        const transformerRef = useLatest(transformer);

        const reset = useCallback(() => setValue(initialValue), []);

        const onChange = useCallback((e: EventTarget<U>) => {
            const _value = e.target.value;
            if (isFunction(transformerRef.current)) {
            return setValue(transformerRef.current(_value));
            }
            // no transformer => U and T should be the same
            return setValue(_value as unknown as T);
        }, []);

        return [
            value,
            {
            onChange,
            reset,
            },
        ] as const;
        }

        export default useEventTarget;


27. useHover
import { useBoolean, useEventListener } from "encodeHooks";
import { BasicTarget } from "./createEffectWithTarget";

export interface Options {
  onEnter?: () => void;
  onLeave?: () => void;
  onChange: (isHovering: boolean) => void;
}

function useHover(target: BasicTarget, options: Options): boolean {
    const { onChange, onLeave, onEnter } = options || {};
    const [state, { setTrue, setFalse }] = useBoolean(false);

    useEventListener(
      'mouseenter',
      () => {
        onEnter?.();
        setTrue();
        onChange?.(true)
      },
      {
        target
      }
    )

    useEventListener(
      'mouseleave',
      () => {
        onLeave?.();
        setFalse();
        onChange?.(false)
      },
      {
        target
      }
    )

    return state;
}

28. useKeyPress
29. useInViewport

30. useInViewport

        import { useState } from 'react';
        import { BasicTarget } from './createEffectWithTarget';
        import useEffectWithTarget from 'encodeHooks/lib/utils/useEffectWithTarget';
        import { getTargetElement } from 'encodeHooks/lib/utils/domTarget';

        type CallbackType = (entry: IntersectionObserverEntry) => void;

        export interface Options {
            rootMargin?: string;// 根元素的外边距
            threshold?: number | number[];// 交叉比例阈值
            root?: BasicTarget<Element>;// 根元素
            callback?: CallbackType;// 回调函数
        }

        function useInViewport (target: BasicTarget | BasicTarget[], options?: Options) {

        const {callback, ...option} = options || {};
        const [state, setState] = useState<boolean>();
        const [ratio, setRatio] = useState<number>();


        useEffectWithTarget(
            () => {
            const targets = Array.isArray(target) ? target : [target];
            // filter(Boolean) 会过滤掉数组中所有假值（如 null、undefined、0、false、"" 等）
            const els = targets.map((element) => getTargetElement(element)).filter(Boolean)

            if (!els.length) return;

            const observer = new IntersectionObserver(
                (entries) => {
                for(const entry of entries) {
                    setState(entry.isIntersecting);
                    setRatio(entry.intersectionRatio);
                    callback?.(entry)
                }
                },
                {
                ...option,
                root: getTargetElement(options?.root),
                }
            )

            els.forEach(el => {
                if (el) {
                observer.observe(el)
                }
            });

            return () => {
                observer.disconnect()
            }

            },
            [option?.root, option?.rootMargin, option.threshold, callback],
            target
        )

        return [state, ratio] as const;

        }

        export default useInViewport;


31. onLongPress

    1. ‌初始化阶段‌：Hook 接收长按回调函数和配置选项，设置内部状态来跟踪按压状态和长按状态。

    2. ‌事件监听‌：当用户开始按压目标元素时（如鼠标按下或触摸开始），Hook 会启动一个计时器。

    3. ‌延迟判断‌：计时器会等待指定的延迟时间（默认 300 毫秒），如果在这段时间内用户没有释放按压，则触发长按回调函数。

    4. ‌状态更新‌：在延迟时间到达后，Hook 会将长按状态标记为已触发，并执行传入的长按处理函数。

    5. ‌结束处理‌：当用户释放按压时（鼠标抬起或触摸结束），Hook 会清除计时器并重置状态，确保不会在后续操作中误触发长按。

    6. ‌清理机制‌：当组件卸载时，Hook 会清理所有注册的事件监听器和定时器，防止内存泄漏。

    这个过程使得开发者可以轻松地为任何元素添加长按功能，而无需关心底层的事件处理逻辑。

            import { useRef } from 'react';
            import isBrowser from "encodeHooks/lib/utils/isBrowser";
            import { BasicTarget } from "./createEffectWithTarget";
            import { useLatest } from "encodeHooks";
            import useEffectWithTarget from 'encodeHooks/lib/utils/useEffectWithTarget';
            import { getTargetElement } from 'encodeHooks/lib/utils/domTarget';

            type EventType = MouseEvent | TouchEvent;

            // 定义配置选项接口，包括延迟时间、移动阈值、点击回调和长按结束回调
            export interface Options {
            onClick?: (e: EventType) => void;
            onLongPressEnd?: (e: EventType) => void;
            moveThreshold?: {x: number; y: number};
            delay?: number;
            }

            const touchSupported =
            isBrowser &&
            ('ontouchstart' in window || (window.DocumentTouch && document instanceof DocumentTouch));
            // 检测浏览器是否支持触摸事件


            function useLongPress(
            onLongPress: (e: EventType) => void,
            target: BasicTarget,
            {delay = 300, onClick, moveThreshold, onLongPressEnd} :Options = {}
            ) {
            const onClickRef = useLatest(onClick);
            const onLongPressEndRef = useLatest(onLongPressEnd);
            const onLongPressRef = useLatest(onLongPress);

            const timerRef = useRef<ReturnType <typeof setTimeout>>();
            const prevPosition = useRef({x: 0, y: 0});
            const isTriggerRef = useRef(false);
            const hasMoveThreshold = !!(
                (moveThreshold?.x && moveThreshold.x > 0) ||
                (moveThreshold?.y && moveThreshold.y > 0)
            )

            useEffectWithTarget(
                () => {
                const targetEl = getTargetElement(target);

                if (!targetEl?.addEventListener) {
                    return;
                }

                function getClientPosition(event: EventType) {
                    if (event instanceof TouchEvent) {
                    return {
                        clientX: event.touches[0].clientX,
                        clientY: event.touches[0].clientY,
                    }
                    }
                    if (event instanceof MouseEvent) {
                    return {
                        clientX: event.clientX,
                        clientY: event.clientY,
                    }
                    }
                    console.warn('unsupported event typr')
                    return {
                    clientX: 0,
                    clientY: 0
                    }
                }

                // 用于判断用户在按下元素后是否移动了超过设定的阈值距离
                const overThreshold = (event: EventType) => {
                    const { clientX, clientY} = getClientPosition(event);
                    const offsetX = Math.abs(clientX - prevPosition.current.x);
                    const offsetY = Math.abs(clientY - prevPosition.current.y);

                    return !!(
                    (moveThreshold?.x && offsetX > moveThreshold.x) ||
                    (moveThreshold?.y && offsetY > moveThreshold.y)
                    )
                }

                const onStart = (event: EventType) => {
                    // 按下事件处理
                    // 启动长按计时器
                    // 记录初始位置
                    if (hasMoveThreshold) {
                    let { clientX, clientY } = getClientPosition(event);
                    prevPosition.current.x = clientX;
                    prevPosition.current.y = clientY;
                    }
                    timerRef.current = setTimeout(() => {
                    // 触发onLongPress
                    onLongPressRef.current(event);
                    // 把触发标志设置为true
                    isTriggerRef.current = true;
                    }, delay)
                };
                
                const onMove = (event: EventType) => {
                    // 移动事件处理
                    // 检查是否超出移动阈值
                    if (timerRef.current && overThreshold(event)) {
                    clearTimeout(timerRef.current);
                    timerRef.current = undefined
                    }
                };
                
                const onEnd = (event: EventType, shouldClick: boolean = false) => {
                    // 清除计时器
                    if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    }
                    // 判断是否触发长按
                    if (isTriggerRef.current) {
                    onLongPressEndRef?.current?.(event)
                    }
                    // 判断是否触发click事件
                    if (shouldClick && !isTriggerRef.current && onClickRef) {
                    onClickRef.current(event)
                    }
                    isTriggerRef.current = false
                };

                const onEndWithClick = (event: EventType) => onEnd(event, true)

                if (!touchSupported) {
                    targetEl.addEventListener('mousedown', onStart);
                    targetEl.addEventListener('mouseup', onEndWithClick);
                    targetEl.addEventListener('mouseleave', onEnd);
                    if (hasMoveThreshold) targetEl.addEventListener('mousemove', onMove);
                } else {
                    targetEl.addEventListener('touchstart', onStart);
                    targetEl.addEventListener('touchend', onEndWithClick);
                    if (hasMoveThreshold) targetEl.addEventListener('touchmove', onMove);
                }

                return () => {
                    if (timerRef.current) {
                    clearTimeout(timerRef.current);
                    timerRef.current = undefined;
                    isTriggerRef.current = false;
                    }
                    if (!touchSupported) {
                    targetEl.removeEventListener('mousedown', onStart);
                    targetEl.removeEventListener('mouseup', onEndWithClick);
                    targetEl.removeEventListener('mouseleave', onEnd);
                    if (hasMoveThreshold) targetEl.removeEventListener('mousemove', onMove);
                    } else {
                    targetEl.removeEventListener('touchstart', onStart);
                    targetEl.removeEventListener('touchend', onEndWithClick);
                    if (hasMoveThreshold) targetEl.removeEventListener('touchmove', onMove);
                    }
                }
                },
                [],
                target
            )
            }


            export default useLongPress;


32. useMutationObserver
import { useLatest } from "encodeHooks"
import { BasicTarget } from "./createEffectWithTarget"
import useDeepCompareEffectWithTarget from "./useDeepCompareEffectWithTarget";
import { getTargetElement } from "encodeHooks/lib/utils/domTarget";

interface MutationCallback {
  (mutations: MutationRecord[], observer: MutationObserver): void
}

const useMutationObserver = (
  callback: MutationCallback,
  target: BasicTarget,
  options: MutationObserverInit = {}
) => {
  const callbackRef = useLatest(callback);

  useDeepCompareEffectWithTarget(
    () => {
      const element = getTargetElement(target);

      if (!element) return;

      const observer = new MutationObserver(callbackRef.current);
      observer.observe(element, options);

      return () => {
        observer?.disconnect()
      }
    },
    [options],
    target
  )
}