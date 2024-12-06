!function(win, doc) {
	'use strict';
	
	// 音频播放器
	var ArivocPlayer = function(params) {
		
		// 播放器
		var player = this.player = doc.createElement("video");
		player.muted = true;
		
		params = params || {};
		
		var progressTimer,
		milliseconds = 100,
		timeout = 0,
		timeoutTimer = 0,
		playing = false,
		curSrc = null,
		loadnoplay = false,
		NOFUN = function() {},
		config = {
			timeout: params.timeout || timeout,
			playingInterval: params.playingInterval || milliseconds,
			onAudioLoaded: params.onAudioLoaded || NOFUN,
			onAudioStart: params.onAudioStart || NOFUN,
			onAudioPlaying: params.onAudioPlaying || NOFUN,
			onAudioPause: params.onAudioPause || NOFUN,
			onAudioError: params.onAudioError || NOFUN,
			onAudioEnd: params.onAudioEnd || NOFUN,
			onAudioRangeEnd: params.onAudioRangeEnd || NOFUN,
			onAudioTimeout: params.onAudioTimeout || NOFUN,
		},
		playlist = new ArivocPlaylist();
		
		milliseconds = config.playingInterval;
		
		this.player.addEventListener("loadedmetadata", function(evt) {
			curSrc = evt.target.src;
			config.onAudioLoaded();
		});
		
		this.player.oncanplay = onCanPlay;
//		this.player.addEventListener("canplaythrough", onCanPlay);
		
		function onCanPlay(evt) {
			if (loadnoplay) {
				loadnoplay = false;
				return;
			}
			evt.target.play();
			console.log("3. " + new Date().getTime());
			clearTimeout(timeoutTimer);
			if (progressTimer) {
				clearInterval(progressTimer);
			}
			progressTimer = setInterval(sendPlayProgress, 0);
			playing = true;
			config.onAudioStart(playlist.curIndex);
		}
		
		this.player.addEventListener("ended", function(evt) {
			var last = playlist.isLastOne();
			config.onAudioEnd(playlist.curIndex, last);
			clearInterval(progressTimer);
			playing = false;
			if (!last) {
				evt.target.src = playlist.getNext(true);
				evt.target.load();
			} else {
				playOver();
			}
		});
		
		this.player.addEventListener("error", function(evt) {
			config.onAudioError(playlist.curIndex);
			clearInterval(progressTimer);
			playing = false;
			if (!playlist.isLastOne()) {
				evt.target.src = playlist.getNext(true);
				evt.target.load();
			} else {
				playOver();
			}
		});
		
		// 载入不播放
		this.load = function(any) {
			loadnoplay = true;
			
			var Class = any.constructor;
			var audioSrc;
			switch (Class) {
				case Number:
					audioSrc = playlist.getAudio(Math.floor(any));
					break;
				case String:
					audioSrc = any;
					break;
				case Blob:
					audioSrc = (window.URL || window.webkitURL).createObjectURL(any);
					break;
				default:
					break;
			}
			this.player.src = audioSrc;
			this.player.load();
		};
		
		// 播放
		this.play = function(any) {
			loadnoplay = false;
			if (any == undefined) {
				if (!!curSrc) {
					this.player.play();
					if (progressTimer) {
						clearInterval(progressTimer);
					}
					progressTimer = setInterval(sendPlayProgress, 0);
					playing = true;
					config.onAudioStart(playlist.curIndex);
					return;
				}
				any = playlist.indexes[0];
			}
			if (any == undefined) {
				return;
			}
			
			var Class = any.constructor;
			var audioSrc;
			switch (Class) {
				case Number:
					audioSrc = playlist.getAudio(Math.floor(any));
					break;
				case String:
					audioSrc = any;
					break;
				case Blob:
					audioSrc = (window.URL || window.webkitURL).createObjectURL(any);
					break;
				default:
					break;
			}
			this.player.src = "data:audio/mp3;base64,//sQxAAABIghVBSRgAipjDK3KFQDQCgEAQFDlxWKxQKCRAgYgAB4eHh4YAAAAAB4eHh6QAAAAQHj6BgKBQMBgMAAAAAAAABwAZ/rXOgaocXN5MG3qHfAokAX4GEQBAv+JAYfigACADT/+xLEAgJEnB1HPcEAMKCDp+q6IAQAH2cp+zAARMOE044DzjJIMKgpZ71rFSpktk6j//qLO9A0N0CT3VUC9pgAFRnvfxn+FgGAFOhpkqYbJrahUEHP8H1A+/W8ALccAAAKGgzHA1AAAAD/+xDEBYAGCGN7uHkQGAAANIOAAAQAAAUHXhkh6k34FhACNXFHCyMTsv4AYApwGTBbx/hlwaIuMlnjakxBTUUzLjk4LjSqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==";
			this.player.load();
			
			if (config.timeout > 0) {
				console.log("1. " + new Date().getTime());
				timeoutTimer = setTimeout(onLoadTimeout, config.timeout);
			}
		};
		
		// 暂停
		this.pause = function() {
			loadnoplay = true;
			this.player.pause();
			clearInterval(progressTimer);
			playing = false;
			config.onAudioPause(playlist.curIndex);
		};
		
		// 指定位置播放
		this.seek = function(time) {
			this.player.currentTime = time;
			if (!playing) {
				this.play();
			}
		};
		
		// 指定一个或多个范围播放
		this.rangePlay = function(points) {
			if (!curSrc) {
				throw new Error("未加载声音");
			}
			if (!arguments || arguments.length == 0) {
				rangePlay(this, {start: 0, end: Number.MAX_VALUE});
				return;
			}
			rangePlay(this, arguments);
		};
		
		// 上一曲
		this.prev = function() {
			this.player.src = playlist.getPrev();
			this.player.load();
		};
		
		// 下一曲
		this.next = function() {
			this.player.src = playlist.getNext();
			this.player.load();
		};
		
		// 音量设置
		this.volume = function(value) {
			this.player.volume = value;
		};
		
		// 载入播放列表
		this.loadPlaylist = function(list) {
			playlist.loadPlaylist(list);
		};
		
		// 向播放列表里添加一个声音
		this.loadOne = function(url) {
			playlist.addAudio(url);
		};
		
		// 移除一个播放列表里的声音
		this.removeOne = function(index) {
			playlist.removeAudio(index);
		};
		
		// 清空播放列表
		this.clearPlaylist = function() {
			playlist.clear();
		};
		
		// 改变模式
		this.changeMode = function(mode) {
			playlist.changeMode(mode);
		};
		
		this.getCurrentTime = function() {
			return this.player.currentTime;
		};
		
		this.getDuration = function() {
			return player.duration;
		};
		
		this.getCurrentSource = function() {
			return curSrc;
		};
		
		this.isPlaying = function() {
			return playing;
		};
		
		// 列表播放完
		function playOver() {
//			curSrc = null;
			playlist.curIndex = -1;
		}
		
		function sendPlayProgress() {
			var ratio = player.currentTime / player.duration;
			ratio = ratio > 1 ? 1 : ratio < 0 ? 0 : ratio;
			config.onAudioPlaying(ratio);
//			config.onAudioPlaying(Math.floor(player.currentTime / player.duration * 100) / 100);
		}
		
		
		var rangeTimer, rangePoints;
		function rangePlay(instance, points) {
			console.log(points);
			rangePoints = points;
			clearInterval(rangeTimer);
			var point = rangePoints[0];
			playRange(instance, 0, point.start, point.end, onRangeEnd);
		}
		function onRangeEnd(instance, index) {
			if (index >= rangePoints.length - 1) {
				config.onAudioRangeEnd();
			} else {
				index++;
				var point = rangePoints[index];
				playRange(instance, index, point.start, point.end, onRangeEnd);
			}
		}
		function playRange(instance, index, start, end, endCallback) {
			console.log(start, end);
			instance.seek(start);
			rangeTimer = setInterval(check, 0);
			
			function check() {
				if (instance.getCurrentTime() >= end) {
					instance.pause();
					clearInterval(rangeTimer);
					endCallback(instance, index);
				}
			}
		}
		
		function onLoadTimeout() {
			console.log("2. " + new Date().getTime());
			player.pause();
			loadnoplay = true;
			config.onAudioTimeout();
		}
	};
	
	// 当前浏览器是否支持音频播放
	ArivocPlayer.isSupport = function() {
		return !!doc.createElement("audio").canPlayType;
	};
	
	var ArivocPlaylist = function() {
		
		this.indexes = new Array();
		this.list = new Array();
		this.curIndex = -1;
		this.mode = ArivocPlayMode.ORDER;
		
		this.addAudio = function(audiourl) {
			this.list.push(audiourl);
			this.indexes.push(this.indexes.length);
		};
		
		this.removeAudio = function(index) {
			this.list.split(index, 1);
			this.indexes.split(this.indexes.indexOf(index), 1);
		};
		
		this.loadPlaylist = function(playlist) {
			this.clear();
			var length = playlist.length;
			for (var i = 0; i < length; i++) {
				this.list.push(playlist[i]);
			}
			this.cleanIndexes(length);
		};
		
		this.clear = function() {
			this.indexes = new Array();
			this.list = new Array();
			this.curIndex = -1;
		};
		
		this.cleanIndexes = function(length) {
			this.indexes = new Array();
			for (var i = 0; i < length; i++) {
				this.indexes.push(i);
			}
			switch (this.mode) {
				case ArivocPlayMode.RANDOM:
					this.indexes = orderArray(this.indexes, this.curIndex);
					break;
				default:
					break;
			}
		};
		
		// 获取上一个声音
		this.getPrev = function() {
			if (this.list.length == 0) { return ""; }
			
			var ii = this.indexes.indexOf(this.curIndex);
			ii > 0 ? ii-- : ii = this.indexes.length - 1;
			this.curIndex = this.indexes[ii];
			return this.list[this.curIndex];
		};
		
		// 获取下一个声音
		this.getNext = function(isAuto) {
			if (this.list.length == 0) { return ""; }
			
			var ii = this.indexes.indexOf(this.curIndex);
			if (this.mode == ArivocPlayMode.ONELOOP && ii != -1 && isAuto) {
				return this.list[ii];
			}
			if (this.mode == ArivocPlayMode.ORDER && ii == this.indexes.length - 1 && isAuto) {
				this.curIndex = -1;
				return null;
			}
			if (this.mode == ArivocPlayMode.RANDOM && ii == this.indexes.length - 1) {
				this.indexes = orderArray(this.indexes);
			}
			(ii < this.indexes.length - 1) ? ii++ : ii = 0;
			this.curIndex = this.indexes[ii];
			return this.list[this.curIndex];
		};
		
		// 获取指定下标的声音
		this.getAudio = function(index) {
			if (this.list.length == 0 || index >= this.list.length) { return ""; }
			
			this.curIndex = index;
			return this.list[index];
		};
		
		// 改变播放模式
		this.changeMode = function(mode) {
			this.mode = mode;
			this.cleanIndexes(this.list.length);
		};
		
		this.isLastOne = function() {
			if (this.mode == ArivocPlayMode.ORDER && this.curIndex == this.indexes.length - 1) {
				return true;
			}
			return false;
		};
		
		// 数组乱序
		function orderArray(originArray, start) {
			var newArray = new Array();
			if (start > -1 && start < originArray.length) {
				newArray.push(originArray.splice(originArray.indexOf(start), 1)[0]);
			}
			var length = originArray.length;
			for (var i = 0; i < length; i++) {
				newArray.push(originArray.splice(Math.floor(Math.random() * originArray.length), 1)[0]);
			}
			return newArray;
		}
		
	};
	
	var ArivocPlayMode = function() {};
	ArivocPlayMode.ORDER = "order_mode";
	ArivocPlayMode.LOOP = "loop_mode";
	ArivocPlayMode.ONELOOP = "one_loop_mode";
	ArivocPlayMode.RANDOM = "random_mode";
	
	
	// 暴露的类
	win.ArivocPlayer = ArivocPlayer;
	win.ArivocPlayMode = ArivocPlayMode;
}(window, document);
