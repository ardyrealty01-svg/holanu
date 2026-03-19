var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// .wrangler/tmp/bundle-WzxTUp/strip-cf-connecting-ip-header.js
function stripCfConnectingIPHeader(input, init) {
  const request = new Request(input, init);
  request.headers.delete("CF-Connecting-IP");
  return request;
}
__name(stripCfConnectingIPHeader, "stripCfConnectingIPHeader");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    return Reflect.apply(target, thisArg, [
      stripCfConnectingIPHeader.apply(null, argArray)
    ]);
  }
});

// node_modules/unenv/dist/runtime/_internal/utils.mjs
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
__name(PerformanceEntry, "PerformanceEntry");
var PerformanceMark = /* @__PURE__ */ __name(class PerformanceMark2 extends PerformanceEntry {
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
}, "PerformanceMark");
var PerformanceMeasure = class extends PerformanceEntry {
  entryType = "measure";
};
__name(PerformanceMeasure, "PerformanceMeasure");
var PerformanceResourceTiming = class extends PerformanceEntry {
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
__name(PerformanceResourceTiming, "PerformanceResourceTiming");
var PerformanceObserverEntryList = class {
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
__name(PerformanceObserverEntryList, "PerformanceObserverEntryList");
var Performance = class {
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
__name(Performance, "Performance");
var PerformanceObserver = class {
  __unenv__ = true;
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
__name(PerformanceObserver, "PerformanceObserver");
__publicField(PerformanceObserver, "supportedEntryTypes", []);
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
import { Socket } from "node:net";
var ReadStream = class extends Socket {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  isRaw = false;
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
  isTTY = false;
};
__name(ReadStream, "ReadStream");

// node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
import { Socket as Socket2 } from "node:net";
var WriteStream = class extends Socket2 {
  fd;
  constructor(fd) {
    super();
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  columns = 80;
  rows = 24;
  isTTY = false;
};
__name(WriteStream, "WriteStream");

// node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class extends EventEmitter {
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return "";
  }
  get versions() {
    return {};
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  ref() {
  }
  unref() {
  }
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: () => 0 });
  mainModule = void 0;
  domain = void 0;
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};
__name(Process, "Process");

// node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var { exit, platform, nextTick } = getBuiltinModule(
  "node:process"
);
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  nextTick
});
var {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  finalization,
  features,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  on,
  off,
  once,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/utils.ts
function corsHeaders(env2, request) {
  let origin = "*";
  if (env2.ENVIRONMENT !== "development") {
    const reqOrigin = request?.headers.get("Origin") ?? "";
    const allowed = (env2.CORS_ORIGIN ?? "https://holanu.id").split(",").map((s) => s.trim());
    origin = allowed.includes(reqOrigin) ? reqOrigin : allowed[0];
  }
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Content-Type": "application/json"
  };
}
__name(corsHeaders, "corsHeaders");
function okResponse(data, env2, status = 200, req) {
  return new Response(JSON.stringify({ ok: true, data }), {
    status,
    headers: corsHeaders(env2, req)
  });
}
__name(okResponse, "okResponse");
function errorResponse(message, status = 400, env2, req) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: corsHeaders(env2, req)
  });
}
__name(errorResponse, "errorResponse");
async function verifyClerkToken(request, env2) {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer "))
    return null;
  const token = authHeader.slice(7);
  try {
    const parts = token.split(".");
    if (parts.length !== 3)
      return null;
    const b64 = /* @__PURE__ */ __name((s) => {
      const pad = s.length % 4;
      return pad ? s + "=".repeat(4 - pad) : s;
    }, "b64");
    const decode = /* @__PURE__ */ __name((s) => JSON.parse(new TextDecoder().decode(
      Uint8Array.from(atob(b64(s.replace(/-/g, "+").replace(/_/g, "/"))), (c) => c.charCodeAt(0))
    )), "decode");
    const header = decode(parts[0]);
    const payload = decode(parts[1]);
    if (payload.exp < Math.floor(Date.now() / 1e3))
      return null;
    const issuer = payload.iss;
    if (!issuer)
      return null;
    const jwksRes = await fetch(`${issuer}/.well-known/jwks.json`);
    if (!jwksRes.ok)
      return null;
    const { keys } = await jwksRes.json();
    const jwk = keys.find((k) => k.kid === header.kid);
    if (!jwk)
      return null;
    const publicKey = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );
    const sigInput = `${parts[0]}.${parts[1]}`;
    const sigBytes = Uint8Array.from(
      atob(b64(parts[2].replace(/-/g, "+").replace(/_/g, "/"))),
      (c) => c.charCodeAt(0)
    );
    const valid = await crypto.subtle.verify(
      "RSASSA-PKCS1-v1_5",
      publicKey,
      sigBytes,
      new TextEncoder().encode(sigInput)
    );
    if (!valid)
      return null;
    const role = payload.public_metadata?.role ?? payload.publicMetadata?.role ?? payload.metadata?.role;
    return { userId: payload.sub, role };
  } catch (e) {
    console.error("JWT verify error:", e);
    return null;
  }
}
__name(verifyClerkToken, "verifyClerkToken");
function generateListingCode(city, sequence) {
  const CITY_CODES = {
    "yogyakarta": "YGY",
    "sleman": "YGY",
    "bantul": "YGY",
    "semarang": "SMG",
    "bandung": "BDG",
    "surabaya": "SBY",
    "makassar": "MKS",
    "medan": "MDN",
    "jakarta": "JKT",
    "bali": "BAL",
    "denpasar": "BAL"
  };
  const year = (/* @__PURE__ */ new Date()).getFullYear().toString().slice(-2);
  const cityKey = city.toLowerCase().split(",")[0].trim();
  const cityCode = CITY_CODES[cityKey] ?? "INA";
  const seq = String(sequence).padStart(4, "0");
  return `HOL-${cityCode}-${year}-${seq}`;
}
__name(generateListingCode, "generateListingCode");
function paginate(url) {
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1"));
  const limit = Math.min(50, parseInt(url.searchParams.get("limit") ?? "12"));
  return { page, limit, offset: (page - 1) * limit };
}
__name(paginate, "paginate");

// src/routes/listings.ts
var PATCH_ALLOWED = [
  "title",
  "description",
  "sell_reason",
  "price",
  "original_price",
  "is_negotiable",
  "sewa_price",
  "rent_period",
  "province",
  "city",
  "district",
  "village",
  "address",
  "latitude",
  "longitude",
  "property_type",
  "offer_type",
  "bedrooms",
  "bathrooms",
  "carports",
  "floors",
  "land_area",
  "building_area",
  "front_width",
  "certificate",
  "doc_status",
  "legalitas_usaha",
  "condition",
  "facilities",
  "images",
  "video_url",
  "virtual_tour",
  "status"
];
async function handleListings(request, env2, url) {
  const method = request.method;
  const segments = url.pathname.split("/").filter(Boolean);
  const id = segments[2];
  const action = segments[3];
  if (method === "GET" && !id) {
    const { limit, offset } = paginate(url);
    const filters = [];
    const params = [];
    const offerType = url.searchParams.get("offer_type");
    const propertyType = url.searchParams.get("property_type");
    const city = url.searchParams.get("city");
    const province = url.searchParams.get("province");
    const minPrice = url.searchParams.get("min_price");
    const maxPrice = url.searchParams.get("max_price");
    const search = url.searchParams.get("q");
    const isPremium = url.searchParams.get("premium");
    const userId = url.searchParams.get("user_id");
    if (userId) {
      filters.push("l.user_id = ?");
      params.push(userId);
    } else {
      filters.push("l.status = 'aktif'");
    }
    if (offerType) {
      filters.push("l.offer_type = ?");
      params.push(offerType);
    }
    if (propertyType) {
      filters.push("l.property_type = ?");
      params.push(propertyType);
    }
    if (city) {
      filters.push("l.city LIKE ?");
      params.push(`%${city}%`);
    }
    if (province) {
      filters.push("l.province = ?");
      params.push(province);
    }
    if (minPrice) {
      filters.push("l.price >= ?");
      params.push(+minPrice);
    }
    if (maxPrice) {
      filters.push("l.price <= ?");
      params.push(+maxPrice);
    }
    if (isPremium) {
      filters.push("l.is_premium = 1");
    }
    if (search) {
      filters.push("(l.title LIKE ? OR l.description LIKE ? OR l.code LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    const where = filters.length ? filters.join(" AND ") : "1=1";
    const [rows, countRow] = await Promise.all([
      env2.DB.prepare(`
        SELECT l.*, u.name AS agent_name, u.is_verified AS agent_verified
        FROM listings l
        LEFT JOIN users u ON u.id = l.user_id
        WHERE ${where}
        ORDER BY l.is_premium DESC, l.is_featured DESC, l.published_at DESC
        LIMIT ? OFFSET ?
      `).bind(...params, limit, offset).all(),
      env2.DB.prepare(`SELECT COUNT(*) as total FROM listings l WHERE ${where}`).bind(...params).first()
    ]);
    return okResponse({
      listings: rows.results,
      total: countRow?.total ?? 0,
      limit,
      offset
    }, env2, 200, request);
  }
  if (method === "GET" && id && !action) {
    const listing = await env2.DB.prepare(`
      SELECT l.*, u.name AS agent_name, u.whatsapp AS agent_wa,
             u.is_verified AS agent_verified, u.avatar_url AS agent_avatar
      FROM listings l
      LEFT JOIN users u ON u.id = l.user_id
      WHERE l.id = ? OR l.code = ?
    `).bind(id, id).first();
    if (!listing)
      return errorResponse("Listing tidak ditemukan", 404, env2, request);
    await env2.DB.prepare("UPDATE listings SET views = views + 1 WHERE id = ?").bind(listing.id).run();
    return okResponse(listing, env2, 200, request);
  }
  if (method === "POST" && !id) {
    const claims = await verifyClerkToken(request, env2);
    if (!claims)
      return errorResponse("Unauthorized", 401, env2, request);
    const body = await request.json();
    if (!body.title?.trim())
      return errorResponse("title wajib diisi", 400, env2, request);
    if (!body.price || isNaN(+body.price) || +body.price <= 0)
      return errorResponse("price harus angka > 0", 400, env2, request);
    if (!body.property_type?.trim())
      return errorResponse("property_type wajib diisi", 400, env2, request);
    if (!body.offer_type?.trim())
      return errorResponse("offer_type wajib diisi", 400, env2, request);
    const newId = crypto.randomUUID();
    const countRow = await env2.DB.prepare("SELECT COUNT(*) as n FROM listings").first();
    let code = generateListingCode(body.city ?? "indonesia", (countRow?.n ?? 0) + 1);
    const existing = await env2.DB.prepare("SELECT id FROM listings WHERE code = ?").bind(code).first();
    if (existing) {
      code = generateListingCode(body.city ?? "indonesia", (countRow?.n ?? 0) + 2 + Math.floor(Math.random() * 100));
    }
    const userId = claims.userId;
    await env2.DB.prepare(`
      INSERT INTO listings (
        id, code, user_id, title, description, sell_reason,
        price, original_price, is_negotiable,
        sewa_price, rent_period,
        province, city, district, village, address, latitude, longitude,
        property_type, offer_type,
        bedrooms, bathrooms, carports, floors, land_area, building_area, front_width,
        certificate, doc_status, legalitas_usaha, condition, facilities, images, video_url, virtual_tour,
        is_premium, is_featured, status, published_at
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(
      newId,
      code,
      userId,
      body.title,
      body.description ?? null,
      body.sell_reason ?? null,
      body.price,
      body.original_price ?? null,
      body.is_negotiable ?? 1,
      body.sewa_price ?? null,
      body.rent_period ?? "bulan",
      body.province ?? null,
      body.city ?? null,
      body.district ?? null,
      body.village ?? null,
      body.address ?? null,
      body.latitude ?? null,
      body.longitude ?? null,
      body.property_type,
      body.offer_type,
      body.bedrooms ?? 0,
      body.bathrooms ?? 0,
      body.carports ?? 0,
      body.floors ?? 1,
      body.land_area ?? null,
      body.building_area ?? null,
      body.front_width ?? null,
      body.certificate ?? null,
      body.doc_status ?? "on_hand",
      JSON.stringify(body.legalitas_usaha ?? []),
      body.condition ?? "Baru",
      JSON.stringify(body.facilities ?? []),
      JSON.stringify(body.images ?? []),
      body.video_url ?? null,
      body.virtual_tour ?? null,
      0,
      0,
      "aktif",
      null
    ).run();
    await env2.DB.prepare(
      `UPDATE listings SET published_at = datetime('now') WHERE id = ?`
    ).bind(newId).run();
    return okResponse({ id: newId, code }, env2, 201, request);
  }
  if (method === "PATCH" && id && !action) {
    const claims = await verifyClerkToken(request, env2);
    if (!claims)
      return errorResponse("Unauthorized", 401, env2, request);
    if (claims.role !== "admin") {
      const listing = await env2.DB.prepare("SELECT user_id FROM listings WHERE id = ?").bind(id).first();
      if (!listing)
        return errorResponse("Listing tidak ditemukan", 404, env2, request);
      if (listing.user_id !== claims.userId)
        return errorResponse("Forbidden", 403, env2, request);
    }
    const body = await request.json();
    const fields = Object.keys(body).filter((k) => PATCH_ALLOWED.includes(k));
    if (!fields.length)
      return errorResponse("Tidak ada field valid yang diupdate", 400, env2, request);
    const sets = fields.map((k) => `${k} = ?`).join(", ");
    const values = fields.map((k) => body[k]);
    await env2.DB.prepare(
      `UPDATE listings SET ${sets}, updated_at = datetime('now') WHERE id = ?`
    ).bind(...values, id).run();
    return okResponse({ updated: true }, env2, 200, request);
  }
  if (method === "DELETE" && id) {
    const claims = await verifyClerkToken(request, env2);
    if (!claims)
      return errorResponse("Unauthorized", 401, env2, request);
    if (claims.role !== "admin") {
      const listing = await env2.DB.prepare("SELECT user_id FROM listings WHERE id = ?").bind(id).first();
      if (!listing)
        return errorResponse("Listing tidak ditemukan", 404, env2, request);
      if (listing.user_id !== claims.userId)
        return errorResponse("Forbidden", 403, env2, request);
    }
    await env2.DB.prepare("DELETE FROM listings WHERE id = ?").bind(id).run();
    return okResponse({ deleted: true }, env2, 200, request);
  }
  return errorResponse("Method tidak diizinkan", 405, env2, request);
}
__name(handleListings, "handleListings");

// src/routes/users.ts
async function handleUsers(request, env2, url) {
  const method = request.method;
  const segments = url.pathname.split("/").filter(Boolean);
  const id = segments[2];
  const action = segments[3];
  if (method === "POST" && id === "sync") {
    const claims = await verifyClerkToken(request, env2);
    if (!claims)
      return errorResponse("Unauthorized", 401, env2, request);
    const body = await request.json();
    const userId = claims.userId;
    const existing = await env2.DB.prepare("SELECT id FROM users WHERE id = ?").bind(userId).first();
    if (!existing) {
      const safeRole = ["owner", "buyer"].includes(body.role) ? body.role : "owner";
      const safeEmail = body.email?.trim() || `${userId}@clerk.local`;
      await env2.DB.prepare(`
        INSERT INTO users (id, name, email, whatsapp, role, display_role)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        userId,
        body.name ?? "User HOLANU",
        safeEmail,
        body.whatsapp ?? null,
        safeRole,
        "agent"
      ).run();
    } else {
      if (body.name || body.email) {
        await env2.DB.prepare(`
          UPDATE users SET
            name = COALESCE(?, name),
            email = COALESCE(?, email),
            updated_at = datetime('now')
          WHERE id = ?
        `).bind(body.name ?? null, body.email ?? null, userId).run();
      }
    }
    return okResponse({ synced: true, userId }, env2, 200, request);
  }
  if (method === "POST" && !id) {
    const body = await request.json();
    if (!body.email || !body.name) {
      return errorResponse("Nama dan email wajib diisi", 400, env2, request);
    }
    const existing = await env2.DB.prepare("SELECT id FROM users WHERE email = ?").bind(body.email).first();
    if (existing)
      return errorResponse("Email sudah terdaftar", 409, env2, request);
    const newId = crypto.randomUUID();
    const safeRole = ["owner", "buyer"].includes(body.role) ? body.role : "buyer";
    await env2.DB.prepare(`
      INSERT INTO users (id, name, email, whatsapp, password_hash, role, display_role)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      newId,
      body.name,
      body.email,
      body.whatsapp ?? null,
      body.password_hash ?? null,
      safeRole,
      safeRole === "owner" ? "agent" : safeRole
    ).run();
    return okResponse({ id: newId }, env2, 201, request);
  }
  if (method === "GET" && id && id !== "sync") {
    const user = await env2.DB.prepare(`
      SELECT id, name, email, whatsapp, role, display_role,
             tier, paket, paket_expiry, avatar_url, bio,
             city, province, instagram, website, is_verified, created_at
      FROM users WHERE id = ?
    `).bind(id).first();
    if (!user)
      return errorResponse("User tidak ditemukan", 404, env2, request);
    return okResponse(user, env2, 200, request);
  }
  if (method === "GET" && !id) {
    const claims = await verifyClerkToken(request, env2);
    if (!claims || claims.role !== "admin") {
      return errorResponse("Forbidden \u2014 admin only", 403, env2, request);
    }
    const { limit, offset } = paginate(url);
    const role = url.searchParams.get("role");
    const search = url.searchParams.get("q");
    const tier = url.searchParams.get("tier");
    const filters = [];
    const params = [];
    if (role) {
      filters.push("role = ?");
      params.push(role);
    }
    if (tier) {
      filters.push("tier = ?");
      params.push(+tier);
    }
    if (search) {
      filters.push("(name LIKE ? OR email LIKE ? OR whatsapp LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const [rows, countRow] = await Promise.all([
      env2.DB.prepare(`
        SELECT id, name, email, whatsapp, role, display_role,
               tier, paket, is_verified, is_banned, created_at
        FROM users ${where}
        ORDER BY created_at DESC LIMIT ? OFFSET ?
      `).bind(...params, limit, offset).all(),
      env2.DB.prepare(`SELECT COUNT(*) as total FROM users ${where}`).bind(...params).first()
    ]);
    return okResponse({ users: rows.results, total: countRow?.total ?? 0 }, env2, 200, request);
  }
  if (method === "PATCH" && id) {
    const claims = await verifyClerkToken(request, env2);
    if (!claims)
      return errorResponse("Unauthorized", 401, env2, request);
    if (claims.userId !== id && claims.role !== "admin") {
      return errorResponse("Forbidden", 403, env2, request);
    }
    const body = await request.json();
    const ALLOWED = ["name", "whatsapp", "bio", "city", "province", "instagram", "website", "avatar_url"];
    const fields = Object.keys(body).filter((k) => ALLOWED.includes(k));
    if (!fields.length)
      return errorResponse("Tidak ada field valid", 400, env2, request);
    const sets = fields.map((k) => `${k} = ?`).join(", ");
    const values = fields.map((k) => body[k]);
    await env2.DB.prepare(
      `UPDATE users SET ${sets}, updated_at=datetime('now') WHERE id=?`
    ).bind(...values, id).run();
    return okResponse({ updated: true }, env2, 200, request);
  }
  return errorResponse("Method tidak diizinkan", 405, env2, request);
}
__name(handleUsers, "handleUsers");

// src/routes/leads.ts
async function handleLeads(request, env2, url) {
  const method = request.method;
  const segments = url.pathname.split("/").filter(Boolean);
  const id = segments[2];
  if (method === "POST" && !id) {
    const body = await request.json();
    if (!body.name || !body.whatsapp) {
      return errorResponse("Nama dan WhatsApp wajib diisi", 400, env2, request);
    }
    const wa = String(body.whatsapp).replace(/\D/g, "");
    if (wa.length < 8 || wa.length > 15) {
      return errorResponse("Nomor WhatsApp tidak valid", 400, env2, request);
    }
    const newId = crypto.randomUUID();
    await env2.DB.prepare(`
      INSERT INTO buyer_leads (
        id, name, whatsapp, domisili_kota, domisili_prov, pekerjaan,
        property_type, purpose, lokasi_incaran, lokasi_prov,
        min_bedrooms, min_land_area, min_build_area,
        budget_min, budget_max, payment_method,
        has_salary_slip, no_active_kpr, need_kpr_help, timeline,
        certificate, condition, facilities, notes,
        source, referrer_listing
      ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
    `).bind(
      newId,
      body.name.trim(),
      wa,
      body.domisili_kota ?? null,
      body.domisili_prov ?? null,
      body.pekerjaan ?? null,
      body.property_type ?? null,
      body.purpose ?? null,
      body.lokasi_incaran ?? null,
      body.lokasi_prov ?? null,
      body.min_bedrooms ?? null,
      body.min_land_area ?? null,
      body.min_build_area ?? null,
      body.budget_min ?? null,
      body.budget_max ?? null,
      body.payment_method ?? null,
      body.has_salary_slip ? 1 : 0,
      body.no_active_kpr ? 1 : 0,
      body.need_kpr_help ? 1 : 0,
      body.timeline ?? null,
      body.certificate ?? null,
      body.condition ?? null,
      JSON.stringify(body.facilities ?? []),
      body.notes ?? null,
      body.source ?? "form",
      body.referrer_listing ?? null
    ).run();
    return okResponse({ id: newId, message: "Konsultasi berhasil dikirim!" }, env2, 201, request);
  }
  const claims = await verifyClerkToken(request, env2);
  if (!claims)
    return errorResponse("Unauthorized", 401, env2, request);
  if (claims.role !== "admin")
    return errorResponse("Forbidden \u2014 admin only", 403, env2, request);
  if (method === "GET" && !id) {
    const { limit, offset } = paginate(url);
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("q");
    const filters = [];
    const params = [];
    if (status) {
      filters.push("status = ?");
      params.push(status);
    }
    if (search) {
      filters.push("(name LIKE ? OR whatsapp LIKE ? OR lokasi_incaran LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const [rows, countRow] = await Promise.all([
      env2.DB.prepare(`
        SELECT * FROM buyer_leads ${where}
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
      `).bind(...params, limit, offset).all(),
      env2.DB.prepare(`SELECT COUNT(*) as total FROM buyer_leads ${where}`).bind(...params).first()
    ]);
    return okResponse({
      leads: rows.results,
      total: countRow?.total ?? 0,
      limit,
      offset
    }, env2, 200, request);
  }
  if (method === "GET" && id) {
    const lead = await env2.DB.prepare("SELECT * FROM buyer_leads WHERE id = ?").bind(id).first();
    if (!lead)
      return errorResponse("Lead tidak ditemukan", 404, env2, request);
    return okResponse(lead, env2, 200, request);
  }
  if (method === "PATCH" && id) {
    const body = await request.json();
    await env2.DB.prepare(`
      UPDATE buyer_leads
      SET status = ?, admin_notes = ?, updated_at = datetime('now')
      WHERE id = ?
    `).bind(body.status ?? "baru", body.admin_notes ?? null, id).run();
    return okResponse({ updated: true }, env2, 200, request);
  }
  return errorResponse("Method tidak diizinkan", 405, env2, request);
}
__name(handleLeads, "handleLeads");

// src/routes/inquiries.ts
async function handleInquiries(request, env2, url) {
  const method = request.method;
  const segments = url.pathname.split("/").filter(Boolean);
  const id = segments[2];
  if (method === "POST" && !id) {
    const body = await request.json();
    if (!body.listing_id || !body.name || !body.whatsapp) {
      return errorResponse("listing_id, name, dan whatsapp wajib diisi", 400, env2, request);
    }
    const newId = crypto.randomUUID();
    await env2.DB.prepare(`
      INSERT INTO inquiries (id, listing_id, from_user, name, whatsapp, message, via)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      newId,
      body.listing_id,
      body.from_user ?? null,
      body.name,
      body.whatsapp,
      body.message ?? null,
      body.via ?? "whatsapp"
    ).run();
    await env2.DB.prepare(
      "UPDATE listings SET inquiry_count = inquiry_count + 1 WHERE id = ?"
    ).bind(body.listing_id).run();
    return okResponse({ id: newId }, env2, 201, request);
  }
  if (method === "GET" && !id) {
    const claims = await verifyClerkToken(request, env2);
    if (!claims)
      return errorResponse("Unauthorized", 401, env2, request);
    const { limit, offset } = paginate(url);
    const listingId = url.searchParams.get("listing_id");
    const stage = url.searchParams.get("stage");
    const filters = [];
    const params = [];
    if (listingId) {
      filters.push("i.listing_id = ?");
      params.push(listingId);
    }
    if (stage) {
      filters.push("i.stage = ?");
      params.push(stage);
    }
    if (claims.role !== "admin") {
      filters.push("l.user_id = ?");
      params.push(claims.userId);
    }
    const where = filters.length ? `WHERE ${filters.join(" AND ")}` : "";
    const [rows, countRow] = await Promise.all([
      env2.DB.prepare(`
        SELECT i.*, l.title AS listing_title, l.code AS listing_code
        FROM inquiries i
        LEFT JOIN listings l ON l.id = i.listing_id
        ${where}
        ORDER BY i.created_at DESC
        LIMIT ? OFFSET ?
      `).bind(...params, limit, offset).all(),
      env2.DB.prepare(`
        SELECT COUNT(*) as total FROM inquiries i
        LEFT JOIN listings l ON l.id = i.listing_id
        ${where}
      `).bind(...params).first()
    ]);
    return okResponse({
      inquiries: rows.results,
      total: countRow?.total ?? 0
    }, env2, 200, request);
  }
  if (method === "PATCH" && id) {
    const claims = await verifyClerkToken(request, env2);
    if (!claims)
      return errorResponse("Unauthorized", 401, env2, request);
    const body = await request.json();
    await env2.DB.prepare(
      `UPDATE inquiries SET stage=?, notes=?, updated_at=datetime('now') WHERE id=?`
    ).bind(body.stage ?? "baru", body.notes ?? null, id).run();
    return okResponse({ updated: true }, env2, 200, request);
  }
  return errorResponse("Method tidak diizinkan", 405, env2, request);
}
__name(handleInquiries, "handleInquiries");

// src/routes/upload.ts
async function handleUpload(request, env2, url) {
  if (request.method !== "GET") {
    return errorResponse("Method tidak diizinkan", 405, env2, request);
  }
  const claims = await verifyClerkToken(request, env2);
  if (!claims)
    return errorResponse("Unauthorized", 401, env2, request);
  const key = env2.IMAGEKIT_PRIVATE_KEY ?? "";
  if (!key)
    return errorResponse("ImageKit private key tidak dikonfigurasi", 500, env2, request);
  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1e3) + 3600;
  const keyData = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const sigBuffer = await crypto.subtle.sign(
    "HMAC",
    keyData,
    new TextEncoder().encode(`${token}${expire}`)
  );
  const signature = Array.from(new Uint8Array(sigBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return okResponse({
    token,
    expire,
    signature,
    publicKey: env2.IMAGEKIT_PUBLIC_KEY ?? "",
    urlEndpoint: env2.IMAGEKIT_URL_ENDPOINT ?? ""
  }, env2, 200, request);
}
__name(handleUpload, "handleUpload");

// src/routes/admin.ts
async function handleAdmin(request, env2, url) {
  const claims = await verifyClerkToken(request, env2);
  if (!claims)
    return errorResponse("Unauthorized", 401, env2, request);
  if (claims.role !== "admin")
    return errorResponse("Forbidden \u2014 admin only", 403, env2, request);
  const method = request.method;
  const segments = url.pathname.split("/").filter(Boolean);
  const resource = segments[2];
  if (method === "GET" && resource === "stats") {
    const [users, listings, leads, revenue] = await Promise.all([
      env2.DB.prepare("SELECT COUNT(*) as n FROM users").first(),
      env2.DB.prepare("SELECT COUNT(*) as n FROM listings WHERE status = 'aktif'").first(),
      env2.DB.prepare("SELECT COUNT(*) as n FROM buyer_leads WHERE status = 'baru'").first(),
      env2.DB.prepare(
        "SELECT COALESCE(SUM(amount),0) as total FROM transactions WHERE status='paid' AND strftime('%Y-%m',created_at)=strftime('%Y-%m','now')"
      ).first()
    ]);
    return okResponse({
      total_users: users?.n ?? 0,
      active_listings: listings?.n ?? 0,
      new_leads: leads?.n ?? 0,
      monthly_revenue: revenue?.total ?? 0
    }, env2, 200, request);
  }
  if (method === "GET" && resource === "leads") {
    const { limit, offset } = paginate(url);
    const rows = await env2.DB.prepare(
      "SELECT * FROM buyer_leads ORDER BY created_at DESC LIMIT ? OFFSET ?"
    ).bind(limit, offset).all();
    const count3 = await env2.DB.prepare("SELECT COUNT(*) as n FROM buyer_leads").first();
    return okResponse({ leads: rows.results, total: count3?.n ?? 0 }, env2, 200, request);
  }
  if (method === "GET" && resource === "listings") {
    const { limit, offset } = paginate(url);
    const status = url.searchParams.get("status") ?? "pending";
    const rows = await env2.DB.prepare(
      "SELECT l.*, u.name AS agent_name FROM listings l LEFT JOIN users u ON u.id=l.user_id WHERE l.status=? ORDER BY l.created_at DESC LIMIT ? OFFSET ?"
    ).bind(status, limit, offset).all();
    const count3 = await env2.DB.prepare("SELECT COUNT(*) as n FROM listings WHERE status=?").bind(status).first();
    return okResponse({ listings: rows.results, total: count3?.n ?? 0 }, env2, 200, request);
  }
  if (method === "PATCH" && resource === "listings") {
    const listingId = segments[3];
    const action = segments[4];
    if (action === "approve") {
      await env2.DB.prepare(
        "UPDATE listings SET status='aktif', published_at=datetime('now') WHERE id=?"
      ).bind(listingId).run();
      return okResponse({ approved: true }, env2, 200, request);
    }
    if (action === "reject") {
      await env2.DB.prepare("UPDATE listings SET status='draft' WHERE id=?").bind(listingId).run();
      return okResponse({ rejected: true }, env2, 200, request);
    }
  }
  if (method === "PATCH" && resource === "users") {
    const userId = segments[3];
    const action = segments[4];
    if (action === "ban") {
      await env2.DB.prepare("UPDATE users SET is_banned=1 WHERE id=?").bind(userId).run();
      return okResponse({ banned: true }, env2, 200, request);
    }
    if (action === "unban") {
      await env2.DB.prepare("UPDATE users SET is_banned=0 WHERE id=?").bind(userId).run();
      return okResponse({ unbanned: true }, env2, 200, request);
    }
    if (action === "tier") {
      const body = await request.json();
      await env2.DB.prepare("UPDATE users SET tier=? WHERE id=?").bind(body.tier, userId).run();
      return okResponse({ tier_updated: true }, env2, 200, request);
    }
  }
  return errorResponse("Admin endpoint tidak ditemukan", 404, env2, request);
}
__name(handleAdmin, "handleAdmin");

// src/index.ts
var src_default = {
  async fetch(request, env2) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;
    if (method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(env2, request) });
    }
    if (path === "/health") {
      return Response.json(
        { status: "ok", env: env2.ENVIRONMENT, ts: (/* @__PURE__ */ new Date()).toISOString() },
        { headers: corsHeaders(env2, request) }
      );
    }
    try {
      if (path.startsWith("/api/listings"))
        return handleListings(request, env2, url);
      if (path.startsWith("/api/users"))
        return handleUsers(request, env2, url);
      if (path.startsWith("/api/leads"))
        return handleLeads(request, env2, url);
      if (path.startsWith("/api/inquiries"))
        return handleInquiries(request, env2, url);
      if (path.startsWith("/api/upload"))
        return handleUpload(request, env2, url);
      if (path.startsWith("/api/admin"))
        return handleAdmin(request, env2, url);
      return errorResponse("Route not found", 404, env2, request);
    } catch (err) {
      console.error("Worker error:", err);
      return errorResponse(err.message ?? "Internal server error", 500, env2, request);
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-WzxTUp/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-WzxTUp/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof __Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
__name(__Facade_ScheduledController__, "__Facade_ScheduledController__");
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = (request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    };
    #dispatcher = (type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    };
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
