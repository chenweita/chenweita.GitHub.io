# hooks
function useState(initialState) {
  // 当前useState使用的hook会被赋值该该变量
  let hook;

  if (isMount) {
    hook = {
      queue: {
        pending: null
      },
      memoizedState: initialState,
      next: null
    }

    // 将hook插入fiber.memoizedState链表末尾
    if (!fiber.memoizedState) {
      fiber.memoizedState = hook;
    } else {
      workInProgressHook.next = hook;
    }
    // 移动workInProgressHook指针
    workInProgressHook = hook;
  } else {
    // update时找到对应hook
    hook = workInProgressHook;
    // 移动workInProgressHook指针
    workInProgressHook = workInProgressHook.next;
  }

  let baseState = hook.memoizedState;
  if (hook.queue.pending) {
    // 获取update环状单向链表中第一个update
    let firstUpdate = hook.queue.pending.next;
  
    do {
      // 执行update action
      const action = firstUpdate.action;
      baseState = action(baseState);
      firstUpdate = firstUpdate.next;
  
      // 最后一个update执行完后跳出循环
    } while (firstUpdate !== hook.queue.pending.next)
  
    // 清空queue.pending
    hook.queue.pending = null;
  }
  hook.memoizedState = baseState;

  return [baseState, dispatchAction.bind(null, hook.queue)];
}


1. 状态初始化‌：在组件挂载阶段(isMount为true时)创建hook对象，包含初始状态、更新队列等属性，并将其插入到fiber节点的memoizedState链表中

2. ‌状态更新‌：在更新阶段(isMount为false时)从memoizedState链表中找到对应的hook节点

3. ‌更新队列处理‌：遍历hook.queue.pending中的更新操作，按顺序执行所有的action函数来计算新的状态值

4. ‌状态返回‌：返回当前状态值和用于触发更新的dispatch函数

5. ‌链表管理‌：通过workInProgressHook指针维护hook链表的遍历，确保每次useState调用都能找到正确的hook节点



# 优先级
// Times out immediately
var IMMEDIATE_PRIORITY_TIMEOUT = -1;
// Eventually times out
var USER_BLOCKING_PRIORITY_TIMEOUT = 250;
var NORMAL_PRIORITY_TIMEOUT = 5000;
var LOW_PRIORITY_TIMEOUT = 10000;
// Never times out
var IDLE_PRIORITY_TIMEOUT = maxSigned31BitInt;

1. 该实现定义了React调度器中不同优先级任务的时间超时阈值。
2. IMMEDIATE_PRIORITY_TIMEOUT设置为-1表示立即超时，用于高优先级任务。
3. USER_BLOCKING_PRIORITY_TIMEOUT为250ms，表示用户阻塞优先级任务的超时时间。
4. NORMAL_PRIORITY_TIMEOUT为5000ms，表示普通优先级任务的超时时间。
5. LOW_PRIORITY_TIMEOUT为10000ms，表示低优先级任务的超时时间。
6. IDLE_PRIORITY_TIMEOUT设置为最大31位有符号整数，表示空闲优先级任务永不超时。