import { ExifDetail } from '../../api/models/ExifDetail';

interface FormatInstruction {
    category: 'exif' | 'maker' | 'composite';
    displayName: string;
    formatFunc?: (val: number) => string;
}

const fourDecimals = (val: number): string => {
    return val.toFixed(4);
};

const distance = (val: number): string => {
    return `${val.toFixed(2)} m`;
};

const formatLatitude = (val: number): string => {
    if (val >= 0) {
        return `${val} (North)`;
    } else {
        return `${val} (South)`;
    }
};

const formatLongitude = (val: number): string => {
    if (val >= 0) {
        return `${val} (East)`;
    } else {
        return `${val} (West)`;
    }
};

const formatAltitude = (val: number): string => {
    if (val >= 0) {
        return `${val} m Above Sea Level`;
    } else {
        return `${val} m Below Sea Level`;
    }
};

const formatMap = new Map<string, FormatInstruction>([
    // exif
    ['bitsPerSample',           { category: 'exif', displayName: 'Bits per Sample' }],
    ['compression',             { category: 'exif', displayName: 'Compression' }],
    ['contrast',                { category: 'exif', displayName: 'Contrast' }],
    ['createDate',              { category: 'exif', displayName: 'Create Date' }],
    ['digitalZoomRatio',        { category: 'exif', displayName: 'Digital Zoom Ratio' }],
    ['exposureCompensation',    { category: 'exif', displayName: 'Exposure Compensation' }],
    ['exposureMode',            { category: 'exif', displayName: 'Exposure Mode' }],
    ['exposureProgram',         { category: 'exif', displayName: 'Exposure Program' }],
    ['exposureTime',            { category: 'exif', displayName: 'Exposure Time' }],
    ['fNumber',                 { category: 'exif', displayName: 'F Number' }],
    ['flash',                   { category: 'exif', displayName: 'Flash' }],
    ['focalLength',             { category: 'exif', displayName: 'Focal Length' }],
    ['focalLengthIn35mmFormat', { category: 'exif', displayName: 'Focal Length in 35mm Format'}],
    ['gainControl',             { category: 'exif', displayName: 'Gain Control' }],
    ['gpsAltitude',             { category: 'exif', displayName: 'GPS Altitude',  formatFunc: formatAltitude }],
    ['gpsDateStamp',            { category: 'exif', displayName: 'GPS Time Stamp' }],
    ['gpsDirection',            { category: 'exif', displayName: 'GPS Direction' }],
    ['gpsLatitude',             { category: 'exif', displayName: 'GPS Latitude',  formatFunc: formatLatitude }],
    ['gpsLongitude',            { category: 'exif', displayName: 'GPS Longitude', formatFunc: formatLongitude }],
    ['gpsMeasureMode',          { category: 'exif', displayName: 'GPS Measure Mode' }],
    ['gpsSatellites',           { category: 'exif', displayName: 'GPS Satellites' }],
    ['gpsStatus',               { category: 'exif', displayName: 'GPS Status' }],
    ['gpsVersionId',            { category: 'exif', displayName: 'GPS Version ID' }],
    ['iso',                     { category: 'exif', displayName: 'ISO' }],
    ['lightSource',             { category: 'exif', displayName: 'Light Source' }],
    ['make',                    { category: 'exif', displayName: 'Make' }],
    ['meteringMode',            { category: 'exif', displayName: 'Metering Mode' }],
    ['model',                   { category: 'exif', displayName: 'Model' }],
    ['orientation',             { category: 'exif', displayName: 'Orientation' }],
    ['saturation',              { category: 'exif', displayName: 'Saturation' }],
    ['sceneCaptureType',        { category: 'exif', displayName: 'Scene Capture Type' }],
    ['sceneType',               { category: 'exif', displayName: 'Scene Type' }],
    ['sensingMethod',           { category: 'exif', displayName: 'Sensing Method' }],
    ['sharpness',               { category: 'exif', displayName: 'Sharpness' }],

    // maker
    ['autoFocusAreaMode',         { category: 'maker', displayName: 'Auto Focus Area Mode' }],
    ['autoFocusPoint',            { category: 'maker', displayName: 'Auto Focus Point' }],
    ['activeDLighting',           { category: 'maker', displayName: 'Active D Lighting' }],
    ['colorspace',                { category: 'maker', displayName: 'Colorspace' }],
    ['exposureDifference',        { category: 'maker', displayName: 'Exposure Difference' }],
    ['flashColorFilter',          { category: 'maker', displayName: 'Flash Color Filter' }],
    ['flashCompensation',         { category: 'maker', displayName: 'Flash Compensation' }],
    ['flashControlMode',          { category: 'maker', displayName: 'Flash Control Mode' }],
    ['flashExposureCompensation', { category: 'maker', displayName: 'Flash Exposure Compensation' }],
    ['flashFocalLength',          { category: 'maker', displayName: 'Flash Focal Length' }],
    ['flashMode',                 { category: 'maker', displayName: 'Flash Mode' }],
    ['flashSetting',              { category: 'maker', displayName: 'Flash Setting' }],
    ['flashType',                 { category: 'maker', displayName: 'Flash Type' }],
    ['focusDistance',             { category: 'maker', displayName: 'Focus Distance', formatFunc: distance}],
    ['focusMode',                 { category: 'maker', displayName: 'Focus Mode' }],
    ['focusPosition',             { category: 'maker', displayName: 'Focus Position' }],
    ['highIsoNoiseReduction',     { category: 'maker', displayName: 'High ISO Noise Reduction' }],
    ['hueAdjustment',             { category: 'maker', displayName: 'Hue Adjustment' }],
    ['noiseReduction',            { category: 'maker', displayName: 'Noise Reduction' }],
    ['pictureControlName',        { category: 'maker', displayName: 'Picture Control' }],
    ['primaryAFPoint',            { category: 'maker', displayName: 'Primary AF Point' }],
    ['vrMode',                    { category: 'maker', displayName: 'VR Mode' }],
    ['vibrationReduction',        { category: 'maker', displayName: 'Vibration Reduction'}],
    ['vignetteControl',           { category: 'maker', displayName: 'Vignette Control' }],
    ['whiteBalance',              { category: 'maker', displayName: 'White Balance' }],

    // composite
    ['aperture',           { category: 'composite', displayName: 'Aperture' }],
    ['autoFocus',          { category: 'composite', displayName: 'Auto Focus' }],
    ['depthOfField',       { category: 'composite', displayName: 'Depth Of Field' }],
    ['fieldOfView',        { category: 'composite', displayName: 'Field of View' }],
    ['hyperfocalDistance', { category: 'composite', displayName: 'Hyperfocal Distance', formatFunc: distance }],
    ['lensId',             { category: 'composite', displayName: 'Lens ID' }],
    ['lightValue',         { category: 'composite', displayName: 'Light Value',         formatFunc: fourDecimals }],
    ['scaleFactor35Efl',   { category: 'composite', displayName: 'Scale Factor 35 EFL' }],
    ['shutterSpeed',       { category: 'composite', displayName: 'Shutter Speed' }],
]);

export const getFormattedExif = (exif: ExifDetail, category: string) => {
    const data = [];

    Object.keys(exif).forEach(key => {
        const val = exif[key] as string | number | boolean;

        if(val) {
            const cfg = formatMap.get(key);

            if(cfg && cfg.category === category) {
                const formattedValue = cfg.formatFunc ? cfg.formatFunc(val as number) : val.toString();

                data.push({ displayName: cfg.displayName, displayValue: formattedValue })
            }
        }
    });

    return data;
};
