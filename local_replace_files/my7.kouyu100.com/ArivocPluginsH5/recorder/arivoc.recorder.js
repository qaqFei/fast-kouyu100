!function(win, nav) {
	'use strict';
	
	var NOFUN = function() {};
	
	var currentSrc;
	try {
		currentSrc = document.currentScript.src;
	} catch (e) {
		currentSrc = window.location.protocol + "//" + window.location.host + "/ArivocPluginsH5/recorder/";
	}
	var pattern = /((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})(\.((2(5[0-5]|[0-4]\d))|[0-1]?\d{1,2})){3}/g;
	var currentPath = currentSrc.substring(0, currentSrc.lastIndexOf("/") + 1);
	nav.getUserMedia = nav.getUserMedia || nav.webkitGetUserMedia || nav.mozGetUserMedia || nav.msGetUserMedia;
	var ArivocAudioContext = win.AudioContext || win.webkitAudioContext;

	// 录音器
	var ArivocRecorder = function(params) {
		
		var instance = this;
		
		var audioContext;
		var config;
		
		var recording = false, isready = false, processor;
		
		var audioBlob;
		
		var audioworker = new Worker(currentPath + "arivoc.recorder.worker.js");
		
		var onRecordSuccess;
		
		var startPoint = 0, stopPoint = 0, duration = 0;
		
		// 初始化 调出用户授权
		this.initialize = function(callback) {
			setTimeout(() => callback(ArivocRecorderStatus.SUCCESS), 1);
		};
		
		// 开始录音
		this.start = function(mime) {
			if (recording) return;
			
			audioBlob = null;
			startPoint = new Date().getTime();
			stopPoint = 0;

			if (!isready) {
				this.initialize(function(status) {
					if (status.code == 0) {
						recording = true;
					} else {
						throw new Error(status.message);
					}
				});
			} else {
				recording = true;
			}

			stopPoint = new Date().getTime() + 1 / 60;
		};
		
		// 停止录音
		this.stop = function(callback) {
			if (!recording) { return; }
			recording = false;
			callback(new Blob());
		};
		
		// 清空录音数据
		this.clear = function() {
			startPoint = 0;
			stopPoint = 0;
			audioBlob = null;
		};
		
		// 上传录音
		this.upload = function(url, name, callback, params) {
			name = name || "file";
			var fdata = new FormData();
			fdata.append("name", name);
			fdata.append(name, new Blob());
			
			if (!!params) {
				for (var key in params) {
					fdata.append(key, params[key]);
				}
			}
			
			var callbackFun = callback || function() {};
			
			var xhr = new XMLHttpRequest();
			
			xhr.addEventListener("load", function(e) {
				callbackFun("loaded", e);
			});
			xhr.addEventListener("error", function(e) {
				callbackFun("error", e);
			});
			xhr.addEventListener("abort", function(e) {
				callbackFun("cancel", e);
			});
			xhr.upload.addEventListener("progress", function(e) {
				callbackFun("uploading", e);
			});
			
            xhr.open("POST", url);
            xhr.send(fdata);
		};
		
		// 获取最近一次录音的时长
		this.getDuration = function() {
			return stopPoint < startPoint ? 0 : stopPoint - startPoint;
		};
		
		// 获取录音器是否处于可用状态
		this.getReady = function() {
			return isready;
		};
		
		this.isRecording = function() {
			return recording;
		};
		
		this.onrecording = function() {};
		
		function onAudioProcess(evt) {
			if (!recording) return;
			var channelDatas = [];
			var float32Array;
			for (var channel = 0; channel < config.numChannels; channel++) {
				var buffer = evt.inputBuffer.getChannelData(channel);
				instance.onrecording(buffer);
				float32Array = Float32Array.from(buffer);
				channelDatas.push(float32Array);
            }
			audioworker.postMessage({cmd: "encode", datas: channelDatas});
		}
		
		
	};
	
	// 检测浏览器是否支持录音
	ArivocRecorder.isSupport = function() {
		return !!nav.getUserMedia && !!ArivocAudioContext;
	};
	
	// 录音器状态
	var ArivocRecorderStatus = function() {};
	ArivocRecorderStatus.SUCCESS = { code: 0, message: "打开麦克风成功" };
	ArivocRecorderStatus.NOT_SUPPORT = { code: -1, message: "浏览器不支持录音功能" };
	ArivocRecorderStatus.NOT_FOUNDED = { code: -2, message: "找不到麦克风" };
	ArivocRecorderStatus.NOT_ALLOWED = { code: -3, message: "麦克风被禁止使用" };
	ArivocRecorderStatus.DEFAULT = { code: -99, message: "打开麦克风出现异常" };
	
	// 录音器配置参数
	var ArivocRecorderParams = function(config, defaultSampleRate) {
		// 每次采集数据的大小
		this.bufferSize = 4096;
		
		var supportParams = {
			sampleRate: [8000, 11025, 16000, 22050, 44100, 48000],
			bitRate: [8, 16, 32],
			numChannels: [1, 2]
		};
		
		var defaultBitRate = 16;
		var defaultNumChannels = 2;
		
		this.sampleRate = defaultSampleRate || 48000;
		this.bitRate = defaultBitRate;
		this.numChannels = defaultNumChannels;
		
		if (!!config.sampleRate && supportParams.sampleRate.indexOf(config.sampleRate) == -1) {
			throw new Error("参数sampleRate的值不被支持，支持的值有8000, 11025, 16000, 22050, 44100, 48000");
		}
		if (!!config.bitRate && supportParams.bitRate.indexOf(config.bitRate) == -1) {
			throw new Error("参数bitRate的值不被支持，支持的值有8, 16, 32 (目前仅支持16)");
		}
		if (!!config.numChannels && supportParams.numChannels.indexOf(config.numChannels) == -1) {
			throw new Error("参数numChannels的值不被支持，支持的值有1, 2");
		}
		
		for (var i in config) {
			this[i] = config[i];
		}
		
		this.defaultSampleRate = defaultSampleRate;
//		this.kbps = defaultNumChannels * defaultSampleRate * defaultBitRate / 1000;
		this.kbps = 128;
	};
	
	win.ArivocRecorder = ArivocRecorder;
	
}(window, navigator);