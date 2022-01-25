export const createPoint3D = (x, y, z) => {
    return [x, y, z]
}

export const createPoint2D = (x,y) => {
    return [x,y]
}

export function crossProduct(vector1, vector2) {
 return createPoint3D(vector1[1] * vector2[2] - vector1[2] * vector2[1],
    vector1[2] * vector2[0] - vector1[0] * vector2[2], 
    vector1[0] * vector2[1] - vector1[1] * vector2[0])
}

export function dotProduct(vector1, vector2) {
    return ((vector1[0] * vector2[0]) + (vector1[1] * vector2[1]) + (vector1[2] * vector2[2]))
}

export function addVectors(vector1, vector2) {
    return (
        createPoint3D(
            (vector1[0] + vector2[0]), (vector1[1] + vector2[1]), (vector1[2] + vector2[2])
        )
    )
}

export function subtractVectors(vector1, vector2) {
    return (
        createPoint3D(
            (vector1[0] - vector2[0]), (vector1[1] - vector2[1]), (vector1[2] - vector2[2])
        )
    )
}

export function scaleVector(vector, scale){
    return createPoint3D(vector[0] * scale, vector[1] * scale, vector[2] * scale)
}

export function unitVector(vector){
    let magnitude = Math.sqrt(vector[0]**2 + vector[1]**2 + vector[2]**2)
    let unitVector = scaleVector(vector, 1/magnitude)
    return unitVector
}

export function distanceBetweenPoints(point1, point2){
    return Math.sqrt((point1[0] - point2[0])**2 + (point1[1] - point2[1])**2 + (point1[2] - point2[2])**2)
}
