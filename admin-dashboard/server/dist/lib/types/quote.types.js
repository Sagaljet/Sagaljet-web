"use strict";
// lib/types/quote.types.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuoteStatus = void 0;
var QuoteStatus;
(function (QuoteStatus) {
    QuoteStatus["PENDING"] = "PENDING";
    QuoteStatus["REVIEWED"] = "REVIEWED";
    QuoteStatus["QUOTED"] = "QUOTED";
    QuoteStatus["ACCEPTED"] = "ACCEPTED";
    QuoteStatus["IN_PROGRESS"] = "IN_PROGRESS";
    QuoteStatus["COMPLETED"] = "COMPLETED";
    QuoteStatus["CANCELLED"] = "CANCELLED";
})(QuoteStatus || (exports.QuoteStatus = QuoteStatus = {}));
