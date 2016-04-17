/// <reference path="../scripts/typings/jasmine/jasmine.d.ts" />
/// <reference path="../scripts/snap/snapsvg.d.ts" />
/// <reference path="../scripts/Shape.ts" />
/// <reference path="../scripts/Line.ts" />
/// <reference path="../scripts/Ellipse.ts" />
/// <reference path="../scripts/Rectangle.ts" />
/// <reference path="../scripts/Arrow.ts" />
/// <reference path="../scripts/ToolSettingsObserver.ts" />
/// <reference path="../scripts/ToolSettings.ts" />
/// <reference path="../scripts/Paper.ts" />


describe("mousemove unit tests", function () {

    var svg;
    beforeEach(function () {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    });

    afterEach(function () {
        svg = 0;
    });

    it("Draws a line from 10,10 to 20,10", function () {

        var toolSettings = new markit.ToolSettings();
        toolSettings.commandMode = markit.CommandMode.Line;
        toolSettings.stroke = "#000";
        toolSettings.strokeWidth = 1;
        var paper = new markit.Paper(svg);
        paper["leftMouseButtonDown"] = true;
        paper["activeElement"] = new markit.Line(paper, { x: 10, y: 10 }, toolSettings);
        paper.toolSettings = toolSettings;
        spyOn(paper, "toLocalCoords").and.returnValue({ x: 20, y: 10 });

        // just some fake mouse values to pass to function. we are using a spy on toLocalCoords to return the 
        // coordinates we want
        var e = {
            clientX: 50,
            clientY: 50
        };

        // run the test
        paper.onmousemove(e);

        var x1 = paper["activeElement"].element.attr("x1");
        var x2 = paper["activeElement"].element.attr("x2");
        var y1 = paper["activeElement"].element.attr("y1");
        var y2 = paper["activeElement"].element.attr("y2");

        expect(x1 === "10" && x2 === "20" && y1 === "10" && y2 === "10").toBe(true);
    });
});
