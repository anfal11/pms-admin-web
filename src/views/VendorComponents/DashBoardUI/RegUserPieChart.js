import { Polar } from 'react-chartjs-2'

import { Fragment, useContext, useEffect } from 'react'

// ** Custom Hooks
import { useSkin } from '@hooks/useSkin'

// ** Context
import { ThemeColors } from '@src/utility/context/ThemeColors'

// ** Styles
import '@styles/react/libs/flatpickr/flatpickr.scss'
const RegUserPieChart = () => {
    // ** Context, Hooks & Vars
    const { colors } = useContext(ThemeColors),
        [skin, setSkin] = useSkin(),
        labelColor = skin === 'dark' ? '#b4b7bd' : '#6e6b7b',
        tooltipShadow = 'rgba(0, 0, 0, 0.25)',
        warningColorShade = '#ffe802',
        primaryColorShade = '#836AF9',
        infoColorShade = '#299AFF',
        successColorShade = '#28dac6',
        greyColor = '#4F5D70',
        gridLineColor = 'rgba(200, 200, 200, 0.2)',
        lineChartPrimary = '#666ee8',
        lineChartDanger = '#ff4961',
        warningLightColor = '#FDAC34',
        yellowColor = '#ffe800',
        blueColor = '#2c9aff',
        blueLightColor = '#84D0FF',
        greyLightColor = '#EDF1F4'

    // ** To Set Border Radius On Mount
    useEffect(() => {
        /*eslint-disable */
        Chart.elements.Rectangle.prototype.draw = function () {
            let ctx = this._chart.ctx
            let viewVar = this._view
            let left, right, top, bottom, signX, signY, borderSkipped, radius
            let borderWidth = viewVar.borderWidth
            let cornerRadius = 20
            if (!viewVar.horizontal) {
                left = viewVar.x - viewVar.width / 2
                right = viewVar.x + viewVar.width / 2
                top = viewVar.y
                bottom = viewVar.base
                signX = 1
                signY = top > bottom ? 1 : -1
                borderSkipped = viewVar.borderSkipped || 'bottom'
            } else {
                left = viewVar.base
                right = viewVar.x
                top = viewVar.y - viewVar.height / 2
                bottom = viewVar.y + viewVar.height / 2
                signX = right > left ? 1 : -1
                signY = 1
                borderSkipped = viewVar.borderSkipped || 'left'
            }

            if (borderWidth) {
                let barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom))
                borderWidth = borderWidth > barSize ? barSize : borderWidth
                let halfStroke = borderWidth / 2
                let borderLeft = left + (borderSkipped !== 'left' ? halfStroke * signX : 0)
                let borderRight = right + (borderSkipped !== 'right' ? -halfStroke * signX : 0)
                let borderTop = top + (borderSkipped !== 'top' ? halfStroke * signY : 0)
                let borderBottom = bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0)
                if (borderLeft !== borderRight) {
                    top = borderTop
                    bottom = borderBottom
                }
                if (borderTop !== borderBottom) {
                    left = borderLeft
                    right = borderRight
                }
            }

            ctx.beginPath()
            ctx.fillStyle = viewVar.backgroundColor
            ctx.strokeStyle = viewVar.borderColor
            ctx.lineWidth = borderWidth
            let corners = [
                [left, bottom],
                [left, top],
                [right, top],
                [right, bottom]
            ]

            let borders = ['bottom', 'left', 'top', 'right']
            let startCorner = borders.indexOf(borderSkipped, 0)
            if (startCorner === -1) {
                startCorner = 0
            }

            function cornerAt(index) {
                return corners[(startCorner + index) % 4]
            }

            let corner = cornerAt(0)
            ctx.moveTo(corner[0], corner[1])

            for (let i = 1; i < 4; i++) {
                corner = cornerAt(i)
                let nextCornerId = i + 1
                if (nextCornerId == 4) {
                    nextCornerId = 0
                }

                let nextCorner = cornerAt(nextCornerId)

                let width = corners[2][0] - corners[1][0],
                    height = corners[0][1] - corners[1][1],
                    x = corners[1][0],
                    y = corners[1][1]

                let radius = cornerRadius

                if (radius > height / 2) {
                    radius = height / 2
                }
                if (radius > width / 2) {
                    radius = width / 2
                }

                if (!viewVar.horizontal) {
                    ctx.moveTo(x + radius, y)
                    ctx.lineTo(x + width - radius, y)
                    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
                    ctx.lineTo(x + width, y + height - radius)
                    ctx.quadraticCurveTo(x + width, y + height, x + width, y + height)
                    ctx.lineTo(x + radius, y + height)
                    ctx.quadraticCurveTo(x, y + height, x, y + height)
                    ctx.lineTo(x, y + radius)
                    ctx.quadraticCurveTo(x, y, x + radius, y)
                } else {
                    ctx.moveTo(x + radius, y)
                    ctx.lineTo(x + width - radius, y)
                    ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
                    ctx.lineTo(x + width, y + height - radius)
                    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
                    ctx.lineTo(x + radius, y + height)
                    ctx.quadraticCurveTo(x, y + height, x, y + height)
                    ctx.lineTo(x, y + radius)
                    ctx.quadraticCurveTo(x, y, x, y)
                }
            }

            ctx.fill()
            if (borderWidth) {
                ctx.stroke()
            }
        }
    }, [])
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 500,
        legend: {
            display: true,
            position: 'right',
            labels: {
                usePointStyle: true,
                padding: 10,
                boxWidth: 9,
                fontColor: labelColor
            }
        },
        layout: {
            padding: {
                top: 0,
                bottom: 0
            }
        },
        tooltips: {
            // Updated default tooltip UI
            shadowOffsetX: 1,
            shadowOffsetY: 1,
            shadowBlur: 8,
            shadowColor: tooltipShadow,
            backgroundColor: '#fff',
            titleFontColor: '#000',
            bodyFontColor: '#000'
        },
        scale: {
            scaleShowLine: true,
            scaleLineWidth: 1,
            ticks: {
                display: false,
                fontColor: labelColor
            },
            reverse: false,
            gridLines: {
                display: false
            }
        },
        animation: {
            animateRotate: false
        }
    },
        data = {
            labels: ['Low', 'Medium', 'High'],
            datasets: [
                {
                    label: '',
                    backgroundColor: [
                        primaryColorShade,
                        warningColorShade,
                        infoColorShade
                    ],
                    data: [19, 17.5, 15],
                    borderWidth: 0
                }
            ]
        }

    return (
        <div style={{ minHeight: '180px', padding: '10px' }}>
            <Polar data={data} options={options} height={180} />
        </div>
    )
}

export default RegUserPieChart