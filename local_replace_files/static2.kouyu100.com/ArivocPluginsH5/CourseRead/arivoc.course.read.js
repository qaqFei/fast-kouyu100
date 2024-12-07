var ArivocCourseRead = (function(win, $, ArivocPlayer, ArivocRecorder) {
	
	var debug = false;
	var log = function() {};

	var scoreOptions = [
		{value: 70, label: "70"},
		{value: 75, label: "75", selected: true},
		{value: 80, label: "80"},
		{value: 85, label: "85"},
		{value: 90, label: "90"}
	];
	
	// 录音0，领读1，评价2，挑战（PK）3，背诵9，单句10，智能11，快速12，通读13
	var modeOptions = [
		{value: 11, label: "智能"},
		{value: 12, label: "快速"},
		{value: 10, label: "单句"},
		{value: 9, label: "背诵"},
		{value: 0, label: "录音"},
		{value: 1, label: "领读"},
		{value: 13, label: "通读"},
		{value: 2, label: "评价"},
		{value: 3, label: "挑战"}
	];
	
	var beginTips = "data:audio/mp3;base64,//sQxAAABIghVBSRgAipjDK3KFQDQCgEAQFDlxWKxQKCRAgYgAB4eHh4YAAAAAB4eHh6QAAAAQHj6BgKBQMBgMAAAAAAAABwAZ/rXOgaocXN5MG3qHfAokAX4GEQBAv+JAYfigACADT/+xLEAgJEnB1HPcEAMKCDp+q6IAQAH2cp+zAARMOE044DzjJIMKgpZ71rFSpktk6j//qLO9A0N0CT3VUC9pgAFRnvfxn+FgGAFOhpkqYbJrahUEHP8H1A+/W8ALccAAAKGgzHA1AAAAD/+xDEBYAGCGN7uHkQGAAANIOAAAQAAAUHXhkh6k34FhACNXFHCyMTsv4AYApwGTBbx/hlwaIuMlnjakxBTUUzLjk4LjSqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==";
	var endTips = "data:audio/mp3;base64,SUQzAwAAAAAfdlBSSVYAAAAOAABQZWFrVmFsdWUA2FUAAFBSSVYAAAARAABBdmVyYWdlTGV2ZWwApCYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7EMQAAANsAYE0AQAwwgwqgzZwAAVSsqKAN5QEw/Lh90EAQ8mGOn3fLg+HwQBA5ShiQ1yhpkOCqsbFQFvJK4Pq+9drXf//CIALwHCkBv4ORUA4H3+KQekS32hIt+1Vv9QPAAtuIYRF//sSxAODRMiBQF3BADCfg6TB3+xAhj09H8zSdyQpjANlYGQeXbBjvRr////////8K7foJcAg4IRLMHiwMf5lMSKSHTDDQgs3qmM1TTIigxIKBRGJBCa87///DPVVAgBUAAAWRMAUAYwG//sQxAYARVB/NO8ArWBdg2w0HJgOAIzBZCgM0ZUQyLwhDBKAZBwDzHXway5Tg5//CTf48AASgAAbCCu+hr2DxAXF8AEwR///63cmEqAAANFwzuzAbCGMFAdszBeLTIAGRA3vYDALQKD/+xLEDoNGjH8qbPqAYLoP5AWvUBJguQCgYLkiDj3///1dV2qua0xql9P86gQ3B08ooFDEjx4QL2NA5/ZjYAEGFqAyB1FgGUVAEnwaDAiJOq/////rV5cPp/y1EAEBMgGhglCmSu0ZgPH/+xDEBwNEpB0qLntCAMwP5Y68IARhkBDJHL9mcaGRLgIeHDEa16X///7OpwEQMCgCgEApmF6H2YoZK5r7vfmowHgYDwFAgArMCsAUGgHkwAzqKUYf///////44g34I6oAAAcDgcDgcP/7EsQEAAWkb5m5FoIQhQ3ja4YwBQAAAAAACyiLfbwM0QP4AnglPgZgOgRn+BQwtoewWz/hvBVCeWOAAkyEQAAHqqrhgImAhR1VXUBErxm4zN6r///VVV2DCihVTEFNRTMuOTguNFVVVVRBRwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAM";
	
	var CourseRead = function() {};
	CourseRead.doStep = "do_step";
	CourseRead.doStepComplete = "do_step_complete";
	CourseRead.started = "do_started";
	CourseRead.practiced = "do_practiced";
	CourseRead.load_teacher = "do_load_teacher";
	CourseRead.play_guide_before = "do_play_guide_before";
	CourseRead.play_guide_after = "do_play_guide_after";
	CourseRead.play_begin_tips = "do_play_begin_tips";
	CourseRead.play_end_tips = "do_play_end_tips";
	CourseRead.play_teacher = "do_play_teacher";
	CourseRead.recording = "do_recording";
	CourseRead.analysising = "do_analysising";
	CourseRead.play_feedback = "do_play_feedback";
	CourseRead.play_record = "do_play_record";
	CourseRead.is_passed = "do_is_passed";
	CourseRead.is_repeat = "do_is_repeat";
	CourseRead.is_finished = "do_is_finished";
	CourseRead.finished = "do_finished";
	CourseRead.feedback_finish = "do_feekback_finish";
	CourseRead.audition_finish = "do_audition_finish";
	CourseRead.playall_finish = "do_playall_finish";
	CourseRead.next_sentence = "do_next_sentence";
	
	CourseRead.wait_1000 = "do_wait_1000";
	
	// aryn老师说话
	CourseRead.moveto_say = "do_moveto_say";
	CourseRead.endto_say = "do_endto_say";
	// aryn老师指黑板
	CourseRead.moveto_blackboard = "do_moveto_blackboard";
	CourseRead.endto_blackboard = "do_endto_blackboard";
	// aryn老师拿话筒
	CourseRead.moveto_microphone = "do_moveto_microphone";
	CourseRead.endto_microphone = "do_endto_microphone";
	// aryn老师亮分数
	CourseRead.moveto_single_score = "do_moveto_single_score";
	CourseRead.endto_single_score = "do_endto_single_score";
	// aryn老师拿录音机
	CourseRead.moveto_recorder = "do_moveto_recorder";
	CourseRead.endto_recorder = "do_endto_recorder";
	
	// 智能模式
	var handfreeModel = new Array(
		CourseRead.started,
		
		CourseRead.moveto_say,
		CourseRead.play_guide_before,
		CourseRead.endto_say,
		CourseRead.moveto_blackboard,
		CourseRead.play_teacher,
		CourseRead.endto_blackboard,
		CourseRead.play_begin_tips,
		CourseRead.moveto_microphone,
		CourseRead.recording,
		CourseRead.play_end_tips,
		CourseRead.endto_microphone,
		CourseRead.analysising,
		CourseRead.moveto_single_score,
		CourseRead.play_feedback,
		CourseRead.endto_single_score,
		CourseRead.moveto_recorder,
		CourseRead.play_record,
		CourseRead.endto_recorder,
		CourseRead.is_passed,
		CourseRead.is_repeat,
		CourseRead.is_finished,
		CourseRead.moveto_say,
		CourseRead.play_guide_after,
		CourseRead.endto_say,
		CourseRead.finished,
		
		CourseRead.next_sentence
	);
	
	// 单句模式
	var singleModel = new Array(
		CourseRead.started,
			
		CourseRead.moveto_blackboard,
		CourseRead.play_teacher,
		CourseRead.endto_blackboard,
		CourseRead.play_begin_tips,
		CourseRead.moveto_microphone,
		CourseRead.recording,
		CourseRead.play_end_tips,
		CourseRead.endto_microphone,
		CourseRead.analysising,
		CourseRead.moveto_single_score,
		CourseRead.play_feedback,
		CourseRead.endto_single_score,
		CourseRead.moveto_recorder,
		CourseRead.play_record,
		CourseRead.endto_recorder,
		CourseRead.is_passed
	);
	
	// 快速模式
	var quickModel = new Array(
		CourseRead.started,
		
		CourseRead.moveto_say,
		CourseRead.play_guide_before,
		CourseRead.endto_say,
		CourseRead.moveto_blackboard,
		CourseRead.play_teacher,
		CourseRead.endto_blackboard,
		CourseRead.play_begin_tips,
		CourseRead.moveto_microphone,
		CourseRead.recording,
		CourseRead.play_end_tips,
		CourseRead.endto_microphone,
		CourseRead.analysising,
		CourseRead.is_passed,
		CourseRead.is_repeat,
		CourseRead.is_finished,
		CourseRead.moveto_say,
		CourseRead.play_guide_after,
		CourseRead.endto_say,
		CourseRead.finished,
		
		CourseRead.next_sentence
	);
	
	// 录音模式
	var recordModel = new Array(
		CourseRead.started,
		
		CourseRead.moveto_say,
		CourseRead.play_guide_before,
		CourseRead.endto_say,
		CourseRead.load_teacher,
		CourseRead.play_begin_tips,
		CourseRead.moveto_microphone,
		CourseRead.recording,
		CourseRead.play_end_tips,
		CourseRead.endto_microphone,
		CourseRead.analysising,
		CourseRead.is_passed,
		CourseRead.is_repeat,
		CourseRead.is_finished,
		CourseRead.finished,
		
		CourseRead.next_sentence
	);
	
	// 领读模式
	var record2Model = new Array(
		CourseRead.started,
		
		CourseRead.moveto_say,
		CourseRead.play_guide_before,
		CourseRead.endto_say,
		CourseRead.moveto_blackboard,
		CourseRead.play_teacher,
		CourseRead.endto_blackboard,
		CourseRead.play_begin_tips,
		CourseRead.moveto_microphone,
		CourseRead.recording,
		CourseRead.play_end_tips,
		CourseRead.endto_microphone,
		CourseRead.analysising,
		CourseRead.is_passed,
		CourseRead.is_repeat,
		CourseRead.is_finished,
		CourseRead.finished,
		
		CourseRead.next_sentence
	);
	
	// 背诵模式
	var reciteModel = new Array(
		CourseRead.started,
		
		CourseRead.moveto_say,
		CourseRead.play_guide_before,
		CourseRead.endto_say,
		CourseRead.load_teacher,
		CourseRead.play_begin_tips,
		CourseRead.moveto_microphone,
		CourseRead.recording,
		CourseRead.play_end_tips,
		CourseRead.endto_microphone,
		CourseRead.analysising,
		CourseRead.is_passed,
		CourseRead.is_repeat,
		CourseRead.is_finished,
		CourseRead.finished,
		
		CourseRead.next_sentence
	);
	
	// 通读模式
	var recite2Model = new Array(
		CourseRead.started,
		
		CourseRead.moveto_say,
		CourseRead.play_guide_before,
		CourseRead.endto_say,
		CourseRead.load_teacher,
		CourseRead.moveto_microphone,
		CourseRead.recording,
		CourseRead.endto_microphone,
		CourseRead.analysising,
		CourseRead.is_passed,
		CourseRead.is_repeat,
		CourseRead.is_finished,
		CourseRead.finished,
		
		CourseRead.next_sentence
	);
	
	// 评价模式
	var freeModel = new Array(
		CourseRead.started,
		
		CourseRead.moveto_blackboard,
		CourseRead.play_teacher,
		CourseRead.endto_blackboard,
		CourseRead.load_teacher,
		CourseRead.play_begin_tips,
		CourseRead.moveto_microphone,
		CourseRead.recording,
		CourseRead.play_end_tips,
		CourseRead.endto_microphone,
		CourseRead.analysising,
		CourseRead.moveto_recorder,
		CourseRead.play_record,
		CourseRead.endto_recorder,
		CourseRead.is_passed,
		CourseRead.is_repeat,
		CourseRead.is_finished,
		CourseRead.finished,
		
		CourseRead.next_sentence
	);
	
	// 挑战模式
	var arneaModel = new Array(
		CourseRead.started,
		
		CourseRead.moveto_say,
		CourseRead.play_guide_before,
		CourseRead.endto_say,
		CourseRead.moveto_blackboard,
		CourseRead.play_teacher,
		CourseRead.endto_blackboard,
		CourseRead.play_begin_tips,
		CourseRead.moveto_microphone,
		CourseRead.recording,
		CourseRead.play_end_tips,
		CourseRead.endto_microphone,
		CourseRead.analysising,
		CourseRead.is_passed,
		CourseRead.is_repeat,
		CourseRead.is_finished,
		CourseRead.finished,
		
		CourseRead.next_sentence
	);
	
	// 播放反馈模式
	var feedbackModel = new Array(
		CourseRead.play_feedback,
		CourseRead.play_record,
		CourseRead.feedback_finish
	);
	// 全文试听模式
	var auditionModel = new Array(
		CourseRead.started,
		
		CourseRead.play_teacher,
		CourseRead.audition_finish,
		CourseRead.wait_1000,
		CourseRead.next_sentence
	);
	// 跟读全放模式
	var playallModel = new Array(
		CourseRead.started,
		
		CourseRead.play_record,
		CourseRead.playall_finish,
		CourseRead.wait_1000,
		CourseRead.next_sentence
	);
	
	/*var CourseReadModel = function() {};
	CourseReadModel.HAND_FREE_MODEL = 11;
	CourseReadModel.QUICK_MODEL = 12;
	CourseReadModel.SINGLE_MODEL = 10;
	CourseReadModel.RECITE_MODEL = 9;
	CourseReadModel.RECORD_MODEL = 0;
	CourseReadModel.RECORD2_MODEL = 1;
	CourseReadModel.RECITE2_MODEL = 13;
	CourseReadModel.FREE_MODEL = 2;*/
	
	var ACR = function(selector, option) {
		
		var NOFUN = function() {};
		
		// 初始化参数 默认值
		var defaultOption = {
			allowToResize: 1, // 是否允许全屏 1允许     0不允许
			type: -1,
			baseurl: null,
			analysisServer: null,
			teacherServer: null,
			primary: 0, // 是否是小学 0:不是 非0:是
			primaryTrial: 0, // 是否是小学试用期 0:不是 非0:是
			userSex: 0, //(1:男；2:女);
			leaderGrade: 0, // 是否有领读模式
			matchId: "", // 比赛ID
			matchType: 0, // 比赛类型
			showScoreSwitch: 0, // 显示分数开关
			lessonNum: "0", // 海选比赛 得分弹窗标识 （为"2" 不弹窗）
			domain: "", // 当前域名
			asr: null,
			userFlag: -1,
			homeworkId: 0, //训练ID
			hideReadModel: "0", // 隐藏模式 0 不隐藏 1 听说分离 2 单句模式 3 快速模式 4 通读模式
			recite: null,
			appointType: "",
			hwtype: "-",
			edic: true,
			readDifficultSwitch:"0",
			getLessonId: NOFUN,
			getParasValue: NOFUN,
			getUserToken: NOFUN,
			gotoHelp: NOFUN,
			getProgramme: NOFUN,
			gotoPay: NOFUN,
			unpay1: NOFUN,
			gotoParentCommunication: NOFUN,
			gotoBackHome: NOFUN,
			listenLeave: NOFUN,
			listenLeave2: NOFUN,
			resultHandler: NOFUN,
			refreshMatch: NOFUN,
			almightMatchInvoke: NOFUN,//单词全能王
			giveVipSwitch:0,//限时VIP开关
			log: console.log
		};
		var config = $.extend(true, {}, defaultOption, option);
		log = debug ? config.log : log;
		
		console.log("初始化参数 ：", config);
		function encourage(){
			if(config.readDifficultSwitch=="1"){//鼓励为主
				return result = {value: 0, label: "鼓励为主", letter: "Z", selected: true};
			}else {
				return result = {value: 0, label: "鼓励为主", letter: "Z"};
			}
		}

		function medium(){
			if (config.readDifficultSwitch=="0" || config.readDifficultSwitch=="2" || config.readDifficultSwitch=="null"){//中等难度
				return result = {value: 1, label: "中等难度", letter: "A", selected: true};
			}else {
				return result = {value: 1, label: "中等难度", letter: "A"};
			}
		}

		function refuse(){
			if (config.readDifficultSwitch=="3"){//严格拒绝
				return result = {value: 2, label: "严格拒绝", letter: "N", selected: true};
			}else {
				return result = {value: 2, label: "严格拒绝", letter: "N"};
			}
		}

		var diffOptions = [
			encourage(),
			medium(),
			refuse()
		];

		var content = $('<div class="arivoc-plugin-course-read-full-container">' +
							'<div class="arivoc-plugin-course-read">' +
								'<div class="course-read-blackboard">' +
									'<div class="progressbar">' +
										'<div class="highlight"></div>' +
									'</div>' +
									'<div class="content"></div>' +
									'<div class="translate"></div>' +
									'<div class="logtips"></div>' +
								'</div>' +
								'<div class="course-read-animate">' +
									'<canvas width="550" height="420"></canvas>' +
								'</div>' +
								'<div class="score-blackboard">' +
									'<div class="title">本句得分</div>' +
									'<div class="score"></div>' +
								'</div>' +
								'<div class="help-area"></div>' +
								'<div class="course-read-controler">' +
									'<div class="full-screen-button"></div>' +
									'<select class="diff-select"></select>' +
									'<div class="target-score">' +
										'<select class="target-select"></select>' +
									'</div>' +
									'<div class="read-mode">' +
										'<select class="mode-select"></select>' +
										'<input type="checkbox" class="slow-check" />' +
									'</div>' +
									'<div class="record-monitor">' +
										'<div class="mic-box">' +
											'<div class="vol-color"></div>' +
											'<div class="mic-bottom"></div>' +
											'<div class="mic-mask"></div>' +
										'</div>' +
									'</div>' +
									'<div class="start-button"></div>' +
									'<div class="button-group">' +
										'<div class="feedback"></div>' +
										'<div class="audition"></div>' +
										'<div class="playall"></div>' +
									'</div>' +
								'</div>' +
							'</div>' +
						'</div>');
		$(selector).prepend(content);
		
		if (config.allowToResize == 0) {
			content.find(".full-screen-button").hide();
		}
		
		var originScale = content.find(".arivoc-plugin-course-read").get(0).getBoundingClientRect().width / content.find(".arivoc-plugin-course-read").width();
		var fsscale = originScale;
		//监听全屏和退出全屏
		win.onresize = function() {
			if (isFullscreen()) {
				content.find(".full-screen-button").addClass("fullscreen");
				
				var originWidth = content.find(".arivoc-plugin-course-read").width();
				var originHeight = content.find(".arivoc-plugin-course-read").height();
				
				var fullWidth = content.width();
				var fullHeight = content.height();
				
				fsscale = Math.min(fullWidth / originWidth, fullHeight / originHeight);
				
				content.find(".arivoc-plugin-course-read").css({"transform": "scale(" + fsscale + ")", "-moz-transform": "scale(" + fsscale + ")", "-webkit-transform": "scale(" + fsscale + ")", "-ms-transform": "scale(" + fsscale + ")"});
			} else {
				fsscale = originScale;
				content.find(".full-screen-button").removeClass("fullscreen");
				content.find(".arivoc-plugin-course-read").css({"transform": "scale(1)", "-moz-transform": "scale(1)", "-webkit-transform": "scale(1)", "-ms-transform": "scale(1)"});
			}
		};
		var targetobj = this, cookie = null, interval = 50;
		var lessonId, courseUrl, cnTextShow = "1", isMerge = "0", isWordLesson = false;
		var readType = -1, targetScore = 0, steps = null, stepIndex = 0, readDiff = null, isSlow = false, haveApply = false, freeApply = false, cacheId = null, userId = null, onlyMark = null, curRole = null, temSteps = null;
		var isReciteWork = config.recite != null, reciteLessonId = config.getLessonId(), reciteWords = null;
		var lessonData = null, analysisServer = null, eppathServer = "recstatic.kouyu100.com", sentenceIndex = -1, finished = false, attachData = null, immeover = false;
		
		var recTimer = null, waitTimer = null, audioEndDelay = null, recordEndDelay = null, arynSayDelay = null;
		
		var conFS = 16, minFS = 16, maxFS = 24, incFS = 4;
		
		var failCount = 0, warnCount = 0, refusedCount = 0, refusedRedu = 2;
		
		//领读模式显示 可以进行领读模式
		var isLeaderGradeShow = (config.userFlag == 2 || config.userFlag == 4) && config.leaderGrade == 1; 
		
		var arynAnimate = new Arivoc_Aryn_Animate_Read(content.find(".course-read-animate canvas").get(0), "87314B3A2D208941AA4A0F4DB3198183");
		
		var mediaPlayer = new ArivocPlayer({
			playingInterval: interval,
		    onAudioLoaded: onAudioLoaded,
		    onAudioPlaying: onAudioPlaying,
		    onAudioError: onAudioError,
		    onAudioEnd: onAudioEnd
		});
		var mediaRecorder = new ArivocRecorder({
			sampleRate: 16000,
			numChannels: 1
		});
		
		//限时VIP开关
		var giveVipSwitch = config.giveVipSwitch;
		var homeWorkIdFor4 = config.homeworkId;
		//是不是VIP
		var vipFlag = config.userFlag;
		function init(lid, curl, cts, merge, isword) {
			
			console.log("初始化：");
			console.log("lessonId：" + lid);
			console.log("courseurl：" + curl);
			
			lessonId = lid;
			courseUrl = curl;
			cnTextShow = cts || "1";
			isMerge = merge || "0";
			
			cookie = new Cookie();
			
			if (isword) {
				setWordLesson(lessonId);
			} else {
				clearWordLesson();
			}
			
			initDom();
			initMode();
			initEvent();
//			initLesson();
			
			arynAnimate.arynYaotou(function() {
				arynAnimate.arynStop();
			});
		};
		
		// 设置单词课模式
		function setWordLesson(lid) {
			isWordLesson = true;
			content.find(".content").addClass("word-mode");
			$.ajax({
				type: "get",
				url: "findReadInfoByWebLessonId.action",
				async: false,
				dataType: "json",
				data: { lessonId: lid },
				success: function(response) {
					if (response.result == 0) {
						attachData = response.list;
					}
				},
				error: function() {
					
				}
			});
		}
		// 清除单词课模式
		function clearWordLesson() {
			isWordLesson = false;
			content.find(".content").removeClass("word-mode");
			attachData = null;
		}
		
		function pause() {
			if (content.find(".start-button").hasClass("started")) {
				content.find(".start-button").trigger("click");
			}
		};
		
		// 向select组件 导入数据
		ReadDataUtils.importSelectData(content.find(".diff-select").empty(), diffOptions);
		ReadDataUtils.importSelectData(content.find(".target-select").empty(), scoreOptions);
		ReadDataUtils.importSelectData(content.find(".mode-select").empty(), getModelListByFlag());
		
		if(vipFlag!=1 && giveVipSwitch==1){
			if(isLeaderGradeShow!=1){
				$(".mode-select").val(0);
			}else if(isLeaderGradeShow==1 && homeWorkIdFor4!=0){
				$(".mode-select").val(1);
			}else if(isLeaderGradeShow==1 && homeWorkIdFor4==0){
				$(".mode-select").val(0);
			}
		}
		
		function clearView() {
			content.find(".highlight").width(0);
			content.find(".content").empty().scrollTop(0);
			content.find(".translate").text("").hide();
			content.find(".logtips").text("").hide();
			content.find(".start-button").removeClass("started");
			content.find(".feedback").removeClass("selected");
			content.find(".audition").removeClass("selected");
			content.find(".playall").removeClass("selected");
//			content.find(".read-alert").remove();
			content.find(".end-score-popup-container").remove();
			setScoreBoard("本句得分", "");
		}
		function restoreRead() {
			on_paused();
			clearView();
			stepIndex = 0;
			sentenceIndex = -1;
			finished = false;
		}
		
		function initDom() {
			
			content.find(".full-screen-button").unbind("click").bind("click", function() {
				if ($(this).hasClass("fullscreen")) {
					exitFullscreen();
				} else {
					intoFullscreen($(selector).find(".arivoc-plugin-course-read-full-container").get(0));
				}
			});
			
			content.find(".target-select").unbind("change").bind("change", function() {
				targetScore = parseInt($(this).val());
				console.log("目标分数: " + targetScore);
			});
			content.find(".mode-select").unbind("change").bind("change", function(evt, noalert) {
				readType = parseInt($(this).val());
				targetScore = parseInt(content.find(".target-select").val());
				console.log("跟读模式: " + readType);
				content.find(".content").removeClass("recite-mode single-mode");
				switch (readType) {
					case 0:
						haveApply = false;
						steps = temSteps = recordModel;
						break;
					case 1: 
						haveApply = false;
						steps = temSteps = record2Model;
						break;
					case 2: 
						haveApply = false;
						steps = temSteps = freeModel;
						break;
					case 3: 
						haveApply = false;
						targetScore = 0;
						steps = temSteps = arneaModel;
						break;
					case 9: 
						haveApply = false;
						targetScore = 0;
						steps = temSteps = reciteModel;
						content.find(".content").addClass("recite-mode");
						break;
					case 13:
						haveApply = false;
						steps = temSteps = recite2Model;
						break;
					case 10:
						haveApply = false;
						steps = temSteps = singleModel;
						content.find(".content").addClass("single-mode");
						if (!noalert) {
							readAlert("系统提示", "本模式供自选重点练习某单句，不记录成绩。", "确定", null);
						}
						break;
					case 11:
						haveApply = false;
						steps = temSteps = handfreeModel;
						break;
					case 12:
						haveApply = false;
						steps = temSteps = quickModel;
						break;
				}
				stopAll();
				restoreRead();
				initLesson();
				setTimeout(onStartClick, 100);
			});
			content.find(".diff-select").unbind("change").bind("change", function() {
				readDiff = $(this).val();
				refusedCount = 0;
				refusedRedu = 2;
				cookie.setData("course_read_diff", readDiff, 3000);
				console.log("跟读难度: " + readDiff);
			});
			content.find(".slow-check").unbind("change").bind("change", function() {
				isSlow = $(this).attr("checked");
				if (content.find(".audition").hasClass("playing")) {
					content.find(".audition").trigger("click");
				}
				if (content.find(".playall").hasClass("playing")) {
					content.find(".playall").trigger("click");
				}
				if (content.find(".start-button").hasClass("started")) {
					content.find(".start-button").trigger("click");
				}
				console.log("慢速: " + isSlow);
			});
			
			content.find(".help-area").unbind("click").bind("click", showHelpBoard);
			
			content.find(".start-button").removeClass("started").unbind("click").bind("click", onStartClick);
			
			content.find(".feedback").unbind("click").bind("click", onFeedback);
			content.find(".audition").unbind("click").bind("click", onAudition);
			content.find(".playall").unbind("click").bind("click", onPlayall);
			
			switch (config.type) {
				case 4:
				case 7:
					content.find(".diff-select").val(0).trigger("change").hide();
					content.find(".mode-select").val(3).parent(".read-mode").hide();
					content.find(".target-select").parent(".target-score").hide();
					break;
				case 9:
					content.find(".start-button").removeClass("started").unbind("click").bind("click", onStartClick4Match);
					
					content.find(".diff-select").val(0).trigger("change").hide();
					content.find(".mode-select").val(3).parent(".read-mode").hide();
					content.find(".target-select").parent(".target-score").hide();
					if (config.matchType == 6 || config.matchType == 7 || config.matchType == 8 || config.matchType == 13 || config.matchType == 14) {
						content.find(".button-group").show();
					} else {
						content.find(".button-group").hide();
					}
					break;
				case 11:
					content.find(".start-button").addClass("record").removeClass("started").unbind("click").bind("click", onStartClick4Match);
					
					content.find(".diff-select").val(0).trigger("change").hide();
					
					var mode = config.appointType === "" ? 13 : config.appointType;
					content.find(".mode-select").val(mode).parent(".read-mode").hide();
					
					content.find(".target-select").parent(".target-score").hide();
					if (config.matchType == 6 || config.matchType == 7 || config.matchType == 8 || config.matchType == 13 || config.matchType == 14) {
						content.find(".button-group").show();
					} else {
						content.find(".button-group").hide();
					}
					break;
				case 3://单词全能王

					content.find(".start-button").addClass("record");
					content.find(".start-button").removeClass("started").unbind("click").bind("click", onStartClick4W2mAlmightyMatch);
					content.find(".diff-select").val(0).trigger("change").hide();
					content.find(".mode-select").val(13).parent(".read-mode").hide();
					content.find(".target-select").parent(".target-score").hide();
						// content.find(".button-group").hide();
					break;
				default:
					var cookieDiff = parseInt(cookie.getData("course_read_diff"));
					if (isNaN(cookieDiff)) {
						cookieDiff = content.find(".diff-select").val();
					}
					content.find(".diff-select").val(cookieDiff).trigger("change");
					if (config.appointType == "") {
						content.find(".mode-select").removeAttr("disabled");
					} else {
						content.find(".mode-select").val(config.appointType).attr("disabled", "disabled");
					}
					break;
			}
			
			$(document).unbind("keydown", adjustFontSize).bind("keydown", adjustFontSize);
			
			if (config.userFlag == 0) {
				content.find(".course-read-animate").hide();
				content.find(".help-area").hide();
				content.find(".score-blackboard").show();
			} else {
				content.find(".course-read-animate").show();
				content.find(".help-area").show();
				content.find(".score-blackboard").hide();
			}
			
			/** 单词课 图片模式 暂时去掉单句模式 */
			if (isWordLesson) {
				content.find(".mode-select option[value=10]").attr("disabled", "disabled");
				// 如果当前是单句模式 改成智能模式
				if (content.find(".mode-select").val() == 10) {
					content.find(".mode-select").val(11);
				}
			} else {
				content.find(".mode-select option[value=10]").removeAttr("disabled");
			}
		}
		
		function initMode() {
			if (isReciteWork && (reciteLessonId == lessonId && isMerge == "0")) {
				reciteWords = ReadDataUtils.formatReciteWords(config.recite);
			} else {
				reciteWords = null;
			}
			
			sentenceIndex = -1;
			haveApply = false;
			finished = false;
			lessonData = null;
			failCount = 0;
			warnCount = 0;
			refusedCount = 0;
			refusedRedu = 2;

			// 这有个奇怪的BUG 谁放第一个谁触发不了select change事件 所以暂时写两遍
			content.find(".target-select").trigger("change");
			content.find(".target-select").trigger("change");
			content.find(".diff-select").trigger("change");
			content.find(".mode-select").trigger("change", true);
			
			if (!ArivocRecorder.isSupport()) {
				readAlert("系统提示", "您的浏览器暂不支持录音功能，请更换Chrome,firefox等浏览器！", "确定", null);
			}
		}
		
		function initEvent() {
			$(targetobj).unbind();
			
			$(targetobj).bind(CourseRead.doStep, on_doStep);
			$(targetobj).bind(CourseRead.doStepComplete, on_doStepComplete);
			
			$(targetobj).bind(CourseRead.started, on_started);
			$(targetobj).bind(CourseRead.load_teacher, on_load_teacher_started);
			$(targetobj).bind(CourseRead.play_guide_before, on_play_guide_before_started);
			$(targetobj).bind(CourseRead.play_guide_after, on_play_guide_after_started);
			$(targetobj).bind(CourseRead.play_teacher, on_play_teacher_started);
			$(targetobj).bind(CourseRead.play_begin_tips, on_play_begin_tips);
			$(targetobj).bind(CourseRead.play_end_tips, on_play_end_tips);
			$(targetobj).bind(CourseRead.recording, on_recording_started);
			$(targetobj).bind(CourseRead.analysising, on_analysising_started);
			$(targetobj).bind(CourseRead.play_feedback, on_play_feedback_started);
			$(targetobj).bind(CourseRead.play_record, on_play_record_started);
			$(targetobj).bind(CourseRead.is_passed, on_is_passed);
			$(targetobj).bind(CourseRead.is_repeat, on_is_repeat);
			$(targetobj).bind(CourseRead.is_finished, on_is_finished);
			$(targetobj).bind(CourseRead.finished, on_finished);
			$(targetobj).bind(CourseRead.feedback_finish, on_feedback_finish);
			$(targetobj).bind(CourseRead.audition_finish, on_audition_finish);
			$(targetobj).bind(CourseRead.playall_finish, on_playall_finish);
			$(targetobj).bind(CourseRead.next_sentence, on_next_sentence);
			$(targetobj).bind(CourseRead.wait_1000, on_wait_1000);
			
			$(targetobj).bind(CourseRead.moveto_say, on_moveto_say);
			$(targetobj).bind(CourseRead.endto_say, on_endto_say);
			$(targetobj).bind(CourseRead.moveto_blackboard, on_moveto_blackboard);
			$(targetobj).bind(CourseRead.endto_blackboard, on_endto_blackboard);
			$(targetobj).bind(CourseRead.moveto_microphone, on_moveto_microphone);
			$(targetobj).bind(CourseRead.endto_microphone, on_endto_microphone);
			$(targetobj).bind(CourseRead.moveto_single_score, on_moveto_single_score);
			$(targetobj).bind(CourseRead.endto_single_score, on_endto_single_score);
			$(targetobj).bind(CourseRead.moveto_recorder, on_moveto_recorder);
			$(targetobj).bind(CourseRead.endto_recorder, on_endto_recorder);
		}
		
		function initLesson() {
			logtips("课文加载中...");
			$.ajax({
				url: courseUrl,
				type: "get",
				async: false,
				data: {
					id: lessonId,
					type: config.type,
					isMerge: isMerge
				},
				success: function(response) {
					logtips();
					lessonData = ReadDataUtils.parseLessonXML(response, attachData);
					var servers = config.analysisServer();
//					if (lessonData.analysis != null && lessonData.analysis != "null") {
//						analysisServer = lessonData.analysis;
//					} else {
//						analysisServer = servers.length > 0 ? servers[0].replace(/:\d*/, '') : null;
//					}
					analysisServer = servers.length > 0 ? servers[0].replace(/:\d*/, '') : null;
					if (!analysisServer) {
						readAlert("系统提示", "没有获取到录音服务器。", "确定");
						return;
					}
					drawLesson(lessonData.sentences);
					console.log("课加载成功：" + lessonData.lessonname);
				},
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					logtips("课加载失败！");
				}
			});
		}
		
		// 黑板上显示单词
		function drawLesson(sentences) {
			
			clearView();
			var paragraphs = [];
			var display = (sentences.length > 0 && sentences[0].role == "A") ? "paragraph" : "roleparagraph";
			
			$(sentences).each(function(i, sentence) {
				
				var curPart = existsPart(paragraphs, sentence);
				
				if (!!curPart) {
					curPart.sentences.push(sentence);
				} else {
					var paragraph = new Object();
					paragraph.part = sentence.part;
					paragraph.role = sentence.role;
					paragraph.sentences = [];
					paragraph.sentences.push(sentence);
					paragraphs.push(paragraph);
				}
			});
			
			$(paragraphs).each(function(i, graph) {
				content.find(".content").append(getParagraph(i, graph));
			});
			
			// 单词课 直接选中第一个
			if (isWordLesson) {
				selectSentence(0);
			}
			
			function getParagraph(gindex, graph) {
				var paraLayer = $("<p class='paragraph'></p>").attr("part", graph.part).attr("role", graph.role);
				if (display == "roleparagraph") {
					paraLayer.append(getRoleSpan(graph.role));
				}
				$(graph.sentences).each(function(i, sentence) {
					paraLayer.append(getSentenceSpan(gindex, i, sentence), (i == graph.sentences.length - 1) ? "" : " ");
				});
				
				return paraLayer;
			}
			function getRoleSpan(role) {
				var roleSpan = $("<span class='role'></span>").text(role + " : ");
				return roleSpan;
			}
			function getSentenceSpan(gindex, sindex, sentence) {
				var sentenceSpan = $("<span class='sentence'></span>")
					.attr("sid", sentence.sid)
					.data("cntext", sentence.cnText)
					.data("audio", sentence.audioPath)
					.data("syllables", parseInt(sentence.syllables))
					.data("role", sentence.role)
					.data("wavpath", sentence.wavPath)
					.data("isYB", sentence.isYB)
					.data("count", 0);
					
				var words = sentence.text.split(" ");
				var impwords = sentence.impWord.split(" ");
				
				if (readType == 10) {
					sentenceSpan.bind("click", onSentenceClick);
				}
				
				// 快速查询
				content.find(".content").bind("mouseup", onSentenceQuery);
				$(document).bind("mouseup", onQueryClear);
				content.bind("mouseup", onQueryClear);
				
				$(words).each(function(i, word) {
					// 背诵模式下 单词隐藏方案
					var wordHide = false;
					if (readType == 9) {
						if (!reciteWords) {
							wordHide = (gindex == 0 && sindex == 0 && i == 0) ? false : true;
						} else {
							$(reciteWords).each(function(j, s) {
								if (sentence.sid == s.sentenceId) {
									wordHide = s.words.indexOf(word) > -1;
									return false;
								}
							});
						}
					}
					
					var wordspan = getWordSpan(word, impwords.indexOf(word) > -1, wordHide);
					sentenceSpan.append(wordspan, (i == words.length - 1) ? "" : " ");
				});
				
				if (!!sentence.imagePath) {
					var imagespan = getImageSpan(sentence.imagePath);
					sentenceSpan.append(imagespan);
				}
				
				return sentenceSpan;
			}
			// 生成单词标签
			function getWordSpan(word, isImp, isHide) {
				var index1 = word.indexOf("{");
				var index2 = word.indexOf("}");
				// 是否是转义的单词
				var istrans = (index1 >= 0 && index2 >= 0);
				var wordtext = (istrans ? word.substring(0, index1) : word).replace("^_^", " ");
				var transwords = istrans ? word.substring(index1 + 1, index2).split("#") : [];
				
				var wordSpan;
				if (ReadDataUtils.isWord(wordtext)) {
					wordSpan = $("<span class='word'></span>")
						.data("origin", wordtext)
						.data("transwords", transwords)
						.text(wordtext);
				} else {
					wordSpan = $("<span class='punc'></span>").text(wordtext);
				}
				if (isImp) {
					wordSpan.addClass("imp-word");
				}
				if (isHide) {
					wordSpan.addClass("recite-word");
				}
				
				return wordSpan;
			}
			function getImageSpan(imageurl) {
				if (!imageurl) return "";
				var imageSpan = $('<img class="image" />').attr("src", imageurl);
				return imageSpan;
			}
			function existsKey(array, key, value) {
				for (var i = 0; i < array.length; i++) {
					if (array[i][key] == value) {
						return array[i];
					}
				}
				return null;
			}
			function existsPart(paragraphs, sentence) {
				if (!paragraphs || paragraphs.length == 0) {
					return null;
				}
				var lastPara = paragraphs[paragraphs.length - 1];
				
				if (lastPara.part == sentence.part && lastPara.role == sentence.role) {
					return lastPara;
				}
				return null;
			}
		}
		
		function drawSyllables(index) {
			var sentence = content.find(".sentence").eq(index);
			console.log("音节打分 --- " + index + " & passed : " + sentence.data("passed") + " & bad : " + sentence.data("bad"));
			
			if ($(sentence).data("isYB") == 1) {
				return;
			}
			
			switch (readType) {
				case 0:
				case 2:
				case 9:
					if (sentence.data("passed")) {
						var color = ReadDataUtils.swtichSyllableColor(false, 10);
						sentence.find(".word").css("color", color);
					} else {
						sentence.find(".word").css("color", "#FFFFFF");
					}
					return;
			/*	case 13:
					return;*/
				
			}
			
			sentence.find(".word").each(function(i, wordspan) {
				$(wordspan).find("sub").remove();
				var wordtext = $(wordspan).text();
				var istrans = $(wordspan).data("transwords").length > 0;
				var upperWord = wordtext.toLocaleUpperCase();
				var indexId = 0;
				
				if ($(wordspan).data("showscore") && !!$(wordspan).data("syllables") && $(wordspan).data("syllables").length > 0) {
					$(wordspan).empty();
					
					// Miss为true 置灰 不标音节分
					if ($(wordspan).data("miss") == 'true') {
						var syllspan = $("<span></span>").css("color", '#808080');
						syllspan.append(wordtext);
						$(wordspan).append(syllspan);
						return;
					}
					
					// 转义
					if (istrans) {
						var transColor = "#FFFFFF";
						var scoreMin = 1000;
						$.each($(wordspan).data("syllables"), function(j, syll) {
							if (syll.score10 < scoreMin) {
								scoreMin = syll.score10;
								transColor = ReadDataUtils.swtichSyllableColor(sentence.data("bad"), scoreMin);
							}
						});
						var syllspan = $("<span></span>").css("color", transColor);
						if (!sentence.data("bad")) {
							syllspan.append(wordtext, "<sub>" + scoreMin + "</sub>");
						} else {
							syllspan.append(wordtext);
						}
						$(wordspan).append(syllspan);
					} else {
						$.each($(wordspan).data("syllables"), function(j, syll) {
							var color = ReadDataUtils.swtichSyllableColor(sentence.data("bad"), syll.score10);
							var k = upperWord.indexOf(syll.syllable.toLocaleUpperCase(), indexId);
							var syllableTxt = wordtext.substr(k, syll.syllable.length);
							
							var syllspan = $("<span></span>").css("color", color);
							if (syll.showscore && !sentence.data("bad")) {
								syllspan.append(syllableTxt, "<sub>" + syll.score10 + "</sub>");
							} else {
								syllspan.append(syllableTxt);
							}
							$(wordspan).append(syllspan);
							indexId = k + syll.syllable.length;
						});
					}
					
				}
			});
		}
		
		function restoreSentence(index) {
			var sentence = content.find(".sentence").eq(index);
			sentence.find(".word").each(function(i, wordspan) {
				$(wordspan).empty().text($(wordspan).data("origin"));
			});
		}
		
		function onFeedback() {
			console.log("步骤：" + stepIndex + " -- 播放反馈开始");
			stopAll();
			freeApply = true;
			steps = feedbackModel;
			finished = false;
			stepIndex = 0;
			content.find(".start-button").addClass("disabled");
			doStep();
		}
		function onAudition() {
			console.log("步骤：" + stepIndex + " -- 全文试听开始");
			if ($(this).hasClass("playing")) {
				stopAll();
				steps = temSteps;
			} else {
				stopAll();
				freeApply = true;
				steps = auditionModel;
				finished = false;
				sentenceIndex = -1;
				stepIndex = 0;
				content.find(".start-button").addClass("disabled");
				$(this).addClass("playing");
				doStep();
			}
		}
		function onPlayall() {
			console.log("步骤：" + stepIndex + " -- 跟读全放开始");
			if ($(this).hasClass("playing")) {
				stopAll();
				steps = temSteps;
			} else {
				stopAll();
				freeApply = true;
				steps = playallModel;
				finished = false;
				sentenceIndex = -1;
				stepIndex = 0;
				content.find(".start-button").addClass("disabled");
				$(this).addClass("playing");
				doStep();
			}
		}
		// 停止播放反馈 全文试听 跟读全放
		function stopAll() {
			on_paused();
			freeApply = false;
			finished = true;
			content.find(".start-button").removeClass("disabled");
			content.find(".audition").removeClass("playing");
			content.find(".playall").removeClass("playing");
		}
		
		function onStartClick() {
			if (content.find(".start-button").hasClass("disabled")) {
				return;
			} else if (content.find(".start-button").hasClass("started")) {
				console.log("暂停跟读");
				on_paused();
				immeover = finished;
			} else {
				if (steps == null) {
					console.log("您选择的模式，正在开发中，敬请期待。");
					return;
				}
				
				if (immeover) {
					on_finished();
					return;
				}
				
				if (finished) {
					restoreRead();
					drawLesson(lessonData.sentences);
				}
				
				console.log("开始跟读");
				stepIndex = 0;
				content.find(".start-button").addClass("started");
				content.find(".course-read-controler .button-group").addClass("disabled");
				doStep();
			}
		}
		
		function onStartClick4Match() {
			if (content.find(".start-button").hasClass("disabled")) {
				return;
			}
			config.listenLeave();
			if (haveApply) {
				realStart();
			} else {
				readAlert("系统提示", "请检查好录音，设备确认无误后点击确定开始跟读，开始后即算今天参赛。", "确定", realStart, "取消", null);
			}
			
			function realStart() {
				onStartClick();
				content.find(".start-button").hide();
			}
		}

		function onStartClick4W2mAlmightyMatch() {
			if (content.find(".start-button").hasClass("disabled")) {
				return;
			}
			config.listenLeave();

			function realStart() {
				onStartClick();
				content.find(".start-button").hide();
			}
			realStart();
		}
		
		function onSentenceClick() {
			if (content.find(".highlight").hasClass("recording")) {
				return;
			}
			
			on_paused();
			
			var sid = $(this).attr("sid");
			sentenceIndex = getSentenceIndexById(sid);
			
			stepIndex = 0;
			doStep();
			content.find(".start-button").addClass("started");
		}
		
		function onSentenceQuery() {
			if (!config.edic) return;
			setTimeout(function() {
				var selectDom = getSelection();
				quickQuery(selectDom);
			}, 0);
		}
		
		function onQueryClear() {
			var selectDom = getSelection();
			if (selectDom.isCollapsed) {
				content.find(".quick-query-button").remove();
			}
		}
		
		/** 音频播放器 相关事件 **/
		function onAudioLoaded() {
			var sentence = content.find(".sentence").eq(sentenceIndex);
			if (content.find(".highlight").hasClass("loading") || content.find(".highlight").hasClass("playing")) {
				console.log("%c音频时长 -- " + mediaPlayer.getDuration(), "color: red;");
				sentence.data("duration", 0);
			}
			if (content.find(".highlight").hasClass("loading")) {
				$(targetobj).trigger(CourseRead.doStepComplete);
			}
		}
		function onAudioPlaying(ratio) {
			content.find(".highlight").width(ratio * 100 + "%");
		}
		function onAudioError() {
			console.log(mediaPlayer.getCurrentSource() + " -- 播放失败");
			audioEndDelay = setTimeout(function() {
				$(targetobj).trigger(CourseRead.doStepComplete);
			}, 100);
		}
		function onAudioEnd() {
			console.log(mediaPlayer.getCurrentSource() + " -- 播放结束");
			content.find(".highlight").width("100%");
			audioEndDelay = setTimeout(function() {
				content.find(".highlight").width(0);
				$(targetobj).trigger(CourseRead.doStepComplete);
			}, 100);
		}
		
		
		/** 跟读步骤 相关事件 **/
		function on_doStep() {
			doStep();
		}
		function on_doStepComplete() {
			doStepComplete();
		}
		function on_started() {
			console.log("步骤：" + stepIndex + " -- on_started: " + haveApply);
			if (config.type == 8 && (readType == 0 || readType == 1 || readType == 2)) {
				haveApply = true;
				fakeApply();
			}
			if (!freeApply && !haveApply) {
				apply_start();
				return;
			}
			if (content.find(".sentence").length == 0) {
				return;
			}
			selectSentence(sentenceIndex);
			$(targetobj).trigger(CourseRead.doStepComplete);
		}
		function on_paused() {
			content.find(".course-read-controler .button-group").removeClass("disabled");
			content.find(".start-button").removeClass("started disabled").show();
			content.find(".audition").removeClass("playing");
			content.find(".playall").removeClass("playing");
			content.find(".highlight").width(0);
			mediaPlayer.pause();
			mediaRecorder.stop();
			clearInterval(recTimer);
			clearInterval(waitTimer);
			clearInterval(audioEndDelay);
			clearInterval(recordEndDelay);
			clearInterval(arynSayDelay);
			arynAnimate.arynStop();
		}
		function on_play_guide_before_started() {
			console.log("步骤：" + stepIndex + " -- 播放前引导音频");
			var sentence = content.find(".sentence").eq(sentenceIndex);
			content.find(".highlight").removeClass("loading playing recording playbacking");
			var guideAudio = ReadDataUtils.getBeforeGuideAudio(readType, sentence.data("count") || 0, sentenceIndex, content.find(".sentence").length, cookie);
			mediaPlayer.play(config.teacherServer + guideAudio);
		}
		function on_play_guide_after_started() {
			console.log("步骤：" + stepIndex + " -- 播放后引导音频");
			var sentence = content.find(".sentence").eq(sentenceIndex);
			content.find(".highlight").removeClass("loading playing recording playbacking");
			var guideAudio = ReadDataUtils.getAfterGuideAudio(sentenceIndex, content.find(".sentence").length, sentence.data("passed"), finished);
			if (!!guideAudio) {
				mediaPlayer.play(config.teacherServer + guideAudio);
			} else {
				$(targetobj).trigger(CourseRead.doStepComplete);
			}
		}
		function on_play_begin_tips() {
			console.log("步骤：" + stepIndex + " -- 播放录音前提示音");
			content.find(".highlight").removeClass("loading playing recording playbacking");
			mediaPlayer.play(beginTips);
		}
		function on_play_end_tips() {
			console.log("步骤：" + stepIndex + " -- 播放录音后提示音");
			content.find(".highlight").removeClass("loading playing recording playbacking");
			mediaPlayer.play(endTips);
		}
		function on_load_teacher_started() {
			console.log("步骤：" + stepIndex + " -- 加载音频");
			var sentence = content.find(".sentence").eq(sentenceIndex);
			content.find(".highlight").removeClass("loading playing recording playbacking").addClass("loading");;
			var audioUrl = config.teacherServer + "course_new/"  + sentence.data("audio");
			if (isSlow) {
				audioUrl = audioUrl.substring(0, audioUrl.length - 4) + "_slow.mp3";
			}
			mediaPlayer.load(audioUrl);
		}
		function on_play_teacher_started() {
			console.log("步骤：" + stepIndex + " -- 播放音频");
			var sentence = content.find(".sentence").eq(sentenceIndex);
			content.find(".highlight").removeClass("loading playing recording playbacking").addClass("playing");
			var audioUrl = config.teacherServer + "course_new/"  + sentence.data("audio");
			if (isSlow) {
				audioUrl = audioUrl.substring(0, audioUrl.length - 4) + "_slow.mp3";
			}
			mediaPlayer.play(audioUrl);
		}
		function on_recording_started() {
			console.log("步骤：" + stepIndex + " -- 开始录音");
			var sentence = content.find(".sentence").eq(sentenceIndex);
			content.find(".highlight").removeClass("loading playing recording playbacking").addClass("recording");
			var recCount = 0;
			var recDuration = sentence.data("duration") * 1000;
			
			// 录音开始
			if (mediaRecorder.getReady()) {
				onAudioRecordStart();
			} else {
				mediaRecorder.initialize(function(status) {
					if (status.code == 0) {
						onAudioRecordStart();
					} else {
						readAlert("系统提示", status.message, "确定");
						on_paused();
					}
				});
			}
			
			var maxvv = -1;
			// 录音开始
			function onAudioRecordStart() {
				if (!content.find(".start-button").hasClass("started")) {
					return;
				}
				
				var inputed = false;
				var inputopen = false;
				var startinput = 0;
				var stopinput = 0;
				maxvv = -1;
				mediaRecorder.onrecording = function(float32) {
					// ES6 写法 IE不兼容
//					var maxval = Math.max(...float32);
					// ES5写法
					var maxval = Math.max.apply(null, float32);
					var volume = Math.round(maxval * 100);
					if (volume > maxvv) {
						maxvv = volume;
					}
					
					content.find(".mic-bottom").height((100 - volume) / 100 * 21);
					if (volume >= 3 && !inputed) {
						inputed = true;
					} else if (volume < 3 && inputed && !inputopen) {
						inputopen = true;
						startinput = new Date().getTime();
					} else if (volume >= 3 && inputed && inputopen) {
						inputopen = false;
					} else if (volume < 3 && inputed && inputopen) {
						stopinput = new Date().getTime();
						if (stopinput - startinput > 1000) {
							onAudioRecordEnd();
						}
					}
				};
				mediaRecorder.start();
				recTimer = setInterval(function() {
					recCount += interval;
					onAudioRecording(recCount, recDuration);
				}, 0);
			}
			
			// 录音中
			function onAudioRecording(count, duration) {
				if (count >= duration) {
					count = duration;
					onAudioRecordEnd();
				}
				content.find(".highlight").width(count / duration * 100 + "%");
			}
			// 录音结束
			function onAudioRecordEnd() {
				clearInterval(recTimer);
				mediaRecorder.onrecording = null;
				content.find(".mic-bottom").height(21);
				mediaRecorder.stop(function(blob) {
					console.log("%c本次录音时长：" + mediaRecorder.getDuration() / 1000, "color: red;");
					sentence.data("audioBlob", new Blob());
				});
				content.find(".highlight").width("100%");
				recordEndDelay = setTimeout(function() {
					content.find(".highlight").width(0);
					$(targetobj).trigger(CourseRead.doStepComplete);
				}, 0);
			}
		}
		function on_analysising_started() {
			console.log("步骤：" + stepIndex + " -- 开始分析");
			var sentence = content.find(".sentence").eq(sentenceIndex);
			
			var sex = config.userSex == 1 ? "m" : config.userSex == 2 ? "f" : "n";
			var seed = Math.ceil(Math.random() * 1000000);
			var level = readDiff == 2 ? "N" : readDiff == 1 ? "A" : readDiff == 0 ? "Z" : "N";
//			var prefix = courseUrl.indexOf("localhost") > -1 ? "test" : courseUrl.substring(courseUrl.indexOf("//") + 2, courseUrl.indexOf("."));
				
			var fileName = level + config.domain + "L" + lessonId + "U" + userId + "i" + sentence.attr("sid") + "s" + sex + seed;
			
			var analysisURL = win.location.protocol + "//" + analysisServer + "/analysis/servlet/RecordAnalysis?r=" + Math.random();
			console.log("analysis file name:" + fileName);
			console.log("录音大小：" + sentence.data("audioBlob").size);
			console.log("打分地址：" + analysisURL);
			
			var wavpath = sentence.data("wavpath");
			if (!wavpath) {
				wavpath = lessonData.rootdir + sentence.attr("sid") + ".wav";
			} else {
				wavpath = "/" + wavpath;
			}
			
			var formData = new FormData();
			formData.append("sid", fileName);
			formData.append("teacher", wavpath);
			formData.append(fileName, sentence.data("audioBlob"));
			formData.append("jac", config.domain + "U" + userId);
			formData.append("asr", readDiff);
			
			uploadBlob(analysisURL, formData, function(status, event) {
				if (status == 'loaded' && event.target.status == 200) {
					sentence.data("result", $(event.target.response));
					analysisResult();
				} else {
					console.log("RecordAnalysis status:" + status);
				}
			});
		}
		function on_play_feedback_started() {
			console.log("步骤：" + stepIndex + " -- 开始播放录音分析feedback音频");
			var sentence = content.find(".sentence").eq(sentenceIndex);
			content.find(".highlight").removeClass("loading playing recording playbacking");
			var feedbackAudio = null;
			switch (sentence.data("errorcode")) {
				case -102: feedbackAudio = config.teacherServer + "guide/cannothear.mp3"; break;
				case -103: feedbackAudio = config.teacherServer + "guide/pass.mp3"; break;
				case -104: feedbackAudio = config.teacherServer + "guide/norecord.mp3"; break;
				case -105: feedbackAudio = config.teacherServer + "guide/refuse.mp3"; break;
				default: 
					feedbackAudio = win.location.protocol + "//" + analysisServer + "/feedback/" + sentence.data("feedback"); 
					if (sentence.data("feedback") == null) {
						$(targetobj).trigger(CourseRead.doStepComplete);
						return;
					}
				break;
			}
			mediaPlayer.play(feedbackAudio);
		}
		function on_play_record_started() {
			console.log("步骤：" + stepIndex + " -- 开始播放录音回放eppath音频");
			var sentence = content.find(".sentence").eq(sentenceIndex);
			content.find(".highlight").removeClass("loading playing recording playbacking").addClass("playbacking");
			var recordAudio;
			switch (sentence.data("errorcode")) {
				case -102: case -103: case -104: 
					recordAudio = config.teacherServer + "guide/blank.mp3"; 
				break;
				default: 
					recordAudio = win.location.protocol + "//" + eppathServer + "/webvoice/" + sentence.data("eppath");
					if (sentence.data("eppath") == null) {
						$(targetobj).trigger(CourseRead.doStepComplete);
						return;
					}
				break;
			}
			mediaPlayer.play(recordAudio);
		}
		function on_is_passed() {
			console.log("步骤：" + stepIndex + " -- 判断是否通过");
			var sentence = content.find(".sentence").eq(sentenceIndex);
			if (sentence.data("passed")) {
				stepIndex++;
				$(targetobj).trigger(CourseRead.doStepComplete);
			} else {
				$(targetobj).trigger(CourseRead.doStepComplete);
			}
		}
		function on_is_repeat() {
			console.log("步骤：" + stepIndex + " -- 再来一遍");
			var sentence = content.find(".sentence").eq(sentenceIndex);
			if (sentence.data("count") > 0) {
				$(targetobj).trigger(CourseRead.doStepComplete);
			} else {
				sentence.data("count", sentence.data("count") + 1);
				stepIndex = 0;
				$(targetobj).trigger(CourseRead.doStepComplete);
			}
		}
		function on_is_finished() {
			console.log("步骤：" + stepIndex + " -- 判断是否全部完成");
			finished = true;
			$(targetobj).trigger(CourseRead.doStepComplete);
		}
		function on_finished() {
			if (!finished) {
				$(targetobj).trigger(CourseRead.doStepComplete);
				return;
			}
			console.log("步骤：" + stepIndex + " -- 处理完成后的数据");
			
			on_paused();
			
			var sentCount = 0;
			var totalSyllable = 0;
			var passSyllable = 0;
			var goodSyllable = 0;
			var normalSyllable = 0;
			var badSyllable = 0;
			
			var unZeroCount = 0;
			var unVolCount = 0;
			var ischengshu = 0;
			var isold = 0;
			
			var sentencesResult = [];
			
			content.find(".sentence").each(function(i, sentence) {
				
				if ((curRole != null && $(sentence).data("role") != curRole) || $(sentence).data("isYB")) {
					return true;
				}
				sentCount++;
				totalSyllable += $(sentence).data("syllables");
				if ($(sentence).data("errorcode") >= 0) {
					passSyllable += $(sentence).data("passSyllable");
					goodSyllable += $(sentence).data("goodSyllable");
					normalSyllable += $(sentence).data("normalSyllable");
					badSyllable += $(sentence).data("badSyllable");
				} else {
					badSyllable += $(sentence).data("syllables");
				}
				
				var worstArray = [];
				$(sentence).find(".word").each(function(m, word) {
					$(word).find(".syllables").each(function(n, syllable) {
						if ($(sentence).data("errorcode") == 0 && syllable.score10 < 10) {
							worstArray.push($(word).data("origin"));
							return true;
						}
					});
				});
				sentencesResult.push((i + 1) + "$" + (!!$(sentence).data("eppath") ? $(sentence).data("eppath") : "null.mp3") + "$" + worstArray.join(","));
				
				//完整度统计
				var un = 0;
				if ($(sentence).data("errorcode") == -1 || $(sentence).data("errorcode") == -4) {
					un = 1;
				} else if ($(sentence).data("errorcode") == 1 || $(sentence).data("errorcode") == 4) {
					un = 0.5;
				}					
				if (content.find(".sentence").length == 1) {
					un = 0;
				} else if (content.find(".sentence").length == 2) {
					un = 0.05 * un;
				} else if (content.find(".sentence").length == 3) {
					un = 0.15 * un;
				} else if (content.find(".sentence").length == 4) {
					un = 0.3 * un;
				} else if (content.find(".sentence").length == 5) {
					un = 0.5 * un;
				} else if (content.find(".sentence").length == 6) {
					un = 0.8 * un;
				}
				unZeroCount += un;
				
				//音量过大比率统计
				var un1 = 0;
				if ($(sentence).data("errorcode") == -2) {
					un1 = 1;
				} else if ($(sentence).data("errorcode") == 2) {
					un1 = 0.5;
				}
				unVolCount = unVolCount + un1;
				
				// 成熟度
				if ($(sentence).data("isold") == 1) {
					ischengshu++;
				}
				if (ischengshu >= Math.floor(content.find(".sentence").length / 2)) {
					isold = 1;
				}
				
			});
			
			var wanzhengRate = unZeroCount / content.find(".sentence").length;
			var loudRate = unVolCount / content.find(".sentence").length;
			var needReduce = 0;
			if (wanzhengRate > 0.2) {
				needReduce = wanzhengRate * 100 - 20;
			}
			
			var score100 = Math.ceil((passSyllable / totalSyllable * 100) - needReduce);
			if (config.primary != 0) {
				// 小学需要修正分数
				score100 = ReadDataUtils.fixScore(score100);
			}
			
			if (ReadDataUtils.isWordsLesson(lessonData.sentences)) {
				score100 = correctScore4Word(score100);
			} else {
				score100 = correctScore(score100); // 增加总分校正
			}
			
			if (score100 > 100) {
				score100 = 100;
			} else if (score100 < 5) {
				score100 = 5;
			}
			
			var wanzhengLabel = wanzhengRate < 0.2 ? "好" : wanzhengRate < 0.4 ? "中" : "差";
			var yudiaoLabel = score100 >= 85 ? "优" : score100 >= 75 ? "良" : score100 >= 60 ? "中" : "差";
			var yinliangLabel = loudRate < 0.05 ? "优" : loudRate < 0.15 ? "良" : loudRate < 0.25 ? "中" : "差";
			var readRecord = sentencesResult.join("|") + "|$$"
							+ goodSyllable + "$$" 
							+ normalSyllable + "$$" 
							+ badSyllable + "$$"
							+ wanzhengLabel + "$$" 
							+ curRole + "$$"
							+ sentCount + "$$" 
							+ yudiaoLabel + "$$"
							+ yinliangLabel;
			
			console.log("句子结果：");
			console.log(sentencesResult);
			console.log("总分：" + score100);
			console.log("音节：" + totalSyllable);
			console.log("通过：" + passSyllable);
			console.log("好：" + goodSyllable);
			console.log("中：" + normalSyllable);
			console.log("差：" + badSyllable);
			console.log("校正：" + needReduce);
			console.log("完整：" + wanzhengRate + " -- " + wanzhengLabel);
			console.log("语调：" + yudiaoLabel);
			console.log("音量：" + loudRate + " -- " + yinliangLabel);
			console.log("readRecord：" + readRecord);
			
			var recScore = score100;
			switch (readType) {
				case 0: case 1:
					recScore = -99;
					break;
				case 9:
					recScore = score100 > 70 ? -98 : -97;
					break;
			}
			
			submitReadResult({
				score: recScore,
				realScore: parseInt(82 + random.random() * 12),
				readRecord: readRecord,
				isold: isold,
				totalCount: sentCount,
				yinjie: totalSyllable,
				fayin: "中",
				good: goodSyllable,
				normal: normalSyllable,
				bad: badSyllable,
				wanzheng: wanzhengLabel,
				yudiao: yudiaoLabel,
				yinliang: yinliangLabel
			});
		}
		
		function on_feedback_finish() {
			console.log("步骤：" + stepIndex + " -- 播放反馈完成");
			$(targetobj).trigger(CourseRead.doStepComplete);
			stopAll();
			steps = temSteps;
		}
		
		function on_audition_finish() {
			console.log("步骤：" + stepIndex + " -- 全文试听完成");
			if (sentenceIndex >= content.find(".sentence").length - 1) {
				stopAll();
				steps = temSteps;
				selectSentence(0);
			} else {
				$(targetobj).trigger(CourseRead.doStepComplete);
			}
		}
		
		function on_playall_finish() {
			console.log("步骤：" + stepIndex + " -- 跟读全放完成");
			if (sentenceIndex >= content.find(".sentence").length - 1) {
				stopAll();
				content.find(".playall").removeClass("playing");
				steps = temSteps;
				selectSentence(0);
			} else {
				$(targetobj).trigger(CourseRead.doStepComplete);
			}
		}
		
		function on_next_sentence() {
			console.log("步骤：" + stepIndex + " -- finished： " + finished);
			if (finished) {
				return;
			}
			console.log("步骤：" + stepIndex + " -- 下一句");
			sentenceIndex++;
			var sentence = content.find(".sentence").eq(sentenceIndex);
			stepIndex = 0;
			doStep();
		}
		
		function on_wait_1000() {
			console.log("步骤：" + stepIndex + " -- 停顿0.5秒");
			var sentence = content.find(".sentence").eq(sentenceIndex);
			if (sentence.data("eppath") == null) {
				$(targetobj).trigger(CourseRead.doStepComplete);
			} else {
				waitTimer = setTimeout(function() {
					$(targetobj).trigger(CourseRead.doStepComplete);
				}, 0);
			}
		}
		function on_moveto_say() {
			console.log("步骤：" + stepIndex + " -- aryn 开始说话");
			// aryn say
			arynSayDelay = setTimeout(function() {
				arynAnimate.arynSay();
			}, 300);
			$(targetobj).trigger(CourseRead.doStepComplete);
		}
		function on_endto_say() {
			console.log("步骤：" + stepIndex + " -- aryn 停止说话");
			// aryn say end
			arynAnimate.arynSayEnd();
			$(targetobj).trigger(CourseRead.doStepComplete);
		}
		function on_moveto_blackboard() {
			console.log("步骤：" + stepIndex + " -- aryn 指黑板");
			// aryn 指黑板
			arynAnimate.arynBlackboard(function() {
				$(targetobj).trigger(CourseRead.doStepComplete);
			});
		}
		function on_endto_blackboard() {
			console.log("步骤：" + stepIndex + " -- aryn 结束指黑板");
			// aryn 结束指黑板
			arynAnimate.arynBlackboardEnd(function() {
				$(targetobj).trigger(CourseRead.doStepComplete);
			});
		}
		function on_moveto_microphone() {
			console.log("步骤：" + stepIndex + " -- aryn 拿麦克风");
			// aryn 拿麦克风
			arynAnimate.arynMicrophone(function() {
				$(targetobj).trigger(CourseRead.doStepComplete);
			});
		}
		function on_endto_microphone() {
			console.log("步骤：" + stepIndex + " -- aryn 放下麦克风");
			// aryn 放下麦克风
			arynAnimate.arynMicrophoneEnd(function() {
				$(targetobj).trigger(CourseRead.doStepComplete);
			});
		}
		function on_moveto_single_score() {
			console.log("步骤：" + stepIndex + " -- aryn 亮起分数牌");
			// aryn 亮起分数牌
			var sentence = content.find(".sentence").eq(sentenceIndex);

			var scoreText = "";
			if (sentence.data("errorcode") > 0) {
				scoreText = sentence.data("score100") + "?";
			} else if (sentence.data("errorcode") == -4) {
				scoreText = "?";
			} else if (sentence.data("score100") == 0) {
				scoreText = "?";
			} else {
				scoreText = sentence.data("score100");
			}

			arynAnimate.arynSingleScore(scoreText, function() {
				$(targetobj).trigger(CourseRead.doStepComplete);
			});
		}
		function on_endto_single_score() {
			console.log("步骤：" + stepIndex + " -- aryn 放下分数牌");
			// aryn 放下分数牌
			arynAnimate.arynSingleScoreEnd(function() {
				$(targetobj).trigger(CourseRead.doStepComplete);
			});
		}
		function on_moveto_recorder() {
			console.log("步骤：" + stepIndex + " -- aryn 拿起录音机");
			// aryn 拿起录音机
			arynAnimate.arynRecorder(function() {
				$(targetobj).trigger(CourseRead.doStepComplete);
			});
		}
		function on_endto_recorder() {
			console.log("步骤：" + stepIndex + " -- aryn 放下录音机");
			// aryn 放下录音机
			arynAnimate.arynRecorderEnd(function() {
				$(targetobj).trigger(CourseRead.doStepComplete);
			});
		}
			
		
		
		function doStep() {
			var step = steps[stepIndex];
			$(targetobj).trigger(step);
		};

		function doStepComplete() {
			if (stepIndex < steps.length - 1) {
				stepIndex++;
				doStep();
			} else {
				console.log("该句子结束");
				stepIndex = 0;
				if (readType == 10) {
					content.find(".start-button").removeClass("started");
				}
			}
		};
		
		function apply_start() {
			console.log("开始前验证");
			
			var applyData = {};
			var applyURL = "";
			
			switch (config.type) {
				case 8:
					// 同步练习训练增加标识
					var hwtarr = config.hwtype.split("-");
					var hwt = null;
					if (hwtarr[1] == lessonId) {
						hwt = hwtarr[0];
					}
					
					applyData.lessonId = lessonId;
					applyData.hwtype = hwt;
					applyData.params = config.getParasValue(config.type);
					applyData.userToken = config.getUserToken();
					
					applyURL = config.baseurl + "/getHasBuyStatus.action?r=" + Math.random();
				break;
				case 4:
					applyData.type = config.type;
					applyData.params = config.getParasValue(config.type);
					applyData.userToken = config.getUserToken();
					applyData.definedId = lessonId;
					
					if (!applyData.params) {
						content.find(".start-button").removeClass("started");
						return;
					}
					
					applyURL = config.baseurl + "/pkStarted.action?r=" + Math.random();
				break;
				case 7:
					applyData.type = config.type;
					applyData.params = config.getParasValue(config.type);
					applyData.userToken = config.getUserToken();
					applyData.definedId = lessonId;
					
					applyURL = config.baseurl + "/pkStartedChallenge.action?r=" + Math.random();
				break;
				case 9:
					applyData.type = config.type;
					applyData.params = config.getParasValue(config.type);
					applyData.userToken = config.getUserToken();
					applyData.definedId = config.getParasValue(config.type);
					applyData.matchId = config.matchId;
					
					applyURL = config.baseurl + "/dailyArenaStart.action?r=" + Math.random();
				break;
				case 11:
					applyData.type = config.type;
					applyData.params = config.getParasValue(config.type);
					applyData.userToken = config.getUserToken();
					applyData.definedId = config.getParasValue(config.type);
					
					applyURL = config.baseurl + "/dailyArenaStart.action?r=" + Math.random();
				break;
				case 3://单词全能王
					applyData["almightyMatch.id"] = config.currentMatchId;
					applyData["almightyMatch.lessonId"] = config.currentLessonId;
					applyData.domain = config.domain;
					applyData.userId = config.currentUserId;
					applyData.matchType = config.matchType;
					applyData.matchStatus = config.matchStatus;
					applyData.lessonId = config.currentDefinedLessonId;
					applyData.userToken = config.getUserToken();
					applyURL = config.baseurl + "/getW2mAlmightyFollowReadMatchStatus.action?r=" + Math.random();
				break;
			}
			
			$.ajax({
				type: "post",
				url : applyURL,
				dataType: "text",
				data: applyData,
				success: function (data) {
					console.log("apply_start data:" + data);
					var resultArray = data.split("@");
					showAlert(parseInt(resultArray[0]), resultArray);
				},		  
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					console.log("apply_start error:" + textStatus);
				}
		    });
			
		}
		
		function getSentenceIndexById(sid) {
			var tempIndex = -1;
			content.find(".sentence").each(function(i) {
				if ($(this).attr("sid") == sid) {
					tempIndex = i;
					return true;
				}
			});
			return tempIndex;
		}
		
		function selectSentence(index) {
			sentenceIndex = (index == -1 || index >= content.find(".sentence").length) ? 0 : index;
			console.log("句子索引：" + sentenceIndex);
			
			var currentSentence = content.find(".sentence").eq(sentenceIndex);
			var id = currentSentence.attr("sid");
			console.log("句子ID：" + id);
			
			content.find(".sentence.choosed").removeClass("choosed");
			currentSentence.addClass("choosed");
			
			if (currentSentence.data("cntext") == "无译文" || cnTextShow == "0") {
				content.find(".translate").text("").hide();
			} else {
				content.find(".translate").text(currentSentence.data("cntext")).show();
			}
			
			if (isWordLesson) {
				// 无图片 上下居中
				var paraphase = currentSentence.parent();
				if (currentSentence.find("img").length == 0) {
					paraphase.addClass("middle").css({
						"margin-top": -paraphase.height() / 2 + "px"
					});
				}
			} else {
				// 选中句子定位
				var currentTop = currentSentence.position().top;
				var firstTop = content.find(".sentence").eq(0).position().top;
				var fixTop = 25;
				content.find(".content").scrollTop((currentTop - firstTop) / fsscale - fixTop);
			}
			
		}
		
		function submitReadResult(resultData) {
			var submitData = {};
			var submitURL = "";
			content.find(".start-button, .button-group").addClass("disabled");
			
			switch (config.type) {
				case 8:
					switch (readType) {
						case 2:
						case 11:
						case 12:
						case 13:
							logtips("正在提交跟读成绩...");
							cookie.setData("read_last_score", resultData.realScore, 3000);
							var sign = hex_md5("" + lessonId + resultData.realScore + onlyMark);
							
							submitData.lesson_id = lessonId;
							submitData.read_score = resultData.realScore;
							submitData.read_record = resultData.readRecord;
							submitData.userToken = config.getUserToken();
							submitData.playRecordServer = win.location.protocol + "//" + eppathServer + "/webvoice";
							submitData.read_type = readType;
							submitData.read_score2 = resultData.realScore;
							submitData.isOld = resultData.isold;
							submitData.roleText = curRole;
							submitData.roleSenCount = resultData.totalCount;
							submitData.onlyMark = onlyMark;
							submitData.sign = sign;
							submitData.hwId = config.homeworkId;
							submitData.isMerge = isMerge;
							submitData.level = "0";
						break;
						case 0:
						case 1:
							logtips("正在提交录音记录...");
							cookie.setData("read_last_score", resultData.score, 3000);
							var sign = hex_md5("" + lessonId + resultData.score + onlyMark);
							
							submitData.lesson_id = lessonId;
							submitData.read_score = resultData.score;
							submitData.read_record = resultData.readRecord;
							submitData.userToken = config.getUserToken();
							submitData.playRecordServer = win.location.protocol + "//" + eppathServer + "/webvoice";
							submitData.read_type = readType;
							submitData.read_score2 = resultData.realScore;
							submitData.isOld = resultData.isold;
							submitData.roleText = curRole;
							submitData.roleSenCount = resultData.totalCount;
							submitData.onlyMark = onlyMark;
							submitData.sign = sign;
							submitData.hwId = config.homeworkId;
							submitData.isMerge = isMerge;
							submitData.level = "0";
						break;
						case 9:
							logtips("正在提交录音记录...");
							cookie.setData("read_last_score", resultData.score, 3000);
							var sign = hex_md5("" + lessonId + resultData.score + onlyMark);
							
							submitData.lesson_id = lessonId;
							submitData.read_score = resultData.score;
							submitData.read_record = resultData.readRecord;
							
							submitData.userToken = config.getUserToken();
							submitData.playRecordServer = win.location.protocol + "//" + eppathServer + "/webvoice";
							submitData.read_type = readType;
							submitData.read_score2 = resultData.realScore;
							submitData.isOld = resultData.isold;
							submitData.imgUrls = "";
							submitData.onlyMark = onlyMark;
							submitData.sign = sign;
							submitData.hwId = config.homeworkId;
							submitData.isMerge = isMerge;
							submitData.level = "0";
							
						break;
					}
					submitURL = config.baseurl + "/courseRead.action" + "?r=" + Math.random();
				break;
				case 4:
					submitData.type = config.type;
					submitData.params = cacheId + "@" + resultData.score + "@" + resultData.readRecord;
					submitData.userToken = config.getUserToken();
					submitData.playRecordServer = win.location.protocol + "//" + eppathServer + "/webvoice";
					submitData.isOld = resultData.isold;
					
					submitURL = config.baseurl + "/pkStartedSave.action" + "?r=" + Math.random();
				break;
				case 7:
					submitData.type = config.type;
					submitData.params = cacheId + "@" + resultData.score + "@" + resultData.readRecord;
					submitData.userToken = config.getUserToken();
					submitData.playRecordServer = win.location.protocol + "//" + eppathServer + "/webvoice";
					
					submitURL = config.baseurl + "/pkStartedSaveChallenge.action" + "?r=" + Math.random();
				break;
				case 9:
				case 11:
					submitData.type = config.type;
					submitData.params = cacheId + "@" + resultData.score + "@" + resultData.readRecord;
					submitData.userToken = config.getUserToken();
					submitData.playRecordServer = win.location.protocol + "//" + eppathServer + "/webvoice";
					submitData.isOld = resultData.isold;
					submitData.lessonId = lessonId;
					
					submitURL = config.baseurl + "/dailyArenaEnd.action" + "?r=" + Math.random();
					break;
				case 3://单词全能王
					submitData["almightyMatch.id"] = config.currentMatchId;
					submitData["almightyMatch.lessonId"] = config.currentLessonId;
					submitData.domain = config.domain;
					submitData.userId = config.currentUserId;
					submitData.matchType = config.matchType;
					submitData.matchStatus = config.matchStatus;
					submitData.lessonId = config.currentDefinedLessonId;
					submitData.userToken = config.getUserToken();
					submitData.scoreId = config.scoreId;
					submitData.score = resultData.score;
					submitData.record = resultData.readRecord;
					submitURL = config.baseurl + "/w2mAlmightyFollowReadMatchFinash.action" + "?r=" + Math.random();
					break;
				default:
				break;
			}
			
			var dataTypess = "text";
			
			if(config.type ==8){
				dataTypess ="json";
			}
			
			$.ajax({
				type: "post",
				url : submitURL,
				dataType: dataTypess,
				data: submitData,
				success: function (data) {
					logtips();
					immeover = false;
					submitReadEnd(data, resultData);
//					submitSuccess(config.matchId);
				},		  
				error: function(XMLHttpRequest, textStatus, errorThrown) {
					logtips("提交失败，网络异常。");
				},
				complete: function() {
					content.find(".start-button, .button-group").removeClass("disabled");
				}
		    });
		}
		
		function submitReadEnd(data, resultData) {
			var saveRes;
			var surplus;
			if(config.type ==8){
				 saveRes = data.result; // 接口返回状态
				 surplus = parseInt(data.surplus)==undefined?'':parseInt(data.surplus); // 训练剩余次数
				 if(data.showGetAiVip==1){
					createMembershipPopUp();
					}
			}else{
				var result = data.split("#");
				saveRes = result[0]; // 接口返回状态
				surplus = parseInt(result[1]); // 训练剩余次数
			}
			
			showScoreBoard(resultData, surplus);
			
			haveApply = false;
			content.find(".start-button").removeClass("started").show();
			switch (config.type) {
				case 8:
					if (readType == 11 || readType == 12) {
						if (saveRes == "0") {
						} else if (saveRes == "-1") {
							readAlert("系统提示", "提交跟读练习记录失败，请联系客服记录您的问题。", "确定", onReload);
						} else if (saveRes == "-2") {
							readAlert("系统提示", "您的成绩有效性验证失败。", "确定", onReload);
						}
					} else if (readType == 0 || readType == 1) {
						if (saveRes == "0") {
							if (surplus > 0) {
								readAlert("系统提示", "跟读还有" + surplus + "遍，是否继续完成？", "继续完成", onReload, "取消", onReload);
							} else {
								readAlert("系统提示", "保存记录成功。", "确定", onReload);
							}
						} else if (saveRes == "-1") {
							readAlert("系统提示", "提交录音记录失败，请联系客服记录您的问题。", "OK", onReload);
						}
					} else if (readType == 9) {
						if (saveRes == "0") {	
							if (surplus > 0) {
								readAlert("系统提示", "跟读还有" + surplus + "遍，是否继续完成？", "继续完成", onReload, "取消", onReload);
							} else {
								if (resultData.score == "-98") {
									readAlert("系统提示", "恭喜您通过了背诵，记录已经保存成功。", "确定", onReload);
								} else if (resultData.score == "-97") {
									readAlert("系统提示", "很遗憾您没有通过背诵，记录已经保存成功。", "确定", onReload);
								} else {
									readAlert("系统提示", "背诵记录已经保存成功。", "确定", onReload);
								}
							}
						} else if (saveRes == "-1") {
							readAlert("系统提示", "提交背诵记录失败，请联系客服记录您的问题。", "确定", onReload);
						}
					}
					break;
				case 3: //单词全能王
					config.almightMatchInvoke("end",config);
					break;
				case 9:
				case 11:
					config.listenLeave2();
				default:
					var resultArray = data.split("@");
					var resultType = parseInt(resultArray[0]);
					config.resultHandler(resultType);
					showAlert(resultType, resultArray);
					break;
			}
			
			if (config.userFlag == 0 && (readType == 0 || readType == 1 || readType == 9)) {
				var lab = resultData.realScore >= 90 ? "优" : resultData.realScore >= 85 ? "良" : resultData.realScore >= 70 ? "中" : "差";
				setScoreBoard("本课得分", lab);
			} else {
				setScoreBoard("本课得分", resultData.realScore);
			}
		}
		
		function onReload() {
//			setScoreBoard("本句得分", "");
			on_paused();
			content.find(".sentence").each(function(i) {
				restoreSentence(i);
			});
		}
		
		function setScoreBoard(title, score) {
			content.find(".score-blackboard .title").text(title);
			content.find(".score-blackboard .score").text(score);
		}
		
		function showScoreBoard(data, surplus) {
			
			if (config.lessonNum == "2" || data.score < 0 || config.userFlag == 0 || ((config.matchType == 6 || config.matchType == 7 || config.matchType == 8) && config.showScoreSwitch == 1)) { // 海选比赛最后得分是否弹窗 判断
				return;
			}
			console.log("最后得分弹窗 -- ");
			console.log(JSON.stringify(data));
			var endscorePopup = $('<div class="end-score-popup-container">' +
									'<div class="end-score-popup">' +
										'<div class="score-box"><span class="score">' + data.realScore + '</span></div>' +
										'<hr />' +
										'<div class="score-info">' +
											'<div class="yinjie-box">本课练习音节数：<span class="yinjie">' + data.yinjie + '</span></div>' +
											'<div class="fayin-box">您的英语发音：<span class="fayin">' + data.fayin + '</span></div>' +
											'<div class="syllable-box">' +
												'好：<span class="good">' + data.good + '</span>&nbsp;' +
												'中：<span class="normal">' + data.normal + '</span>&nbsp;' +
												'差：<span class="bad">' + data.bad + '</span>' +
											'</div>' +
											'<div class="wanzheng-box">完整(流利)度：<span class="wanzheng">' + data.wanzheng + '</span></div>' +
											'<div class="yuyin-box">' +
												'语调：<span class="yudiao">' + data.yudiao + '</span>&nbsp;' +
												'音量(重音)：<span class="yinliang">' + data.yinliang + '</span>' +
											'</div>' +
										'</div>' +
										'<div class="tips-box">成绩会保存在个人空间，老师也可以查阅到</div>' +
										'<button class="close-button">关闭</button>' +
									'</div>' +
								'</div>');
			content.find(".arivoc-plugin-course-read").append(endscorePopup);
			
			if (surplus > 0) {
				endscorePopup.find(".tips-box").text("跟读还有" + surplus + "遍，是否继续完成？");
				endscorePopup.find(".close-button").text("继续完成");
			} else {
				endscorePopup.find(".tips-box").text("成绩会保存在个人空间，老师也可以查阅到");
				endscorePopup.find(".close-button").text("关闭");
			}
			
			endscorePopup.find(".close-button").bind("click", function() {
				endscorePopup.remove();
				onReload();
			});
			
			arynAnimate.arynEndScore(data.realScore);
			
			if(data.realScore > 89) {
				content.find(".highlight").removeClass("loading playing recording playbacking");
				mediaPlayer.play(config.teacherServer + "guide/clap1.mp3");
			}
			
		}
		
		function showHelpBoard() {
			var helpPopup = $('<div class="help-board-container">' +
								'<div class="help-board">' +
									'<button class="close-button">关闭</button>' +
									'<h3>帮助</h3>' +
									'<p><strong>怎么开始</strong>：调整好麦克风，点“开始跟读”就可以和Aryn老师一起练习口语了。哔的一声后红色进度条走动，你开始读。</p>' +
									'<p><strong>目标成绩</strong>：如果一句话达不到目标成绩，老师就会让你再重复一次。</p>' +
									'<p><strong>智能模式</strong>：让老师带领你，从头到尾朗读课文。并获得一个全文的成绩。</p>' +
									'<p><strong>人工模式</strong>：如果你希望重点反复练习某个句子，用人工模式，可以直接选择这个个句子并反复练习。</p>' +
									'<p><strong>麦克风</strong>： 最好用台式麦克。要调整好录音音量，不要太大或太小，注意不要吹话筒。</p>' +
									'<p><strong>字体大小</strong>：您可以通过shift +/- 来调整黑板字体大小。 </p>' +
									'<p><strong>你还可以</strong>：点“全文试听”，先听听全文的录音。还可以在完成后，点跟读全放，听听自己的跟读录音。 </p>' +
								'</div>' +
							'</div>');
			
			helpPopup.find(".close-button").bind("click", function() {
				helpPopup.remove();
			});
			
			content.find(".arivoc-plugin-course-read").append(helpPopup);
		}
		
		function adjustFontSize(evt) {
			if (evt.which == 187 && (evt.shiftKey || evt.originalEvent.shiftKey)) {
				conFS = conFS >= maxFS ? maxFS : conFS += incFS;
				content.find(".content").css("font-size", conFS);
			} else if (evt.which == 189 && (evt.shiftKey || evt.originalEvent.shiftKey)) {
				conFS = conFS <= minFS ? minFS : conFS -= incFS;
				content.find(".content").css("font-size", conFS);
			}
		}
		
		function analysisResult() {
			var sentence = content.find(".sentence").eq(sentenceIndex);
			var $xml = sentence.data("result");
			
			var errorcode = parseInt($xml.find("ErrorCode").text());
			sentence.data("eppath", $xml.find("EPPATH").text());
			sentence.data("feedback", $xml.find("WavFeedback").text());
			sentence.data("totalSyllable", 0);
			sentence.data("goodSyllable", 0);
			sentence.data("normalSyllable", 0);
			sentence.data("badSyllable", 0);
			sentence.data("passSyllable", 0);
			sentence.data("score100", parseInt($xml.find("SentenceScore").text()));
			sentence.data("score10", ReadDataUtils.score100210(sentence.data("score100")));
			
			if (errorcode > 90 && errorcode < 110) {
				errorcode -= 100;
				sentence.data("isold", 1);
			} else if (errorcode > 190 && errorcode < 210) {
				errorcode -= 200;
				sentence.data("isold", 0);
			} else if (errorcode == -106) {
				errorcode = -105;
				sentence.data("isold", 1);
			} else {
				sentence.data("isold", 0);
			}
			sentence.data("errorcode", errorcode);
			console.log("句子errorcode: " + errorcode);
			
			if ($(sentence).data("isYB")) {
				sentence.data("passed", true);
				if (readType == 10 || readType == 11) {
					stepIndex += 3;
				}
				$(targetobj).trigger(CourseRead.doStepComplete);
				return;
			}
			
			failCount = 0;
			warnCount = 0;
			
			sentence.data("passed", true);
			
			sentence.data("bad", sentence.data("errorcode") >= 0 ? false : true);
			
			if (sentence.data("score100") > 0 && readType != 0 && readType != 1 && readType != 9 && readType != 3) {
				setScoreBoard("本句得分", sentence.data("score100"));
			} else {
				setScoreBoard("本句得分", "");
			}
			
			var sortArry = new Array();
			
			var wordIndex = -1;
			sentence.find(".word").each(function(i, w) {
				var wordobj = $(w);
				wordobj.data("syllables", []);
				wordIndex = wordIndex + 1;
				fillSyllables(wordIndex, i, wordobj);
				
//				if (wordobj.data("transwords").length == 0) {
//					wordIndex = wordIndex + 1;
//					fillSyllables(wordIndex, i, wordobj);
//				} else {
//					$.each(wordobj.data("transwords"), function(j, wo) {
//						wordIndex = wordIndex + 1;
//						fillSyllables(wordIndex, i, wordobj);
//					});
//				}
			});
			
			function fillSyllables(index, windex, wordobj) {
				
				if ($xml.find('Word').eq(index).children('Syllable').length == 0) {
					return;
				}
				
				wordobj.data("miss", $xml.find('Word').eq(index).children('Miss').text());
				
				$xml.find('Word').eq(index).children('Syllable').each(function(j) {
					sentence.data("totalSyllable", sentence.data("totalSyllable") + 1);
					
					var syllable = new Object();
					syllable.syllable = $(this).children('slbText').text();
					syllable.score100 = $(this).children('Score').text();
					syllable.score10 = ReadDataUtils.score100210(syllable.score100);
					wordobj.data("syllables").push(syllable);
					
					var sortStr = windex + "-" + j + "-" + syllable.score100;
					sortArry.push(sortStr);
					
					if (syllable.score10 <= 3) {
						sentence.data("badSyllable", sentence.data("badSyllable") + 1);
					} else if (syllable.score10 > 3 && syllable.score10 < 7) {
						sentence.data("normalSyllable", sentence.data("normalSyllable") + 1);
					} else {
						sentence.data("goodSyllable", sentence.data("goodSyllable") + 1);
					}
					
					var syllCount = ReadDataUtils.getSyllableCountValue(syllable.score10);
					sentence.data("passSyllable", sentence.data("passSyllable") + syllCount);
				});
				
				var transwords = wordobj.data("transwords").join("");
				var syllableStitch = "";
				$.each(wordobj.data("syllables"), function(i, item) {
					syllableStitch += item.syllable;
				});
				
				// 转义的单词 音节填充不够 继续填充下一单词音节
				if (transwords.length > 0 && transwords.length > syllableStitch.length) {
					wordIndex = wordIndex + 1;
					fillSyllables(wordIndex, windex, wordobj);
				}
			}
			
			// 按音节分数降序排列
			sortArry.sort(function(a, b) {
				var sa = a.split("-");
				var sb = b.split("-");
				return sa[2] - sb[2];
			});
			// 取前两个最高分 用于显示
			for (var i = 0; i < sortArry.length; i++) {
				if (i > 1) {
//					break;
				}
				var sa = sortArry[i].split("-");
				sentence.find(".word").eq(sa[0]).data("showscore", true);
				sentence.find(".word").eq(sa[0]).data("syllables")[sa[1]].showscore = true;
			}
			drawSyllables(sentenceIndex);
			$(targetobj).trigger(CourseRead.doStepComplete);
		}
		
		function correctScore(score) {
			var file = 4;
			content.find(".sentence").each(function(i, sentence) {
				if ($(sentence).data("score100") > 90 && file >= 3) {
					file = 3;
				} else if ($(sentence).data("score100") > 80 && file >= 2) {
					file = 2;
				} else if ($(sentence).data("score100") > 70 && file >= 1) {
					file = 1;
				} else {
					file = 0;
				}
			});
			switch (file) {
				case 1: return score < 62 ? 62 : score;
				case 2: return score < 70 ? 70 : score;
				case 3: return score < 80 ? 80 : score;
				default: return score;
			}
		}
		
		function correctScore4Word(score) {
			var totalscore = 0;
			content.find(".sentence").each(function(i, sentence) {
				totalscore += $(sentence).data("score100");
			});
			var avgscore = Math.round(totalscore / content.find(".sentence").length);
			return Math.max(score, avgscore);
		}
		
		function fakeApply() {
			switch (config.type) {
				case 8:
					var hwtarr = config.hwtype.split("-");
					var hwt = null;
					if (hwtarr[1] == lessonId) {
						hwt = hwtarr[0];
					}
					
					var applyData = {};
					applyData.lessonId = lessonId;
					applyData.hwtype = hwt;
					applyData.params = config.getParasValue(config.type);
					applyData.userToken = config.getUserToken();
					
					$.ajax({
						type: "post",
						url : config.baseurl + "/getHasBuyStatus.action?r=" + Math.random(),
						dataType: "text",
						data: applyData,
						success: function (data) {
							var resultArray = data.split("@");
							onlyMark = resultArray[2];
						},		  
						error: function(XMLHttpRequest, textStatus, errorThrown) {
							console.log("apply_start error:" + textStatus);
						}
				    });
					
				break;
			}
		}
		
		
		
		
		
		function uploadBlob(url, formData, callback) {

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
		
			xhr.open("POST", url);
			xhr.send(formData);
		};
		
		
		function getModelListByFlag() {
			var modelIndexes = [];
			
			switch (config.userFlag) {
				case 0:
					if (isLeaderGradeShow) {
						modelIndexes.push(5);
					}
					modelIndexes.push(4);
					if (config.appointType == "9") {
						modelIndexes.push(3);
					}
					modelIndexes.push(7);
					break;
				default:
					modelIndexes.push(0);
					if (config.hideReadModel.indexOf("3") == -1) {
						modelIndexes.push(1);
					}
					if (config.hideReadModel.indexOf("4") == -1) {
						modelIndexes.push(6);
					}
					if (isLeaderGradeShow) {
						modelIndexes.push(5);
					}
					modelIndexes.push(4);
					modelIndexes.push(3);
					if (config.hideReadModel.indexOf("2") == -1) {
						modelIndexes.push(2);
					}
					if (config.domain == "thjyjt") {
						modelIndexes.push(7);
					}
					break;
			}
			
			if (config.type == 4 || config.type == 7 || config.type == 9 || config.type == 11) {
				modelIndexes.push(8);
			}
			
			var models = [];
			for (var i = 0; i < modelIndexes.length; i++) {
				models.push(modeOptions[modelIndexes[i]]);
			}
			return models;
		}
		
		function logtips(message) {
			if (!!message) {
				content.find(".logtips").text(message).show();
			} else {
				content.find(".logtips").text("").hide();
			}
		}
		
		function readAlert(title, message, leftlabel, leftcallback, rightlabel, rightcallback) {
			content.find(".read-alert").remove();
			
			var NOFUN = function() {};
			var alertDiv = $('<div class="read-alert">' +
								'<div class="popup">' +
									'<div class="alert-title">' + title + '</div>' +
									'<div class="alert-content">' +
										'<p class="alert-message">' + message + '</p>' +
										'<div class="button-group">' +
											'<button class="left-button">' + leftlabel + '</button>' +
											'<button class="right-button"></button>' +
										'</div>' +
									'</div>' +
								'</div>' +
							'</div>');
			
			if (!!rightlabel) {
				alertDiv.find(".right-button").text(rightlabel).show();
			} else {
				alertDiv.find(".right-button").text("").hide();
			}
			
			alertDiv.find(".left-button").bind("click", function() {
				alertDiv.remove();
				(leftcallback || NOFUN)();
			});
			alertDiv.find(".right-button").bind("click", function() {
				alertDiv.remove();
				(rightcallback || NOFUN)();
			});
			
			content.find(".arivoc-plugin-course-read").append(alertDiv);
			
			alertDiv.find(".popup").css({
				"margin-top": -alertDiv.find(".popup").height() / 2 + "px",
				"margin-left": -alertDiv.find(".popup").width() / 2 + "px"
			});
			
			if (alertDiv.find(".alert-message").innerHeight() <= 40) {
				alertDiv.find(".alert-message").css("text-align", "center");
			} else {
				alertDiv.find(".alert-message").css("text-align", "justify");
			}
		}
		
		function arynAlert(message, leftlabel, leftcallback, rightlabel, rightcallback) {
			content.find(".arivoc-course-read-aryn-alert-wrapper").remove();
			
			var NOFUN = function() {};
			var arynAlertDiv = $('<div class="arivoc-course-read-aryn-alert-wrapper">' +
								'<div class="course-read-aryn-alert">' +
									'<div class="close-x"></div>' +
									'<p class="aryn-alert-message">' + message + '</p>' +
									'<div class="aryn-alert-left-button">' + leftlabel + '</div>' +
									'<div class="aryn-alert-right-button">' + rightlabel + '</div>' +
								'</div>' +
							'</div>');
			
			
			arynAlertDiv.find(".close-x").bind("click", function() {
				arynAlertDiv.remove();
			});
			arynAlertDiv.find(".aryn-alert-left-button").bind("click", function() {
				arynAlertDiv.remove();
				(leftcallback || NOFUN)();
			});
			arynAlertDiv.find(".aryn-alert-right-button").bind("click", function() {
				arynAlertDiv.remove();
				(rightcallback || NOFUN)();
			});
			
			content.find(".arivoc-plugin-course-read").append(arynAlertDiv);
			
		}
		
		function beianPromptPK() {
			var prompt = config.getProgramme();
			switch (prompt.programme) {
				case 1:
					readAlert("系统提示", prompt.text.type2, "支付中心", config.gotoPay);
					break;
				case 2:
					readAlert("系统提示", prompt.text.type2, "取消", null, "分享给家长", config.unpay1);
					break;
				case 3:
					readAlert("系统提示", prompt.text.type2, "取消", null, "家长通", config.gotoParentCommunication);
					break;
				case 4:
					readAlert("系统提示", prompt.text.type2, "取消", null, "返回首页", config.gotoBackHome);
					break;
			}
			content.find(".start-button").removeClass("started");
		}
		
		function beianPrompt() {
			// var prompt = config.getProgramme();
			// var message = prompt.text.type1;
			// message = isLeaderGradeShow ? message.replace(/录音模式/g, "领读模式") : message;
			
			// var freeLabel = isLeaderGradeShow ? "切换领读模式" : "切换录音模式";
			// switch (prompt.programme) {
			// 	case 1:
			// 		arynAlert(message, freeLabel, gotoFreeMode, "支付中心", config.gotoPay);
			// 		break;
			// 	case 2:
			// 		arynAlert(message, freeLabel, gotoFreeMode, "分享给家长", config.unpay1);
			// 		break;
			// 	case 3:
			// 		arynAlert(message, freeLabel, gotoFreeMode, "家长通", config.gotoParentCommunication);
			// 		break;
			// 	case 4:
			// 		arynAlert(message, freeLabel, gotoFreeMode, "返回首页", config.gotoBackHome);
			// 		break;
			// 	case 6:
			// 		arynAlert(message, freeLabel, gotoFreeMode, "返回首页", config.gotoBackHome);
			// 		break;					
			// }
			content.find(".start-button").removeClass("started");
			gotoFreeMode();
		}
		
		function gotoFreeMode() {
			content.find(".mode-select").val(isLeaderGradeShow ? 1 : 0).trigger("change");
		}
		
		function showAlert(resultCode, resultArray) {
			switch (resultCode) {
				case ResultCode.CODE_101:
					haveApply = true;
					cacheId = resultArray[1];
					on_started();
					break ;
				case ResultCode.CODE_111:	
					readAlert("系统提示", "我要打擂申请失败！", "确定", null);
					break ;
				case ResultCode.CODE_112:	
					readAlert("系统提示", "您已经完成今天的打擂了，请明天再来吧！", "确定", null);
					break ;
				case ResultCode.CODE_113:	
					readAlert("系统提示", "金币不足，不能参加擂台。购买金币请到支付中心！", "确定", null);
					break ;
				case ResultCode.CODE_151:	
					readAlert("系统提示", "打擂成功，请耐心等待发榜。", "确定", null);
					break ;
				case ResultCode.CODE_161:	
					readAlert("系统提示", "打擂失败。", "确定", null);
					break ;
				/** ****************** **/
				case ResultCode.CODE_201:
					haveApply = true;
					cacheId = resultArray[1];					
					on_started();
					break ;
				case ResultCode.CODE_211:	
					readAlert("系统提示", "我要练习申请失败！", "确定", null);
					break ;
				case ResultCode.CODE_212:	
					readAlert("系统提示", "金币不足，不能练习！购买金币请到支付中心！", "确定", null);
					break ;
				case ResultCode.CODE_251:	
					readAlert("系统提示", "练习成功。", "确定", null);
					break ;
				case ResultCode.CODE_261:	
					readAlert("系统提示", "练习失败。", "确定", null);
					break ;
				/** ****************** **/
				case ResultCode.CODE_301:
					haveApply = true;
					cacheId = resultArray[1];					
					on_started();
					break ;
				case ResultCode.CODE_311:	
					readAlert("系统提示", "挑战自我申请失败！", "确定", null);
					break ;
				case ResultCode.CODE_312:		
					readAlert("系统提示", "金币不足，不能挑战自我！购买金币请到支付中心！", "确定", null);
					break ;
				case ResultCode.CODE_313:
					readAlert("系统提示", "今天你已经完成了挑战自我，请明天再来吧。", "确定", null);
					break ;
				case ResultCode.CODE_351:	
					readAlert("系统提示", "挑战自我成功，请耐心等待结果。", "确定", null);
					break ;
				case ResultCode.CODE_361:	
					readAlert("系统提示", "挑战自我失败。", "确定", null);
					break ;
				/** ****************** **/
				case ResultCode.CODE_401:
					haveApply = true;
					cacheId = resultArray[1];					
					on_started();
					break ;
				case ResultCode.CODE_411:
					readAlert("系统提示", "挑战好友申请失败！", "确定", null);
					break ;
				case ResultCode.CODE_412:	
					break ;
				case ResultCode.CODE_413:
					readAlert("系统提示", "金币不足，不能挑战好友！购买金币请到支付中心！", "确定", null);
					break ;
				case ResultCode.CODE_414:
					readAlert("系统提示", "被挑战者金币不足，请挑战其它好友吧。", "确定", null);
					break ;
				case ResultCode.CODE_415:
					readAlert("系统提示", "不能重复挑战，上次挑战还未结束。", "确定", null);
					break ;
				case ResultCode.CODE_416:
					if (config.userFlag == 0 || config.userFlag == 4) {
						readAlert("系统提示", "免费版不能使用该功能。", "确定", null);
					} else {
						beianPromptPK();
					}
					content.find(".start-button").removeClass("started");
					break ;
				/** ****************** **/
				case ResultCode.CODE_451:
					readAlert("系统提示", "挑战好友成功，请耐心等待结果。", "确定", null);
					break ;
				case ResultCode.CODE_461:
					readAlert("系统提示", "挑战好友失败。", "确定", null);
					break ;
				case ResultCode.CODE_471:
					haveApply = true;
					cacheId = resultArray[1];					
					on_started();
					break ;
				case ResultCode.CODE_472:	
					readAlert("系统提示", "应战成功。", "确定", null);
					break ;
				case ResultCode.CODE_473:
					readAlert("系统提示", "挑战好友接受者已经跟读完成,挑战结束了。", "确定", null);
					break ;
				case ResultCode.CODE_474:
					readAlert("系统提示", "挑战好友接受者金币不足。购买金币请到支付中心！", "确定", null);
					break ;
				/** ****************** **/
				case ResultCode.CODE_1001:	
					readAlert("系统提示", "您不是参赛选手。", "确定", null);
					break ;
				case ResultCode.CODE_1002:
					readAlert("系统提示", "在您参赛前请先接受参赛要求。", "确定", null);
					break ;
				case ResultCode.CODE_1003:
					readAlert("系统提示", "您已完成参赛。", "确定", null);
					break ;
				/** ****************** **/
				case ResultCode.CODE_1010:
					readAlert("系统提示", "您有两次参赛资格，目前已完成指定参赛次数。", "确定", null);
					break;
				case ResultCode.CODE_1011:
					haveApply = true;
					cacheId = resultArray[1];			
					on_started();
					break;
				case ResultCode.CODE_1012:
					readAlert("系统提示", "您申请周擂台参赛失败。", "确定", null);
					break;
				case ResultCode.CODE_1013:
					readAlert("系统提示", "您参赛已成功结束。", "确定", null);
					break;
				case ResultCode.CODE_1014:	
					readAlert("系统提示", "您参赛失败。", "确定", null);
					break;
				/** ****************** **/
				case ResultCode.CODE_1051:
					readAlert("系统提示", "您只有一次贡献机会，目前不能再次贡献。", "确定", null);
					break;
				case ResultCode.CODE_1052:
					cacheId = resultArray[1];
					haveApply = true;
					on_started();
					break;
				case ResultCode.CODE_1053:
					readAlert("系统提示", "您的贡献申请失败。", "确定", null);
					break;
				case ResultCode.CODE_1054:
					readAlert("系统提示", "您的贡献成功结束。", "确定", null);
					break;
				case ResultCode.CODE_1055:
					readAlert("系统提示", "您的贡献结束失败。", "确定", null);
					break;
				case ResultCode.CODE_1056:
					readAlert("系统提示", "您必须有支持的对象才能贡献声音。", "确定", null);
					break;
				/** ****************** **/
				case ResultCode.CODE_1060:
					readAlert("系统提示", "周擂台未开放。", "确定", null);
					break;
				case ResultCode.CODE_1061:
					readAlert("系统提示", "日擂台周末不开放。", "确定", null);
					break;
				/** ****************** **/
				case ResultCode.CODE_2000:
					userId = resultArray[1];
					onlyMark = resultArray[2] ? resultArray[2] : "";
					haveApply = true;
					on_started();
					break;
				case ResultCode.CODE_2001:
				case ResultCode.CODE_2002:
					beianPrompt();
					break;
				case ResultCode.CODE_2003:
					readAlert("系统提示", "您访问的课程不合法。", "确定", null);
					break;
				/** ****************** **/
				case ResultCode.CODE_2101:
					haveApply = true;
					cacheId = resultArray[1];	
					userId = resultArray[2];
					on_started();
					break;
				case ResultCode.CODE_2111:	
					readAlert("系统提示", "参加比赛申请失败！", "确定", null);
					break;
				case ResultCode.CODE_2112:	
					readAlert("系统提示", "跟读次数已用完，请耐心等待发榜。", "确定", null);
					break;
				case ResultCode.CODE_2113:	
					readAlert("系统提示", "金币不足，不能参加擂台。购买金币请到支付中心！", "确定", null);
					break;
				case ResultCode.CODE_2114:	
					readAlert("系统提示", "您今天已经参赛，明天再来吧！", "确定", null);
					break;
				/** ****************** **/
				case ResultCode.CODE_2151:
					if (config.showScoreSwitch == 1 && (config.matchType == 6 || config.matchType == 7 || config.matchType == 8)) {
						readAlert("系统提示", '参赛成功！<br>按照相关规定，竞赛、展示类活动需在家长知情下完成，家长可在微信公众号"清睿口语100家长通"查看成绩。',
								"如何查看成绩", function() {
									window.open("http://www.kouyu100.com/hxmatch/index.html");
									config.refreshMatch();
								}, "知道了", config.refreshMatch);
					} else {
						readAlert("系统提示", "参赛成功。", "确定", config.refreshMatch);
					}
					break;
				case ResultCode.CODE_2161:
					readAlert("系统提示", "参赛失败。", "确定", null);
					break;
				/** ****************** **/
				case ResultCode.CODE_2201://考试开始
					haveApply = true;
					cacheId = resultArray[1];
					on_started();
					break;
				case ResultCode.CODE_2251:
					readAlert("系统提示", "参赛成功。", "确定", null);
					break;
				case ResultCode.CODE_3001://单词全能王
					if (!content.find(".start-button").hasClass("disabled")) {
						var matchStatus = parseInt(resultArray[1]);
						if(matchStatus == -5){
							config.almightMatchInvoke("nochance",config);
						}
						config.matchStatus = matchStatus;
						var msg = config.almightMatchInvoke("matchstatusmsg",config);
						readAlert(
							"系统提示",
							msg,
							"确定",
							function () {
								if(matchStatus >= 0){
										var res = config.almightMatchInvoke("start",config);
										if(res){
											haveApply = true;
											on_started();
											content.find(".start-button").hide();
										}else {
											alert("开始活动失败");
										}
								}else{
									pause();
								}
							},
							"返回"
							,function () {
								pause();
								content.find(".start-button").show();
								config.almightMatchInvoke("backtohome",config);
							}
						);
					}
					break;
				default:
					if (resultArray[0].toString().length < 5) {
						readAlert("系统提示", "未处理的返回值：" + resultArray[0], "确定", null);
					} else {
						pushOff();
					}
					break;
			}
		}
		
		// 快速查询
		function quickQuery(selection) {
			content.find(".quick-query-button").remove();
			var selectStr = selection.toString();
			var patternEN = /[a-zA-Z]/;
			
			if (selection.isCollapsed || $.trim(selectStr) == "" || patternEN.exec(selectStr) == null) return;
			
			// 查询按钮创建
			var quickBtn = $('<div class="quick-query-button"></div>');
			content.find('.arivoc-plugin-course-read').append(quickBtn);
			
			quickBtn.bind("click", function(evt) {
				content.find(".quick-query-button").remove();
				gotoEdic(selectStr);
			});
			quickBtn.bind("mouseup", function(evt) {
				evt.stopPropagation();
			});
			
			// 查询按钮定位
			var rangeDom = selection.getRangeAt(0);
			var rect = rangeDom.getBoundingClientRect();
			var parentRect = content.find('.arivoc-plugin-course-read').get(0).getBoundingClientRect();
			var buttonRect = quickBtn.get(0).getBoundingClientRect();
			var l = (rect.left - parentRect.left + (rect.width - buttonRect.width) / 2) / fsscale;
			var t = (rect.top - parentRect.top - buttonRect.height - 6) / fsscale;
			quickBtn.css({top: t, left: l});
		}
		
		function gotoEdic(word) {
			// 外部电子词典赋值
			$("#wdid").click();
			$("#dict_word").val(word).trigger('keyup');
		}
		
		setTimeout(function() {
			arynAnimate.arynStop();
		}, 1000);
		
		this.init = init;
		this.pause = pause;
		
	};
	
	/** 跟读H5数据处理工具 **/
	var ReadDataUtils = {};
	// recite单词字符串处理
	ReadDataUtils.formatReciteWords = function(recite) {
		var recitewords = [];
		if (!!recite && recite.length > 0) {
			var temarray = recite.split("#");
			for (var i = 0; i < temarray.length; i++) {
				if (temarray[i] == "") {
					continue;
				}
				var reciteSentence = {};
				var sentences = temarray[i].split("|");
				reciteSentence.sentenceId = sentences[0];
				reciteSentence.words = sentences[1].split("@");
				recitewords.push(reciteSentence);
			}
		}
		return recitewords;
	};
	// 向select组件 导入数据
	ReadDataUtils.importSelectData = function(jqobj, options) {
		$.each(options, function(i, option) {
			var opt = $("<option></option>");
			$.each(option, function(key, val) {
				if (key == "value") {
					opt.val(val);
				} else if (key == "label") {
					opt.text(val);
				} else if (key == "selected" && val == true) {
					opt.attr("selected", "selected");
				} else {
					opt.attr(key, val);
				}
			});
			jqobj.append(opt);
		});
	};
	// 解析lessonXML
	ReadDataUtils.parseLessonXML = function(xdata, attach) {
		var returndata = {};
		var xmlData;
		var temindex = xdata.indexOf("#<?xml");
		if (temindex >= 0) {
			returndata.isold = 1;
			returndata.analysis = xdata.substr(0, temindex);
			xmlData = xdata.substr(temindex + 1);
		} else {
			returndata.isold = 0;
			returndata.analysis = null;
			xmlData = xdata;
		}
		returndata.bookname = $(xmlData).find("bookname").text();
		returndata.lessonname = $(xmlData).find("lessonname").text();
		returndata.model = $(xmlData).find("model").text();
		returndata.rootdir = $(xmlData).find("rootdir").text();
		returndata.display = $(xmlData).find("display").text();
		
		console.log("参数isold:" + returndata.isold);
		console.log("打分服务器:" + returndata.analysis);
		console.log("音频根目录:" + returndata.rootdir);
		
		returndata.sentences = [];
		$(xmlData).find("sentence").each(function(i, x) {
			var curSentence = $(x);
			var sentence = new Object();
			
			sentence.sid = curSentence.find("sid").text();
			sentence.part = curSentence.find("part").text();
			sentence.role = curSentence.find("role").text();
			sentence.text = curSentence.find("text").text();
			sentence.impWord = curSentence.find("impWord").text();
			sentence.cnText = curSentence.find("cnText").text();
			sentence.audioPath = curSentence.find("audioPath").text().replace(/\//g, "!!!");
			sentence.syllables = curSentence.find("syllables").text();
			sentence.wavPath = curSentence.find("wavPath").text();
			sentence.isYB = curSentence.find("yinbiao").text() || 0;
			
			if (!!attach) {
				$.each(attach, function(j, s) {
					var xmlAudioPath = curSentence.find("audioPath").text();
					// var word = curSentence.find("text").text();
					var word = curSentence.find("text").text().replaceAll(/\{[^{}]*\}/g, "");
					if (word == s.txt) {//xmlAudioPath.endsWith(s.path) 原来是音频路径比较 现改位单词比较
						sentence.wid = s.wordId;
						sentence.flag = s.picFlag;
						sentence.imagePath = s.picUrl;
						/*if (sentence.flag == 0) {
							sentence.imagePath = "";
						} else if (sentence.flag == 1) {
							sentence.imagePath = "http://static2.kouyu100.com/twominute/" + sentence.text.substr(0, 1).toLocaleLowerCase() + "/" + sentence.text + ".png";
						} else {
							sentence.imagePath = "http://static2.kouyu100.com/twominute/" + sentence.text.substr(0, 1).toLocaleLowerCase() + "/" + sentence.text + sentence.flag + ".png";
						}*/
					}
				});
			}
			
			returndata.sentences.push(sentence);
		});
		return returndata;
	};
	
	// TODO 有可能返回undefined
	ReadDataUtils.getBeforeGuideAudio = function(model, count, index, total, cookie) {
		
		// 背诵 和 通读模式 的引导音
		if (model == 9 || model == 13) {
			switch (count) {
				case 0:
					if (index == 0 && model == 9) {
						return "guide/Let's_begin_7.mp3";
					} else if (index == 0 && model == 13) {
						return "guide/Let's_begin_8.mp3";
					} else {
						return "guide/blank.mp3";
					}
				break;
				case 1:
					return "guide/Try_it_again.mp3";
				break;
				case 2:
					return "guide/One_more_time.mp3";
				break;
				default:
					return "guide/blank.mp3";
				break;
			}
		}
		
		switch (count) {
			case 0:
				if (index == 0) {
					var lastTime = parseInt(cookie.getData("read_last_time"));
					var lastScore = parseInt(cookie.getData("read_last_score"));
					var now = new Date().getTime();
					if (!lastTime) {
						cookie.setData("read_last_time", now + "", 3000);
						return "guide/Let's_begin_First_sentence.mp3";
					} else {
						var diff = now - lastTime;
						cookie.setData("read_last_time", now + "", 3000);
						if (diff < 1000 * 60 * 60 * 24 * 7) {
							if (lastScore > 0 && lastScore < 55) {
								return "guide/Let's_begin_6.mp3";
							} else if (lastScore > 90) {
								return "guide/Let's_begin_5.mp3";
							} else if (diff < 1000 * 60 * 60) {
								//一小时之内，不贫
								return "guide/Let's_begin_1.mp3";
							} else if (diff < 1000 * 60 * 60 * 24) {
								//一天之内，鼓励
								return "guide/Let's_begin_2.mp3";
							} else if (diff < 1000 * 60 * 60 * 24 * 3) {
								//三天之内，不贫
								return "guide/Let's_begin_3.mp3";
							} else {
								//七天之内
								return "guide/Let's_begin_4.mp3";
							}
						} else {
							return "guide/Let's_begin_First_sentence.mp3";
						}
					}
				} else if (index == total - 1) {
					return "guide/Last_one.mp3";
				} else if (index == 4) {
					return "guide/Sentence5.mp3";
				} else if (index == 9) {
					return "guide/Sentence10.mp3";
				} else if (index == 14) {
					return "guide/Sentence15.mp3";
				} else if (index == 19) {
					return "guide/Sentence20.mp3";
				} else if (index == 24) {
					return "guide/Sentence25.mp3";
				} else if (index == 29) {
					return "guide/Sentence30.mp3";
				} else if (model == 3) {
					return "guide/blank.mp3";
				} else {
					return "guide/Next_one.mp3";
				}
			break;
			case 1:
				return "guide/Try_it_again.mp3";
			break;
			case 2:
				return "guide/One_more_time.mp3";
			break;
			default:
				return "guide/blank.mp3";
			break;
		}
	};
	ReadDataUtils.getAfterGuideAudio = function(index, total, passed, finished) {
		if (total > 10 && index == Math.ceil(total / 2) - 1 && passed) {
			return "guide/Go_on.mp3";
		} else if (index == total - 1 && finished) {
			return "guide/You_have_finished_this_session_Here_is_the_result.mp3";
		} else {
			return null;
		}
	};
	ReadDataUtils.isWord = function(word) {
		var rep = /^([A-Za-z0-9]+-[A-Za-z0-9]+)|([A-Za-z0-9]+'[A-Za-z0-9]+)|([A-Za-z0-9]+’[A-Za-z0-9]+)|([A-Za-z0-9]+)|([A-Za-z0-9]+.)$/;
		return rep.test(word);
	};

	ReadDataUtils.score100210 = function(score) {
		if (score > 96) {
			return 10;
		} else if (score > 92 && score <= 96) {
			return 9;
		} else if (score > 88 && score <= 92) {
			return 8;
		} else if (score > 84 && score <= 88) {
			return 7;
		} else if (score > 80 && score <= 85) {
			return 6;
		} else if (score > 75 && score <= 80) {
			return 5;
		} else if (score > 70 && score <= 75) {
			return 4;
		} else if (score > 65 && score <= 70) {
			return 3;
		} else if (score > 60 && score <= 65) {
			return 2;
		} else if (score > 55 && score <= 60) {
			return 1;
		} else {
			return 0;
		}
	};
	ReadDataUtils.getSyllableCountValue = function(score10) {
		switch (score10) {
			case 3: return 0.2;
			case 4: return 0.36;
			case 5: return 0.55;
			case 6: return 0.65;
			case 7: return 0.78;
			case 8: return 0.82;
			case 9: return 0.92;
			case 10: return 1;
			default: return 0;
		}
	};
	ReadDataUtils.swtichSyllableColor = function(bad, score10) {
		var color = "#FFFFFF";
		if (bad) {
			color = "#8B6914";
		} else if (score10 >= 0 && score10 < 4) {
			color = "#FF4500";
		} else if (score10 >= 4 && score10 < 7) {
			color = "#FFA500";
		} else if (score10 >= 7 && score10 <= 10) {
			color = "#00A400";
		} else {
			color = "blue";
		}
		return color;
	};
	//判断是不是单词课
	ReadDataUtils.isWordsLesson = function(sentences) {
		var total3 = 0;
		var total0 = 0;
		
		$.each(sentences, function(i, sentence) {
			if (sentence.syllables < 3) {
				total0++;
			}
			total3 += sentence.syllables;
		});
		var r = 0;
		if (sentences.length < 3) {
			r = 4;
		} else if (sentences.length < 5) {
			r = 3;
		} else {
			r = 1.5;
		}
		if (total3 <= sentences.length * r || total0 == sentences.length) {
			return true;
		}else {
			return false;
		}
	};
	ReadDataUtils.fixScore = function(score) {
		if (score > 40 && score <= 70) {
			return Math.ceil(1.2 * score - 8);
		} else if (score > 70 && score <= 100) {
			return Math.ceil(0.8 * score + 20);
		} else {
			return score;
		}
	};
	
	/** 跟读Aryn老师动画 **/
	var Arivoc_Aryn_Animate_Read = function(canvas, animateId) {
		var comp = AdobeAn.getComposition(animateId);
		var lib = comp.getLibrary();
		var readAnimate = new lib.ReadArynAnimate();
		var stage = new lib.Stage(canvas);
		stage.enableMouseOver();
		stage.addChild(readAnimate);
		createjs.Ticker.setFPS(lib.properties.fps);
		createjs.Ticker.addEventListener("tick", onArynTicker);
		
		var nextStepFun = null;
		function onArynTicker() {
			stage.update();
			switch (readAnimate.currentFrame) {
				case 0:
					break;
				case 1:
					if ((!!nextStepFun && readAnimate.aryn_blackboard.teacher.currentFrame == 20) ||
						(!!nextStepFun && readAnimate.aryn_blackboard.teacher.currentFrame == 48)) {
						nextStepFun();
					}
					break;
				case 2:
					if ((!!nextStepFun && readAnimate.aryn_playback.currentFrame == 11) ||
						(!!nextStepFun && readAnimate.aryn_playback.currentFrame == 54)) {
						nextStepFun();
					}
					break;
				case 3:
					if ((!!nextStepFun && readAnimate.aryn_mic.currentFrame == 15) ||
						(!!nextStepFun && readAnimate.aryn_mic.currentFrame == 73)) {
						nextStepFun();
					}
					break;
				case 4:
					if ((!!nextStepFun && readAnimate.aryn_score.currentFrame == 5) ||
						(!!nextStepFun && readAnimate.aryn_score.currentFrame == 51)) {
						nextStepFun();
					}
					break;
				case 5:
					break;
				case 6:
					if (!!nextStepFun && readAnimate.aryn_yaotou.head.currentFrame == 18) {
						nextStepFun();
					}
					break;
			}
		}
		
		this.arynSay = function() {
			readAnimate.gotoAndStop(0);
			readAnimate.aryn_say.head.gotoAndPlay(0);
			readAnimate.aryn_say.head.face.mouth.gotoAndPlay(0);
		};
		this.arynSayEnd = function() {
			readAnimate.aryn_say.head.gotoAndStop(0);
			readAnimate.aryn_say.head.face.mouth.gotoAndStop(0);
		};
		this.arynBlackboard = function(nextStep) {
			readAnimate.gotoAndStop(1);
			nextStepFun = nextStep;
			readAnimate.aryn_blackboard.teacher.gotoAndStop(0);
			readAnimate.aryn_blackboard.teacher.play();
		};
		this.arynBlackboardEnd = function(nextStep) {
			nextStepFun = nextStep;
			readAnimate.aryn_blackboard.teacher.gotoAndStop(36);
			readAnimate.aryn_blackboard.teacher.play();
		};
		
		this.arynMicrophone = function(nextStep) {
			readAnimate.gotoAndStop(3);
			nextStepFun = nextStep;
			readAnimate.aryn_mic.gotoAndStop(14);
			readAnimate.aryn_mic.play();
		};
		
		this.arynMicrophoneEnd = function(nextStep) {
			nextStepFun = nextStep;
			readAnimate.aryn_mic.gotoAndStop(60);
			readAnimate.aryn_mic.play();
		};
		
		this.arynRecorder = function(nextStep) {
			readAnimate.gotoAndStop(2);
			nextStepFun = nextStep;
			readAnimate.aryn_playback.gotoAndStop(0);
			readAnimate.aryn_playback.play();
		};
		
		this.arynRecorderEnd = function(nextStep) {
			nextStepFun = nextStep;
			readAnimate.aryn_playback.gotoAndStop(46);
			readAnimate.aryn_playback.play();
		};
		
		this.arynSingleScore = function(score, nextStep) {
			readAnimate.gotoAndStop(4);
			nextStepFun = nextStep;
			var scoreInt = parseInt(score);
			if (scoreInt < 0) {
				readAnimate.aryn_score.teacher.veryGood.visible = false;
				readAnimate.aryn_score.teacher.good.visible = false;
				readAnimate.aryn_score.teacher.normal.visible = false;
				readAnimate.aryn_score.teacher.bad.visible = false;
				readAnimate.aryn_score.teacher.free.visible = true;
			} else if (!scoreInt || scoreInt < 60) {
				readAnimate.aryn_score.teacher.veryGood.visible = false;
				readAnimate.aryn_score.teacher.good.visible = false;
				readAnimate.aryn_score.teacher.normal.visible = false;
				readAnimate.aryn_score.teacher.bad.visible = true;
				readAnimate.aryn_score.teacher.free.visible = false;
				readAnimate.aryn_score.teacher.bad.mouth.gotoAndPlay(0);
			} else if (scoreInt < 75) {
				readAnimate.aryn_score.teacher.veryGood.visible = false;
				readAnimate.aryn_score.teacher.good.visible = false;
				readAnimate.aryn_score.teacher.normal.visible = true;
				readAnimate.aryn_score.teacher.bad.visible = false;
				readAnimate.aryn_score.teacher.free.visible = false;
				readAnimate.aryn_score.teacher.normal.mouth.gotoAndPlay(0);
			} else if (scoreInt < 90) {
				readAnimate.aryn_score.teacher.veryGood.visible = false;
				readAnimate.aryn_score.teacher.good.visible = true;
				readAnimate.aryn_score.teacher.normal.visible = false;
				readAnimate.aryn_score.teacher.bad.visible = false;
				readAnimate.aryn_score.teacher.free.visible = false;
				readAnimate.aryn_score.teacher.good.mouth.gotoAndPlay(0);
			} else if (scoreInt <= 100) {
				readAnimate.aryn_score.teacher.veryGood.visible = true;
				readAnimate.aryn_score.teacher.good.visible = false;
				readAnimate.aryn_score.teacher.normal.visible = false;
				readAnimate.aryn_score.teacher.bad.visible = false;
				readAnimate.aryn_score.teacher.free.visible = false;
				readAnimate.aryn_score.teacher.veryGood.mouth.gotoAndPlay(0);
			}
			readAnimate.aryn_score.textMc.txt.text = score;
			readAnimate.aryn_score.gotoAndStop(0);
			readAnimate.aryn_score.play();
		};
		
		this.arynSingleScoreEnd = function(nextStep) {
			nextStepFun = nextStep;
			readAnimate.aryn_score.textMc.txt.text = "";
			readAnimate.aryn_score.teacher.veryGood.mouth.gotoAndStop(0);
			readAnimate.aryn_score.teacher.good.mouth.gotoAndStop(0);
			readAnimate.aryn_score.teacher.normal.mouth.gotoAndStop(0);
			readAnimate.aryn_score.teacher.bad.mouth.gotoAndStop(0);
			readAnimate.aryn_score.teacher.free.mouth.gotoAndStop(0);
			readAnimate.aryn_score.gotoAndStop(46);
			readAnimate.aryn_score.play();
		};
		
		this.arynEndScore = function(score) {
			readAnimate.gotoAndStop(5);
			/*if (score < 40) {
				readAnimate.aryn_end.teacher.face40.visible = true;
				readAnimate.aryn_end.teacher.face60.visible = false;
				readAnimate.aryn_end.teacher.face60_80.visible = false;
				readAnimate.aryn_end.teacher.face80.visible = false;
				readAnimate.aryn_end.teacher.face95.visible = false;
				readAnimate.aryn_end.teacher.face40.gotoAndPlay(0);
			} else */if (score < 60) {
				readAnimate.aryn_end.teacher.face40.visible = false;
				readAnimate.aryn_end.teacher.face60.visible = true;
				readAnimate.aryn_end.teacher.face60_80.visible = false;
				readAnimate.aryn_end.teacher.face80.visible = false;
				readAnimate.aryn_end.teacher.face95.visible = false;
				readAnimate.aryn_end.teacher.face60.gotoAndPlay(0);
			} else if (score < 80) {
				readAnimate.aryn_end.teacher.face40.visible = false;
				readAnimate.aryn_end.teacher.face60.visible = false;
				readAnimate.aryn_end.teacher.face60_80.visible = true;
				readAnimate.aryn_end.teacher.face80.visible = false;
				readAnimate.aryn_end.teacher.face95.visible = false;
				readAnimate.aryn_end.teacher.face60_80.gotoAndPlay(0);
			} else if (score < 95) {
				readAnimate.aryn_end.teacher.face40.visible = false;
				readAnimate.aryn_end.teacher.face60.visible = false;
				readAnimate.aryn_end.teacher.face60_80.visible = false;
				readAnimate.aryn_end.teacher.face80.visible = true;
				readAnimate.aryn_end.teacher.face95.visible = false;
				readAnimate.aryn_end.teacher.face80.gotoAndPlay(0);
			} else if (score <= 100) {
				readAnimate.aryn_end.teacher.face40.visible = false;
				readAnimate.aryn_end.teacher.face60.visible = false;
				readAnimate.aryn_end.teacher.face60_80.visible = false;
				readAnimate.aryn_end.teacher.face80.visible = false;
				readAnimate.aryn_end.teacher.face95.visible = true;
				readAnimate.aryn_end.teacher.face95.gotoAndPlay(0);
			}
		};
		
		this.arynYaotou = function(nextStep) {
			readAnimate.gotoAndStop(6);
			nextStepFun = nextStep;
			readAnimate.aryn_yaotou.head.gotoAndPlay(0);
			readAnimate.aryn_yaotou.head.face.mouth.gotoAndPlay(0);
			readAnimate.aryn_yaotou.head.face.eye.gotoAndPlay(0);
		};
		
		this.arynStop = function() {
			readAnimate.gotoAndStop(0);
			readAnimate.aryn_say.head.gotoAndStop(0);
			readAnimate.aryn_say.head.face.mouth.gotoAndStop(0);
		};
//		this.arynStop();
	};
	
	/** 本地Cookie **/
	var Cookie = function() {
		this.setData = function(c_name, value, expiredays) {
			var exdate = new Date();
			exdate.setDate(exdate.getDate() + expiredays);
			document.cookie = c_name + "=" +escape(value) + ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
		};
		this.getData = function(c_name) {
			if (document.cookie.length > 0) {
				c_start = document.cookie.indexOf(c_name + "=");
				if (c_start != -1) { 
					c_start = c_start + c_name.length + 1;
					c_end = document.cookie.indexOf(";",c_start);
					if (c_end == -1) {
						c_end = document.cookie.length;
					}
					return unescape(document.cookie.substring(c_start,c_end));
				}
			}
			return "";
		};
	};
	
	//进入全屏
	function intoFullscreen(element) {
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		} else if (typeof window.ActiveXObject !== "undefined") {
			
		}
	}
	// 退出全屏
	function exitFullscreen() {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else {
			document.msExitFullscreen();
		}
	}
	// 是否全屏
	function isFullscreen() {
		
		if (navigator.userAgent.indexOf("Firefox") != -1) {
			return document.mozFullScreen;
		} else if (navigator.userAgent.indexOf("Chrome") != -1) {
			return document.webkitIsFullScreen;
		} else if (document.msFullscreenElement !== undefined) {
			return !!document.msFullscreenElement;
		}
		return document.fullscreen;
	}
	
	//////////////
	var ResultCode = function() {};
	// 我要打擂申请成功
	ResultCode.CODE_101 = 101;
	// 我要打擂申请失败
	ResultCode.CODE_111 = 111;
	// 我要打擂次数上限
	ResultCode.CODE_112 = 112;
	// 我要打擂金币上限
	ResultCode.CODE_113 = 113;
	// 我要打擂成功结束
	ResultCode.CODE_151 = 151;
	// 我要打擂结束失败
	ResultCode.CODE_161 = 161;
	// 我要练习申请成功
	ResultCode.CODE_201 = 201;
	// 我要练习申请失败
	ResultCode.CODE_211 = 211;
	// 我要练习金币上限
	ResultCode.CODE_212 = 212;
	// 我要练习成功结束
	ResultCode.CODE_251 = 251;
	// 我要练习结束失败
	ResultCode.CODE_261 = 261;
	// 挑战自我申请成功
	ResultCode.CODE_301 = 301;
	// 挑战自我申请失败
	ResultCode.CODE_311 = 311;
	// 挑战自我金币上限
	ResultCode.CODE_312 = 312;
	// 挑战自我次数上限
	ResultCode.CODE_313 = 313;
	// 挑战自我成功结束
	ResultCode.CODE_351 = 351;
	// 挑战自我结束失败
	ResultCode.CODE_361 = 361;
	// 挑战好友申请成功
	ResultCode.CODE_401 = 401;
	// 挑战好友申请失败
	ResultCode.CODE_411 = 411;
	// 挑战好友次数上限
	ResultCode.CODE_412 = 412;
	// 挑战好友金币上限
	ResultCode.CODE_413 = 413;
	// 被挑战者金币不足
	ResultCode.CODE_414 = 414;
	// 重复挑战。上次挑战未结束。
	ResultCode.CODE_415 = 415;
	// 无权使用挑战功能
	ResultCode.CODE_416 = 416;
	// 挑战好友成功结束
	ResultCode.CODE_451 = 451;
	// 挑战好友结束失败
	ResultCode.CODE_461 = 461;
	// 挑战好友接受者申请成功
	ResultCode.CODE_471 = 471;
	// 挑战好友接受者成功结束
	ResultCode.CODE_472 = 472;
	// 挑战好友接受者已经跟读完成,挑战结束了
	ResultCode.CODE_473 = 473;
	// 挑战好友接受者金币不足
	ResultCode.CODE_474 = 474;
	// 周擂台判断不是参赛选手
	ResultCode.CODE_1001 = 1001;
	// 周擂台判断参赛选手未接受
	ResultCode.CODE_1002 = 1002;
	// 周擂台判断参赛选手已参赛
	ResultCode.CODE_1003 = 1003;
	// 周擂台判断次数限制
	ResultCode.CODE_1010 = 1010;
	// 周擂台参赛选手申请成功
	ResultCode.CODE_1011 = 1011;
	// 周擂台参赛选手申请失败
	ResultCode.CODE_1012 = 1012;
	// 周擂台参赛选手成功结束
	ResultCode.CODE_1013 = 1013;
	// 周擂台参赛选手结束失败
	ResultCode.CODE_1014 = 1014;
	// 周擂台贡献者超出次数限制
	ResultCode.CODE_1051 = 1051;
	// 周擂台贡献者申请成功
	ResultCode.CODE_1052 = 1052;
	// 周擂台贡献者申请失败
	ResultCode.CODE_1053 = 1053;
	// 周擂台贡献者成功结束
	ResultCode.CODE_1054 = 1054;
	// 周擂台贡献者结束失败
	ResultCode.CODE_1055 = 1055;
	// 周擂台支持后才能贡献
	ResultCode.CODE_1056 = 1056;
	// 周擂台未开放
	ResultCode.CODE_1060 = 1060;
	// 日擂台周末不开放
	ResultCode.CODE_1061 = 1061;
	// 0：已经购买;
	ResultCode.CODE_2000 = 2000;
	// 1：已经购买，但已经过期;
	ResultCode.CODE_2001 = 2001;
	// 2：未购买
	ResultCode.CODE_2002 = 2002;
	// 3: lessonId无效，未定义此lesson
	ResultCode.CODE_2003 = 2003;
	// 参加内蒙大赛申请成功
	ResultCode.CODE_2101 = 2101;
	// 参加内蒙大赛申请失败
	ResultCode.CODE_2111 = 2111;
	// 参加内蒙大赛次数上限
	ResultCode.CODE_2112 = 2112;
	// 参加内蒙大赛金币上限
	ResultCode.CODE_2113 = 2113;
	// 已达到当日次数限制
	ResultCode.CODE_2114 = 2114;
	// 参加内蒙大赛成功结束
	ResultCode.CODE_2151 = 2151;
	// 参加内蒙大赛结束失败
	ResultCode.CODE_2161 = 2161;
	// 参加考试申请成功
	ResultCode.CODE_2201 = 2201;
	// 参加考试申请失败
	ResultCode.CODE_2211 = 2211;
	// 已达到当日次数限制
	ResultCode.CODE_2214 = 2214;
	// 参加考试成功结束
	ResultCode.CODE_2251 = 2251;
	// 参加考试结束失败
	ResultCode.CODE_2261 = 2261;
	// 单词全能王
	ResultCode.CODE_3001 = 3001;

	return ACR;
})(window, jQuery, ArivocPlayer, ArivocRecorder);
