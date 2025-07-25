import { Vec3 } from 'cc';

export function calculateDirection(from: Vec3, to: Vec3): Vec3 {
    const direction = to.clone().subtract(from);
    const length = direction.length();
    if (length === 0) {
        return new Vec3(0, 0, 0); // 如果长度为0，返回零向量
    }
    return direction.normalize();
}

// 节点销毁顺序说明
export function explainDestroyOrder() {
    console.log('=== Cocos Creator 节点销毁顺序 ===');
    console.log('当调用 node.destroy() 时：');
    console.log('1. 先销毁所有子节点（深度优先，后序遍历）');
    console.log('2. 再销毁当前节点');
    console.log('');
    console.log('示例：');
    console.log('Parent');
    console.log('├── ChildA');
    console.log('│   ├── ChildA1');
    console.log('│   └── ChildA2');
    console.log('└── ChildB');
    console.log('    └── ChildB1');
    console.log('');
    console.log('销毁顺序：ChildA1 → ChildA2 → ChildA → ChildB1 → ChildB → Parent');
} 