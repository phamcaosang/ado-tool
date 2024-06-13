"use strict";
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
var axios_1 = require("axios");
var variables_1 = require("../shared/variables");
var utils_1 = require("../shared/utils");
var enums_1 = require("../shared/enums");
var date_fns_1 = require("date-fns");
var token = (0, utils_1.base64Encode)(variables_1.CONFIGS.pat);
var DATA = {};
var GetAllPendingApprovals = function () { return __awaiter(void 0, void 0, void 0, function () {
    var url, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                url = variables_1.TEMPLATE_URL.BASE_URL +
                    variables_1.TEMPLATE_URL.GET_ALL_APPROVALS_PATH
                        .replace("{userIds}", Object.values(variables_1.CONFIGS.users).join(","))
                        .replace("{state}", enums_1.ApprovalStatus.pending);
                return [4 /*yield*/, axios_1.default.get(url, {
                        headers: {
                            Authorization: "Basic ".concat(token),
                        }
                    })];
            case 1:
                res = _a.sent();
                return [2 /*return*/, res.data.value];
        }
    });
}); };
var ApprovePipelines = function (approvalIds) {
    var url = variables_1.TEMPLATE_URL.BASE_URL + variables_1.TEMPLATE_URL.UPDATE_APPROVAL_PATH;
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
        storage.set(job.id, job, job.duration * 60);
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
        DATA[job.id] = intervalId;
    },
    removeInterval: function (jobId) {
        clearInterval(DATA[jobId]);
        delete DATA[jobId];
    }
};
var RunJob = function (id, storage) { return __awaiter(void 0, void 0, void 0, function () {
    var job, pendingApprovals, approvalIds, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                job = ApprovalPipelineJobStorage.getJob(id, storage);
                if (!job) {
                    return [2 /*return*/];
                }
                if ((0, date_fns_1.addMinutes)(job.createdAt, job.duration) < new Date()) {
                    RemoveJob(job.id, storage);
                    console.log("Expire job", job);
                    return [2 /*return*/];
                }
                console.log("Running Job detail", job, new Date());
                return [4 /*yield*/, GetAllPendingApprovals()];
            case 1:
                pendingApprovals = _b.sent();
                approvalIds = pendingApprovals
                    .filter(function (x) { return job.pipelineIds.includes(x.pipeline.id); })
                    .filter(function (x) { return new Date(x.createdOn) > new Date(job.createdAt); })
                    .map(function (x) { return x.id; });
                console.log("Approval IDs", approvalIds);
                _a = approvalIds.length > 0;
                if (!_a) return [3 /*break*/, 3];
                return [4 /*yield*/, ApprovePipelines(approvalIds)];
            case 2:
                _a = (_b.sent());
                _b.label = 3;
            case 3:
                _a;
                return [2 /*return*/];
        }
    });
}); };
function RemoveJob(id, storage) {
    var job = ApprovalPipelineJobStorage.getJob(id, storage);
    if (job) {
        ApprovalPipelineJobStorage.deleteJob(job.id, storage);
        CustomCronJob.removeInterval(job.id);
    }
}
function CreateJob(job, storage) {
    CustomCronJob.create(job, storage);
    return ApprovalPipelineJobStorage.createJob(job, storage);
}
function ListJob(storage) {
    return ApprovalPipelineJobStorage.listJobs(storage);
}
module.exports = {
    RemoveJob: RemoveJob,
    CreateJob: CreateJob,
    ListJob: ListJob,
    CONFIGS: variables_1.CONFIGS,
    CustomCronJob: CustomCronJob
};
