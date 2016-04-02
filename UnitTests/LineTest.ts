/// <reference path="../scripts/typings/jasmine/jasmine.d.ts"  />
/// <reference path="../scripts/snap/snapsvg.d.ts" />
/// <reference path="../scripts/Shape.ts" />
/// <reference path="../scripts/Line.ts" />
/// <reference path="../scripts/ToolSettings.ts" />
/// <chutzpah_reference path="../scripts/snap/snap.svg.js" />
// chutzpah-exclude="true"

describe("Line constructor unit tests", function () {
    
    it("throws exception if surface parameter undefined", function () {

        var surface;
        //var line = new markit.Line(surface, null, null);
        expect( new markit.Line(surface, null, null)).toThrow("surface parameter is undefined.");
    });
});

describe("Line draw unit test", function () {

    it("Line endpoints to equal given coordinates", function () {
        var paper = Snap(new SVGElement());
        var origin = { x: 100, y: 100 };
        var toolSettings = new markit.ToolSettings();
        var line = new markit.Line(paper, origin, toolSettings);
        line.draw({ x: 50, y: 50 });
        var attrX = Number(line.element.attr("x"));
        var attrY = Number(line.element.attr("y"));
        var attrX2 = Number(line.element.attr("x2"));
        var attrY2 = Number(line.element.attr("y2"));
        expect(attrX === origin.x && attrY === origin.y).toBe(true);
        expect(attrX2 === 50 && attrY2 === 50).toBe(true);
    });
});