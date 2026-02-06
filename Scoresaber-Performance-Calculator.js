// ==UserScript==
// @name         Scoresaber PP Calculator
// @namespace    ss_performance_calc
// @version      1.0
// @description  Adds a Performance Calculator to the pages of Ranked Maps on Scoresaber
// @author       potasium_
// @updateURL    https://github.com/potasium2/SS-PP-Calculator/blob/main/Scoresaber-Performance-Calculator.js
// @downloadURL  https://github.com/potasium2/SS-PP-Calculator/blob/main/Scoresaber-Performance-Calculator.js
// @match        https://scoresaber.com/leaderboard/*
// ==/UserScript==

let accuracyPoints = [
    0,
    0.6,
    0.65,
    0.7,
    0.75,
    0.8,
    0.825,
    0.85,
    0.875,
    0.9,
    0.91,
    0.92,
    0.93,
    0.94,
    0.95,
    0.955,
    0.96,
    0.965,
    0.97,
    0.9725,
    0.975,
    0.9775,
    0.98,
    0.9825,
    0.985,
    0.9875,
    0.99,
    0.9925,
    0.995,
    0.9975,
    0.999,
    1
]

let performanceCurve = [
    0,
    0.18223233667439,
    0.586601001276757,
    0.612556595911495,
    0.645180821010144,
    0.687226886295028,
    0.715046566345427,
    0.746229066414318,
    0.781693456029604,
    0.825756123560842,
    0.848837598812446,
    0.872871034144885,
    0.903999407186573,
    0.941736298058023,
    1,
    1.03886333314189,
    1.08718835738504,
    1.1552120359501,
    1.24858077599573,
    1.30903330650576,
    1.38071027431051,
    1.46647263992895,
    1.57024100555322,
    1.69753624864754,
    1.85638876936471,
    2.05894715905273,
    2.32450628214992,
    2.68566785659272,
    3.20220175973379,
    3.99679360676332,
    4.7154706464162,
    5.36739428289063
]

function LinearInterpolation(x, xp, fp) {
    if (x <= xp[0]) {
        return fp[0]
    }

    if (x >= xp[xp.length - 1]) {
        return fp[fp.length - 1]
    }

    let index = BinarySearch(x, xp) - 1;

    let t = (x - xp[index]) / (xp[index + 1] - xp[index]);
    let midPoint = fp[index] + (fp[index + 1] - fp[index]) * t
    return midPoint;
}

function BinarySearch(key, array) {
    let min = 0;
    let max = array.length - 1;
    let mid = Math.floor((min + max) / 2);

    while (min != max) {
        mid = Math.floor((min + max) / 2);
        if (key < array[mid]) {
            max = mid;
        }
        else {
            min = mid + 1;
        }
    }

    return max
}

function createCalculator(mapDifficulty) {
    let infoColumn = document.getElementsByClassName('column is-4');

    if (infoColumn.length == 0) {
        return true;
    }

    let mapDifficultyBadge = document.getElementsByClassName('tag difficulty-badge expert-plus svelte-1ro6svo');

    if (mapDifficultyBadge == 0) {
        return false;
    }

    let calculator = document.createElement("div");
    calculator.setAttribute("class", 'window has-shadow mt-3 svelte-1w4l532');

    let calculatorTitle = document.createElement("div");
    calculatorTitle.setAttribute("class", 'title is-6 svelte-1w4l532');
    calculatorTitle.innerHTML = 'Performance Calculator';

    let performancePoints = document.createElement("div");
    performancePoints.setAttribute("id", 'performance-field');
    performancePoints.setAttribute("class", 'info-value mt-3 svelte-1w4l532');
    performancePoints.innerHTML = 'Performance: 0pp'

    let accuracyField = document.createElement("div");
    accuracyField.setAttribute("class", 'ss-input svelte-1sxyuf3');

    let inputButton = document.createElement("div");
    inputButton.setAttribute("class", 'svelte-1sxyuf3');

    let accuracyInput = document.createElement("input");
    accuracyInput.setAttribute("class", 'svelte-1sxyuf3');
    accuracyInput.setAttribute("placeholder", 'Enter Accuracy: i;e 94.37');
    accuracyInput.setAttribute("type", 'text');

    accuracyInput.addEventListener('input', function () {
        calculatePerformance(accuracyInput.value)
    });

    let selectiongUnderline = document.createElement("div");
    selectiongUnderline.setAttribute("class", 'active svelte-1sxyuf3');

    inputButton.appendChild(accuracyInput);
    inputButton.appendChild(selectiongUnderline);

    accuracyField.appendChild(inputButton);

    calculator.appendChild(calculatorTitle);
    calculator.appendChild(accuracyField);
    calculator.appendChild(performancePoints);

    let referenceNode = infoColumn[0].firstChild;
    infoColumn[0].insertBefore(calculator, referenceNode.nextSibling);

    return false;
}

function calculatePerformance(accuracy) {
    let mapDifficulty = document.getElementsByClassName('tag difficulty-badge expert-plus svelte-1ro6svo')[0];

    let calculatorPerformanceField = document.getElementById('performance-field');

    let rawAccuracy = Number(accuracy);
    let performancePoints = (String(mapDifficulty.innerHTML).slice(0, -1) * 44.05413187445) / 1.046;
    calculatorPerformanceField.innerHTML = "Performance: " + Math.round(performancePoints * LinearInterpolation(rawAccuracy / 100, accuracyPoints, performanceCurve) * 100) / 100 + "pp";
}

(async function() {
    'use strict';

    while(true) {
        await new Promise(r => setTimeout(r, 1));

        if (document.getElementById('performance-field') == null) {
            createCalculator();
        }
    }
})

(function() {
});
