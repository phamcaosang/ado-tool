"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListJob = exports.CreateJob = exports.RemoveJob = void 0;
var axios_1 = require("axios");
var variables_1 = require("../shared/variables");
var utils_1 = require("../shared/utils");
var ApprovePipelines = function (approvalIds) {
    var url = variables_1.TEMPLATE_URL.BASE_URL + variables_1.TEMPLATE_URL.UPDATE_APPROVAL_PATH;
    var token = (0, utils_1.base64Encode)(variables_1.CONFIGS.pat);
    var payload = approvalIds.map(function (id) { return ({
        approvalId: id,
        status: "approved",
        comment: "Approving"
    }); });
    return axios_1.default.patch(url, payload, {
        headers: {
            Authorization: "Basic ".concat(token)
        }
    });
};
var ApprovalPipelineJobStorage = {
    createJob: function (job, storage) {
        storage.set(job.id, job, job.duration);
        return job;
    },
    getJob: function (id, storage) {
        return storage.get(id);
    },
    listJobs: function (storage) {
        var keys = storage.keys();
        return keys.map(function (x) { return storage.get(x); });
    },
    deleteJob: function (id, storage) {
        return storage.del(id) !== 0;
    }
};
var CustomCronJob = {
    create: function (job, storage) {
        var _this = this;
        var intervalId = setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, RunJob(job.id, storage)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); }, job.interval * 1000);
        return __assign({ intervalId: intervalId }, job);
    },
    removeInterval: function (intervalId) {
        clearInterval(intervalId);
    }
};
var RunJob = function (id, storage) { return __awaiter(void 0, void 0, void 0, function () {
    var job, approvalIds;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                job = ApprovalPipelineJobStorage.getJob(id, storage);
                if (!job) return [3 /*break*/, 2];
                approvalIds = job.pipelineIds;
                return [4 /*yield*/, ApprovePipelines(approvalIds)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [2 /*return*/];
        }
    });
}); };
function RemoveJob(id, storage) {
    var job = ApprovalPipelineJobStorage.getJob(id, storage);
    if (job) {
        ApprovalPipelineJobStorage.deleteJob(job.id, storage);
        CustomCronJob.removeInterval(job.intervalId);
    }
}
exports.RemoveJob = RemoveJob;
function CreateJob(job, storage) {
    var intervalJob = CustomCronJob.create(job, storage);
    return ApprovalPipelineJobStorage.createJob(intervalJob, storage);
}
exports.CreateJob = CreateJob;
function ListJob(storage) {
    return ApprovalPipelineJobStorage.listJobs(storage);
}
exports.ListJob = ListJob;
