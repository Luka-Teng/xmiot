/// <reference path="../../../declare/global.d.ts" />

// 在Window上挂载hybrid，JSBridge，nativeCallback
declare interface Window {
  hybrid: genObject
  JSBridge: genObject
  nativeCallback: genObject
}
