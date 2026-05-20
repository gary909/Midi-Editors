// Detect which page we're on (index1.html is test page, index.html is live)
const isTestPage = window.location.pathname.includes('index1.html');

// Variable to store the selected MIDI output port
let midiOutput = null;

// Variable to store the original text of the MIDI status element
let originalMidiStatusText = '';

// --- MIDI CC NUMBERS CZ-1 MINI ---
// Note: These are typical CC assignments for phase distortion synthesizers
// Adjust based on actual CZ-1 Mini MIDI implementation

// Bank Select
const CC_BANK_SELECT = 0;

// DCO 1
const CC_DCO1_WF1 = 13;
const CC_DCO2_WF2 = 14;
const CC_DCO1_DCW = 15;
const CC_LINE_SELECT = 8;

// Vibrato
const CC_VIBRATO_WAVE = 2;
const CC_VIBRATO_RATE = 3;
const CC_VIBRATO_SYNC = 4;
const CC_VIBRATO_SYNC_RATE = 5;
const CC_VIBRATO_DEPTH = 6;
const CC_VIBRATO_DELAY = 7;

// Detune
const CC_DETUNE_POLARITY = 9;
const CC_DETUNE_OCT = 10;
const CC_DETUNE_NOTE = 11;
const CC_DETUNE_FINE = 12;

// DCO 2
const CC_DCO1_WF1_LINEOFFSET = 16;
const CC_DCO1_WF2_LINEOFFSET = 17;

// DCW Params
const CC_DCO1_DCW_LINEOFFSET = 18;
const CC_DCO1_DCW_KEYFOLLOW = 19;
const CC_DCO1_DCW_KEYFOLLOW_RANGE = 20;
const CC_DCO1_DCW_KEYFOLLOW_LINEOFFSET = 23;
const CC_DCO1_DCW_KEYFOLLOW_RANGE_LINEOFFSET = 24;

// DCA Params
const CC_DCO1_DCA_KEYFOLLOW = 21;
const CC_DCO1_DCA_KEYFOLLOW_RANGE = 22;
const CC_DCO1_DCA_KEYFOLLOW_LINEOFFSET = 25;
const CC_DCO1_DCA_KEYFOLLOW_RANGE_LINEOFFSET = 26;

// DCA Level
const CC_DCA_SUSTAIN_POINT = 27;
const CC_DCA_END_POINT = 28;
const CC_DCA_LEVEL_0 = 29;
const CC_DCA_LEVEL_1 = 30;
const CC_DCA_LEVEL_2 = 31;
const CC_DCA_LEVEL_3 = 32;
const CC_DCA_LEVEL_4 = 33;
const CC_DCA_LEVEL_5 = 34;
const CC_DCA_LEVEL_6 = 35;
const CC_DCA_LEVEL_7 = 36;

// DCA Rate
const CC_DCA_RATE_0 = 37;
const CC_DCA_RATE_1 = 38;
const CC_DCA_RATE_2 = 39;
const CC_DCA_RATE_3 = 40;
const CC_DCA_RATE_4 = 41;
const CC_DCA_RATE_5 = 42;
const CC_DCA_RATE_6 = 43;
const CC_DCA_RATE_7 = 44;

// Pitch Level
const CC_PITCH_SUSTAIN_POINT = 45;
const CC_PITCH_END_POINT = 46;
const CC_PITCH_LEVEL_0 = 47;
const CC_PITCH_LEVEL_1 = 48;
const CC_PITCH_LEVEL_2 = 49;
const CC_PITCH_LEVEL_3 = 50;
const CC_PITCH_LEVEL_4 = 51;
const CC_PITCH_LEVEL_5 = 52;
const CC_PITCH_LEVEL_6 = 53;
const CC_PITCH_LEVEL_7 = 54;

// Pitch Rate
const CC_PITCH_RATE_0 = 55;
const CC_PITCH_RATE_1 = 56;
const CC_PITCH_RATE_2 = 57;
const CC_PITCH_RATE_3 = 58;
const CC_PITCH_RATE_4 = 59;
const CC_PITCH_RATE_5 = 60;
const CC_PITCH_RATE_6 = 61;
const CC_PITCH_RATE_7 = 62;

// DCW Level
const CC_DCW_SUSTAIN_POINT = 63;
const CC_DCW_END_POINT = 64;
const CC_DCW_LEVEL_0 = 65;
const CC_DCW_LEVEL_1 = 66;
const CC_DCW_LEVEL_2 = 67;
const CC_DCW_LEVEL_3 = 68;
const CC_DCW_LEVEL_4 = 69;
const CC_DCW_LEVEL_5 = 70;
const CC_DCW_LEVEL_6 = 71;
const CC_DCW_LEVEL_7 = 72;

// DCW Rate
const CC_DCW_RATE_0 = 73;
const CC_DCW_RATE_1 = 74;
const CC_DCW_RATE_2 = 75;
const CC_DCW_RATE_3 = 76;
const CC_DCW_RATE_4 = 77;
const CC_DCW_RATE_5 = 78;
const CC_DCW_RATE_6 = 79;
const CC_DCW_RATE_7 = 80;

// LFO 1
const CC_LFO1_WAVE = 81;
const CC_LFO1_AMOUNT = 82;
const CC_LFO1_RATE = 83;

// Filter EG
const CC_FILTER_ATTACK = 84;
const CC_FILTER_DECAY = 85;
const CC_FILTER_SUSTAIN = 86;
const CC_FILTER_RELEASE = 87;

// Filter
const CC_FILTER_ENV_AMOUNT = 88;
const CC_FILTER_CUTOFF = 89;
const CC_FILTER_RESONANCE = 90;

// Chorus
const CC_CHORUS_RATE = 91;
const CC_CHORUS_DEPTH = 92;

// --- HELPER FUNCTIONS ---
// Map waveform slider values to waveform names
function getWaveformName(val) {
    if (val >= 0 && val <= 18) return 'SAWTOOTH';
    if (val >= 19 && val <= 36) return 'SQUARE';
    if (val >= 37 && val <= 54) return 'PULSE';
    if (val >= 55 && val <= 72) return 'DOUBLESINE';
    if (val >= 73 && val <= 90) return 'SAW-PULSE';
    if (val >= 91 && val <= 108) return 'RESONANCE I SAW';
    if (val >= 109 && val <= 126) return 'RESONANCE II TRI';
    if (val === 127) return 'RESONANCE III TRAP';
    return 'UNKNOWN';
}

// Map line select values to line names
function getLineName(val) {
    if (val >= 0 && val <= 42) return 'Line 1';
    if (val >= 43 && val <= 84) return 'Line 2';
    if (val >= 85 && val <= 126) return 'Line 1+2';
    if (val === 127) return 'Line 1+1';
    return 'UNKNOWN';
}

// Map sustain point values to point numbers (0-7)
function getSustainPointNumber(val) {
    if (val >= 0 && val <= 18) return '0';
    if (val >= 19 && val <= 36) return '1';
    if (val >= 37 && val <= 54) return '2';
    if (val >= 55 && val <= 72) return '3';
    if (val >= 73 && val <= 90) return '4';
    if (val >= 91 && val <= 108) return '5';
    if (val >= 109 && val <= 126) return '6';
    if (val >= 127 && val <= 127) return '7';
    return 'UNKNOWN';
}

// Map end point values to point numbers (0-8)
function getEndPointNumber(val) {
    // if (val >= 0 && val <= 8) return '0';
    // if (val >= 9 && val <= 24) return '1';
    // if (val >= 25 && val <= 41) return '2';
    // if (val >= 42 && val <= 59) return '3';
    // if (val >= 60 && val <= 73) return '4';
    // if (val >= 74 && val <= 88) return '5';
    // if (val >= 89 && val <= 104) return '6';
    // if (val >= 105 && val <= 120) return '7';
    // if (val >= 121 && val <= 127) return '8';
    if (val >= 0 && val <= 21) return '2';
    if (val >= 22 && val <= 42) return '3';
    if (val >= 43 && val <= 63) return '4';
    if (val >= 64 && val <= 84) return '5';
    if (val >= 85 && val <= 105) return '6';
    if (val >= 106 && val <= 126) return '7';
    if (val >= 127 && val <= 127) return '8';
    return 'UNKNOWN';
}

// Map Vibrato wave values to wave names
function getVibratoWaveName(val) {
    if (val >= 0 && val <= 42) return 'TRI';
    if (val >= 43 && val <= 84) return 'SAW RMP UP';
    if (val >= 85 && val <= 126) return 'SAW RMP DWN';
    if (val === 127) return 'SQR';
    return 'UNKNOWN';
}

// Map LFO1 wave values to wave names
function getLfo1WaveName(val) {
    if (val >= 0 && val <= 25) return 'TRI';
    if (val >= 26 && val <= 50) return 'SQR';
    if (val >= 51 && val <= 76) return 'SAW';
    if (val >= 77 && val <= 101) return 'RMP';
    if (val >= 102 && val <= 127) return 'S&H';
    return 'UNKNOWN';
}

// Map detune polarity value to direction name
function getDetunePolarityName(val) {
    if (val >= 0 && val <= 64) return "DOWN'";
    return "UP'";
}

// Map detune octave values to octave numbers (0-3)
function getDetuneOctName(val) {
    if (val >= 0 && val <= 42) return "0'";
    if (val >= 43 && val <= 84) return "1'";
    if (val >= 85 && val <= 126) return "2'";
    if (val === 127) return "3'";
    return 'UNKNOWN';
}

// Map detune note values to semitone numbers (0-11)
function getDetuneNoteName(val) {
    if (val >= 0 && val <= 11) return "0'";
    if (val >= 12 && val <= 23) return "1'";
    if (val >= 24 && val <= 35) return "2'";
    if (val >= 36 && val <= 46) return "3'";
    if (val >= 47 && val <= 57) return "4'";
    if (val >= 58 && val <= 69) return "5'";
    if (val >= 70 && val <= 80) return "6'";
    if (val >= 81 && val <= 92) return "7'";
    if (val >= 93 && val <= 103) return "8'";
    if (val >= 104 && val <= 115) return "9'";
    if (val >= 116 && val <= 126) return "10'";
    if (val === 127) return "11'";
    return 'UNKNOWN';
}

// Map pitch end point values to point numbers (2-8)
function getPitchEndPointNumber(val) {
    if (val >= 0 && val <= 21) return '2';
    if (val >= 22 && val <= 42) return '3';
    if (val >= 43 && val <= 63) return '4';
    if (val >= 64 && val <= 84) return '5';
    if (val >= 85 && val <= 105) return '6';
    if (val >= 106 && val <= 126) return '7';
    if (val >= 127 && val <= 127) return '8';
    return 'UNKNOWN';
}

// --- PATCH DEFAULTS ---
const ALL_PATCH_CONTROLS = [
    // DCO 1
    { id: 'dco1-wf1', cc: CC_DCO1_WF1, value: 0 },
    { id: 'dco2-wf2', cc: CC_DCO2_WF2, value: 0 },
    { id: 'dco1-dcw', cc: CC_DCO1_DCW, value: 0 },
    { id: 'line-select', cc: CC_LINE_SELECT, value: 0 },
    
    // Vibrato
    { id: 'vibrato-wave', cc: CC_VIBRATO_WAVE, value: 0 },
    { id: 'vibrato-rate', cc: CC_VIBRATO_RATE, value: 0 },
    { id: 'vibrato-sync', cc: CC_VIBRATO_SYNC, value: 0 },
    { id: 'vibrato-sync-rate', cc: CC_VIBRATO_SYNC_RATE, value: 0 },
    { id: 'vibrato-depth', cc: CC_VIBRATO_DEPTH, value: 0 },
    { id: 'vibrato-delay', cc: CC_VIBRATO_DELAY, value: 0 },
    
    // Detune
    { id: 'detune-polarity', cc: CC_DETUNE_POLARITY, value: 0 },
    { id: 'detune-oct', cc: CC_DETUNE_OCT, value: 0 },
    { id: 'detune-note', cc: CC_DETUNE_NOTE, value: 0 },
    // FINE TUNE: Re-enabled for testing on index1.html only
    ...(isTestPage ? [{ id: 'detune-fine', cc: CC_DETUNE_FINE, value: 0 }] : []),
    
    // DCO 2
    { id: 'dco1-wf1-lineoffset', cc: CC_DCO1_WF1_LINEOFFSET, value: 0 },
    { id: 'dco1-wf2-lineoffset', cc: CC_DCO1_WF2_LINEOFFSET, value: 0 },
    
    // DCW Params
    { id: 'dco1-dcw-lineoffset', cc: CC_DCO1_DCW_LINEOFFSET, value: 0 },
    { id: 'dco1-dcw-keyfollow', cc: CC_DCO1_DCW_KEYFOLLOW, value: 0 },
    { id: 'dco1-dcw-keyfollow-range', cc: CC_DCO1_DCW_KEYFOLLOW_RANGE, value: 0 },
    { id: 'dco1-dcw-keyfollow-lineoffset', cc: CC_DCO1_DCW_KEYFOLLOW_LINEOFFSET, value: 0 },
    { id: 'dco1-dcw-keyfollow-range-lineoffset', cc: CC_DCO1_DCW_KEYFOLLOW_RANGE_LINEOFFSET, value: 0 },
    
    // DCA Params
    { id: 'dco1-dca-keyfollow', cc: CC_DCO1_DCA_KEYFOLLOW, value: 0 },
    { id: 'dco1-dca-keyfollow-range', cc: CC_DCO1_DCA_KEYFOLLOW_RANGE, value: 0 },
    { id: 'dco1-dca-keyfollow-lineoffset', cc: CC_DCO1_DCA_KEYFOLLOW_LINEOFFSET, value: 0 },
    { id: 'dco1-dca-keyfollow-range-lineoffset', cc: CC_DCO1_DCA_KEYFOLLOW_RANGE_LINEOFFSET, value: 0 },
    
    // DCA Level
    { id: 'dca-sustain-point', cc: CC_DCA_SUSTAIN_POINT, value: 19 },
    { id: 'dca-end-point', cc: CC_DCA_END_POINT, value: 0 },
    { id: 'dca-level-1', cc: CC_DCA_LEVEL_0, value: 127 },
    { id: 'dca-level-2', cc: CC_DCA_LEVEL_1, value: 0 },
    { id: 'dca-level-3', cc: CC_DCA_LEVEL_2, value: 0 },
    { id: 'dca-level-4', cc: CC_DCA_LEVEL_3, value: 0 },
    { id: 'dca-level-5', cc: CC_DCA_LEVEL_4, value: 0 },
    { id: 'dca-level-6', cc: CC_DCA_LEVEL_5, value: 0 },
    { id: 'dca-level-7', cc: CC_DCA_LEVEL_6, value: 0 },
    { id: 'dca-level-8', cc: CC_DCA_LEVEL_7, value: 0 },
    
    // DCA Rate
    { id: 'dca-rate-1', cc: CC_DCA_RATE_0, value: 127 },
    { id: 'dca-rate-2', cc: CC_DCA_RATE_1, value: 65 },
    { id: 'dca-rate-3', cc: CC_DCA_RATE_2, value: 0 },
    { id: 'dca-rate-4', cc: CC_DCA_RATE_3, value: 0 },
    { id: 'dca-rate-5', cc: CC_DCA_RATE_4, value: 0 },
    { id: 'dca-rate-6', cc: CC_DCA_RATE_5, value: 0 },
    { id: 'dca-rate-7', cc: CC_DCA_RATE_6, value: 0 },
    { id: 'dca-rate-8', cc: CC_DCA_RATE_7, value: 0 },

    // DCA Env 2 (DCO 2) — same CCs as ENV 1 but sent with Bank Select = 1
    { id: 'dca2-sustain-point', cc: CC_DCA_SUSTAIN_POINT, value: 19 },
    { id: 'dca2-end-point', cc: CC_DCA_END_POINT, value: 0 },
    { id: 'dca2-level-1', cc: CC_DCA_LEVEL_0, value: 127 },
    { id: 'dca2-level-2', cc: CC_DCA_LEVEL_1, value: 0 },
    { id: 'dca2-level-3', cc: CC_DCA_LEVEL_2, value: 0 },
    { id: 'dca2-level-4', cc: CC_DCA_LEVEL_3, value: 0 },
    { id: 'dca2-level-5', cc: CC_DCA_LEVEL_4, value: 0 },
    { id: 'dca2-level-6', cc: CC_DCA_LEVEL_5, value: 0 },
    { id: 'dca2-level-7', cc: CC_DCA_LEVEL_6, value: 0 },
    { id: 'dca2-level-8', cc: CC_DCA_LEVEL_7, value: 0 },
    { id: 'dca2-rate-1', cc: CC_DCA_RATE_0, value: 127 },
    { id: 'dca2-rate-2', cc: CC_DCA_RATE_1, value: 64 },
    { id: 'dca2-rate-3', cc: CC_DCA_RATE_2, value: 0 },
    { id: 'dca2-rate-4', cc: CC_DCA_RATE_3, value: 0 },
    { id: 'dca2-rate-5', cc: CC_DCA_RATE_4, value: 0 },
    { id: 'dca2-rate-6', cc: CC_DCA_RATE_5, value: 0 },
    { id: 'dca2-rate-7', cc: CC_DCA_RATE_6, value: 0 },
    { id: 'dca2-rate-8', cc: CC_DCA_RATE_7, value: 0 },

    // Pitch Level
    { id: 'pitch-sustain-point', cc: CC_PITCH_SUSTAIN_POINT, value: 19 },
    { id: 'pitch-end-point', cc: CC_PITCH_END_POINT, value: 0 },
    { id: 'pitch-level-1', cc: CC_PITCH_LEVEL_0, value: 0 },
    { id: 'pitch-level-2', cc: CC_PITCH_LEVEL_1, value: 0 },
    { id: 'pitch-level-3', cc: CC_PITCH_LEVEL_2, value: 0 },
    { id: 'pitch-level-4', cc: CC_PITCH_LEVEL_3, value: 0 },
    { id: 'pitch-level-5', cc: CC_PITCH_LEVEL_4, value: 0 },
    { id: 'pitch-level-6', cc: CC_PITCH_LEVEL_5, value: 0 },
    { id: 'pitch-level-7', cc: CC_PITCH_LEVEL_6, value: 0 },
    { id: 'pitch-level-8', cc: CC_PITCH_LEVEL_7, value: 0 },
    
    // Pitch Rate
    { id: 'pitch-rate-1', cc: CC_PITCH_RATE_0, value: 65 },
    { id: 'pitch-rate-2', cc: CC_PITCH_RATE_1, value: 0 },
    { id: 'pitch-rate-3', cc: CC_PITCH_RATE_2, value: 0 },
    { id: 'pitch-rate-4', cc: CC_PITCH_RATE_3, value: 0 },
    { id: 'pitch-rate-5', cc: CC_PITCH_RATE_4, value: 0 },
    { id: 'pitch-rate-6', cc: CC_PITCH_RATE_5, value: 0 },
    { id: 'pitch-rate-7', cc: CC_PITCH_RATE_6, value: 0 },
    { id: 'pitch-rate-8', cc: CC_PITCH_RATE_7, value: 0 },

    // Pitch Env 2 (DCO 2) — same CCs as ENV 1 but sent with Bank Select = 1
    { id: 'pitch2-sustain-point', cc: CC_PITCH_SUSTAIN_POINT, value: 19 },
    { id: 'pitch2-end-point', cc: CC_PITCH_END_POINT, value: 0 },
    { id: 'pitch2-level-1', cc: CC_PITCH_LEVEL_0, value: 0 },
    { id: 'pitch2-level-2', cc: CC_PITCH_LEVEL_1, value: 0 },
    { id: 'pitch2-level-3', cc: CC_PITCH_LEVEL_2, value: 0 },
    { id: 'pitch2-level-4', cc: CC_PITCH_LEVEL_3, value: 0 },
    { id: 'pitch2-level-5', cc: CC_PITCH_LEVEL_4, value: 0 },
    { id: 'pitch2-level-6', cc: CC_PITCH_LEVEL_5, value: 0 },
    { id: 'pitch2-level-7', cc: CC_PITCH_LEVEL_6, value: 0 },
    { id: 'pitch2-level-8', cc: CC_PITCH_LEVEL_7, value: 0 },
    { id: 'pitch2-rate-1', cc: CC_PITCH_RATE_0, value: 0 },
    { id: 'pitch2-rate-2', cc: CC_PITCH_RATE_1, value: 64 },
    { id: 'pitch2-rate-3', cc: CC_PITCH_RATE_2, value: 0 },
    { id: 'pitch2-rate-4', cc: CC_PITCH_RATE_3, value: 0 },
    { id: 'pitch2-rate-5', cc: CC_PITCH_RATE_4, value: 0 },
    { id: 'pitch2-rate-6', cc: CC_PITCH_RATE_5, value: 0 },
    { id: 'pitch2-rate-7', cc: CC_PITCH_RATE_6, value: 0 },
    { id: 'pitch2-rate-8', cc: CC_PITCH_RATE_7, value: 0 },

    // DCW Level
    { id: 'dcw-sustain-point', cc: CC_DCW_SUSTAIN_POINT, value: 19 },
    { id: 'dcw-end-point', cc: CC_DCW_END_POINT, value: 0 },
    { id: 'dcw-level-1', cc: CC_DCW_LEVEL_0, value: 127 },
    { id: 'dcw-level-2', cc: CC_DCW_LEVEL_1, value: 65 },
    { id: 'dcw-level-3', cc: CC_DCW_LEVEL_2, value: 0 },
    { id: 'dcw-level-4', cc: CC_DCW_LEVEL_3, value: 0 },
    { id: 'dcw-level-5', cc: CC_DCW_LEVEL_4, value: 0 },
    { id: 'dcw-level-6', cc: CC_DCW_LEVEL_5, value: 0 },
    { id: 'dcw-level-7', cc: CC_DCW_LEVEL_6, value: 0 },
    { id: 'dcw-level-8', cc: CC_DCW_LEVEL_7, value: 0 },
    
    // DCW Rate
    { id: 'dcw-rate-1', cc: CC_DCW_RATE_0, value: 126 },
    { id: 'dcw-rate-2', cc: CC_DCW_RATE_1, value: 0 },
    { id: 'dcw-rate-3', cc: CC_DCW_RATE_2, value: 0 },
    { id: 'dcw-rate-4', cc: CC_DCW_RATE_3, value: 0 },
    { id: 'dcw-rate-5', cc: CC_DCW_RATE_4, value: 0 },
    { id: 'dcw-rate-6', cc: CC_DCW_RATE_5, value: 0 },
    { id: 'dcw-rate-7', cc: CC_DCW_RATE_6, value: 0 },
    { id: 'dcw-rate-8', cc: CC_DCW_RATE_7, value: 0 },

    // DCW Env 2 (DCO 2) — same CCs as ENV 1 but sent with Bank Select = 1
    { id: 'dcw2-sustain-point', cc: CC_DCW_SUSTAIN_POINT, value: 19 },
    { id: 'dcw2-end-point', cc: CC_DCW_END_POINT, value: 0 },
    { id: 'dcw2-level-1', cc: CC_DCW_LEVEL_0, value: 127 },
    { id: 'dcw2-level-2', cc: CC_DCW_LEVEL_1, value: 64 },
    { id: 'dcw2-level-3', cc: CC_DCW_LEVEL_2, value: 0 },
    { id: 'dcw2-level-4', cc: CC_DCW_LEVEL_3, value: 0 },
    { id: 'dcw2-level-5', cc: CC_DCW_LEVEL_4, value: 0 },
    { id: 'dcw2-level-6', cc: CC_DCW_LEVEL_5, value: 0 },
    { id: 'dcw2-level-7', cc: CC_DCW_LEVEL_6, value: 0 },
    { id: 'dcw2-level-8', cc: CC_DCW_LEVEL_7, value: 0 },
    { id: 'dcw2-rate-1', cc: CC_DCW_RATE_0, value: 125 },
    { id: 'dcw2-rate-2', cc: CC_DCW_RATE_1, value: 0 },
    { id: 'dcw2-rate-3', cc: CC_DCW_RATE_2, value: 0 },
    { id: 'dcw2-rate-4', cc: CC_DCW_RATE_3, value: 0 },
    { id: 'dcw2-rate-5', cc: CC_DCW_RATE_4, value: 0 },
    { id: 'dcw2-rate-6', cc: CC_DCW_RATE_5, value: 0 },
    { id: 'dcw2-rate-7', cc: CC_DCW_RATE_6, value: 0 },
    { id: 'dcw2-rate-8', cc: CC_DCW_RATE_7, value: 0 },

    // LFO 1
    { id: 'lfo1-wave', cc: CC_LFO1_WAVE, value: 0 },
    { id: 'lfo1-amount', cc: CC_LFO1_AMOUNT, value: 0 },
    { id: 'lfo1-rate', cc: CC_LFO1_RATE, value: 0 },
    
    // Filter EG
    { id: 'filter-attack', cc: CC_FILTER_ATTACK, value: 0 },
    { id: 'filter-decay', cc: CC_FILTER_DECAY, value: 0 },
    { id: 'filter-sustain', cc: CC_FILTER_SUSTAIN, value: 127 },
    { id: 'filter-release', cc: CC_FILTER_RELEASE, value: 0 },
    
    // Filter
    { id: 'filter-cutoff', cc: CC_FILTER_CUTOFF, value: 127 },
    { id: 'filter-resonance', cc: CC_FILTER_RESONANCE, value: 0 },
    { id: 'filter-env-amount', cc: CC_FILTER_ENV_AMOUNT, value: 0 },
    
    // Chorus
    { id: 'chorus-rate', cc: CC_CHORUS_RATE, value: 0 },
    { id: 'chorus-depth', cc: CC_CHORUS_DEPTH, value: 0 }
];

// --- INITIALIZATION ---
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
} else {
    // No Web MIDI API (e.g. Firefox without extension) — still init all visuals
    initVisuals();
}

function onMIDIFailure() {
    console.log("Could not access MIDI devices.");
    initVisuals();
}

function onMIDISuccess(midiAccess) {
    const statusElement = document.getElementById('midi-output-select');
    populateOutputDevices(midiAccess);
    midiAccess.addEventListener('statechange', () => populateOutputDevices(midiAccess));

    const attachSlider = (ccNumber, elementId, helperFn = null) => {
        const slider = document.getElementById(elementId);
        if (!slider || !statusElement) return;

        slider.addEventListener('mousedown', () => {
            originalMidiStatusText = statusElement.options[statusElement.selectedIndex].textContent;
            statusElement.options[statusElement.selectedIndex].textContent = '';
        });

        slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            sendMidiCC(ccNumber, val);
            statusElement.options[statusElement.selectedIndex].textContent = 
                helperFn ? helperFn(val) : `${elementId.toUpperCase().replace('-', ' ')}: ${val}`;
        });
    };

    // Like attachSlider but forces Bank Select before sending and restores it after
    const attachSliderForcedBank = (bankValue, ccNumber, elementId, helperFn = null) => {
        const slider = document.getElementById(elementId);
        if (!slider || !statusElement) return;

        slider.addEventListener('mousedown', () => {
            originalMidiStatusText = statusElement.options[statusElement.selectedIndex].textContent;
            statusElement.options[statusElement.selectedIndex].textContent = '';
        });

        slider.addEventListener('input', (e) => {
            const val = parseInt(e.target.value);
            sendMidiCC(CC_BANK_SELECT, bankValue);
            sendMidiCC(ccNumber, val);
            // Restore Bank Select to match current Line Select
            const lineSelectEl = document.getElementById('line-select');
            if (lineSelectEl) {
                const lineVal = parseInt(lineSelectEl.value);
                const restoredBank = (lineVal >= 43 && lineVal <= 84) ? 1 : 0;
                sendMidiCC(CC_BANK_SELECT, restoredBank);
            }
            statusElement.options[statusElement.selectedIndex].textContent =
                helperFn ? helperFn(val) : `${elementId.toUpperCase().replace(/-/g, ' ')}: ${val}`;
        });
    };

    // Attach all sliders
    ALL_PATCH_CONTROLS.forEach(control => {
        // Use waveform name helper for waveform sliders
        if (control.id === 'vibrato-wave') {
            attachSlider(control.cc, control.id, (val) => `VIB WAVE: ${getVibratoWaveName(val)}`);
        } else if (control.id === 'dco1-wf1') {
            attachSlider(control.cc, control.id, (val) => `DCO 1 WF1: ${getWaveformName(val)}`);
        } else if (control.id === 'dco2-wf2') {
            attachSlider(control.cc, control.id, (val) => `DCO 2 WF2: ${getWaveformName(val)}`);
        } else if (control.id === 'dco1-wf1-lineoffset') {
            attachSlider(control.cc, control.id, (val) => `DCO 2 WF1: ${getWaveformName(val)}`);
        } else if (control.id === 'dco1-wf2-lineoffset') {
            attachSlider(control.cc, control.id, (val) => `DCO 2 WF2: ${getWaveformName(val)}`);
        } else if (control.id === 'line-select') {
            // Line select needs special handling to send both CC 8 and CC 0 (BANK SELECT)
            const slider = document.getElementById(control.id);
            if (slider) {
                slider.addEventListener('mousedown', () => {
                    originalMidiStatusText = statusElement.options[statusElement.selectedIndex].textContent;
                    statusElement.options[statusElement.selectedIndex].textContent = '';
                });
                slider.addEventListener('input', (e) => {
                    const val = parseInt(e.target.value);
                    // Send CC 8 with the actual value
                    sendMidiCC(CC_LINE_SELECT, val);
                    // Send CC 0 (BANK SELECT) based on active line
                    // 0-42: Line 1 (CC 0 = 0), 43-84: Line 2 (CC 0 = 1)
                    // 85-126: Line 1+2 (CC 0 = 0), 127: Line 1+1 (CC 0 = 0)
                    const bankSelect = (val >= 43 && val <= 84) ? 1 : 0;
                    sendMidiCC(CC_BANK_SELECT, bankSelect);
                    statusElement.options[statusElement.selectedIndex].textContent = `LINE SELECT: ${getLineName(val)}`;
                });
                slider.addEventListener('mouseup', () => {
                    setTimeout(() => {
                        statusElement.options[statusElement.selectedIndex].textContent = originalMidiStatusText;
                    }, 1500);
                });
            }
        } else if (control.id === 'pitch-sustain-point') {
            attachSliderForcedBank(0, control.cc, control.id, (val) => `PITCH 1 SUSTAIN: ${getSustainPointNumber(val)}`);
        } else if (control.id === 'pitch-end-point') {
            attachSliderForcedBank(0, control.cc, control.id, (val) => `PITCH 1 END: ${getPitchEndPointNumber(val)}`);
        } else if (control.id === 'pitch2-sustain-point') {
            attachSliderForcedBank(1, control.cc, control.id, (val) => `PITCH 2 SUSTAIN: ${getSustainPointNumber(val)}`);
        } else if (control.id === 'pitch2-end-point') {
            attachSliderForcedBank(1, control.cc, control.id, (val) => `PITCH 2 END: ${getPitchEndPointNumber(val)}`);
        } else if (control.id.startsWith('pitch-rate-') || control.id.startsWith('pitch-level-')) {
            attachSliderForcedBank(0, control.cc, control.id);
        } else if (control.id.startsWith('pitch2-rate-') || control.id.startsWith('pitch2-level-')) {
            attachSliderForcedBank(1, control.cc, control.id);
        } else if (control.id === 'dca-sustain-point') {
            attachSliderForcedBank(0, control.cc, control.id, (val) => `DCA 1 SUSTAIN: ${getSustainPointNumber(val)}`);
        } else if (control.id === 'dca-end-point') {
            attachSliderForcedBank(0, control.cc, control.id, (val) => `DCA 1 END: ${getEndPointNumber(val)}`);
        } else if (control.id === 'dca2-sustain-point') {
            attachSliderForcedBank(1, control.cc, control.id, (val) => `DCA 2 SUSTAIN: ${getSustainPointNumber(val)}`);
        } else if (control.id === 'dca2-end-point') {
            attachSliderForcedBank(1, control.cc, control.id, (val) => `DCA 2 END: ${getEndPointNumber(val)}`);
        } else if (control.id.startsWith('dca-rate-') || control.id.startsWith('dca-level-')) {
            attachSliderForcedBank(0, control.cc, control.id);
        } else if (control.id.startsWith('dca2-rate-') || control.id.startsWith('dca2-level-')) {
            attachSliderForcedBank(1, control.cc, control.id);
        } else if (control.id === 'dcw-sustain-point') {
            attachSliderForcedBank(0, control.cc, control.id, (val) => `DCW 1 SUSTAIN: ${getSustainPointNumber(val)}`);
        } else if (control.id === 'dcw-end-point') {
            attachSliderForcedBank(0, control.cc, control.id, (val) => `DCW 1 END: ${getEndPointNumber(val)}`);
        } else if (control.id === 'dcw2-sustain-point') {
            attachSliderForcedBank(1, control.cc, control.id, (val) => `DCW 2 SUSTAIN: ${getSustainPointNumber(val)}`);
        } else if (control.id === 'dcw2-end-point') {
            attachSliderForcedBank(1, control.cc, control.id, (val) => `DCW 2 END: ${getEndPointNumber(val)}`);
        } else if (control.id.startsWith('dcw-rate-') || control.id.startsWith('dcw-level-')) {
            attachSliderForcedBank(0, control.cc, control.id);
        } else if (control.id.startsWith('dcw2-rate-') || control.id.startsWith('dcw2-level-')) {
            attachSliderForcedBank(1, control.cc, control.id);
        } else if (control.id === 'lfo1-wave') {
            attachSlider(control.cc, control.id, (val) => `LFO WAVE: ${getLfo1WaveName(val)}`);
        } else if (control.id === 'detune-note') {
            attachSlider(control.cc, control.id, (val) => `DETUNE: ${getDetuneNoteName(val)}`);
        } else if (control.id === 'detune-oct') {
            attachSlider(control.cc, control.id, (val) => `DETUNE OCT: ${getDetuneOctName(val)}`);
        } else if (control.id === 'detune-polarity') {
            attachSlider(control.cc, control.id, (val) => `DETUNE POL: ${getDetunePolarityName(val)}`);
        } else if (control.id === 'detune-fine') {
            // Re-enabled for testing on index1.html - attach regular slider without special formatting
            if (isTestPage) {
                attachSlider(control.cc, control.id);
            }
            // On index.html (live), skip attaching MIDI send; slider is greyed out
        } else if (['dco1-dcw-keyfollow', 'dco1-dcw-keyfollow-lineoffset', 'dco1-dca-keyfollow', 'dco1-dca-keyfollow-lineoffset'].includes(control.id)) {
            attachSlider(control.cc, control.id, (val) => `KEY FOLLOW: ${val >= 65 ? 'ON' : 'OFF'}`);
        } else {
            attachSlider(control.cc, control.id);
        }
    });

    initVisuals();
}

// --- VISUAL-ONLY INITIALISATION (runs regardless of MIDI availability) ---
function initVisuals() {
    // Add waveform indicator updates
    // Add vibrato wave indicator update
    const vibrWaveIndicator = document.getElementById('vibr-wave-indicator');
    const vibrWaveSlider = document.getElementById('vibrato-wave');
    const vibrWaveImg = document.querySelector('.wav-vibr-icon');
    function updateVibrWaveIndicator(val) {
        if (!vibrWaveIndicator || !vibrWaveImg) return;
        const imgHeight = vibrWaveImg.offsetHeight;
        const zoneHeight = imgHeight / 4;
        const inset = 2;
        let zone;
        if (val <= 42) zone = 3;        // TRI (bottom)
        else if (val <= 84) zone = 2;   // SAW RMP UP
        else if (val <= 126) zone = 1;  // SAW RMP DWN
        else zone = 0;                  // SQR (top)
        vibrWaveIndicator.style.height = (zoneHeight - inset * 2) + 'px';
        vibrWaveIndicator.style.top = (zone * zoneHeight + inset) + 'px';
    }
    if (vibrWaveSlider) {
        vibrWaveSlider.addEventListener('input', (e) => updateVibrWaveIndicator(parseInt(e.target.value)));
        // Wait for image to load before initializing position
        if (vibrWaveImg.complete) {
            updateVibrWaveIndicator(parseInt(vibrWaveSlider.value));
        } else {
            vibrWaveImg.addEventListener('load', () => updateVibrWaveIndicator(parseInt(vibrWaveSlider.value)));
        }
    }

    document.getElementById('dco1-wf1').addEventListener('input', (e) => {
        updateWaveformIndicator(1, parseInt(e.target.value));
    });

    document.getElementById('dco2-wf2').addEventListener('input', (e) => {
        updateWaveformIndicator(2, parseInt(e.target.value));
    });

    document.getElementById('dco1-wf1-lineoffset').addEventListener('input', (e) => {
        updateWaveformIndicator(3, parseInt(e.target.value));
    });

    document.getElementById('dco1-wf2-lineoffset').addEventListener('input', (e) => {
        updateWaveformIndicator(4, parseInt(e.target.value));
    });

    // Add sustain point indicator for PITCH ENV 1
    document.getElementById('pitch-sustain-point').addEventListener('input', (e) => {
        const susValue = parseInt(e.target.value);
        const susNumber = getSustainPointNumber(susValue);
        
        // Remove active class from all pitch1 sustain indicators
        document.querySelectorAll('.pitch1-sustain-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Add active class to the corresponding rate indicator (if sus is 1-7)
        if (susNumber !== '0') {
            const activeIndicator = document.querySelector(`.pitch1-sustain-indicator[data-rate="${susNumber}"]`);
            if (activeIndicator) {
                activeIndicator.classList.add('active');
            }
        }
    });

    // Add end point indicator for PITCH ENV 1
    document.getElementById('pitch-end-point').addEventListener('input', (e) => {
        const endValue = parseInt(e.target.value);
        const endNumber = getPitchEndPointNumber(endValue);
        
        // Remove active class from all pitch1 end indicators
        document.querySelectorAll('.pitch1-end-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Add active class to the corresponding rate indicator (rates 2-8)
        const activeIndicator = document.querySelector(`.pitch1-end-indicator[data-rate="${endNumber}"]`);
        if (activeIndicator) {
            activeIndicator.classList.add('active');
        }
    });

    // Add sustain point indicator for PITCH ENV 2
    document.getElementById('pitch2-sustain-point').addEventListener('input', (e) => {
        const susValue = parseInt(e.target.value);
        const susNumber = getSustainPointNumber(susValue);
        document.querySelectorAll('.pitch2-sustain-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        if (susNumber !== '0') {
            const activeIndicator = document.querySelector(`.pitch2-sustain-indicator[data-rate="${susNumber}"]`);
            if (activeIndicator) activeIndicator.classList.add('active');
        }
    });

    // Add end point indicator for PITCH ENV 2
    document.getElementById('pitch2-end-point').addEventListener('input', (e) => {
        const endValue = parseInt(e.target.value);
        const endNumber = getPitchEndPointNumber(endValue);
        document.querySelectorAll('.pitch2-end-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        const activeIndicator = document.querySelector(`.pitch2-end-indicator[data-rate="${endNumber}"]`);
        if (activeIndicator) activeIndicator.classList.add('active');
    });

    // Add sustain point indicator for DCA ENV 1
    document.getElementById('dca-sustain-point').addEventListener('input', (e) => {
        const susValue = parseInt(e.target.value);
        const susNumber = getSustainPointNumber(susValue);
        document.querySelectorAll('.dca1-sustain-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        if (susNumber !== '0') {
            const activeIndicator = document.querySelector(`.dca1-sustain-indicator[data-rate="${susNumber}"]`);
            if (activeIndicator) activeIndicator.classList.add('active');
        }
    });

    // Add end point indicator for DCA ENV 1
    document.getElementById('dca-end-point').addEventListener('input', (e) => {
        const endValue = parseInt(e.target.value);
        const endNumber = getPitchEndPointNumber(endValue);
        document.querySelectorAll('.dca1-end-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        const activeIndicator = document.querySelector(`.dca1-end-indicator[data-rate="${endNumber}"]`);
        if (activeIndicator) activeIndicator.classList.add('active');
    });

    // Add sustain point indicator for DCA ENV 2
    document.getElementById('dca2-sustain-point').addEventListener('input', (e) => {
        const susValue = parseInt(e.target.value);
        const susNumber = getSustainPointNumber(susValue);
        document.querySelectorAll('.dca2-sustain-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        if (susNumber !== '0') {
            const activeIndicator = document.querySelector(`.dca2-sustain-indicator[data-rate="${susNumber}"]`);
            if (activeIndicator) activeIndicator.classList.add('active');
        }
    });

    // Add end point indicator for DCA ENV 2
    document.getElementById('dca2-end-point').addEventListener('input', (e) => {
        const endValue = parseInt(e.target.value);
        const endNumber = getPitchEndPointNumber(endValue);
        document.querySelectorAll('.dca2-end-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        const activeIndicator = document.querySelector(`.dca2-end-indicator[data-rate="${endNumber}"]`);
        if (activeIndicator) activeIndicator.classList.add('active');
    });

    // Add sustain point indicator for DCW ENV 1
    document.getElementById('dcw-sustain-point').addEventListener('input', (e) => {
        const susValue = parseInt(e.target.value);
        const susNumber = getSustainPointNumber(susValue);
        
        // Remove active class from all dcw1 sustain indicators
        document.querySelectorAll('.dcw1-sustain-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Add active class to the corresponding rate indicator (if sus is 1-7)
        if (susNumber !== '0') {
            const activeIndicator = document.querySelector(`.dcw1-sustain-indicator[data-rate="${susNumber}"]`);
            if (activeIndicator) {
                activeIndicator.classList.add('active');
            }
        }
    });

    // Add end point indicator for DCW ENV 1
    document.getElementById('dcw-end-point').addEventListener('input', (e) => {
        const endValue = parseInt(e.target.value);
        const endNumber = getPitchEndPointNumber(endValue);
        
        // Remove active class from all dcw1 end indicators
        document.querySelectorAll('.dcw1-end-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        
        // Add active class to the corresponding rate indicator (rates 2-8)
        const activeIndicator = document.querySelector(`.dcw1-end-indicator[data-rate="${endNumber}"]`);
        if (activeIndicator) {
            activeIndicator.classList.add('active');
        }
    });

    // Add sustain point indicator for DCW ENV 2
    document.getElementById('dcw2-sustain-point').addEventListener('input', (e) => {
        const susValue = parseInt(e.target.value);
        const susNumber = getSustainPointNumber(susValue);
        document.querySelectorAll('.dcw2-sustain-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        if (susNumber !== '0') {
            const activeIndicator = document.querySelector(`.dcw2-sustain-indicator[data-rate="${susNumber}"]`);
            if (activeIndicator) activeIndicator.classList.add('active');
        }
    });

    // Add end point indicator for DCW ENV 2
    document.getElementById('dcw2-end-point').addEventListener('input', (e) => {
        const endValue = parseInt(e.target.value);
        const endNumber = getPitchEndPointNumber(endValue);
        document.querySelectorAll('.dcw2-end-indicator').forEach(indicator => {
            indicator.classList.remove('active');
        });
        const activeIndicator = document.querySelector(`.dcw2-end-indicator[data-rate="${endNumber}"]`);
        if (activeIndicator) activeIndicator.classList.add('active');
    });

    // Add LFO1 wave indicator update
    const lfo1WaveIndicator = document.getElementById('lfo1-wave-indicator');
    const lfo1WaveSlider = document.getElementById('lfo1-wave');
    const lfo1WaveImg = document.querySelector('.wav-lfo1-icon');
    function updateLfo1WaveIndicator(val) {
        if (!lfo1WaveIndicator || !lfo1WaveImg) return;
        const imgHeight = lfo1WaveImg.offsetHeight;
        const zoneHeight = imgHeight / 5;
        const inset = 2;
        let zone;
        if (val <= 25) zone = 4;        // TRI (bottom)
        else if (val <= 50) zone = 3;   // SQR
        else if (val <= 76) zone = 2;   // SAW
        else if (val <= 101) zone = 1;  // RMP
        else zone = 0;                  // S&H (top)
        lfo1WaveIndicator.style.height = (zoneHeight - inset * 2) + 'px';
        lfo1WaveIndicator.style.top = (zone * zoneHeight + inset) + 'px';
    }
    if (lfo1WaveSlider) {
        lfo1WaveSlider.addEventListener('input', (e) => updateLfo1WaveIndicator(parseInt(e.target.value)));
        if (lfo1WaveImg.complete) {
            updateLfo1WaveIndicator(parseInt(lfo1WaveSlider.value));
        } else {
            lfo1WaveImg.addEventListener('load', () => updateLfo1WaveIndicator(parseInt(lfo1WaveSlider.value)));
        }
    }

    // Initialize pot controls
    initPotControls();

    // Initialize key follow toggle buttons
    initKeyFollowButtons();

    // Initialize line select indicator circles
    initLineIndicator();

    // Initialize detune polarity LED indicators
    initDetunePolarityIndicator();

    document.getElementById('init-patch-button')?.addEventListener('click', initPatch);
    document.getElementById('random-patch-button')?.addEventListener('click', randomPatch);
    document.getElementById('preset-patch-button')?.addEventListener('click', cyclePreset);
    document.getElementById('bass-patch-button')?.addEventListener('click', () => applyPreset(BASS_PRESET));
    document.getElementById('string-patch-button')?.addEventListener('click', () => applyPreset(STRING_PRESET));
    document.getElementById('organ-patch-button')?.addEventListener('click', () => applyPreset(ORGAN_PRESET));
    document.getElementById('sine-patch-button')?.addEventListener('click', () => applyPreset(SINE_PRESET));
}

// --- DETUNE POLARITY LED INDICATOR INITIALIZATION ---
function initDetunePolarityIndicator() {
    const slider = document.getElementById('detune-polarity');
    const leds = document.querySelectorAll('.pol-indicator-leds .circle');

    if (!slider || leds.length === 0) return;

    const updateIndicator = () => {
        const value = parseInt(slider.value);
        leds.forEach(led => {
            const ledValue = parseInt(led.getAttribute('data-value'));
            const shouldBeActive = (ledValue === 0 && value <= 64) || (ledValue === 65 && value >= 65);
            if (shouldBeActive) led.classList.add('active');
            else led.classList.remove('active');
        });
    };

    leds.forEach((led, i) => {
        led.addEventListener('click', () => {
            slider.value = i === 0 ? 0 : 65;
            slider.dispatchEvent(new Event('input'));
        });
    });

    updateIndicator();
    slider.addEventListener('input', updateIndicator);
}

// --- LINE SELECT INDICATOR INITIALIZATION ---
function initLineIndicator() {
    const lineSelect = document.getElementById('line-select');
    const circles = document.querySelectorAll('.line-indicator-circles .circle');
    
    if (!lineSelect || circles.length === 0) return;
    
    // Map circle data-values to exact slider snap values
    const snapValues = [0, 43, 85, 127];

    // Function to update active circle
    const updateIndicator = () => {
        const value = parseInt(lineSelect.value);
        circles.forEach(circle => {
            const circleValue = parseInt(circle.getAttribute('data-value'));
            
            // Determine which circle should be active based on value ranges
            let shouldBeActive = false;
            if (circleValue === 0 && value >= 0 && value <= 42) shouldBeActive = true;
            else if (circleValue === 42 && value >= 43 && value <= 84) shouldBeActive = true;
            else if (circleValue === 85 && value >= 85 && value <= 126) shouldBeActive = true;
            else if (circleValue === 127 && value === 127) shouldBeActive = true;

            if (shouldBeActive) {
                circle.classList.add('active');
            } else {
                circle.classList.remove('active');
            }
        });

        // Update DCO 1 heading based on line select position
        const dco1Heading = document.getElementById('dco1-heading');
        const dco1Inactive = value >= 43 && value <= 84;
        const line1Headings = [
            dco1Heading,
            document.getElementById('pitch-env1-heading'),
            document.getElementById('dcw-env1-heading'),
            document.getElementById('dca-env1-heading'),
        ];
        line1Headings.forEach(el => {
            if (el) {
                if (dco1Inactive) {
                    el.classList.add('module-inactive');
                } else {
                    el.classList.remove('module-inactive');
                }
            }
        });

        // Update DCO 2 headings — active for positions 2 (43-84) and 1+2 (85-126), inactive for 1 (0-42) and 1+1 (127)
        const dco2Inactive = value <= 42 || value === 127;
        const line2Headings = [
            document.getElementById('dco2-heading'),
            document.getElementById('pitch-env2-heading'),
            document.getElementById('dcw-env2-heading'),
            document.getElementById('dca-env2-heading'),
        ];
        line2Headings.forEach(el => {
            if (el) {
                if (dco2Inactive) {
                    el.classList.add('module-inactive');
                } else {
                    el.classList.remove('module-inactive');
                }
            }
        });

        // Update DETUNE heading — active for 1+2 (85-126) and 1+1 (127), inactive for 1 (0-42) and 2 (43-84)
        const detuneHeading = document.getElementById('detune-heading');
        if (detuneHeading) {
            if (value <= 84) {
                detuneHeading.classList.add('module-inactive');
            } else {
                detuneHeading.classList.remove('module-inactive');
            }
        }
    };
    
    // Make each circle clickable — snaps slider to its value
    circles.forEach((circle, i) => {
        circle.addEventListener('click', () => {
            const snapVal = snapValues[i];
            lineSelect.value = snapVal;
            lineSelect.dispatchEvent(new Event('input'));
        });
    });

    // Update on page load
    updateIndicator();
    
    // Update on slider change
    lineSelect.addEventListener('input', updateIndicator);
}

// --- KEY FOLLOW CHECKBOX INITIALIZATION ---
function initKeyFollowButtons() {
    const kfIds = [
        'dco1-dcw-keyfollow',
        'dco1-dcw-keyfollow-lineoffset',
        'dco1-dca-keyfollow',
        'dco1-dca-keyfollow-lineoffset'
    ];

    kfIds.forEach(id => {
        const input = document.getElementById(id);
        const checkbox = document.querySelector(`.keyfollow-checkbox[data-input="${id}"]`);
        if (!input || !checkbox) return;

        checkbox.checked = parseInt(input.value) >= 65;

        checkbox.addEventListener('change', () => {
            input.value = checkbox.checked ? 127 : 0;
            input.dispatchEvent(new Event('input'));
        });
    });
}

// --- POT CONTROL INITIALIZATION ---
function initPotControls() {
    const potControls = document.querySelectorAll('.pot-control');
    
    potControls.forEach(potControl => {
        const input = potControl.querySelector('input[type="range"]');
        const knob = potControl.querySelector('.pot-knob');
        const valueDisplay = potControl.querySelector('.pot-value');
        
        if (!input || !knob) return;
        
        // Function to update pot rotation and value display
        const updatePot = () => {
            const value = parseInt(input.value);
            const min = parseInt(input.min);
            const max = parseInt(input.max);
            
            // Calculate rotation (270 degrees range: -135 to +135)
            const percent = (value - min) / (max - min);
            const rotation = (percent * 270) - 135;
            
            knob.style.transform = `rotate(${rotation}deg)`;
            if (valueDisplay) {
                valueDisplay.textContent = value;
            }
        };
        
        // Initialize pot position
        updatePot();
        
        // Update on input change
        input.addEventListener('input', updatePot);
    });
}

// --- MIDI UTILITIES ---
function populateOutputDevices(midiAccess) {
    const select = document.getElementById('midi-output-select');
    const currentId = select.value;
    select.innerHTML = '';
    if (midiAccess.outputs.size === 0) {
        select.innerHTML = '<option value="">-- No Devices --</option>';
        return;
    }
    midiAccess.outputs.forEach(output => {
        const opt = new Option(output.name, output.id);
        if (output.id === currentId || output.name.includes("CZ-1") || output.name.includes("CZ1")) {
            opt.selected = true;
        }
        select.add(opt);
    });
    connectToSelectedOutput(select.value, midiAccess);
}

function connectToSelectedOutput(portId, midiAccess) {
    midiOutput = portId ? midiAccess.outputs.get(portId) : null;
}

function sendMidiCC(cc, val) {
    // Console log FINE TUNE slider values for debugging with Behringer support
    if (cc === CC_DETUNE_FINE) {
        console.log(`FINE TUNE: CC${cc} = ${val}`);
    }
    if (midiOutput && !sendMidiCC._suppress) midiOutput.send([0xB0, cc, val]);
}

// Determine which bank a control needs (1 for ENV 2/DCO 2 line-offset params, 0 otherwise)
function getControlBank(id) {
    if (id.startsWith('dca2-') || id.startsWith('pitch2-') || id.startsWith('dcw2-')) return 1;
    return 0;
}

function sendPatchSequentially(controls, getValueFn) {
    let currentBank = -1;
    let i = 0;
    const DELAY = 10; // ms between messages

    function sendNext() {
        if (i >= controls.length) {
            // Restore bank to match current line select
            const lineSelectEl = document.getElementById('line-select');
            if (lineSelectEl) {
                const lineVal = parseInt(lineSelectEl.value);
                const restoredBank = (lineVal >= 43 && lineVal <= 84) ? 1 : 0;
                sendMidiCC(CC_BANK_SELECT, restoredBank);
            }
            return;
        }
        const p = controls[i];
        const el = document.getElementById(p.id);
        if (!el) { i++; sendNext(); return; }

        const val = getValueFn(p, el);
        el.value = val;
        // Update visual indicators without triggering MIDI sends from event listeners
        sendMidiCC._suppress = true;
        el.dispatchEvent(new Event('input'));
        sendMidiCC._suppress = false;

        const neededBank = getControlBank(p.id);
        if (neededBank !== currentBank) {
            sendMidiCC(CC_BANK_SELECT, neededBank);
            currentBank = neededBank;
        }

        sendMidiCC(p.cc, val);
        i++;
        setTimeout(sendNext, DELAY);
    }

    sendNext();
}

function initPatch() {
    sendPatchSequentially(ALL_PATCH_CONTROLS, (p) => p.value);
    clearPresetDisplay();
    restoreDeviceName();
}

function randomPatch() {
    sendPatchSequentially(ALL_PATCH_CONTROLS, (p, el) => {
        // Keep detune-fine at 0 to avoid potential hardware issues
        if (p.id === 'detune-fine') {
            return 0;
        }
        const max = parseInt(el.max) || 127;
        return Math.floor(Math.random() * (max + 1));
    });
    clearPresetDisplay();
    restoreDeviceName();
}

// --- PRESETS ---
const PRESETS = [
    {
        name: 'SYNTH',
        params: {
            'dco1-wf1': 0,
            'dco2-wf2': 91,
            'dco1-dcw': 11,
            'line-select': 0,
            'vibrato-wave': 0,
            'vibrato-rate': 66,
            'vibrato-sync': 0,
            'vibrato-sync-rate': 0,
            'vibrato-depth': 0,
            'vibrato-delay': 0,
            'detune-polarity': 0,
            'detune-oct': 0,
            'detune-note': 0,
            'dco1-wf1-lineoffset': 0,
            'dco1-wf2-lineoffset': 0,
            'dco1-dcw-lineoffset': 0,
            'dco1-dcw-keyfollow': 0,
            'dco1-dcw-keyfollow-range': 0,
            'dco1-dcw-keyfollow-lineoffset': 0,
            'dco1-dcw-keyfollow-range-lineoffset': 0,
            'dco1-dca-keyfollow': 0,
            'dco1-dca-keyfollow-range': 0,
            'dco1-dca-keyfollow-lineoffset': 0,
            'dco1-dca-keyfollow-range-lineoffset': 0,
            'dca-sustain-point': 37,
            'dca-end-point': 43,
            'dca-level-1': 127,
            'dca-level-2': 49,
            'dca-level-3': 90,
            'dca-level-4': 41,
            'dca-level-5': 0,
            'dca-level-6': 0,
            'dca-level-7': 0,
            'dca-level-8': 0,
            'dca-rate-1': 77,
            'dca-rate-2': 34,
            'dca-rate-3': 88,
            'dca-rate-4': 44,
            'dca-rate-5': 0,
            'dca-rate-6': 0,
            'dca-rate-7': 0,
            'dca-rate-8': 0,
            'dca2-sustain-point': 0,
            'dca2-end-point': 0,
            'dca2-level-1': 0,
            'dca2-level-2': 0,
            'dca2-level-3': 0,
            'dca2-level-4': 0,
            'dca2-level-5': 0,
            'dca2-level-6': 0,
            'dca2-level-7': 0,
            'dca2-level-8': 0,
            'dca2-rate-1': 0,
            'dca2-rate-2': 0,
            'dca2-rate-3': 0,
            'dca2-rate-4': 0,
            'dca2-rate-5': 0,
            'dca2-rate-6': 0,
            'dca2-rate-7': 0,
            'dca2-rate-8': 0,
            'pitch-sustain-point': 0,
            'pitch-end-point': 0,
            'pitch-level-1': 0,
            'pitch-level-2': 0,
            'pitch-level-3': 0,
            'pitch-level-4': 0,
            'pitch-level-5': 0,
            'pitch-level-6': 0,
            'pitch-level-7': 0,
            'pitch-level-8': 0,
            'pitch-rate-1': 55,
            'pitch-rate-2': 0,
            'pitch-rate-3': 0,
            'pitch-rate-4': 0,
            'pitch-rate-5': 0,
            'pitch-rate-6': 0,
            'pitch-rate-7': 0,
            'pitch-rate-8': 0,
            'pitch2-sustain-point': 0,
            'pitch2-end-point': 0,
            'pitch2-level-1': 0,
            'pitch2-level-2': 0,
            'pitch2-level-3': 0,
            'pitch2-level-4': 0,
            'pitch2-level-5': 0,
            'pitch2-level-6': 0,
            'pitch2-level-7': 0,
            'pitch2-level-8': 0,
            'pitch2-rate-1': 0,
            'pitch2-rate-2': 0,
            'pitch2-rate-3': 0,
            'pitch2-rate-4': 0,
            'pitch2-rate-5': 0,
            'pitch2-rate-6': 0,
            'pitch2-rate-7': 0,
            'pitch2-rate-8': 0,
            'dcw-sustain-point': 55,
            'dcw-end-point': 43,
            'dcw-level-1': 85,
            'dcw-level-2': 54,
            'dcw-level-3': 29,
            'dcw-level-4': 0,
            'dcw-level-5': 0,
            'dcw-level-6': 0,
            'dcw-level-7': 0,
            'dcw-level-8': 0,
            'dcw-rate-1': 30,
            'dcw-rate-2': 22,
            'dcw-rate-3': 20,
            'dcw-rate-4': 27,
            'dcw-rate-5': 0,
            'dcw-rate-6': 0,
            'dcw-rate-7': 0,
            'dcw-rate-8': 0,
            'dcw2-sustain-point': 0,
            'dcw2-end-point': 0,
            'dcw2-level-1': 0,
            'dcw2-level-2': 0,
            'dcw2-level-3': 0,
            'dcw2-level-4': 0,
            'dcw2-level-5': 0,
            'dcw2-level-6': 0,
            'dcw2-level-7': 0,
            'dcw2-level-8': 0,
            'dcw2-rate-1': 0,
            'dcw2-rate-2': 0,
            'dcw2-rate-3': 0,
            'dcw2-rate-4': 0,
            'dcw2-rate-5': 0,
            'dcw2-rate-6': 0,
            'dcw2-rate-7': 0,
            'dcw2-rate-8': 0,
            'lfo1-wave': 0,
            'lfo1-amount': 7,
            'lfo1-rate': 5,
            'filter-attack': 93,
            'filter-decay': 52,
            'filter-sustain': 57,
            'filter-release': 65,
            'filter-cutoff': 56,
            'filter-resonance': 97,
            'filter-env-amount': 31,
            'chorus-rate': 0,
            'chorus-depth': 0
        }
    }
];

let currentPresetIndex = -1;

function clearPresetDisplay() {
    currentPresetIndex = -1;
}

function restoreDeviceName() {
    const statusElement = document.getElementById('midi-output-select');
    if (statusElement && statusElement.options[statusElement.selectedIndex]) {
        statusElement.options[statusElement.selectedIndex].textContent = originalMidiStatusText;
    }
}

function applyPreset(preset) {
    const presetValues = preset.params;
    sendPatchSequentially(ALL_PATCH_CONTROLS, (p) => {
        return Object.prototype.hasOwnProperty.call(presetValues, p.id) ? presetValues[p.id] : 0;
    });
    const statusElement = document.getElementById('midi-output-select');
    if (statusElement && statusElement.options[statusElement.selectedIndex]) {
        originalMidiStatusText = preset.name;
        statusElement.options[statusElement.selectedIndex].textContent = preset.name;
    }
}

function cyclePreset() {
    currentPresetIndex = (currentPresetIndex + 1) % PRESETS.length;
    applyPreset(PRESETS[currentPresetIndex]);
}

const STRING_PRESET = {
    name: 'STRING',
    params: {
        'dco1-wf1': 0,
        'dco2-wf2': 55,
        'dco1-dcw': 42,
        'line-select': 85,
        'vibrato-wave': 0,
        'vibrato-rate': 61,
        'vibrato-sync': 0,
        'vibrato-sync-rate': 0,
        'vibrato-depth': 11,
        'vibrato-delay': 11,
        'detune-polarity': 0,
        'detune-oct': 43,
        'detune-note': 0,
        'dco1-wf1-lineoffset': 0,
        'dco1-wf2-lineoffset': 0,
        'dco1-dcw-lineoffset': 0,
        'dco1-dcw-keyfollow': 0,
        'dco1-dcw-keyfollow-range': 0,
        'dco1-dcw-keyfollow-lineoffset': 0,
        'dco1-dcw-keyfollow-range-lineoffset': 0,
        'dco1-dca-keyfollow': 0,
        'dco1-dca-keyfollow-range': 0,
        'dco1-dca-keyfollow-lineoffset': 0,
        'dco1-dca-keyfollow-range-lineoffset': 0,
        'dca-sustain-point': 19,
        'dca-end-point': 0,
        'dca-level-1': 115,
        'dca-level-2': 89,
        'dca-level-3': 0,
        'dca-level-4': 0,
        'dca-level-5': 0,
        'dca-level-6': 0,
        'dca-level-7': 0,
        'dca-level-8': 0,
        'dca-rate-1': 47,
        'dca-rate-2': 41,
        'dca-rate-3': 0,
        'dca-rate-4': 0,
        'dca-rate-5': 0,
        'dca-rate-6': 0,
        'dca-rate-7': 0,
        'dca-rate-8': 0,
        'dca2-sustain-point': 0,
        'dca2-end-point': 0,
        'dca2-level-1': 0,
        'dca2-level-2': 0,
        'dca2-level-3': 0,
        'dca2-level-4': 0,
        'dca2-level-5': 0,
        'dca2-level-6': 0,
        'dca2-level-7': 0,
        'dca2-level-8': 0,
        'dca2-rate-1': 0,
        'dca2-rate-2': 0,
        'dca2-rate-3': 0,
        'dca2-rate-4': 0,
        'dca2-rate-5': 0,
        'dca2-rate-6': 0,
        'dca2-rate-7': 0,
        'dca2-rate-8': 0,
        'pitch-sustain-point': 19,
        'pitch-end-point': 0,
        'pitch-level-1': 0,
        'pitch-level-2': 0,
        'pitch-level-3': 0,
        'pitch-level-4': 0,
        'pitch-level-5': 0,
        'pitch-level-6': 0,
        'pitch-level-7': 0,
        'pitch-level-8': 0,
        'pitch-rate-1': 60,
        'pitch-rate-2': 0,
        'pitch-rate-3': 0,
        'pitch-rate-4': 0,
        'pitch-rate-5': 0,
        'pitch-rate-6': 0,
        'pitch-rate-7': 0,
        'pitch-rate-8': 0,
        'pitch2-sustain-point': 0,
        'pitch2-end-point': 0,
        'pitch2-level-1': 0,
        'pitch2-level-2': 0,
        'pitch2-level-3': 0,
        'pitch2-level-4': 0,
        'pitch2-level-5': 0,
        'pitch2-level-6': 0,
        'pitch2-level-7': 0,
        'pitch2-level-8': 0,
        'pitch2-rate-1': 0,
        'pitch2-rate-2': 0,
        'pitch2-rate-3': 0,
        'pitch2-rate-4': 0,
        'pitch2-rate-5': 0,
        'pitch2-rate-6': 0,
        'pitch2-rate-7': 0,
        'pitch2-rate-8': 0,
        'dcw-sustain-point': 55,
        'dcw-end-point': 43,
        'dcw-level-1': 127,
        'dcw-level-2': 113,
        'dcw-level-3': 121,
        'dcw-level-4': 0,
        'dcw-level-5': 0,
        'dcw-level-6': 0,
        'dcw-level-7': 0,
        'dcw-level-8': 0,
        'dcw-rate-1': 127,
        'dcw-rate-2': 99,
        'dcw-rate-3': 30,
        'dcw-rate-4': 50,
        'dcw-rate-5': 0,
        'dcw-rate-6': 0,
        'dcw-rate-7': 0,
        'dcw-rate-8': 0,
        'dcw2-sustain-point': 0,
        'dcw2-end-point': 0,
        'dcw2-level-1': 0,
        'dcw2-level-2': 0,
        'dcw2-level-3': 0,
        'dcw2-level-4': 0,
        'dcw2-level-5': 0,
        'dcw2-level-6': 0,
        'dcw2-level-7': 0,
        'dcw2-level-8': 0,
        'dcw2-rate-1': 0,
        'dcw2-rate-2': 0,
        'dcw2-rate-3': 0,
        'dcw2-rate-4': 0,
        'dcw2-rate-5': 0,
        'dcw2-rate-6': 0,
        'dcw2-rate-7': 0,
        'dcw2-rate-8': 0,
        'lfo1-wave': 0,
        'lfo1-amount': 0,
        'lfo1-rate': 0,
        'filter-attack': 77,
        'filter-decay': 69,
        'filter-sustain': 64,
        'filter-release': 115,
        'filter-cutoff': 73,
        'filter-resonance': 65,
        'filter-env-amount': 37,
        'chorus-rate': 19,
        'chorus-depth': 33
    }
};

const ORGAN_PRESET = {
    name: 'ORGAN',
    params: {
        'dco1-wf1': 55,
        'dco2-wf2': 73,
        'dco1-dcw': 14,
        'line-select': 85,
        'vibrato-wave': 0,
        'vibrato-rate': 79,
        'vibrato-sync': 0,
        'vibrato-sync-rate': 0,
        'vibrato-depth': 39,
        'vibrato-delay': 47,
        'detune-polarity': 0,
        'detune-oct': 43,
        'detune-note': 0,
        'dco1-wf1-lineoffset': 55,
        'dco1-wf2-lineoffset': 73,
        'dco1-dcw-lineoffset': 0,
        'dco1-dcw-keyfollow': 65,
        'dco1-dcw-keyfollow-range': 80,
        'dco1-dcw-keyfollow-lineoffset': 65,
        'dco1-dcw-keyfollow-range-lineoffset': 80,
        'dco1-dca-keyfollow': 0,
        'dco1-dca-keyfollow-range': 0,
        'dco1-dca-keyfollow-lineoffset': 0,
        'dco1-dca-keyfollow-range-lineoffset': 0,
        'dca-sustain-point': 19,
        'dca-end-point': 73,
        'dca-level-1': 127,
        'dca-level-2': 0,
        'dca-level-3': 0,
        'dca-level-4': 0,
        'dca-level-5': 0,
        'dca-level-6': 0,
        'dca-level-7': 0,
        'dca-level-8': 0,
        'dca-rate-1': 104,
        'dca-rate-2': 61,
        'dca-rate-3': 0,
        'dca-rate-4': 0,
        'dca-rate-5': 0,
        'dca-rate-6': 0,
        'dca-rate-7': 0,
        'dca-rate-8': 0,
        'dca2-sustain-point': 19,
        'dca2-end-point': 55,
        'dca2-level-1': 127,
        'dca2-level-2': 98,
        'dca2-level-3': 0,
        'dca2-level-4': 0,
        'dca2-level-5': 0,
        'dca2-level-6': 0,
        'dca2-level-7': 0,
        'dca2-level-8': 0,
        'dca2-rate-1': 96,
        'dca2-rate-2': 79,
        'dca2-rate-3': 40,
        'dca2-rate-4': 0,
        'dca2-rate-5': 0,
        'dca2-rate-6': 0,
        'dca2-rate-7': 0,
        'dca2-rate-8': 0,
        'pitch-sustain-point': 19,
        'pitch-end-point': 0,
        'pitch-level-1': 0,
        'pitch-level-2': 0,
        'pitch-level-3': 0,
        'pitch-level-4': 0,
        'pitch-level-5': 0,
        'pitch-level-6': 0,
        'pitch-level-7': 0,
        'pitch-level-8': 0,
        'pitch-rate-1': 13,
        'pitch-rate-2': 5,
        'pitch-rate-3': 0,
        'pitch-rate-4': 0,
        'pitch-rate-5': 0,
        'pitch-rate-6': 0,
        'pitch-rate-7': 0,
        'pitch-rate-8': 0,
        'pitch2-sustain-point': 19,
        'pitch2-end-point': 0,
        'pitch2-level-1': 0,
        'pitch2-level-2': 0,
        'pitch2-level-3': 0,
        'pitch2-level-4': 0,
        'pitch2-level-5': 0,
        'pitch2-level-6': 0,
        'pitch2-level-7': 0,
        'pitch2-level-8': 0,
        'pitch2-rate-1': 25,
        'pitch2-rate-2': 17,
        'pitch2-rate-3': 0,
        'pitch2-rate-4': 0,
        'pitch2-rate-5': 0,
        'pitch2-rate-6': 0,
        'pitch2-rate-7': 0,
        'pitch2-rate-8': 0,
        'dcw-sustain-point': 19,
        'dcw-end-point': 43,
        'dcw-level-1': 30,
        'dcw-level-2': 81,
        'dcw-level-3': 0,
        'dcw-level-4': 0,
        'dcw-level-5': 0,
        'dcw-level-6': 0,
        'dcw-level-7': 0,
        'dcw-level-8': 0,
        'dcw-rate-1': 19,
        'dcw-rate-2': 11,
        'dcw-rate-3': 0,
        'dcw-rate-4': 0,
        'dcw-rate-5': 0,
        'dcw-rate-6': 0,
        'dcw-rate-7': 0,
        'dcw-rate-8': 0,
        'dcw2-sustain-point': 19,
        'dcw2-end-point': 0,
        'dcw2-level-1': 32,
        'dcw2-level-2': 0,
        'dcw2-level-3': 0,
        'dcw2-level-4': 0,
        'dcw2-level-5': 0,
        'dcw2-level-6': 0,
        'dcw2-level-7': 0,
        'dcw2-level-8': 0,
        'dcw2-rate-1': 21,
        'dcw2-rate-2': 17,
        'dcw2-rate-3': 0,
        'dcw2-rate-4': 0,
        'dcw2-rate-5': 0,
        'dcw2-rate-6': 0,
        'dcw2-rate-7': 0,
        'dcw2-rate-8': 0,
        'lfo1-wave': 0,
        'lfo1-amount': 0,
        'lfo1-rate': 0,
        'filter-attack': 0,
        'filter-decay': 0,
        'filter-sustain': 127,
        'filter-release': 0,
        'filter-cutoff': 127,
        'filter-resonance': 0,
        'filter-env-amount': 0,
        'chorus-rate': 29,
        'chorus-depth': 59
    }
};

const SINE_PRESET = {
    name: 'SINE',
    params: {
        'dco1-wf1': 0,
        'dco2-wf2': 0,
        'dco1-dcw': 0,
        'line-select': 127,
        'vibrato-wave': 0,
        'vibrato-rate': 0,
        'vibrato-sync': 0,
        'vibrato-sync-rate': 0,
        'vibrato-depth': 0,
        'vibrato-delay': 0,
        'detune-polarity': 0,
        'detune-oct': 85,
        'detune-note': 0,
        'dco1-wf1-lineoffset': 0,
        'dco1-wf2-lineoffset': 0,
        'dco1-dcw-lineoffset': 0,
        'dco1-dcw-keyfollow': 0,
        'dco1-dcw-keyfollow-range': 0,
        'dco1-dcw-keyfollow-lineoffset': 0,
        'dco1-dcw-keyfollow-range-lineoffset': 0,
        'dco1-dca-keyfollow': 0,
        'dco1-dca-keyfollow-range': 0,
        'dco1-dca-keyfollow-lineoffset': 0,
        'dco1-dca-keyfollow-range-lineoffset': 0,
        'dca-sustain-point': 37,
        'dca-end-point': 22,
        'dca-level-1': 120,
        'dca-level-2': 80,
        'dca-level-3': 0,
        'dca-level-4': 0,
        'dca-level-5': 0,
        'dca-level-6': 0,
        'dca-level-7': 0,
        'dca-level-8': 0,
        'dca-rate-1': 50,
        'dca-rate-2': 26,
        'dca-rate-3': 40,
        'dca-rate-4': 0,
        'dca-rate-5': 0,
        'dca-rate-6': 0,
        'dca-rate-7': 0,
        'dca-rate-8': 0,
        'dca2-sustain-point': 0,
        'dca2-end-point': 0,
        'dca2-level-1': 0,
        'dca2-level-2': 0,
        'dca2-level-3': 0,
        'dca2-level-4': 0,
        'dca2-level-5': 0,
        'dca2-level-6': 0,
        'dca2-level-7': 0,
        'dca2-level-8': 0,
        'dca2-rate-1': 0,
        'dca2-rate-2': 0,
        'dca2-rate-3': 0,
        'dca2-rate-4': 0,
        'dca2-rate-5': 0,
        'dca2-rate-6': 0,
        'dca2-rate-7': 0,
        'dca2-rate-8': 0,
        'pitch-sustain-point': 19,
        'pitch-end-point': 0,
        'pitch-level-1': 0,
        'pitch-level-2': 0,
        'pitch-level-3': 0,
        'pitch-level-4': 0,
        'pitch-level-5': 0,
        'pitch-level-6': 0,
        'pitch-level-7': 0,
        'pitch-level-8': 0,
        'pitch-rate-1': 60,
        'pitch-rate-2': 0,
        'pitch-rate-3': 0,
        'pitch-rate-4': 0,
        'pitch-rate-5': 0,
        'pitch-rate-6': 0,
        'pitch-rate-7': 0,
        'pitch-rate-8': 0,
        'pitch2-sustain-point': 0,
        'pitch2-end-point': 0,
        'pitch2-level-1': 0,
        'pitch2-level-2': 0,
        'pitch2-level-3': 0,
        'pitch2-level-4': 0,
        'pitch2-level-5': 0,
        'pitch2-level-6': 0,
        'pitch2-level-7': 0,
        'pitch2-level-8': 0,
        'pitch2-rate-1': 0,
        'pitch2-rate-2': 0,
        'pitch2-rate-3': 0,
        'pitch2-rate-4': 0,
        'pitch2-rate-5': 0,
        'pitch2-rate-6': 0,
        'pitch2-rate-7': 0,
        'pitch2-rate-8': 0,
        'dcw-sustain-point': 19,
        'dcw-end-point': 0,
        'dcw-level-1': 0,
        'dcw-level-2': 0,
        'dcw-level-3': 0,
        'dcw-level-4': 0,
        'dcw-level-5': 0,
        'dcw-level-6': 0,
        'dcw-level-7': 0,
        'dcw-level-8': 0,
        'dcw-rate-1': 99,
        'dcw-rate-2': 0,
        'dcw-rate-3': 0,
        'dcw-rate-4': 0,
        'dcw-rate-5': 0,
        'dcw-rate-6': 0,
        'dcw-rate-7': 0,
        'dcw-rate-8': 0,
        'dcw2-sustain-point': 0,
        'dcw2-end-point': 0,
        'dcw2-level-1': 0,
        'dcw2-level-2': 0,
        'dcw2-level-3': 0,
        'dcw2-level-4': 0,
        'dcw2-level-5': 0,
        'dcw2-level-6': 0,
        'dcw2-level-7': 0,
        'dcw2-level-8': 0,
        'dcw2-rate-1': 0,
        'dcw2-rate-2': 0,
        'dcw2-rate-3': 0,
        'dcw2-rate-4': 0,
        'dcw2-rate-5': 0,
        'dcw2-rate-6': 0,
        'dcw2-rate-7': 0,
        'dcw2-rate-8': 0,
        'lfo1-wave': 0,
        'lfo1-amount': 0,
        'lfo1-rate': 0,
        'filter-attack': 0,
        'filter-decay': 0,
        'filter-sustain': 127,
        'filter-release': 0,
        'filter-cutoff': 127,
        'filter-resonance': 0,
        'filter-env-amount': 0,
        'chorus-rate': 0,
        'chorus-depth': 0
    }
};

const BASS_PRESET = {
    name: 'BASS',
    params: {
        'dco1-wf1': 37,
        'dco2-wf2': 55,
        'dco1-dcw': 0,
        'line-select': 0,
        'vibrato-wave': 0,
        'vibrato-rate': 65,
        'vibrato-sync': 29,
        'vibrato-sync-rate': 0,
        'vibrato-depth': 0,
        'vibrato-delay': 55,
        'detune-polarity': 0,
        'detune-oct': 0,
        'detune-note': 0,
        'dco1-wf1-lineoffset': 0,
        'dco1-wf2-lineoffset': 0,
        'dco1-dcw-lineoffset': 65,
        'dco1-dcw-keyfollow': 100,
        'dco1-dcw-keyfollow-range': 0,
        'dco1-dcw-keyfollow-lineoffset': 0,
        'dco1-dcw-keyfollow-range-lineoffset': 0,
        'dco1-dca-keyfollow': 127,
        'dco1-dca-keyfollow-range': 100,
        'dco1-dca-keyfollow-lineoffset': 0,
        'dco1-dca-keyfollow-range-lineoffset': 0,
        'dca-sustain-point': 37,
        'dca-end-point': 22,
        'dca-level-1': 127,
        'dca-level-2': 0,
        'dca-level-3': 0,
        'dca-level-4': 0,
        'dca-level-5': 0,
        'dca-level-6': 0,
        'dca-level-7': 0,
        'dca-level-8': 0,
        'dca-rate-1': 127,
        'dca-rate-2': 44,
        'dca-rate-3': 59,
        'dca-rate-4': 0,
        'dca-rate-5': 0,
        'dca-rate-6': 0,
        'dca-rate-7': 0,
        'dca-rate-8': 0,
        'dca2-sustain-point': 0,
        'dca2-end-point': 0,
        'dca2-level-1': 0,
        'dca2-level-2': 0,
        'dca2-level-3': 0,
        'dca2-level-4': 0,
        'dca2-level-5': 0,
        'dca2-level-6': 0,
        'dca2-level-7': 0,
        'dca2-level-8': 0,
        'dca2-rate-1': 0,
        'dca2-rate-2': 0,
        'dca2-rate-3': 0,
        'dca2-rate-4': 0,
        'dca2-rate-5': 0,
        'dca2-rate-6': 0,
        'dca2-rate-7': 0,
        'dca2-rate-8': 0,
        'pitch-sustain-point': 0,
        'pitch-end-point': 0,
        'pitch-level-1': 84,
        'pitch-level-2': 0,
        'pitch-level-3': 0,
        'pitch-level-4': 0,
        'pitch-level-5': 0,
        'pitch-level-6': 0,
        'pitch-level-7': 0,
        'pitch-level-8': 0,
        'pitch-rate-1': 127,
        'pitch-rate-2': 70,
        'pitch-rate-3': 0,
        'pitch-rate-4': 0,
        'pitch-rate-5': 0,
        'pitch-rate-6': 0,
        'pitch-rate-7': 0,
        'pitch-rate-8': 0,
        'pitch2-sustain-point': 0,
        'pitch2-end-point': 0,
        'pitch2-level-1': 0,
        'pitch2-level-2': 0,
        'pitch2-level-3': 0,
        'pitch2-level-4': 0,
        'pitch2-level-5': 0,
        'pitch2-level-6': 0,
        'pitch2-level-7': 0,
        'pitch2-level-8': 0,
        'pitch2-rate-1': 0,
        'pitch2-rate-2': 0,
        'pitch2-rate-3': 0,
        'pitch2-rate-4': 0,
        'pitch2-rate-5': 0,
        'pitch2-rate-6': 0,
        'pitch2-rate-7': 0,
        'pitch2-rate-8': 0,
        'dcw-sustain-point': 55,
        'dcw-end-point': 43,
        'dcw-level-1': 116,
        'dcw-level-2': 85,
        'dcw-level-3': 52,
        'dcw-level-4': 82,
        'dcw-level-5': 0,
        'dcw-level-6': 0,
        'dcw-level-7': 0,
        'dcw-level-8': 0,
        'dcw-rate-1': 89,
        'dcw-rate-2': 91,
        'dcw-rate-3': 32,
        'dcw-rate-4': 0,
        'dcw-rate-5': 0,
        'dcw-rate-6': 0,
        'dcw-rate-7': 0,
        'dcw-rate-8': 0,
        'dcw2-sustain-point': 0,
        'dcw2-end-point': 0,
        'dcw2-level-1': 0,
        'dcw2-level-2': 0,
        'dcw2-level-3': 0,
        'dcw2-level-4': 0,
        'dcw2-level-5': 0,
        'dcw2-level-6': 0,
        'dcw2-level-7': 0,
        'dcw2-level-8': 0,
        'dcw2-rate-1': 0,
        'dcw2-rate-2': 0,
        'dcw2-rate-3': 0,
        'dcw2-rate-4': 0,
        'dcw2-rate-5': 0,
        'dcw2-rate-6': 0,
        'dcw2-rate-7': 0,
        'dcw2-rate-8': 0,
        'lfo1-wave': 0,
        'lfo1-amount': 0,
        'lfo1-rate': 0,
        'filter-attack': 23,
        'filter-decay': 37,
        'filter-sustain': 57,
        'filter-release': 41,
        'filter-cutoff': 30,
        'filter-resonance': 60,
        'filter-env-amount': 22,
        'chorus-rate': 33,
        'chorus-depth': 60
    }
};

// --- BOX RANDOM ---
const BOX_CONTROLS = {
    'dco1': ['dco1-wf1', 'dco2-wf2', 'dco1-dcw'],
    'dco2': ['dco1-wf1-lineoffset', 'dco1-wf2-lineoffset', 'dco1-dcw-lineoffset'],
    'pitch-env1': [
        'pitch-sustain-point', 'pitch-end-point',
        'pitch-rate-1', 'pitch-level-1', 'pitch-rate-2', 'pitch-level-2',
        'pitch-rate-3', 'pitch-level-3', 'pitch-rate-4', 'pitch-level-4',
        'pitch-rate-5', 'pitch-level-5', 'pitch-rate-6', 'pitch-level-6',
        'pitch-rate-7', 'pitch-level-7', 'pitch-rate-8', 'pitch-level-8'
    ],
    'pitch-env2': [
        'pitch2-sustain-point', 'pitch2-end-point',
        'pitch2-rate-1', 'pitch2-level-1', 'pitch2-rate-2', 'pitch2-level-2',
        'pitch2-rate-3', 'pitch2-level-3', 'pitch2-rate-4', 'pitch2-level-4',
        'pitch2-rate-5', 'pitch2-level-5', 'pitch2-rate-6', 'pitch2-level-6',
        'pitch2-rate-7', 'pitch2-level-7', 'pitch2-rate-8', 'pitch2-level-8'
    ],
    'dcw-env1': [
        'dco1-dcw-keyfollow', 'dco1-dcw-keyfollow-range',
        'dcw-sustain-point', 'dcw-end-point',
        'dcw-rate-1', 'dcw-level-1', 'dcw-rate-2', 'dcw-level-2',
        'dcw-rate-3', 'dcw-level-3', 'dcw-rate-4', 'dcw-level-4',
        'dcw-rate-5', 'dcw-level-5', 'dcw-rate-6', 'dcw-level-6',
        'dcw-rate-7', 'dcw-level-7', 'dcw-rate-8', 'dcw-level-8'
    ],
    'dcw-env2': [
        'dco1-dcw-keyfollow-lineoffset', 'dco1-dcw-keyfollow-range-lineoffset',
        'dcw2-sustain-point', 'dcw2-end-point',
        'dcw2-rate-1', 'dcw2-level-1', 'dcw2-rate-2', 'dcw2-level-2',
        'dcw2-rate-3', 'dcw2-level-3', 'dcw2-rate-4', 'dcw2-level-4',
        'dcw2-rate-5', 'dcw2-level-5', 'dcw2-rate-6', 'dcw2-level-6',
        'dcw2-rate-7', 'dcw2-level-7', 'dcw2-rate-8', 'dcw2-level-8'
    ],
    'dca-env1': [
        'dco1-dca-keyfollow', 'dco1-dca-keyfollow-range',
        'dca-sustain-point', 'dca-end-point',
        'dca-rate-1', 'dca-level-1', 'dca-rate-2', 'dca-level-2',
        'dca-rate-3', 'dca-level-3', 'dca-rate-4', 'dca-level-4',
        'dca-rate-5', 'dca-level-5', 'dca-rate-6', 'dca-level-6',
        'dca-rate-7', 'dca-level-7', 'dca-rate-8', 'dca-level-8'
    ],
    'dca-env2': [
        'dco1-dca-keyfollow-lineoffset', 'dco1-dca-keyfollow-range-lineoffset',
        'dca2-sustain-point', 'dca2-end-point',
        'dca2-rate-1', 'dca2-level-1', 'dca2-rate-2', 'dca2-level-2',
        'dca2-rate-3', 'dca2-level-3', 'dca2-rate-4', 'dca2-level-4',
        'dca2-rate-5', 'dca2-level-5', 'dca2-rate-6', 'dca2-level-6',
        'dca2-rate-7', 'dca2-level-7', 'dca2-rate-8', 'dca2-level-8'
    ],
    'vibrato': ['vibrato-wave', 'vibrato-rate', 'vibrato-depth', 'vibrato-delay', 'vibrato-sync', 'vibrato-sync-rate'],
    'lfo': ['lfo1-wave', 'lfo1-rate', 'lfo1-amount'],
    'detune': ['detune-polarity', 'detune-oct', 'detune-note'],
    'filter': ['filter-cutoff', 'filter-resonance', 'filter-env-amount'],
    'filter-eg': ['filter-attack', 'filter-decay', 'filter-sustain', 'filter-release']
};

function randomiseBox(boxId) {
    const ids = BOX_CONTROLS[boxId];
    if (!ids) return;
    const controls = ALL_PATCH_CONTROLS.filter(c => ids.includes(c.id));
    sendPatchSequentially(controls, (p, el) => {
        // Keep detune-fine at 0 to avoid potential hardware issues
        if (p.id === 'detune-fine') {
            return 0;
        }
        const max = parseInt(el.max) || 127;
        return Math.floor(Math.random() * (max + 1));
    });
}

function initBox(boxId) {
    const ids = BOX_CONTROLS[boxId];
    if (!ids) return;
    const controls = ALL_PATCH_CONTROLS.filter(c => ids.includes(c.id));
    sendPatchSequentially(controls, (p) => p.value);
}

document.querySelectorAll('.box-random-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        randomiseBox(btn.dataset.box);
    });
});

document.querySelectorAll('.box-init-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        initBox(btn.dataset.box);
    });
});

// Function to get waveform index (0-7) from MIDI value
function getWaveformIndex(val) {
    if (val >= 0 && val <= 18) return 0; // SAWTOOTH
    if (val >= 19 && val <= 36) return 1; // SQUARE
    if (val >= 37 && val <= 54) return 2; // PULSE
    if (val >= 55 && val <= 72) return 3; // DOUBLESINE
    if (val >= 73 && val <= 90) return 4; // SAW-PULSE
    if (val >= 91 && val <= 108) return 5; // RESONANCE I
    if (val >= 109 && val <= 126) return 6; // RESONANCE II
    return 7; // RESONANCE III (127)
}

// Function to update waveform indicator position
function updateWaveformIndicator(dcoNumber, value) {
    const waveformIndex = getWaveformIndex(value);
    const row = waveformIndex < 4 ? 0 : 1; // Top or bottom row
    const col = waveformIndex % 4; // Column (0-3)
    
    const indicator = document.querySelector(`.wf-dco${dcoNumber}`);
    if (indicator) {
        // Position indicator under the correct waveform
        indicator.style.left = `${col * 25}%`;
        // Top row at 146px, bottom row at 296px
        const topPosition = row === 0 ? 48 : 96; // change this for line indicator position   
        // DCO 1 section: dcoNumber 1 slightly higher than 2
        // DCO 2 section: dcoNumber 3 slightly higher than 4
        let offset;
        if (dcoNumber === 1 || dcoNumber === 3) {
            offset = -4;
        } else {
            offset = -2;
        }
        indicator.style.top = `${topPosition + offset}px`;
    }
}

// --- HAMBURGER MENU LOGIC ---
const hamburger = document.getElementById('hamburger-menu');
const sideNav = document.getElementById('side-nav');
const closeBtn = document.getElementById('close-btn');
const aboutBtn = document.getElementById('about-btn');
const versionNumber = document.getElementById('version-number');
const aboutModal = document.getElementById('about-modal');
const aboutModalContent = document.getElementById('about-modal-content');
const aboutModalClose = document.getElementById('about-modal-close');
const footerDisclaimer = document.getElementById('footer-disclaimer');
const footerDisclaimerClose = document.getElementById('footer-disclaimer-close');
const showFooterDisclaimer = document.getElementById('show-footer-disclaimer');

function openAboutModal() {
    if (!aboutModal) return;
    aboutModal.classList.remove('modal-hidden');
    aboutModal.setAttribute('aria-hidden', 'false');
    startAboutModalSpin();
}

function closeAboutModal() {
    if (!aboutModal) return;
    aboutModal.classList.add('modal-hidden');
    aboutModal.setAttribute('aria-hidden', 'true');
    stopAboutModalSpin();
}

// Open Menu
if (hamburger && sideNav) {
    hamburger.addEventListener('click', () => {
        sideNav.style.width = "280px";
    });
}

// Close Menu
if (closeBtn && sideNav) {
    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        sideNav.style.width = "0";
    });
}

// About Modal
if (aboutBtn) {
    aboutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        openAboutModal();
        if (sideNav) {
            sideNav.style.width = "0";
        }
    });
}

if (versionNumber) {
    versionNumber.addEventListener('click', openAboutModal);
}

if (aboutModalClose) {
    aboutModalClose.addEventListener('click', closeAboutModal);
}

if (aboutModal) {
    aboutModal.addEventListener('click', (e) => {
        if (!aboutModalContent || !aboutModalContent.contains(e.target)) {
            closeAboutModal();
        }
    });
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && aboutModal && !aboutModal.classList.contains('modal-hidden')) {
        closeAboutModal();
    }
});

if (footerDisclaimer && footerDisclaimerClose) {
    footerDisclaimerClose.addEventListener('click', () => {
        footerDisclaimer.style.display = 'none';
    });
}

if (footerDisclaimer && showFooterDisclaimer) {
    showFooterDisclaimer.addEventListener('click', (e) => {
        e.preventDefault();
        footerDisclaimer.style.display = 'block';
    });
}

// --- ZOOM CONTROLS LOGIC ---
let currentZoom = 100; // Track current zoom level as percentage
const minZoom = 50;    // Minimum zoom level
const maxZoom = 200;   // Maximum zoom level
const zoomStep = 10;   // Zoom increment percentage

const zoomInBtn = document.getElementById('zoom-in-btn');
const zoomOutBtn = document.getElementById('zoom-out-btn');

function setZoom(level) {
    // Clamp zoom level between min and max
    currentZoom = Math.max(minZoom, Math.min(maxZoom, level));
    document.body.style.zoom = currentZoom + '%';
    // Save zoom level to localStorage
    localStorage.setItem('pageZoom', currentZoom);
}

if (zoomInBtn) {
    zoomInBtn.addEventListener('click', () => {
        setZoom(currentZoom + zoomStep);
    });
}

if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', () => {
        setZoom(currentZoom - zoomStep);
    });
}

// Restore saved zoom level on page load
window.addEventListener('load', () => {
    const savedZoom = localStorage.getItem('pageZoom');
    if (savedZoom) {
        setZoom(parseInt(savedZoom));
    }
});

// Also support keyboard shortcuts: Ctrl/Cmd + Plus/Minus
window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) {
        e.preventDefault();
        setZoom(currentZoom + zoomStep);
    } else if ((e.ctrlKey || e.metaKey) && (e.key === '-' || e.key === '_')) {
        e.preventDefault();
        setZoom(currentZoom - zoomStep);
    } else if ((e.ctrlKey || e.metaKey) && e.key === '0') {
        e.preventDefault();
        setZoom(100); // Reset to 100%
    }
});

// Close menu if clicking anywhere outside the side-nav
if (hamburger && sideNav) {
    window.addEventListener('click', (e) => {
        if (e.target !== hamburger && !hamburger.contains(e.target) && e.target !== sideNav && !sideNav.contains(e.target)) {
            sideNav.style.width = "0";
        }
    });
}

// --- ACCORDION LOGIC ---
const acc = document.getElementsByClassName("accordion-header");

for (let i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        const panel = this.nextElementSibling;
        const isActive = this.classList.contains("active");

        // Close ALL accordion sections first
        for (let j = 0; j < acc.length; j++) {
            acc[j].classList.remove("active");
            acc[j].nextElementSibling.style.maxHeight = null;
        }

        // If the one we clicked wasn't already open, open it now
        if (!isActive) {
            this.classList.add("active");
            panel.style.maxHeight = panel.scrollHeight + "px";
        }
    });
}

// --- NAV SYNTH 3D SPIN ---
function setupNavSynth() {
    const navWrap = document.querySelector('.nav-synth-wrap');
    if (!navWrap) return;

    const imgs = Array.from(navWrap.querySelectorAll('.nav-synth-img'));
    // Degrees offset per ghost layer (front=0, mid=1.5, back=3)
    const OFFSETS = [0, 1.5, 3];
    const SPEED = 30;       // deg/s (full rotation in ~12s)
    const RETURN_DUR = 0.8; // seconds to ease back to 0°

    let angle = 0;
    let spinning = false;
    let rafId = null;
    let lastTime = null;

    function applyTransforms(a) {
        imgs.forEach((img, i) => {
            const a2 = ((a + OFFSETS[i]) % 360 + 360) % 360;
            img.style.transform = `perspective(300px) rotateY(${a2}deg)`;
        });
    }

    function spinLoop(ts) {
        if (lastTime == null) lastTime = ts;
        const dt = (ts - lastTime) / 1000;
        lastTime = ts;
        angle = (angle + SPEED * dt) % 360;
        applyTransforms(angle);
        if (spinning) rafId = requestAnimationFrame(spinLoop);
    }

    function returnToZero() {
        const remainder = ((angle % 360) + 360) % 360;
        const startAngle = angle;
        // Take the shortest arc back to 0°
        const target = remainder <= 180
            ? startAngle - remainder
            : startAngle + (360 - remainder);
        const startTime = performance.now();

        function returnLoop(ts) {
            if (spinning) return;
            const t = Math.min((ts - startTime) / 1000 / RETURN_DUR, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            angle = startAngle + (target - startAngle) * eased;
            applyTransforms(angle);
            if (t < 1) {
                rafId = requestAnimationFrame(returnLoop);
            } else {
                angle = 0;
                applyTransforms(0);
            }
        }
        rafId = requestAnimationFrame(returnLoop);
    }

    navWrap.addEventListener('mouseenter', () => {
        spinning = true;
        if (rafId) cancelAnimationFrame(rafId);
        lastTime = null;
        rafId = requestAnimationFrame(spinLoop);
    });

    navWrap.addEventListener('mouseleave', () => {
        spinning = false;
        if (rafId) cancelAnimationFrame(rafId);
        returnToZero();
    });
}

setupNavSynth();

// --- ABOUT MODAL SYNTH SPIN ---
const _aboutModalImg = document.getElementById('about-modal-synth-img');
let _aboutSpinAngle = 0;
let _aboutSpinRaf = null;
let _aboutSpinLastTime = null;
const _ABOUT_SPEED = 30; // deg/s

function _aboutSpinLoop(ts) {
    if (_aboutSpinLastTime == null) _aboutSpinLastTime = ts;
    const dt = (ts - _aboutSpinLastTime) / 1000;
    _aboutSpinLastTime = ts;
    _aboutSpinAngle = (_aboutSpinAngle + _ABOUT_SPEED * dt) % 360;
    if (_aboutModalImg) {
        _aboutModalImg.style.transform = `perspective(300px) rotateY(${_aboutSpinAngle}deg)`;
    }
    _aboutSpinRaf = requestAnimationFrame(_aboutSpinLoop);
}

function startAboutModalSpin() {
    if (!_aboutModalImg || _aboutSpinRaf) return;
    _aboutSpinLastTime = null;
    _aboutSpinRaf = requestAnimationFrame(_aboutSpinLoop);
}

function stopAboutModalSpin() {
    if (_aboutSpinRaf) {
        cancelAnimationFrame(_aboutSpinRaf);
        _aboutSpinRaf = null;
    }
}
