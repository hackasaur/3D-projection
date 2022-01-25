import * as vector3D from './vector3D.js'

export function vertex3DTo2Dprojection(vertex3D, origin3D, focalPoint3D, cameraOrientation) {
    let planeNormal = vector3D.unitVector(vector3D.subtractVectors(focalPoint3D, origin3D))
    let scale = vector3D.dotProduct(vector3D.subtractVectors(origin3D, vertex3D), planeNormal) / vector3D.dotProduct(planeNormal, planeNormal)
    let intersectionPoint3D = vector3D.addVectors(vertex3D, vector3D.scaleVector(planeNormal, scale))
    let originToPointOnPlane = vector3D.subtractVectors(intersectionPoint3D, origin3D)
    let yAxis = vector3D.crossProduct(cameraOrientation, planeNormal)
    // console.log('xAxis:', cameraOrientation)
    // console.log('yAxis:', yAxis)
    let projected2DPoint = vector3D.createPoint2D(vector3D.dotProduct(originToPointOnPlane, cameraOrientation), vector3D.dotProduct(originToPointOnPlane, yAxis))
    return projected2DPoint
}