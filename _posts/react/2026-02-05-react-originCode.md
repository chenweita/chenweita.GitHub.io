


# 1. beforeMutation
do {
    // 触发useEffect回调与其他同步任务。由于这些任务可能触发新的渲染，所以这里要一直遍历执行直到没有任务
    flushPassiveEffects();
  } while (rootWithPendingPassiveEffects !== null);
  <!-- 持续执行 flushPassiveEffects() 直到没有待处理的被动副作用
这确保所有 useEffect 都被执行完毕 -->

  // root指 fiberRootNode
  // root.finishedWork指当前应用的rootFiber
  const finishedWork = root.finishedWork;

  // 凡是变量名带lane的都是优先级相关
  const lanes = root.finishedLanes;
  if (finishedWork === null) {
    return null;
  }
  root.finishedWork = null;
  root.finishedLanes = NoLanes;
  
  <!-- 获取已完成的渲染工作节点 清空相关状态，为下一次渲染做准备 -->
  

  // 重置Scheduler绑定的回调函数
  root.callbackNode = null;
  root.callbackId = NoLanes;
  <!-- 重置调度器相关的回调函数和标识 -->

  let remainingLanes = mergeLanes(finishedWork.lanes, finishedWork.childLanes);
  // 重置优先级相关变量
  markRootFinished(root, remainingLanes);
  <!-- 计算剩余的优先级任务 标记根节点完成 -->

  // 清除已完成的discrete updates，例如：用户鼠标点击触发的更新。
  if (rootsWithPendingDiscreteUpdates !== null) {
    if (
      !hasDiscreteLanes(remainingLanes) &&
      rootsWithPendingDiscreteUpdates.has(root)
    ) {
      rootsWithPendingDiscreteUpdates.delete(root);
    }
  }
  <!-- 清除已完成的离散更新任务 -->

  // 重置全局变量
  if (root === workInProgressRoot) {
    workInProgressRoot = null;
    workInProgress = null;
    workInProgressRootRenderLanes = NoLanes;
  } else {
  }
  <!-- 重置当前正在处理的工作进度 -->

  // 将effectList赋值给firstEffect
  // 由于每个fiber的effectList只包含他的子孙节点
  // 所以根节点如果有effectTag则不会被包含进来
  // 所以这里将有effectTag的根节点插入到effectList尾部
  // 这样才能保证有effect的fiber都在effectList中
  let firstEffect;
  if (finishedWork.effectTag > PerformedWork) {
    if (finishedWork.lastEffect !== null) {
      finishedWork.lastEffect.nextEffect = finishedWork;
      firstEffect = finishedWork.firstEffect;
    } else {
      firstEffect = finishedWork;
    }
  } else {
    // 根节点没有effectTag
    firstEffect = finishedWork.firstEffect;
  }
  <!-- 构建完整的副作用执行链表 确保根节点的副作用也被正确包含在执行链中 -->


## React提交阶段的上下文管理，通过保存和恢复优先级确保同步执行。

// 保存之前的优先级，以同步优先级执行，执行完毕后恢复之前优先级
const previousLanePriority = getCurrentUpdateLanePriority();
setCurrentUpdateLanePriority(SyncLanePriority);

// 将当前上下文标记为CommitContext，作为commit阶段的标志
const prevExecutionContext = executionContext;
executionContext |= CommitContext;

// 处理focus状态
focusedInstanceHandle = prepareForCommit(root.containerInfo);
shouldFireAfterActiveInstanceBlur = false;

// beforeMutation阶段的主函数 ！！！
commitBeforeMutationEffects(finishedWork);

focusedInstanceHandle = null;

1. 该代码片段实现了React提交阶段的上下文管理，通过保存和恢复优先级确保同步执行。
2. 设置CommitContext标志位来标识当前处于提交阶段。
3. 处理DOM焦点状态的准备和清理工作。
4. 执行beforeMutation阶段的副作用处理。‘
5. 最终清理焦点实例句柄，确保状态一致性。

## commitBeforeMutationEffects

function commitBeforeMutationEffects() {
  while (nextEffect !== null) {
    const current = nextEffect.alternate;

    if (!shouldFireAfterActiveInstanceBlur && focusedInstanceHandle !== null) {
      // ...focus blur相关
    }

    const effectTag = nextEffect.effectTag;

    // 调用getSnapshotBeforeUpdate
    if ((effectTag & Snapshot) !== NoEffect) {
      commitBeforeMutationEffectOnFiber(current, nextEffect);
    }

    // 调度useEffect
    if ((effectTag & Passive) !== NoEffect) {
      if (!rootDoesHavePassiveEffects) {
        rootDoesHavePassiveEffects = true;
        scheduleCallback(NormalSchedulerPriority, () => {
          flushPassiveEffects();
          return null;
        });
      }
    }
    nextEffect = nextEffect.nextEffect;
  }
}
1. 处理DOM节点渲染、删除后的autoFocus、blur等操作；
2. 调用getSnapshotBeforeUpdate
3. 调度 useEffect

## 调度useEffect
// 调度useEffect
if ((effectTag & Passive) !== NoEffect) {
    <!-- 检查当前 effect 是否包含 Passive 标记
    Passive 标记表示这是一个 useEffect 或 useLayoutEffect 等被动副作用 -->
  if (!rootDoesHavePassiveEffects) {
    <!-- 使用 rootDoesHavePassiveEffects 标志避免重复调度 确保同一个渲染周期内只调度一次被动效果处理 -->
    rootDoesHavePassiveEffects = true;
    scheduleCallback(NormalSchedulerPriority, () => { // scheduler提供，调度优先级的回调
      // 触发useEffect
      flushPassiveEffects(); // 具体见后文hooks
      return null;
    });
    <!-- 通过 scheduleCallback 将 flushPassiveEffects 调度到浏览器空闲时间执行 使用 NormalSchedulerPriority 保证执行优先级 -->
  }
}
执行流程：
‌检测到被动效果‌ → 2. ‌检查是否已调度‌ → 3. ‌未调度则创建调度任务‌ → 4. ‌异步执行 flushPassiveEffects



# 2. mutation（执行DOM中）

## 遍历effectList执行函数。这里执行的是commitMutationEffects。
nextEffect = firstEffect;
do {
  try {
      commitMutationEffects(root, renderPriorityLevel);
    } catch (error) {
      invariant(nextEffect !== null, 'Should be working on an effect.');
      captureCommitPhaseError(nextEffect, error);
      nextEffect = nextEffect.nextEffect;
    }
} while (nextEffect !== null);

## commitMutationEffects
function commitMutationEffects(root: FiberRoot, renderPriorityLevel) {
  // 遍历effectList
  while (nextEffect !== null) {

    const effectTag = nextEffect.effectTag;

    // 根据 ContentReset effectTag重置文字节点
    if (effectTag & ContentReset) {
      commitResetTextContent(nextEffect);
    }

    // 更新ref
    if (effectTag & Ref) {
      const current = nextEffect.alternate;
      if (current !== null) {
        commitDetachRef(current);
      }
    }

    // 根据 effectTag 分别处理
    const primaryEffectTag =
      effectTag & (Placement | Update | Deletion | Hydrating);
    switch (primaryEffectTag) {
      // 插入DOM
      case Placement: {
        commitPlacement(nextEffect);
        nextEffect.effectTag &= ~Placement;
        break;
      }
      // 插入DOM 并 更新DOM
      case PlacementAndUpdate: {
        // 插入
        commitPlacement(nextEffect);

        nextEffect.effectTag &= ~Placement;

        // 更新
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // SSR
      case Hydrating: {
        nextEffect.effectTag &= ~Hydrating;
        break;
      }
      // SSR
      case HydratingAndUpdate: {
        nextEffect.effectTag &= ~Hydrating;

        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 更新DOM
      case Update: {
        const current = nextEffect.alternate;
        commitWork(current, nextEffect);
        break;
      }
      // 删除DOM
      case Deletion: {
        commitDeletion(root, nextEffect, renderPriorityLevel);
        break;
      }
    }

    nextEffect = nextEffect.nextEffect;
  }
}



执行内容：
1. 根据ContentReset effectTag重置文字节点
2. 更新ref
3. 根据effectTag分别处理，其中effectTag包括(Placement | Update | Deletion | Hydrating)，hydrate是SSR，不考虑
Placement，PlacementAndUpdate，Hydrating，HydratingAndUpdate，Update，Deletion


# 3. render阶段
# 3.1 beginWork

mount阶段：
调用：mountChildFibers
根据fiber.tag处理不同的子fiber节点
IndeterminateComponent: 处理未确定类型的组件（通常是函数组件但在初始化时类型未确定）
LazyComponent: 处理 React.lazy() 创建的懒加载组件
FunctionComponent: 处理函数式组件
ClassComponent: 处理类组件
HostRoot: 处理根节点（ReactDOM.render挂载的根节点）
HostComponent: 处理原生DOM元素（如div、span等）
HostText: 处理文本节点

update：
调用：reconcileChildFibers
  - 通过didReceiveUpdate判断是否需要更新
  - !includesSomeLane(renderLanes, updateLanes)，即当前Fiber节点优先级不够（后面讲）
if (current !== null) {
    const oldProps = current.memoizedProps;
    const newProps = workInProgress.pendingProps;

    if (
      oldProps !== newProps ||
      hasLegacyContextChanged() ||
      (__DEV__ ? workInProgress.type !== current.type : false)
    ) {
      didReceiveUpdate = true;
    } else if (!includesSomeLane(renderLanes, updateLanes)) {
      didReceiveUpdate = false;
      switch (workInProgress.tag) {
        // 省略处理
      }
      return bailoutOnAlreadyFinishedWork(
        current,
        workInProgress,
        renderLanes,
      );
    } else {
      didReceiveUpdate = false;
    }
  } else {
    didReceiveUpdate = false;
  }

1. 该代码实现React Fiber中更新检查的核心逻辑，用于判断组件是否需要重新渲染。
2. 通过比较新旧props、上下文变化和组件类型来决定是否需要更新。
3. 当组件已完成且无更新时，通过bailout机制跳过不必要的渲染以提升性能。
4. 使用条件判断和switch语句处理不同类型的组件更新逻辑。

- mountChildFibers & reconcileChildFibers
  - 都会生成新的fiber节点返回给workInProgress.child，作为本次beginWork的返回值，在下次performUnitOfWork执行时workInProgress的入参
- effectTag
  - render阶段的工作是在内存中进行，当工作结束后会通知Renderer需要执行的DOM操作。要执行DOM操作的具体类型就保存在fiber.effectTag中

