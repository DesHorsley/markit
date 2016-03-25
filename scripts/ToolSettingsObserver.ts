
/// <reference path="ToolSettings.ts" />

module markit {

    export interface ToolSettingsObserver {
        setToolSettings(toolSettings: ToolSettings);
    }
}