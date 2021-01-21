import React, { useState, useRef, useEffect } from 'react'


const Main = (props) => {
    const [imageElt, setImageElt] = useState(null);
    const [points, setPoints] = useState(null);
    const [edit, setEdit] = useState(false);
    const [croppedOrgImg, setCroppedOrgImg] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setInterval(() => {
            if (window.openCvLoaded) {
                setLoading(false);
            }
        })
        // return () => {
        //     cleanup
        // }
    }, [setLoading])

    const canvasRef = useRef(null)

    // const draw = (ctx, frameCount) => {
    //     ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    //     ctx.fillStyle = '#000000'
    //     ctx.beginPath()
    //     ctx.arc(50, 100, 20 * Math.sin(frameCount * 0.05) ** 2, 0, 2 * Math.PI)
    //     ctx.fill()
    // }

    const rotate = () => {
        let cv = window.cv;
        let src = cv.imread(canvasRef.current);
        let dst = new cv.Mat();
        let dsize = new cv.Size(src.rows, src.cols);
        let center = new cv.Point(src.cols / 2, src.rows / 2);
        let M = cv.getRotationMatrix2D(center, 90, 1);
        cv.warpAffine(src, dst, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());
        cv.imshow(canvasRef.current, dst);
    }



    const handleSelectedFile = async (e) => {
        setEdit(true);
        let ctx = canvasRef.current.getContext('2d');
        let file = e.target.files[0];
        let cv = window.cv;
        console.log("CV is ", cv);
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
            let imageElt = new Image();
            // imageElt.width = 300;
            // imageElt.height = 200;
            imageElt.onload = () => {
                setImageElt(imageElt);
                // canvasRef.current.width = imageElt.width;
                // canvasRef.current.height = imageElt.height;
                // ctx.drawImage(imageElt, 0, 0, imageElt.width, imageElt.height);
                // drawImageProp(ctx, imageElt);
                let x = 0, y = 0;

                let wrh = imageElt.width / imageElt.height;
                let newWidth = canvasRef.current.width;
                let newHeight = newWidth / wrh;
                if (newHeight > canvasRef.current.height) {
                    newHeight = canvasRef.current.height;
                    newWidth = newHeight * wrh;
                }

                if (newWidth < canvasRef.current.width) {
                    let diff = canvasRef.current.width - newWidth;
                    x = diff / 2;
                }
                if (newHeight < canvasRef.current.height) {
                    let diff = canvasRef.current.height - newHeight;
                    y = diff / 2;
                }
                console.log("New width height", x, y, newWidth, newHeight);
                // ctx.drawImage(imageElt, 0, 0, canvasRef.current.width, canvasRef.current.height)
                ctx.drawImage(imageElt, x, y, newWidth, newHeight)


                let image = cv.imread(canvasRef.current);
                //BAD IDEA BEGIN
                // window.image = image;
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
                if (cnts.length > 0 && cnts[0].area > 500) {
                    // window.points = cnts[0].points;
                    setPoints(cnts[0].points);
                    drawPoints(cnts[0].points);
                } else {
                    let tempPoints = [{ x: 10, y: 10 }, { x: 10, y: ctx.canvas.height - 10 }, { x: ctx.canvas.width - 10, y: ctx.canvas.height - 10 }, { x: ctx.canvas.width - 10, y: 10 }];
                    // window.points = tempPoints;
                    setPoints(tempPoints);
                    drawPoints(tempPoints);
                }

            }
            imageElt.src = e.target.result;

            // Load the model


            // setSelectedFile(fileReader.result);
            // let modFile = await ImageJs.load(fileReader.result);
            // console.log("File", modFile);
            // let rgbData = modFile.getRGBAData({ clamped: true });

            // canvasRef.current.width = modFile.width;
            // canvasRef.current.height = modFile.height;
            // Processing image
            // const processedImage = await cv.findContours({ data: rgbData, width: modFile.width, height: modFile.height })

            // ctx.putImageData(processedImage.data.payload, 0, 0)


            // const edge = cannyEdgeDetector(modFile.grey(), { lowThreshold: 30, highThreshold: 90 });
            // const edge = modFile.grey().cannyEdge();
            // let rgbEdge = edge.grey({});
            // let rgbImage = edge.rgba8();
            // console.log("Edge", edge);
            // setModifiedFile(rgbImage.toDataURL());

        }
        fileReader.readAsDataURL(file);
    }

    const drawPoints = (points) => {
        let context = canvasRef.current.getContext('2d');
        for (var i = 0; i < points.length; i++) {
            var circle = points[i];

            // 绘制圆圈
            context.globalAlpha = 0.85;
            context.beginPath();
            context.arc(circle.x, circle.y, 10, 0, Math.PI * 2);
            context.fillStyle = "red";
            context.strokeStyle = "red";
            context.lineWidth = 3;
            context.fill();
            context.stroke();
            context.beginPath();
            context.moveTo(circle.x, circle.y);
            context.lineTo(points[i - 1 >= 0 ? i - 1 : 3].x, points[i - 1 >= 0 ? i - 1 : 3].y);
            context.stroke();

        }
    }

    const canvasClick = (e) => {
        var x = e.pageX - e.target.offsetLeft;
        var y = e.pageY - e.target.offsetTop;

        for (var i = 0; i < points.length; i++) {

            if (Math.pow(points[i].x - x, 2) + Math.pow(points[i].y - y, 2) < 1000) {
                points[i].selected = true;
                console.log(points[i]);
            } else {
                if (points[i].selected) points[i].selected = false;
            }
        }
    }
    const dragCircle = (e) => {
        //   console.log(points);
        for (var i = 0; i < points.length; i++) if (points[i].selected) {
            points[i].x = e.pageX - e.target.offsetLeft;
            points[i].y = e.pageY - e.target.offsetTop;
            console.log("xxxx1x");
        }
        draw();
    }
    const stopDragging = (e) => {
        for (var i = 0; i < points.length; i++) {
            points[i].selected = false;
        }
        setPoints(points);
    }
    const draw = () => {
        let canvas = canvasRef.current;
        let context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(imageElt, 0, 0, canvas.width, canvas.height);
        if (points)
            drawPoints(points);

    }

    const onCropClick = () => {

        setEdit(false);
        let cv = window.cv;

        const tl = points[0], tr = points[3], br = points[2], bl = points[1]; //stands for top-left,top-right ....

        // const width = Math.max(
        //     Math.sqrt((br.x - bl.x) ** 2 + (br.y - bl.y) ** 2),
        //     Math.sqrt((tr.x - tl.x) ** 2 + (tr.y - tl.y) ** 2),
        // );

        // const height = Math.max(
        //     Math.sqrt((tr.x - br.x) ** 2 + (tr.y - br.y) ** 2),
        //     Math.sqrt((tl.x - bl.x) ** 2 + (tl.y - bl.y) ** 2),
        // );

        // const from = cv.matFromArray(4, 1, cv.CV_32FC2, [points[0].x, points[0].y, points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y]);
        const from = cv.matFromArray(4, 1, cv.CV_32FC2, [tl.x, tl.y, tr.x, tr.y, br.x, br.y, bl.x, bl.y]);
        // const to = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, width - 1, 0, width - 1, height - 1, 0, height - 1]);
        const to = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, 300, 0, 300, 200, 0, 200]);



        // const to = cv.matFromArray(4, 1, cv.CV_32FC2, [0, 0, 0, height - 1, width - 1, height - 1, width - 1, 0]);
        const M = cv.getPerspectiveTransform(from, to);
        let out = new cv.Mat();
        let size = new cv.Size();
        size.width = canvasRef.current.width;
        size.height = canvasRef.current.height;
        let image = cv.imread(imageElt);
        cv.warpPerspective(image, out, M, size);
        // canvasRef.current.width = width;
        // canvasRef.current.height = height;
        setCroppedOrgImg(out);
        cv.imshow(canvasRef.current, out);
        // $("#canvas-0").hide();
    }

    const handleFilter = (e) => {
        let cv = window.cv;
        console.log(e.target.value);
        let result = new cv.Mat();
        let src = cv.imread(canvasRef.current);
        let selected = e.target.value;
        if (selected === "magic") {
            cv.cvtColor(src, result, cv.COLOR_BGR2GRAY)
            cv.threshold(result, result, 127, 255, cv.THRESH_BINARY);
            cv.imshow(canvasRef.current, result);
        } else if (selected === "bw") {
            cv.cvtColor(src, result, cv.COLOR_BGR2GRAY)
            cv.threshold(result, result, 100, 200, cv.THRESH_BINARY);
            cv.imshow(canvasRef.current, result);
        } else if (selected === "org") {
            cv.imshow(canvasRef.current, croppedOrgImg);
        }

        // cv.imshow(canvasRef.current, src);
    }

    return (<>
        {loading ? <h2>Loading...</h2> :
            <div className="container content">
                <input type="file" onChange={(e) => handleSelectedFile(e)} accept="image/*" />
                <div>
                    <canvas ref={canvasRef} style={{ touchAction: "none", border: "2px solid #c4c4c4" }} width="300px" height="200px" onPointerDown={(e) => edit && canvasClick(e)} onPointerMove={(e) => edit && dragCircle(e)} onPointerUp={(e) => edit && stopDragging(e)} onPointerOut={(e) => edit && stopDragging(e)} />
                </div>
                {!croppedOrgImg ? <div>
                    <button onClick={() => onCropClick()}>Crop</button>
                    <select onChange={handleFilter}>
                        <option value="org">{"Original"}</option>
                        <option value="bw">{"B & W"}</option>
                        <option value="magic">{"Magic Color"}</option>
                    </select>

                </div> :
                    <div>
                        <button onClick={() => setCroppedOrgImg(null)}>Back</button>
                        <button onClick={rotate}>Rotate</button>
                    </div>
                }
            </div>
        }
    </>
    )
}

export default Main;