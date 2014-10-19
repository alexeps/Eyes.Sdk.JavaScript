/*
 ---

 name: GeometryUtils

 description: collection of utility methods for geometric shapes.

 provides: [GeometryUtils]

 ---
 */

(function () {
    "use strict";

    var GeometryUtils = {};

    GeometryUtils.intersect = function (rect1, rect2) {
        var top = Math.max(rect1.top, rect2.top);
        var left = Math.max(rect1.left, rect2.left);
        var bottom = Math.min(rect1.top + rect1.height, rect2.top + rect2.height);
        var right = Math.min(rect1.left + rect1.width, rect2.left + rect2.width);
        var height = bottom - top;
        var width = right - left;
        if (height > 0 && width > 0) {
            return {
                top: top,
                left: left,
                width: width,
                height: height
            };
        }

        return {
            top: 0,
            left: 0,
            width: 0,
            height: 0
        };
    };

    GeometryUtils.contains = function (rect, point) {
        return (rect.left <= point.x
            && (rect.left + rect.width) > point.x
            && rect.top <= point.y
            && (rect.top + rect.height) > point.y);
    };

    /**
     *
     * @param region The region from which we want to extract the sub regions. {left, top, width, height}
     * @param maxSubRegionSize The max size of a sub region {width, height}
     */
    GeometryUtils.getSubRegions = function (region, maxSubRegionSize) {
        var subRegions = [];
        var currentTop = region.top;
        var bottom = region.top + region.height;
        var right = region.left + region.width;

        var currentBottom, currentLeft, currentRight, currentWidth, currentHeight;
        while (currentTop < bottom) {
            currentBottom = currentTop + maxSubRegionSize.height;
            if (currentBottom > bottom) {
                currentBottom = bottom;
            }

            currentLeft = region.left;
            while (currentLeft < right) {
                currentRight = currentLeft + maxSubRegionSize.width;
                if (currentRight > right) {
                    currentRight = right;
                }

                currentHeight = currentBottom - currentTop;
                currentWidth = currentRight - currentLeft;

                subRegions.push({left: currentLeft, top: currentTop, width: currentWidth, height: currentHeight});

                currentLeft += maxSubRegionSize.width;
            }
            currentTop += maxSubRegionSize.height;
        }
    };

    //noinspection JSUnresolvedVariable
    module.exports = GeometryUtils;
}());