/**
 * With OpenCV we have to work the images as cv.Mat (matrices),
 * so the first thing we have to do is to transform the
 * ImageData to a type that openCV can recognize.
 */
function imageProcessing({ msg, payload }) {
    const img = cv.matFromImageData(payload)
    let result = new cv.Mat()

    // What this does is convert the image to a grey scale.
    cv.cvtColor(img, result, cv.COLOR_BGR2GRAY)
    postMessage({ msg, payload: imageDataFromMat(result) })
}

function scanImage({ msg, payload }) {

    let image = cv.imread(payload);
    //BAD IDEA BEGIN
    //BAD IDEA END
    let edges = new cv.Mat();
    cv.Canny(image, edges, 100, 200);
    // cv.imshow($("canvas")[0],edges);
    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();

    cv.findContours(edges, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);

    let cnts = []
    for (let i = 0; i < contours.size(); i++) {
        const tmp = contours.get(i);
        const peri = cv.arcLength(tmp, true);
        let approx = new cv.Mat();

        let result = {
            area: cv.contourArea(tmp),
            points: []
        };

        cv.approxPolyDP(tmp, approx, 0.02 * peri, true);
        const pointsData = approx.data32S;
        for (let j = 0; j < pointsData.length / 2; j++)
            result.points.push({ x: pointsData[2 * j], y: pointsData[2 * j + 1] });

        if (result.points.length === 4)
            cnts.push(result);

    }
    cnts.sort((a, b) => b.area - a.area);

    console.log(cnts);



    src.delete(); dst.delete(); contours.delete(); hierarchy.delete();
    postMessage({ msg, payload: cnts });
}

/**
 * This function is to convert again from cv.Mat to ImageData
 */
function imageDataFromMat(mat) {
    // convert the mat type to cv.CV_8U
    const img = new cv.Mat()
    const depth = mat.type() % 8
    const scale =
        depth <= cv.CV_8S ? 1.0 : depth <= cv.CV_32S ? 1.0 / 256.0 : 255.0
    const shift = depth === cv.CV_8S || depth === cv.CV_16S ? 128.0 : 0.0
    mat.convertTo(img, cv.CV_8U, scale, shift)

    // convert the img type to cv.CV_8UC4
    switch (img.type()) {
        case cv.CV_8UC1:
            cv.cvtColor(img, img, cv.COLOR_GRAY2RGBA)
            break
        case cv.CV_8UC3:
            cv.cvtColor(img, img, cv.COLOR_RGB2RGBA)
            break
        case cv.CV_8UC4:
            break
        default:
            throw new Error(
                'Bad number of channels (Source image must have 1, 3 or 4 channels)'
            )
    }
    const clampedArray = new ImageData(
        new Uint8ClampedArray(img.data),
        img.cols,
        img.rows
    )
    img.delete()
    return clampedArray
}

/**
 *  Here we will check from time to time if we can access the OpenCV
 *  functions. We will return in a callback if it has been resolved
 *  well (true) or if there has been a timeout (false).
 */
function waitForOpencv(callbackFn, waitTimeMs = 30000, stepTimeMs = 100) {
    if (cv.Mat) callbackFn(true)

    console.log("CV is not loaded still")
    let timeSpentMs = 0
    const interval = setInterval(() => {
        const limitReached = timeSpentMs > waitTimeMs
        if (cv.Mat || limitReached) {
            clearInterval(interval)
            return callbackFn(!limitReached)
        } else {
            timeSpentMs += stepTimeMs
        }
    }, stepTimeMs)
}

/**
 * This exists to capture all the events that are thrown out of the worker
 * into the worker. Without this, there would be no communication possible
 * with our project.
 */
onmessage = function (e) {
    switch (e.data.msg) {
        case 'load': {
            // Import Webassembly script
            // self.importScripts('./opencv_3_4_custom_O3.js');
            self.importScripts('https://docs.opencv.org/3.4.0/opencv.js');
            waitForOpencv(function (success) {
                if (success) {
                    console.log("Loaded success!!!", success)
                    postMessage({ msg: e.data.msg })
                }
                else throw new Error('Error on loading OpenCV')
            })
            break
        }
        case 'imageProcessing':
            return imageProcessing(e.data)
        case 'scanImage':
            return scanImage(e.data)
        default:
            break
    }
}