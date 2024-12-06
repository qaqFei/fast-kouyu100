!function($, ArivocPlayer) {
	
	var ChoosePicByWord = function(container, option) {
		var defaultOption = {
			nextAuto: true,
			requestAuto: true,
			theme: "",
			onFinished: function() {},
			onClosed: function() {}
		};
		
		var config = $.extend({}, defaultOption, option);
		
		var player = new ArivocPlayer({
			onAudioStart: onPlayerStart,
			onAudioError: onPlayerError,
			onAudioEnd: onPlayerEnd
		});
		
		var imageRootPath = "http://static2.kouyu100.com/twominute/";
		var gameOverAction = "wordChooseGameOver.action";
		var lessonType = "3";
		
		var content = $('<div class="arivoc-choose-picture">' +
							'<div class="close-button"></div>' +
							'<div class="header">' +
								'<div class="topic"></div>' +
								'<div class="infor">' +
									'<span>播放次数：</span>' +
									'<select class="play-times">' +
										'<option value="1">1</option>' +
										'<option value="2">2</option>' +
										'<option value="3" selected>3</option>' +
										'<option value="4">4</option>' +
										'<option value="5">5</option>' +
									'</select>' +
									'<span>单词总数：</span>' +
									'<span class="word-total">0</span>' +
									'<span>正确：</span>' +
									'<span class="word-right">0</span>' +
									'<span>错误：</span>' +
									'<span class="word-wrong">0</span>' +
								'</div>' +
							'</div>' +
							'<div class="body">' +
								'<div class="countdown">倒计时：<span class="second">5s</span></div>' +
								'<div class="option optionA"></div>' +
								'<div class="option optionB"></div>' +
								'<div class="option optionC"></div>' +
								'<div class="option optionD"></div>' +
							'</div>' +
							'<div class="footer">' +
								'<span class="word-count">0</span> / <span class="word-total">0</span>' +
							'</div>' +
							'<div class="close-popup-container">' +
								'<div class="close-popup">' +
									'<div class="popup-text"></div>' +
									'<div class="popup-submit"></div>' +
									'<div class="popup-cancel"></div>' +
								'</div>' +
							'</div>' +
						'</div>');
						
		content.addClass(config.theme);
		
		$(container).append(content);
		
		
		var wordlist, lessonId, playCount, rootPath, wordTotal, wordRight, wordWrong, wordCount;
		
		var wordIsRight = true, wordIsOver = false, audioCount = 0;
		
		var startTimer, proTimer, endTimer,thirdSecond;
		
		var wrongWords, wrongIds;
		
		content.find(".play-times").change(function() {
			playCount = parseInt($(this).val());
		});
		
		content.find(".close-button").click(function() {
			showClosePopup("练习尚未完成，确定退出？", function(evt) {
				config.onClosed(content.find(".play-times").val());
				clear();
			});
		});

		var isNotePad = false;
		function loadAll(l_wordlist, l_rootPath, l_playCount, l_autoStart) {

			clear();
			isNotePad = true;
			if ($.isArray(l_wordlist)) {
				wordlist = l_wordlist;
			} else {
				wordlist = parseWordlist(l_wordlist);
			}
			rootPath = l_rootPath;
			playCount = l_playCount || 3;
			wordTotal = wordlist.length;

			content.find(".play-times").val(playCount);
			content.find(".word-total").text(wordTotal);
			content.find(".word-right").text(wordRight);
			content.find(".word-wrong").text(wordWrong);
			content.find(".word-count").text(wordCount);

			l_autoStart = l_autoStart || true;
			if (l_autoStart) {
				start();
			}

		}
		
		function load(l_wordlist, l_lessonId, l_rootPath, l_playCount, l_autoStart) {
			
			clear();
			
			if ($.isArray(l_wordlist)) {
				wordlist = l_wordlist;
			} else {
				wordlist = parseWordlist(l_wordlist);
			}
			lessonId = l_lessonId;
			rootPath = l_rootPath;
			playCount = l_playCount || 3;
			wordTotal = wordlist.length;
			
			content.find(".play-times").val(playCount);
			content.find(".word-total").text(wordTotal);
			content.find(".word-right").text(wordRight);
			content.find(".word-wrong").text(wordWrong);
			content.find(".word-count").text(wordCount);
			
			l_autoStart = l_autoStart || true;
			if (l_autoStart) {
				start();
			}
			
		}
		
		function parseWordlist(_questions) {
			var questions = new Array();
			
			var temArray = _questions.split("##");
			for (var i = 0; i < temArray.length; i++) {
				var temArr = temArray[i].split("@@");
				var temObj = new Object();
				temObj.id = temArr[0];
				temObj.topic = temArr[1];
				temObj.explain = temArr[2];
				temObj.options = [temArr[3], temArr[4], temArr[5], temArr[6]];
				temObj.answer = temArr[7];
				temObj.audio = temArr[8];
				temObj.index = temArr[9];
				questions.push(temObj);
			}
			return questions;
		}
		
		function start() {
			setWord(0);
		}
		
		function setWord(index) {
			
			if (index >= wordTotal) {
				finish();
				return;
			}
			
			// 还原状态
			content.find(".option").removeClass("right");
			content.find(".option").unbind("click", validAnswers);
			wordIsRight = true;
			wordIsOver = false;
			audioCount = 0;
			
			// 设置新题
			wordCount = index;
			var word = wordlist[wordCount];
			
			content.find(".topic").text(word.topic).attr("answer", word.answer);
			content.find(".topic").text(word.topic).attr("notepadId", word.id);
			content.find(".word-count").text(wordCount + 1);
			
			var options = orderArray(word.options);
			content.find(".optionA").html($("<img />").attr("src", imageRootPath + options[0].split("$$$")[0].substr(0, 1).toLocaleLowerCase() + "/" + options[0].split("$$$")[0] + ".png")).attr("answer", word.answer == options[0].split("$$$")[0]).show();
			content.find(".optionB").html($("<img />").attr("src", imageRootPath + options[1].split("$$$")[0].substr(0, 1).toLocaleLowerCase() + "/" + options[1].split("$$$")[0] + ".png")).attr("answer", word.answer == options[1].split("$$$")[0]).show();
			content.find(".optionC").html($("<img />").attr("src", imageRootPath + options[2].split("$$$")[0].substr(0, 1).toLocaleLowerCase() + "/" + options[2].split("$$$")[0] + ".png")).attr("answer", word.answer == options[2].split("$$$")[0]).show();
			content.find(".optionD").html($("<img />").attr("src", imageRootPath + options[3].split("$$$")[0].substr(0, 1).toLocaleLowerCase() + "/" + options[3].split("$$$")[0] + ".png")).attr("answer", word.answer == options[3].split("$$$")[0]).show();

			var cn1 = options[0].split("$$$")[1];
			cn1 = cn1.length < 8 ? cn1 : (cn1.substring(0,7)+"...");
			var cn2 = options[1].split("$$$")[1];
			cn2 = cn2.length < 8 ? cn2 : (cn2.substring(0,7)+"...");
			var cn3 = options[2].split("$$$")[1];
			cn3 = cn3.length < 8 ? cn3 : (cn3.substring(0,7)+"...");
			var cn4 = options[3].split("$$$")[1];
			cn4 = cn4.length < 8 ? cn4 : (cn4.substring(0,7)+"...");

			content.find(".optionA").append($("<div class='cnText' >"+cn1+"</div>"));
			content.find(".optionB").append($("<div class='cnText' >"+cn2+"</div>"));
			content.find(".optionC").append($("<div class='cnText' >"+cn3+"</div>"));
			content.find(".optionD").append($("<div class='cnText' >"+cn4+"</div>"));

			hideCountDown();
			
			content.find(".option").bind("click", validAnswers);
			
			startTimer = setTimeout(function() {
				player.play(word.audio);

			}, 500);
			thirdSecond = setTimeout(function (){
				$(".cnText").show();
			},3000);
			
		}
		
		function clear() {
			isNotePad = false;
			wordlist = [];
			lessonId = "";
			rootPath = "";
			playCount = 3;
			wordTotal = 0;
			wordRight = 0;
			wordWrong = 0;
			wordCount = 0;
			wordIsRight = true;
			wordIsOver = false;
			audioCount = 0;
			
			wrongWords = [];
			wrongIds = [];
			
			content.find(".topic").text("");
			content.find(".play-times").val(3);
			content.find(".word-total").text(0);
			content.find(".word-right").text(0);
			content.find(".word-wrong").text(0);
			content.find(".word-count").text(0);
			content.find(".option").html("");
			hideCountDown();
			player.pause();
			
			content.find(".option").show();
			content.find(".option").removeClass("right");
			content.find(".option").unbind("click", validAnswers);
			content.find(".close-popup-container").hide();
			
			clearTimeout(startTimer);
			clearTimeout(proTimer);
			clearTimeout(endTimer);
			clearTimeout(thirdSecond);
		}
		
		
		function validAnswers(evt) {
			if ($(this).attr("answer") == "true" || true) {
				$(this).attr("answer", true);
				$(this).addClass("right");
				player.pause();
				wordEnd();
			} else {
				wordIsRight = false;
				$(this).hide();
			}
			
		}
		
		/** 一道题完成 */
		function wordEnd() {

			content.find(".option").unbind("click", validAnswers);
			stopCountDown();
			wordIsOver = true;
			player.pause();
			if (wordIsRight) {
				content.find(".word-right").text(++wordRight);
				if(isNotePad){
					var notepadId = content.find(".topic").text(word.topic).attr("notepadId");
					$.ajax({
						type: "get",
						url: 'updateW2MNotepadById.action?v='+Math.random(),
						async: true,
						data: {notepadId:notepadId},
						success: function(data) {
						},
						error: function() {
						}
					});
				}
			} else {
				content.find(".word-wrong").text(++wordWrong);
				wrongIds.push(wordlist[wordCount].id);
				wrongWords.push(wordlist[wordCount].index + "##" + "<font color='#20B2AA' size='20'>" + wordlist[wordCount].topic + "</font>");
			}
			endTimer = setTimeout(function() {
				player.play(wordlist[wordCount].audio);
			}, 500);
			clearTimeout(thirdSecond);
		}
		
		/** 声音播放状态 */
		function onPlayerStart(index) {
//			content.find(".play-times").val(audioCount + "/" + playCount);
		}
		function onPlayerError(index) {
			if (wordIsOver) {
				setWord(++wordCount);
			} else {
				if (config.nextAuto) {
					showCountDown();
				}
			}
		}
		function onPlayerEnd(index, last) {
			if (wordIsOver) {
				setWord(++wordCount);
			} else {
				audioCount++;
				if (audioCount >= playCount) {
					if (config.nextAuto) {
						showCountDown();
					}
				} else {
					proTimer = setTimeout(function() {
						player.play(wordlist[wordCount].audio);
					}, 1500);
				}
			}
		}
		
		function finish() {
			var score = Math.round(wordRight / wordTotal * 100);
			config.onFinished(score, content.find(".play-times").val(), wrongIds.join(",") + ",", wordRight, wordWrong);

			if (!config.requestAuto) {
				return;
			}

			if(!isNotePad){
				$.ajax({
					type: "post",
					url: gameOverAction,
					async: true,
					data: {
						"lesson_id": lessonId,
						"listenType": lessonType,
						"listen_score": score,
						"hwId":hwid,
						"mistakeContent": wrongWords.join("@@")
					},
					success: function(data) {},
					error: function() {}
				});
			}
		}


		
		
		/** 倒计时 */
		var countDownId;
		function showCountDown() {
			var count = 5;
			content.find(".countdown .second").text(count + "s").removeClass("warming");
			content.find(".countdown").show();
			countDownId = setInterval(function() {
				content.find(".countdown .second").text(--count + "s");
				if (count < 2) {
					content.find(".countdown .second").addClass("warming");
				}
				if (count == 0) {
					wordIsRight = false;
					wordEnd();
				}
			}, 1000);
		}
		
		function stopCountDown() {
			clearInterval(countDownId);
		}
		
		function hideCountDown() {
			stopCountDown();
			content.find(".countdown").hide();
		}
		
		
		
		/** 关闭弹窗 */
		function showClosePopup(contenttext, leftcallback, rightcallback) {
			
			content.find(".close-popup-container .popup-submit, .close-popup-container .popup-cancel").unbind("click");
			
			content.find(".close-popup-container .popup-text").text(contenttext);
			content.find(".close-popup-container .popup-submit").bind("click", function(evt) {
				content.find(".close-popup-container").hide();
				if (!!leftcallback) {
					leftcallback();
				}
			});
			content.find(".close-popup-container .popup-cancel").bind("click", function(evt) {
				content.find(".close-popup-container").hide();
				if (!!rightcallback) {
					rightcallback();
				}
			});
			content.find(".close-popup-container").show();
		}
		
		/** 数组乱序 */
		function orderArray(arr) {
			var temArray = arr.concat();
			var newArray = [];
			var length = temArray.length;
			for (var i = 0; i < length; i++) {
				var index = Math.floor(Math.random() * temArray.length);
				newArray.push(temArray.splice(index, 1)[0]);
			}
			return newArray;
		}
		
		this.load = function(l_wordlist, l_lessonId, l_rootPath, l_playCount, l_autoStart) {
			load(l_wordlist, l_lessonId, l_rootPath, l_playCount, l_autoStart);
		};

		this.loadAll = function(l_wordlist, l_rootPath, l_playCount, l_autoStart) {
			loadAll(l_wordlist, l_rootPath, l_playCount, l_autoStart);
		};
		
//		this.start = function() {
//			start();
//		}
		
		this.close = function() {
			content.find(".close-button").trigger("click");
		};
		
	};
	
	$.fn.choosePicByWord = function(option) {
		return this.each(function(i) {
			var chooser = new ChoosePicByWord(this, option);
			$(this).data("arivoc-choose-picture", chooser);
		});
	};
	
}(jQuery, ArivocPlayer);
