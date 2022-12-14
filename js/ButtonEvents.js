var selectedIndex = 0;
var layerNumberIncrement = 0;

//Input must be a 3 digit hex string, including the # at the start
function expandShortHex(shortHex) {
    let hexChars = shortHex.replace("#", "").split("");
    if (hexChars.length == 3)
        return (
            "#" + hexChars[0] + hexChars[0] + hexChars[1] + hexChars[1] + hexChars[2] + hexChars[2]
        );
    else return shortHex;
}

function clickUpload() {
    $("#imageUpload").click();
}

function drawImageClicked() {
    let imageInput = $("#imageUpload")[0];
    if (imageInput.files && imageInput.files[0]) {
        $("canvas").drawImage({
            layer: true,
            draggable: true,
            bringToFront: true,
            name: "Image" + layerNumberIncrement++,
            source: URL.createObjectURL(imageInput.files[0]),
            x: 100,
            y: 100,
            width: 200,
            height: 200,
            click: function (layer) {
                displayProperties(layer, "image");
            },
            mouseover: function (layer) {
                $(this).css("cursor", "pointer");
            },
            mouseout: function (layer) {
                $(this).css("cursor", "default");
            },
        });
    }
}

function drawRectangleClicked() {
    $("canvas").drawRect({
        layer: true,
        draggable: true,
        bringToFront: true,
        name: "Rectangle" + layerNumberIncrement++,
        fillStyle: "#fff",
        strokeStyle: "#000",
        strokeWidth: "1",
        x: 100,
        y: 100,
        width: 100,
        height: 50,
        click: function (layer) {
            displayProperties(layer, "shape");
        },
        mouseover: function (layer) {
            $(this).css("cursor", "pointer");
        },
        mouseout: function (layer) {
            $(this).css("cursor", "default");
        },
    });
}

function drawEllipseClicked() {
    $("canvas").drawEllipse({
        layer: true,
        draggable: true,
        bringToFront: true,
        name: "Ellipse" + layerNumberIncrement++,
        fillStyle: "#fff",
        strokeStyle: "#000",
        strokeWidth: "1",
        x: 100,
        y: 100,
        width: 100,
        height: 100,
        click: function (layer) {
            displayProperties(layer, "shape");
        },
        mouseover: function (layer) {
            $(this).css("cursor", "pointer");
        },
        mouseout: function (layer) {
            $(this).css("cursor", "default");
        },
    });
}

function drawTextClicked() {
    $("canvas").drawText({
        layer: true,
        draggable: true,
        bringToFront: true,
        name: "Text" + layerNumberIncrement++,
        fillStyle: "#000",
        x: 150,
        y: 100,
        strokeWidth: 0,
        fontSize: 24,
        fontFamily: "Arial, sans-serif",
        text: "Insert text",
        click: function (layer) {
            displayProperties(layer, "text");
        },
        mouseover: function (layer) {
            $(this).css("cursor", "pointer");
        },
        mouseout: function (layer) {
            $(this).css("cursor", "default");
        },
    });
}

//Ask user to confirm and then clear the canvas
function clearCanvas() {
    if (confirm("Are you sure you want to clear the canvas?")) {
        $("canvas").removeLayers().drawLayers();
        $("#properties").css("display", "none");
        selectedIndex = 0;
        layerNumberIncrement = 0;
    }
}

//Will let the user enter a name for the image and then save it as a .png file
function saveImageClick() {
    let fileName = prompt("Enter a name for the image", "New Image");
    if (fileName !== null && fileName !== "") {
        var link = document.getElementById("container");
        link.setAttribute("download", fileName + ".png");
        link.setAttribute(
            "href",
            canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")
        );
        link.click();
    }
}

//layerType is used to determine which properties to display in the properties window
function displayProperties(layer, layerType) {
    selectedIndex = layer.index;
    $("#properties").css("display", "inline-block");

    //Display and set text properties if the selected layer is a text box
    if (layerType == "text") {
        $("#textProperties").css("display", "block");
        $("#width").css("display", "none");
        $("#height").css("display", "none");

        $("#textID").val(layer.text);
        $("#fontFamilyID").val(layer.fontFamily);
        $("#fontSizeID").val(layer.fontSize);
    } else {
        $("#textProperties").css("display", "none");
        $("#width").css("display", "block");
        $("#height").css("display", "block");
    }

    //Unless the layer is an image, display and set the border and fill color options
    if (layerType !== "image") {
        $("#nonImageProperties").css("display", "block");

        $("#borderWidthID").val(layer.strokeWidth);
        $("#borderColorID").val(expandShortHex(layer.strokeStyle));
        $("#fillColorID").val(expandShortHex(layer.fillStyle));
    } else {
        $("#nonImageProperties").css("display", "none");
    }

    $("#xPosID").val(layer.x);
    $("#yPosID").val(layer.y);
    $("#widthID").val(layer.width);
    $("#heightID").val(layer.height);
    $("#rotateID").val(layer.rotate);
}

function applyPropertiesClicked() {
    $("canvas")
        .setLayer(selectedIndex, {
            x: $("#xPosID").val(),
            y: $("#yPosID").val(),
            width: $("#widthID").val(),
            height: $("#heightID").val(),
            rotate: $("#rotateID").val(),
            strokeWidth: $("#borderWidthID").val(),
            strokeStyle: $("#borderColorID").val(),
            fillStyle: $("#fillColorID").val(),
            text: $("#textID").val(),
            fontFamily: $("#fontFamilyID").val(),
            fontSize: $("#fontSizeID").val(),
        })
        .drawLayers();
}

function deleteLayerClicked() {
    if (confirm("Are you sure you want to delete this layer?")) {
        $("canvas").removeLayer(selectedIndex).drawLayers();
        $("#properties").css("display", "none");
        selectedIndex = 0;
    }
}
