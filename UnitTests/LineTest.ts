/// <reference path="../scripts/typings/jasmine/jasmine.d.ts" />
/// <reference path="../scripts/snap/snapsvg.d.ts" />
/// <reference path="../scripts/Point.ts" />
/// <reference path="../scripts/Shape.ts" />
/// <reference path="../scripts/Line.ts" />
/// <reference path="../scripts/Ellipse.ts" />
/// <reference path="../scripts/Rectangle.ts" />
/// <reference path="../scripts/IShapeObserver.ts" />
/// <reference path="../scripts/Paper.ts" />
/// <reference path="../scripts/ToolSettingsObserver.ts" />
/// <reference path="../scripts/ToolSettings.ts" />
// chutzpah-exclude="true"

describe("Line constructor unit tests", function () {

    var svg;
    beforeEach(function () {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    });

    afterEach(function () {
        svg = 0;
    });

    it("throws exception if observer parameter undefined", function () {

        var observer;
        expect(function () {
            var line = new markit.Line(observer, null, null);
        }).toThrow("observer parameter is required.");
    });

    it("throws exception if observer parameter is null", function () {

        var observer = null;
        expect(function () {
            var line = new markit.Line(observer, null, null);
        }).toThrow("observer parameter is required.");
    });

    it("throws exception if origin parameter undefined", function () {

        var observer = new markit.Paper(svg);
        var origin;
        expect(function () {
            var line = new markit.Line(observer, origin, null);
        }).toThrow("origin parameter is required.");
    });

    it("throws exception if origin parameter is null", function () {

        var observer = new markit.Paper(svg);
        var origin = null;
        expect(function () {
            var line = new markit.Line(observer, origin, null);
        }).toThrow("origin parameter is required.");
    });

    it("throws exception if toolSettings parameter is undefined", function () {

        var observer = new markit.Paper(svg);
        var origin = { x: 0, y: 0 };
        var ts;
        expect(function () {
            var line = new markit.Line(observer, origin, ts);
        }).toThrow("toolSettings parameter is required.");
    });

    it("throws exception if toolSettings parameter is null", function () {

        var observer = new markit.Paper(svg);
        var origin = { x: 0, y: 0 };
        var ts = null;
        expect(function () {
            var line = new markit.Line(observer, origin, ts);
        }).toThrow("toolSettings parameter is required.");
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
      
        var paper = new markit.Paper(svg);
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

describe("Line set toolSettings unit tests", function () {

    var svg;
    beforeEach(function () {
        svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    });

    afterEach(function () {
        svg = 0;
    });

    it("toolSettings throws exception if undefined", function () {
        var paper = new markit.Paper(svg);
        var origin = { x: 100, y: 100 };
        var toolSettings = new markit.ToolSettings();
        var line = new markit.Line(paper, origin, toolSettings);
        
        expect(function () {
            var ts;
            line.toolSettings = ts;
        }).toThrow("settings required.");
    });

    it("toolSettings throws exception if null", function () {
        var paper = new markit.Paper(svg);
        var origin = { x: 100, y: 100 };
        var toolSettings = new markit.ToolSettings();
        var line = new markit.Line(paper, origin, toolSettings);              
        expect(function () {
            line.toolSettings = null;
        }).toThrow("settings required.");
    });

    it("toolSettings calls setToolSettings", function () {
        var paper = new markit.Paper(svg);
        var origin = { x: 100, y: 100 };
        var toolSettings = new markit.ToolSettings();
        var line = new markit.Line(paper, origin, toolSettings);
        spyOn(line, "setToolSettings");
        line.toolSettings = new markit.ToolSettings();
        expect(line["setToolSettings"]).toHaveBeenCalled();
    });
});