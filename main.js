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

        let focalPoint3D = vector3D.createPoint3D(0, 0, 0)
        let origin3D = vector3D.createPoint3D(5, 5, 0)


        let vertices = []
        // let size = 500
        // for (let i = 0; i < 10; i++) {
        //     points3D.push([size * Math.random() - 200, size * Math.random() - 200, size * Math.random() - 200])
        // }

        vertices.push(
            [100, -100, 100], [100, -100, -100], [100, 100, 100], [100, 100, -100],
            [-100, 100, 100], [-100, 100, -100], [-100, -100, 100], [-100, -100, -100])

        let edges = [
            [0, 1], [0, 2], [0, 6],
            [5, 4], [5, 3], [5, 7],
            [6, 7], [6, 4], [3, 2],
            [3, 1], [2, 4], [1, 7]

        ]

        function movePointByTheta(point3D, center3D, angle) {
            let radius = vector3D.distanceBetweenPoints(center3D, point3D)
            point3D[0] = center3D[0] + radius * Math.cos(angle[1]) * Math.sin(angle[0])
            point3D[1] = center3D[1] + radius * Math.cos(angle[1]) * Math.cos(angle[0])
            point3D[2] = center3D[2] + radius * Math.sin(angle[1])
        }

        const view = (vertices, edges, origin3D, focalPoint3D) => {
            let points2D = []
            let orbiting = false
            let normal = vector3D.unitVector(vector3D.subtractVectors(focalPoint3D, origin3D))
            let cameraOrient = vector3D.unitVector(vector3D.crossProduct(vector3D.createPoint3D(0, 0, 1), normal))
            let angles = [0, 0]
            let delta = 0.02
            let mouseCoords = []

            console.log('cameraOrient', cameraOrient)
            console.log('normal', vector3D.unitVector(vector3D.subtractVectors(focalPoint3D, origin3D)))
            console.log('origin3D', origin3D)

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
                    angles[0] += (event.x - mouseCoords[0]) * delta
                    angles[1] += (event.y - mouseCoords[1]) * delta
                    movePointByTheta(origin3D, focalPoint3D, angles)
                    normal = vector3D.unitVector(vector3D.subtractVectors(focalPoint3D, origin3D))
                    cameraOrient = vector3D.unitVector(vector3D.crossProduct(vector3D.createPoint3D(0, 0, 1), normal))
                }
                mouseCoords[0] = event.x
                mouseCoords[1] = event.y
            })

            canvas.addEventListener('mousedown', (event) => {
                orbiting = true
            })

            for (let vertex of vertices) {
                points2D.push(projection3D.vertex3DTo2Dprojection(vertex, origin3D, focalPoint3D, cameraOrient))
            }

            console.log(points2D)
            function animationLoop() {
                if (orbiting) {
                    points2D = []

                    for (let vertex of vertices) {
                        points2D.push(projection3D.vertex3DTo2Dprojection(vertex, origin3D, focalPoint3D, cameraOrient))
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

                for (let edge of edges) {
                    ctx.beginPath()
                    ctx.moveTo(points2D[edge[0]][0], -1 * points2D[edge[0]][1])
                    ctx.lineTo(points2D[edge[1]][0], -1 * points2D[edge[1]][1])
                    ctx.stroke()
                    ctx.closePath()
                }
                ctx.strokeStyle = 'white'
                requestAnimationFrame(animationLoop)
            }
            animationLoop()
        }

        view(vertices, edges, origin3D, focalPoint3D)
    }
}
window.addEventListener('load', main)
