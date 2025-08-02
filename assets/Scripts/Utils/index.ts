import { Vec3 } from 'cc';

export function calculateDirection(from: Vec3, to: Vec3): Vec3 {
    const direction = to.clone().subtract(from);
    const length = direction.length();
    if (length === 0) {
        return new Vec3(0, 0, 0); // 如果长度为0，返回零向量
    }
    return direction.normalize();
}