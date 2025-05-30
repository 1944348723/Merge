import { Vec3 } from "cc";

export const calculateDirection = (from: Vec3, to: Vec3): Vec3 => {
    const direction = to.subtract(from);
    const length = direction.length();
    if (length > 0) {
        return direction.normalize();
    }
    return new Vec3(0, 0, 0); // 如果长度为0，返回零向量
}
