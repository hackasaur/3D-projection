import * as projection3D from './modules/projection3D.js'
import * as vector3D from './modules/vector3D.js'
import * as canvasTools from './modules/canvas tools.js'

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
        let origin3D = vector3D.createPoint3D(150, 0, 0)
        let eye3D = vector3D.createPoint3D(200, 0, 0)

        let vertices = []

        //vertices of a cube
        vertices.push(
            [100, -100, 100], [100, -100, -100], [100, 100, 100], [100, 100, -100],
            [-100, 100, 100], [-100, 100, -100], [-100, -100, 100], [-100, -100, -100])


        //edges of the cube
        let edges = [
            [0, 1], [0, 2], [0, 6],
            [5, 4], [5, 3], [5, 7],
            [6, 7], [6, 4], [3, 2],
            [3, 1], [2, 4], [1, 7],
        ]

        // let size = 500
        // for (let i = 0; i < 5; i++) {
        //     vertices.push([size * Math.random() - 200, size * Math.random() - 200, size * Math.random() - 200])
        // }

        function movePointByTheta(point3D, center3D, angle) {
            let radius = vector3D.distanceBetweenPoints(center3D, point3D)
            point3D[0] = center3D[0] + radius * Math.abs(Math.cos(angle[1])) * Math.cos(angle[0])
            point3D[1] = center3D[1] + radius * Math.abs(Math.cos(angle[1])) * Math.sin(angle[0])
            point3D[2] = center3D[2] + radius * Math.sin(angle[1])
        }

        const view = (vertices, edges, origin3D, eye3D) => {
            let points2D = []
            let orbiting = false
            let normal = vector3D.unitVector(vector3D.subtractVectors(eye3D, origin3D))
            let cameraOrient = vector3D.unitVector(vector3D.crossProduct(normal, vector3D.createPoint3D(0, 0, 1)))
            let angles = [0, 0]
            let delta = 0.01
            let mouseCoords = []

            let axisPoints2D = []
            let axisVerts = [[0, 0, 0], [50, 0, 0], [0, 50, 0], [0, 0, 50]]
            let axisEdges = [[0, 1], [0, 2], [0, 3]]

            console.log('cameraOrient', cameraOrient)
            console.log('normal', vector3D.unitVector(vector3D.subtractVectors(eye3D, origin3D)))
            console.log('origin3D', origin3D)

            canvas.addEventListener('mouseup', () => {
                orbiting = false
                console.log(points2D)
                console.log('origin3D', origin3D)
                console.log('cameraOrient', cameraOrient)
                console.log('focalPoint', eye3D)
                console.log('normal', vector3D.unitVector(vector3D.subtractVectors(eye3D, origin3D)))
            })

            canvas.addEventListener('mousemove', (event) => {
                if (orbiting) {
                    angles[0] += -1 * (event.x - mouseCoords[0]) * delta
                    angles[1] += (event.y - mouseCoords[1]) * delta
                    movePointByTheta(origin3D, eye3D, angles)
                    normal = vector3D.unitVector(vector3D.subtractVectors(eye3D, origin3D))
                    cameraOrient = vector3D.unitVector(vector3D.crossProduct(normal, vector3D.createPoint3D(0, 0, 1)))
                }
                mouseCoords[0] = event.x
                mouseCoords[1] = event.y
            })

            canvas.addEventListener('mousedown', (event) => {
                orbiting = true
            })

            for (let vertex of vertices) {
                points2D.push(projection3D.vertex3DTo2DEyeProject(vertex, origin3D, eye3D, cameraOrient))
            }

            for (let vertex of axisVerts) {
                axisPoints2D.push(projection3D.vertex3DTo2DEyeProject(vertex, origin3D, eye3D, cameraOrient))
            }

            console.log(points2D)
            function animationLoop() {

                if (orbiting) {
                    points2D = []
                    axisPoints2D = []

                    for (let vertex of vertices) {
                        points2D.push(projection3D.vertex3DTo2DEyeProject(vertex, origin3D, eye3D, cameraOrient))
                    }

                    for (let vertex of axisVerts) {
                        axisPoints2D.push(projection3D.vertex3DTo2DEyeProject(vertex, origin3D, eye3D, cameraOrient))
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

                canvasTools.setCanvasFont(ctx, { font: 'sans', color: 'white', size: 10 })
                ctx.fillText(`angels: ${angles[0]} ${angles[1]}`, -200, -200)

                for (let edge of edges) {
                    ctx.beginPath()
                    ctx.moveTo(points2D[edge[0]][0], -1 * points2D[edge[0]][1])
                    ctx.lineTo(points2D[edge[1]][0], -1 * points2D[edge[1]][1])
                    ctx.strokeStyle = 'yellow'
                    ctx.stroke()
                    ctx.closePath()
                }

                let i = 0
                for (let edge of axisEdges) {
                    ctx.beginPath()
                    ctx.moveTo(axisPoints2D[edge[0]][0], -1 * axisPoints2D[edge[0]][1])
                    ctx.lineTo(axisPoints2D[edge[1]][0], -1 * axisPoints2D[edge[1]][1])
                    if (i === 0) {
                        ctx.strokeStyle = 'red'
                    }
                    else if (i === 1) {
                        ctx.strokeStyle = 'green'
                    }
                    else if (i === 2) {
                        ctx.strokeStyle = 'blue'
                    }
                    ctx.stroke()
                    ctx.closePath()
                    i++
                }
                requestAnimationFrame(animationLoop)
            }
            animationLoop()
        }

        view(vertices, edges, origin3D, eye3D)
    }
}
window.addEventListener('load', main)
