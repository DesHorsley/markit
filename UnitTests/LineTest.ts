/// <reference path="../scripts/typings/jasmine/jasmine.d.ts" />
/// <reference path="../scripts/snap/snapsvg.d.ts" />
/// <reference path="../scripts/Point.ts" />
/// <reference path="../scripts/Shape.ts" />
/// <reference path="../scripts/Line.ts" />
/// <reference path="../scripts/Ellipse.ts" />
/// <reference path="../scripts/Rectangle.ts" />

/// <reference path="../scripts/ToolSettingsObserver.ts" />
/// <reference path="../scripts/ToolSettings.ts" />
// chutzpah-exclude="true"

describe("Line constructor unit tests", function () {
    
    it("throws exception if surface parameter undefined", function () {

        var surface;
        //var line = new markit.Line(surface, null, null);
        expect(function () {
            var line = new markit.Line(surface, null, null);
        }).toThrow("surface parameter is required.");
    });
});

describe("Line draw unit test", function () {

    var svg;
    beforeEach(function () {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    });

    afterEach(function () {
        svg = 0;
    });

    it("Line coordinates to equal given coordinates", function () {
      
        var paper = Snap(svg);
        var origin = { x: 100, y: 100 };
        var toolSettings = new markit.ToolSettings();
        var line = new markit.Line(paper, origin, toolSettings);
        line.draw({ x: 50, y: 50 });
        var attrX = Number(line.element.attr("x1"));
        var attrY = Number(line.element.attr("y1"));
        var attrX2 = Number(line.element.attr("x2"));
        var attrY2 = Number(line.element.attr("y2"));
        expect(attrX === origin.x && attrY === origin.y).toBe(true);
        expect(attrX === 100 && attrY === 100).toBe(true);
        expect(attrX2 === 50 && attrY2 === 50).toBe(true);
    });

});