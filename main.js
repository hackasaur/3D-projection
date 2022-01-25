import * as projection3D from './modules/projection3D.js'
import * as vector3D from './modules/vector3D.js'

function main() {
    const canvas = document.getElementById('scene')
    if (canvas.getContext) {
        let yPadding = 140
        let xPadding = 300
        const ctx = canvas.getContext('2d')
        ctx.canvas.width = window.screen.width - xPadding
        ctx.canvas.height = window.screen.height - yPadding
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2)
        // ctx.imageSmoothingEnabled = false
        // ctx.translate(0.5, 0.5)window.addEventListener('load', main)

        function cartesianToCanvas(point2D) {
            return [point2D[0], -1 * point2D[1]]
        }

        // let planeNormal = vector3D.createPoint3D(0, 1, 0)
        // let vertex3D = vector3D.createPoint3D(100, 0, 100)
        // let cameraOrientation = vector3D.unitVector(vector3D.createPoint3D(1, 0, 0))
        // let pointOnXAxis = vector3D.createPoint3D(1, 5, 0)
        // let projected2DPoint = projection3D.vertex3DTo2Dprojection(vertex3D, origin3D, planeNormal, cameraOrientation)

        let focalPoint3D = vector3D.createPoint3D(0, 0, 0)
        let origin3D = vector3D.createPoint3D(5, 5, 0)

        let points3D = []
        let size = 500
        // for (let i = 0; i < 10; i++) {
        //     points3D.push([size * Math.random() - 200, size * Math.random() - 200, size * Math.random() - 200])
        // }

        points3D.push([100, -100, 100], [100, -100, -100], [100, 100, 100], [100, 100,-100], 
            [-100, 100, 100], [-100, 100, -100], [-100, -100, 100], [-100, -100, -100])

        function movePointByTheta(point3D, center3D, horizontalTheta, verticalTheta) {
            let radius = vector3D.distanceBetweenPoints(center3D, point3D)
            // console.log('radius', radius)
            point3D[0] = center3D[0] + radius * Math.cos(horizontalTheta) * Math.cos(verticalTheta)
            point3D[1] = center3D[1] + radius * Math.sin(horizontalTheta) * Math.cos(verticalTheta)
            point3D[2] = center3D[2] + radius * Math.sin(verticalTheta)
        }

        const view = (points3D, origin3D, focalPoint3D) => {
            let points2D = []
            let orbiting = false
            let mouseCoords = []
            let normal = vector3D.unitVector(vector3D.subtractVectors(focalPoint3D, origin3D))
            let cameraOrient = vector3D.unitVector(vector3D.crossProduct(vector3D.createPoint3D(0, 0, 1), normal))
            let thetaVertical = 0
            let thetaHorizontal = 0
            let deltaTheta = 0.02

            console.log('cameraOrient', cameraOrient)
            console.log('normal', vector3D.unitVector(vector3D.subtractVectors(focalPoint3D, origin3D)))
            console.log('origin', origin3D)

            canvas.addEventListener('mouseup', () => {
                orbiting = false
                console.log(points2D)
                console.log('origin3D', origin3D)
                console.log('cameraOrient', cameraOrient)
                console.log('focalPoint', focalPoint3D)
                console.log('normal', vector3D.unitVector(vector3D.subtractVectors(focalPoint3D, origin3D)))

            })

            canvas.addEventListener('mousemove', (event) => {
                if (orbiting) {
                    // console.log('origin3D', origin3D)
                    thetaHorizontal += deltaTheta
                    thetaVertical += deltaTheta
                    movePointByTheta(origin3D, focalPoint3D, thetaHorizontal, thetaVertical)
                    normal = vector3D.unitVector(vector3D.subtractVectors(focalPoint3D, origin3D))
                    cameraOrient = vector3D.unitVector(vector3D.crossProduct(vector3D.createPoint3D(0, 0, 1), normal))
                }
                // mouseCoords[0] = event.x
                // mouseCoords[1] = event.y
            })

            canvas.addEventListener('mousedown', (event) => {
                orbiting = true
            })

            for (let point3D of points3D) {
                points2D.push(projection3D.vertex3DTo2Dprojection(point3D, origin3D, focalPoint3D, cameraOrient))
            }

            console.log(points2D)
            function animationLoop() {
                if (orbiting) {
                    points2D = []
                    for (let point3D of points3D) {
                        points2D.push(projection3D.vertex3DTo2Dprojection(point3D, origin3D, focalPoint3D, cameraOrient))
                    }
                }
                ctx.clearRect(-1 * ctx.canvas.width / 2, -1 * ctx.canvas.height / 2, ctx.canvas.width, ctx.canvas.height)

                for (let point2D of points2D) {
                    ctx.fillStyle = 'white'
                    ctx.beginPath()
                    ctx.arc(point2D[0], -1 * point2D[1], 8, 0, Math.PI * 2)
                    ctx.closePath()
                    let gradient = ctx.createRadialGradient(point2D[0], -1 * point2D[1], 1, point2D[0], -1 * point2D[1], 8);

                    // Add three color stops
                    gradient.addColorStop(0, 'white');
                    gradient.addColorStop(.6, 'lightgray');
                    gradient.addColorStop(1, 'gray');
                    ctx.fillStyle = gradient
                    ctx.fill()

                }
                requestAnimationFrame(animationLoop)
            }
            animationLoop()
        }

        view(points3D, origin3D, focalPoint3D)
    }
}
window.addEventListener('load', main)
