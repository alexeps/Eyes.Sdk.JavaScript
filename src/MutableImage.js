/*
 ---

 name: MutableImage

 description: A wrapper for image buffer that parses it to BMP to allow editing and extracting its dimensions

 provides: [MutableImage]

 ---
 */

(function () {
    "use strict";


    var EyesUtils = require('eyes.utils');
    var ImageUtils = EyesUtils.ImageUtils;
    var fs = require('fs');

    /**
     * Parses the image if possible - meaning dimensions and BMP are extracted and available
     * @param that - the context of the current instance of MutableImage
     * @private
     */
    function _parseImage(that) {
        return that._promiseFactory.makePromise(function (resolve) {
            if (that._isParsed || !fs.open) {
                return resolve();
            }

            return ImageUtils.parseImage(that._imageBuffer)
                .then(function(bmp) {
                    that._imageBmp = bmp;
                    that._width = bmp.width;
                    that._height = bmp.height;
                    that._isParsed = true;
                    resolve();
                });
        });
    }

    /**
     * Packs the image if possible - meaning the buffer is updated according to the edited BMP
     * @param that - the context of the current instance of MutableImage
     * @private
     */
    function _packImage(that) {
        return that._promiseFactory.makePromise(function (resolve) {

            if (!that._isParsed || !fs.open) {
                return resolve();
            }

            return ImageUtils.packImage(that._imageBmp)
                .then(function(buffer) {
                    that._imageBuffer = buffer;
                    resolve();
                });
        });
    }

    /**
     *
     * C'tor = initializes the module settings
     *
     * @param {Buffer} imageBuffer
     * @param {PromiseFactory} promiseFactory An object which will be used for creating deferreds/promises.
     *
     **/
    function MutableImage(imageBuffer, promiseFactory) {
        this._imageBuffer = imageBuffer;
        this._promiseFactory = promiseFactory;
        this._isParsed = false;
        this._imageBmp = undefined;
        this._width = 0;
        this._height = 0;
    }

    //noinspection JSUnusedGlobalSymbols
    /**
     * Parses the image if necessary
     * @returns {Object} - the image size
     */
    MutableImage.prototype.getSize = function () {
        var that = this;
        return _parseImage(that)
            .then(function () {
                return {
                    width: that._width,
                    height: that._height
                };
            });
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * return the image as buffer and image width and height.
     *
     * {Object} Promise of an object with buffer and image dimensions
     */
    MutableImage.prototype.asObject = function () {
        var that = this;
        return _parseImage(that)
            .then(function () {
                return _packImage(that);
            })
            .then(function () {
                return {
                    imageBuffer: that._imageBuffer,
                    width: that._width,
                    height: that._height
                };
            });
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * scales the image (used to downsize by 2 for retina display chrome bug - and tested accordingly).
     *
     * @param {Float} scale
     * @return {Object} promise - resolves without any value
     */
    MutableImage.prototype.scaleImage = function (scale) {
        var that = this;
        return _parseImage(that)
            .then(function () {
                if (that._isParsed) {
                    return ImageUtils.scaleImage(that._imageBmp, scale)
                        .then(function(){
                            that._width = that._imageBmp.width;
                            that._height = that._imageBmp.height;
                        });
                }
            });
    };

    //noinspection JSUnusedGlobalSymbols
    /**
     * crops the image according to the given region.
     *
     * @param {Object} region
     * @return {Object} promise - resolves without any value
     */
    MutableImage.prototype.cropImage = function (region) {
        var that = this;
        return _parseImage(that)
            .then(function () {
                if (that._isParsed) {
                    return ImageUtils.cropImage(that._imageBmp, region)
                        .then(function(){
                            that._width = that._imageBmp.width;
                            that._height = that._imageBmp.height;
                        });
                }
            });
    };

    module.exports = MutableImage;
}());