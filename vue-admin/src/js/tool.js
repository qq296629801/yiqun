// 主动触发窗口变化事件，让图表根据窗口变化而自适应
const changeWindowSize = () => {
    if (document.createEvent) {
        const event = document.createEvent('HTMLEvents')
        event.initEvent('resize', true, true)
        window.dispatchEvent(event)
    } else if (document.createEventObject) {
        window.fireEvent('onresize')
    }
}
export { changeWindowSize }
