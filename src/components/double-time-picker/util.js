export const DEFAULT_ITEM_HEIGHT = 44;
export const getClient = function(e) {
    let clientX = e.changedTouches[0].clientX;
    let clientY = e.changedTouches[0].clientY;
    return {
        x: clientX,
        y: clientY
    }
}
export function padZero(num, targetLen) {
    let str = num + '';
    if (str.length < targetLen) {
        str = '0' + str;
    }
    return str;
}
// 此方法可以求出该月的天数--无论闰年还是平年的月份数量
export function getMounthEndDay(year, mounth) {
    return 32 - new Date(year, mounth - 1, 32).getDate();
}